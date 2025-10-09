/**
 * Data Rendering Logic for katgrapher.studio
 *
 * This module handles fetching and rendering content from Sanity CMS
 * into the HTML elements on the page. Uses vanilla JavaScript for DOM
 * manipulation without any framework dependencies.
 *
 * Features:
 * - Render projects on index page
 * - Render featured photos on index page
 * - Render photo gallery with category filtering
 * - URL parameter handling for category filtering
 * - Responsive image loading and error handling
 */

import { fetchSanity, buildImageUrl, getResponsiveImageUrls } from './sanity-client.js';
import { contentTypes, projectConfig, galleryConfig } from './config.js';

/**
 * Initialize all rendering when DOM is loaded
 */
export function initRendering() {
  // Check if we're on the index page or gallery page
  const isIndexPage = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html');
  const isGalleryPage = window.location.pathname.endsWith('gallery.html');

  if (isIndexPage) {
    initIndexPage();
  } else if (isGalleryPage) {
    initGalleryPage();
  }
}

/**
 * Initialize index page rendering
 */
async function initIndexPage() {
  try {
    // Render projects and photos in parallel for better performance
    await Promise.all([
      renderProjects(),
      renderPhotoTeaser(),
    ]);
  } catch (error) {
    console.error('Error initializing index page:', error);
    showErrorMessage('Failed to load content from CMS');
  }
}

/**
 * Initialize gallery page rendering
 */
async function initGalleryPage() {
  try {
    // Initialize category filtering first
    initCategoryFiltering();

    // Render initial photos
    await renderGallery();

  } catch (error) {
    console.error('Error initializing gallery page:', error);
    showErrorMessage('Failed to load gallery from CMS');
  }
}

/**
 * Render projects on the index page
 */
export async function renderProjects() {
  try {
    // Show loading state
    const projectsContainer = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.gap-8.mb-12');
    if (!projectsContainer) {
      console.warn('Projects container not found');
      return;
    }

    // Add loading indicator
    projectsContainer.innerHTML = '<div class="col-span-full text-center py-8"><p class="text-gray-400">Loading projects...</p></div>';

    // Fetch featured projects from Sanity
    const query = `
      *[_type == $type && featured == true] | order(coalesce(completionDate, _createdAt) desc) [0...$limit] {
        _id,
        title,
        slug,
        description,
        url,
        image,
        techTags,
        githubUrl,
        completionDate,
        projectType
      }
    `;

    const projects = await fetchSanity(query, {
      type: contentTypes.PROJECT,
      limit: projectConfig.featuredProjectCount,
    });

    // Clear loading state
    projectsContainer.innerHTML = '';

    if (!projects || projects.length === 0) {
      projectsContainer.innerHTML = '<div class="col-span-full text-center py-8"><p class="text-gray-400">No projects found. Add some projects in your Sanity CMS.</p></div>';
      return;
    }

    // Render each project
    projects.forEach(project => {
      const projectElement = createProjectElement(project);
      projectsContainer.appendChild(projectElement);
    });

    // Update loading text
    const loadingText = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.gap-8.mb-12 + div');
    if (loadingText) {
      loadingText.innerHTML = `<p class="text-gray-400 mb-6">${projects.length} project${projects.length !== 1 ? 's' : ''} loaded from Sanity CMS</p>`;
    }

  } catch (error) {
    console.error('Error rendering projects:', error);
    showErrorMessage('Failed to load projects');
  }
}

/**
 * Create a project card element
 *
 * @param {object} project - Project data from Sanity
 * @returns {HTMLElement} Project card element
 */
function createProjectElement(project) {
  const projectDiv = document.createElement('div');
  projectDiv.className = 'bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-brand-green transition-colors';

  // Get responsive image URLs
  const imageUrls = getResponsiveImageUrls(project.image, {
    width: 600,
    height: 400,
    fit: 'fill',
  });

  const techTags = project.techTags || [];
  const displayTags = techTags.slice(0, projectConfig.maxTechTags);

  projectDiv.innerHTML = `
    <div class="aspect-video bg-gray-800 flex items-center justify-center">
      <img src="${imageUrls?.medium || ''}"
           alt="${project.title}"
           class="w-full h-full object-cover"
           loading="lazy"
           onerror="this.onerror=null; this.src='${imageUrls?.small || ''}';">
    </div>
    <div class="p-6">
      <h3 class="text-xl font-semibold mb-2 text-brand-green">${escapeHtml(project.title)}</h3>
      <p class="text-gray-300 mb-4">${escapeHtml(project.description)}</p>
      ${displayTags.length > 0 ? `
        <div class="flex flex-wrap gap-2 mb-4">
          ${displayTags.map(tag => `<span class="bg-brand-yellow text-black px-2 py-1 rounded text-sm">${escapeHtml(tag)}</span>`).join('')}
          ${techTags.length > projectConfig.maxTechTags ? `<span class="text-gray-400 text-sm">+${techTags.length - projectConfig.maxTechTags} more</span>` : ''}
        </div>
      ` : ''}
      <div class="flex gap-4">
        <a href="${escapeHtml(project.url)}"
           target="_blank"
           rel="noopener noreferrer"
           class="text-brand-green hover:text-brand-neon transition-colors">Live Demo</a>
        ${project.githubUrl && projectConfig.showGithubLink ? `
          <a href="${escapeHtml(project.githubUrl)}"
             target="_blank"
             rel="noopener noreferrer"
             class="text-brand-green hover:text-brand-neon transition-colors">Source</a>
        ` : ''}
      </div>
    </div>
  `;

  return projectDiv;
}

/**
 * Render featured photos on index page
 */
export async function renderPhotoTeaser() {
  try {
    // Find the photo teaser container
    const photoContainer = document.querySelector('.grid.grid-cols-2.gap-4');
    if (!photoContainer) {
      console.warn('Photo teaser container not found');
      return;
    }

    // Add loading state
    photoContainer.innerHTML = '<div class="col-span-2 text-center py-4"><p class="text-gray-400">Loading photos...</p></div>';

    // Fetch featured photos from Sanity
    const query = `
      *[_type == $type && featured == true] | order(coalesce(order, 0) asc, coalesce(date, _createdAt) desc) [0...4] {
        _id,
        image,
        alt,
        caption,
        categories[]->{
          _id,
          title,
          slug
        }
      }
    `;

    const photos = await fetchSanity(query, {
      type: contentTypes.PHOTO,
    });

    // Clear loading state
    photoContainer.innerHTML = '';

    if (!photos || photos.length === 0) {
      // Create placeholder photos if none found
      for (let i = 0; i < 4; i++) {
        const placeholderDiv = document.createElement('div');
        placeholderDiv.className = 'aspect-square bg-gray-800 rounded-lg flex items-center justify-center';
        placeholderDiv.innerHTML = '<span class="text-gray-400 text-sm">Featured Photo</span>';
        photoContainer.appendChild(placeholderDiv);
      }
      return;
    }

    // Render each photo
    photos.forEach(photo => {
      const photoElement = createPhotoTeaserElement(photo);
      photoContainer.appendChild(photoElement);
    });

  } catch (error) {
    console.error('Error rendering photo teaser:', error);
    showErrorMessage('Failed to load featured photos');
  }
}

/**
 * Create a photo teaser element for index page
 *
 * @param {object} photo - Photo data from Sanity
 * @returns {HTMLElement} Photo element
 */
function createPhotoTeaserElement(photo) {
  const photoDiv = document.createElement('div');
  photoDiv.className = 'aspect-square bg-gray-800 rounded-lg overflow-hidden';

  // Get responsive image URLs
  const imageUrls = getResponsiveImageUrls(photo.image, {
    width: 400,
    height: 400,
    fit: 'fill',
  });

  photoDiv.innerHTML = `
    <img src="${imageUrls?.small || ''}"
         alt="${escapeHtml(photo.alt)}"
         class="w-full h-full object-cover transition-transform hover:scale-105"
         loading="lazy"
         onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='flex';">
    <div class="w-full h-full flex items-center justify-center bg-gray-900 hidden">
      <span class="text-gray-400 text-sm">Photo</span>
    </div>
  `;

  return photoDiv;
}

/**
 * Render photo gallery with category filtering
 */
export async function renderGallery() {
  try {
    const photoGrid = document.getElementById('photo-grid');
    if (!photoGrid) {
      console.warn('Photo grid not found');
      return;
    }

    // Get current category filter from URL
    const currentCategory = getUrlParam('category') || 'all';

    // Show loading state
    photoGrid.innerHTML = '<div class="col-span-full text-center py-12"><p class="text-gray-400">Loading photos...</p></div>';

    // Fetch photos and categories in parallel
    const [photos, categories] = await Promise.all([
      fetchPhotos(currentCategory),
      fetchCategories(),
    ]);

    // Clear loading state
    photoGrid.innerHTML = '';

    if (!photos || photos.length === 0) {
      photoGrid.innerHTML = '<div class="col-span-full text-center py-12"><p class="text-gray-400">No photos found for this category.</p></div>';
      return;
    }

    // Store categories for filtering
    window.galleryCategories = categories || [];

    // Render photos
    photos.forEach(photo => {
      const photoElement = createGalleryPhotoElement(photo);
      photoGrid.appendChild(photoElement);
    });

    // Update load more button visibility
    updateLoadMoreButton(photos.length);

  } catch (error) {
    console.error('Error rendering gallery:', error);
    showErrorMessage('Failed to load gallery photos');
  }
}

/**
 * Fetch photos from Sanity with optional category filtering
 *
 * @param {string} categorySlug - Category slug to filter by ('all' for no filter)
 * @param {number} offset - Number of photos to skip (for pagination)
 * @param {number} limit - Maximum number of photos to return
 * @returns {Promise<Array>} Array of photos
 */
async function fetchPhotos(categorySlug = 'all', offset = 0, limit = galleryConfig.initialLoadCount) {
  try {
    let query;

    if (categorySlug === 'all') {
      // Fetch all photos
      query = `
        *[_type == $type] | order(coalesce(order, 0) asc, coalesce(date, _createdAt) desc) [$offset...$limit] {
          _id,
          image,
          alt,
          caption,
          categories[]->{
            _id,
            title,
            slug
          },
          date,
          location,
          featured
        }
      `;
    } else {
      // Fetch photos by category
      query = `
        *[_type == $type && $categorySlug in categories[]->slug.current] | order(coalesce(order, 0) asc, coalesce(date, _createdAt) desc) [$offset...$limit] {
          _id,
          image,
          alt,
          caption,
          categories[]->{
            _id,
            title,
            slug
          },
          date,
          location,
          featured
        }
      `;
    }

    return await fetchSanity(query, {
      type: contentTypes.PHOTO,
      categorySlug,
      offset,
      limit,
    });

  } catch (error) {
    console.error('Error fetching photos:', error);
    throw error;
  }
}

/**
 * Fetch all categories from Sanity
 *
 * @returns {Promise<Array>} Array of categories
 */
async function fetchCategories() {
  try {
    const query = `
      *[_type == $type] | order(title asc) {
        _id,
        title,
        slug,
        description
      }
    `;

    return await fetchSanity(query, {
      type: contentTypes.CATEGORY,
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Create a gallery photo element
 *
 * @param {object} photo - Photo data from Sanity
 * @returns {HTMLElement} Photo element
 */
function createGalleryPhotoElement(photo) {
  const photoDiv = document.createElement('div');
  photoDiv.className = 'photo-item aspect-square bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-brand-green transition-colors cursor-pointer';
  photoDiv.dataset.photoId = photo._id;

  // Get category slugs for filtering
  const categorySlugs = photo.categories ? photo.categories.map(cat => cat.slug?.current || cat.slug).filter(Boolean) : [];

  // Add category data attributes
  categorySlugs.forEach(slug => {
    photoDiv.dataset.category = (photoDiv.dataset.category ? photoDiv.dataset.category + ' ' : '') + slug;
  });

  // Get responsive image URLs
  const imageUrls = getResponsiveImageUrls(photo.image, {
    width: 600,
    height: 600,
    fit: 'fill',
  });

  photoDiv.innerHTML = `
    <div class="w-full h-full relative">
      <img src="${imageUrls?.small || ''}"
           alt="${escapeHtml(photo.alt)}"
           class="w-full h-full object-cover"
           loading="lazy"
           data-lightbox-src="${imageUrls?.large || ''}"
           data-lightbox-caption="${escapeHtml(photo.caption || photo.alt)}"
           onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='flex';">
      <div class="absolute inset-0 bg-gray-900 hidden items-center justify-center">
        <span class="text-gray-400 text-sm">Photo</span>
      </div>
      <div class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-opacity flex items-end">
        <div class="p-4 w-full">
          <p class="text-white text-sm opacity-0 hover:opacity-100 transition-opacity">${escapeHtml(photo.alt)}</p>
        </div>
      </div>
    </div>
  `;

  return photoDiv;
}

/**
 * Initialize category filtering functionality
 */
function initCategoryFiltering() {
  const categoryButtons = document.querySelectorAll('.category-filter');

  categoryButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();

      const category = button.dataset.category;

      // Update active button state
      categoryButtons.forEach(btn => btn.classList.remove('active', 'bg-brand-green', 'text-black'));
      button.classList.add('active', 'bg-brand-green', 'text-black');

      // Update URL without page reload
      updateUrlParam('category', category);

      // Re-render gallery with new filter
      await renderGallery();

      // Scroll to top of gallery
      const photoGrid = document.getElementById('photo-grid');
      if (photoGrid) {
        photoGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/**
 * Get URL parameter value
 *
 * @param {string} param - Parameter name
 * @returns {string|null} Parameter value or null if not found
 */
export function getUrlParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

/**
 * Update URL parameter without page reload
 *
 * @param {string} param - Parameter name
 * @param {string} value - Parameter value
 */
function updateUrlParam(param, value) {
  const url = new URL(window.location);
  if (value && value !== 'all') {
    url.searchParams.set(param, value);
  } else {
    url.searchParams.delete(param);
  }
  window.history.pushState({}, '', url);
}

/**
 * Update load more button visibility
 *
 * @param {number} currentCount - Current number of photos displayed
 */
function updateLoadMoreButton(currentCount) {
  const loadMoreBtn = document.getElementById('load-more');
  if (loadMoreBtn) {
    // For now, hide the load more button since we're loading all photos
    // In a real implementation, you'd check if there are more photos to load
    loadMoreBtn.style.display = 'none';
  }
}

/**
 * Show error message to user
 *
 * @param {string} message - Error message to display
 */
function showErrorMessage(message) {
  // Create a simple error notification
  const errorDiv = document.createElement('div');
  errorDiv.className = 'fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
  errorDiv.innerHTML = `
    <div class="flex items-center">
      <span class="mr-2">⚠️</span>
      <span>${escapeHtml(message)}</span>
      <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `;

  document.body.appendChild(errorDiv);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (errorDiv.parentNode) {
      errorDiv.remove();
    }
  }, 5000);
}

/**
 * Escape HTML characters to prevent XSS
 *
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
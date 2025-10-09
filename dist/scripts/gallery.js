/**
 * Gallery JavaScript file for katgrapher.studio
 *
 * This file initializes all functionality for the gallery page including:
 * - Photo gallery rendering from Sanity CMS
 * - Category filtering
 * - Lightbox functionality
 * - Load more functionality
 * - Error handling and fallbacks
 */

import { initRendering } from './render.js';
import { initLightbox } from './lightbox.js';
import { sanityConfig } from './config.js';

/**
 * Initialize the gallery page when DOM is ready
 */
async function init() {
  try {
    console.log('Initializing gallery page...');

    // Validate configuration
    validateConfiguration();

    // Initialize lightbox first (for photo click handlers)
    initLightbox();

    // Initialize content rendering (gallery and filtering)
    await initRendering();

    // Initialize load more functionality
    initLoadMore();

    console.log('Gallery page initialized successfully');

  } catch (error) {
    console.error('Failed to initialize gallery page:', error);
    handleInitializationError(error);
  }
}

/**
 * Initialize load more functionality
 */
function initLoadMore() {
  const loadMoreBtn = document.getElementById('load-more');

  if (!loadMoreBtn) {
    console.warn('Load more button not found');
    return;
  }

  loadMoreBtn.addEventListener('click', async () => {
    try {
      // Show loading state
      const originalText = loadMoreBtn.textContent;
      loadMoreBtn.textContent = 'Loading...';
      loadMoreBtn.disabled = true;

      // Import render functions dynamically to avoid circular dependencies
      const { renderGallery } = await import('./render.js');

      // Re-render gallery (this will load more photos)
      await renderGallery();

      // Restore button state
      loadMoreBtn.textContent = originalText;
      loadMoreBtn.disabled = false;

    } catch (error) {
      console.error('Error loading more photos:', error);
      loadMoreBtn.textContent = 'Error - Try Again';
      loadMoreBtn.disabled = false;

      // Show error message
      showErrorMessage('Failed to load more photos. Please try again.');
    }
  });

  console.log('Load more functionality initialized');
}

/**
 * Validate Sanity configuration
 */
function validateConfiguration() {
  const requiredFields = ['projectId', 'dataset', 'apiVersion'];

  for (const field of requiredFields) {
    if (!sanityConfig[field]) {
      throw new Error(`Missing required Sanity configuration: ${field}. Please update scripts/config.js`);
    }
  }

  console.log('Sanity configuration validated');
}

/**
 * Handle initialization errors gracefully
 *
 * @param {Error} error - Initialization error
 */
function handleInitializationError(error) {
  // Show user-friendly error message
  const errorDiv = document.createElement('div');
  errorDiv.className = 'fixed bottom-4 right-4 bg-yellow-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-sm';
  errorDiv.innerHTML = `
    <div class="flex items-start">
      <span class="mr-2">⚠️</span>
      <div>
        <p class="font-semibold">Gallery Loading Issue</p>
        <p class="text-sm mt-1">The photo gallery may not load properly. Please refresh the page or check your connection.</p>
      </div>
      <button class="ml-4 text-white hover:text-gray-200 flex-shrink-0" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `;

  document.body.appendChild(errorDiv);

  // Log detailed error for debugging
  console.error('Gallery initialization error details:', {
    message: error.message,
    stack: error.stack,
    config: {
      projectId: sanityConfig.projectId,
      dataset: sanityConfig.dataset,
      apiVersion: sanityConfig.apiVersion,
    }
  });

  // Auto-remove error message after 10 seconds
  setTimeout(() => {
    if (errorDiv.parentNode) {
      errorDiv.remove();
    }
  }, 10000);
}

/**
 * Show error message to user
 *
 * @param {string} message - Error message to display
 */
function showErrorMessage(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
  errorDiv.innerHTML = `
    <div class="flex items-center">
      <span class="mr-2">⚠️</span>
      <span>${message}</span>
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
 * Retry initialization after a delay
 * Useful if there are temporary network issues
 */
async function retryInitialization() {
  try {
    console.log('Retrying gallery initialization...');

    // Wait a bit before retrying
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Re-initialize
    await init();

  } catch (error) {
    console.error('Gallery retry failed:', error);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Expose functions globally for debugging and manual control
window.retryGalleryInitialization = retryInitialization;
window.reloadGallery = () => initRendering();

// Add gallery-specific analytics
window.addEventListener('load', () => {
  // Track gallery load time
  const loadTime = performance.now();
  console.log(`Gallery loaded in ${Math.round(loadTime)}ms`);

  // Track initial photo count
  const initialPhotoCount = document.querySelectorAll('.photo-item').length;
  console.log(`Gallery initialized with ${initialPhotoCount} photos`);
});

// Handle browser back/forward navigation
window.addEventListener('popstate', () => {
  // Re-initialize if category filter changed via browser navigation
  if (window.location.search.includes('category')) {
    initRendering();
  }
});

// Add keyboard shortcuts for gallery
document.addEventListener('keydown', (e) => {
  // Only handle shortcuts when not in input fields
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
    return;
  }

  switch (e.key) {
    case 'r':
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        retryInitialization();
      }
      break;
    case 'l':
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        initRendering();
      }
      break;
  }
});
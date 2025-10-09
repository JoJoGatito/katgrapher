/**
 * Minimalist Lightbox Implementation for katgrapher.studio
 *
 * This module provides a lightweight, accessible image lightbox with:
 * - Keyboard navigation (arrows, escape)
 * - Touch/swipe support for mobile
 * - Focus trapping for accessibility
 * - Respect for prefers-reduced-motion
 * - No external dependencies
 *
 * Usage:
 * - Click on gallery photos to open lightbox
 * - Use arrow keys or swipe to navigate
 * - Press Escape or click close to exit
 */

import { galleryConfig } from './config.js';

/**
 * Initialize lightbox functionality
 */
export function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  if (!lightbox || !lightboxImage || !lightboxCaption || !lightboxClose) {
    console.warn('Lightbox elements not found in DOM');
    return;
  }

  // Track current photo index and all photos
  let currentIndex = 0;
  let allPhotos = [];

  // Initialize event listeners
  initLightboxEvents(lightbox, lightboxImage, lightboxCaption, lightboxClose);

  // Initialize photo click handlers
  initPhotoClickHandlers(lightbox, lightboxImage, lightboxCaption);

  console.log('Lightbox initialized');
}

/**
 * Initialize lightbox event listeners
 */
function initLightboxEvents(lightbox, lightboxImage, lightboxCaption, lightboxClose) {
  // Close button click
  lightboxClose.addEventListener('click', closeLightbox);

  // Click outside image to close
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', handleLightboxKeydown);

  // Touch/swipe support
  initTouchSupport(lightboxImage);

  // Handle visibility change (for accessibility)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && lightbox.classList.contains('visible')) {
      closeLightbox();
    }
  });

  // Respect prefers-reduced-motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Disable animations for users who prefer reduced motion
    lightbox.style.setProperty('--lightbox-animation-duration', '0ms');
  }
}

/**
 * Initialize photo click handlers
 */
function initPhotoClickHandlers(lightbox, lightboxImage, lightboxCaption) {
  // Handle clicks on gallery photos
  document.addEventListener('click', (e) => {
    const photoItem = e.target.closest('.photo-item');
    if (!photoItem) return;

    // Prevent default if it's a link
    e.preventDefault();

    // Get photo data
    const img = photoItem.querySelector('img');
    if (!img) return;

    const src = img.dataset.lightboxSrc || img.src;
    const caption = img.dataset.lightboxCaption || img.alt || '';

    // Find all photos for navigation
    const allPhotoItems = Array.from(document.querySelectorAll('.photo-item')).filter(item => {
      const itemImg = item.querySelector('img');
      return itemImg && (itemImg.dataset.lightboxSrc || itemImg.src);
    });

    const clickedIndex = allPhotoItems.indexOf(photoItem);

    // Open lightbox
    openLightbox(src, caption, clickedIndex, allPhotoItems);
  });
}

/**
 * Open lightbox with specified image
 *
 * @param {string} src - Image source URL
 * @param {string} caption - Image caption
 * @param {number} startIndex - Starting photo index
 * @param {Array} photoItems - Array of all photo elements
 */
function openLightbox(src, caption, startIndex, photoItems) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');

  if (!lightbox || !lightboxImage || !lightboxCaption) {
    return;
  }

  // Set image and caption
  lightboxImage.src = src;
  lightboxImage.alt = caption;
  lightboxCaption.textContent = caption;

  // Store photo data for navigation
  window.lightboxPhotos = photoItems;
  window.lightboxCurrentIndex = startIndex;

  // Show lightbox
  lightbox.classList.remove('hidden');
  lightbox.classList.add('visible');

  // Add visible class for CSS transitions
  setTimeout(() => {
    lightbox.classList.add('opacity-100');
    lightbox.querySelector('.flex').classList.add('opacity-100');
  }, 10);

  // Trap focus for accessibility
  trapFocus(lightbox);

  // Prevent body scroll
  document.body.style.overflow = 'hidden';

  // Add escape key listener
  document.addEventListener('keydown', handleEscapeKey);

  // Preload adjacent images for better performance
  preloadAdjacentImages(startIndex, photoItems);

  console.log(`Lightbox opened with image ${startIndex + 1} of ${photoItems.length}`);
}

/**
 * Close lightbox
 */
function closeLightbox() {
  const lightbox = document.getElementById('lightbox');

  if (!lightbox || !lightbox.classList.contains('visible')) {
    return;
  }

  // Remove visible classes for fade out
  lightbox.classList.remove('opacity-100');
  const flexContainer = lightbox.querySelector('.flex');
  if (flexContainer) {
    flexContainer.classList.remove('opacity-100');
  }

  // Hide lightbox after animation
  setTimeout(() => {
    lightbox.classList.add('hidden');
    lightbox.classList.remove('visible');
  }, getAnimationDuration());

  // Restore body scroll
  document.body.style.overflow = '';

  // Remove escape key listener
  document.removeEventListener('keydown', handleEscapeKey);

  // Return focus to the photo that was clicked
  const lastFocusedPhoto = window.lastFocusedPhoto;
  if (lastFocusedPhoto) {
    lastFocusedPhoto.focus();
    window.lastFocusedPhoto = null;
  }

  console.log('Lightbox closed');
}

/**
 * Handle keyboard navigation in lightbox
 *
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleLightboxKeydown(e) {
  if (!document.getElementById('lightbox')?.classList.contains('visible')) {
    return;
  }

  switch (e.key) {
    case 'ArrowLeft':
      e.preventDefault();
      navigatePrevious();
      break;
    case 'ArrowRight':
      e.preventDefault();
      navigateNext();
      break;
    case 'Home':
      e.preventDefault();
      navigateToIndex(0);
      break;
    case 'End':
      e.preventDefault();
      navigateToIndex(window.lightboxPhotos.length - 1);
      break;
    case 'Escape':
      e.preventDefault();
      closeLightbox();
      break;
  }
}

/**
 * Navigate to previous image
 */
function navigatePrevious() {
  const photos = window.lightboxPhotos;
  if (!photos || photos.length === 0) return;

  const currentIndex = window.lightboxCurrentIndex || 0;
  const prevIndex = currentIndex > 0 ? currentIndex - 1 : photos.length - 1;

  navigateToIndex(prevIndex);
}

/**
 * Navigate to next image
 */
function navigateNext() {
  const photos = window.lightboxPhotos;
  if (!photos || photos.length === 0) return;

  const currentIndex = window.lightboxCurrentIndex || 0;
  const nextIndex = currentIndex < photos.length - 1 ? currentIndex + 1 : 0;

  navigateToIndex(nextIndex);
}

/**
 * Navigate to specific image index
 *
 * @param {number} index - Index to navigate to
 */
function navigateToIndex(index) {
  const photos = window.lightboxPhotos;
  if (!photos || index < 0 || index >= photos.length) return;

  const photoItem = photos[index];
  const img = photoItem.querySelector('img');
  if (!img) return;

  const src = img.dataset.lightboxSrc || img.src;
  const caption = img.dataset.lightboxCaption || img.alt || '';

  // Update lightbox content
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');

  if (lightboxImage) {
    // Fade out current image
    lightboxImage.style.opacity = '0';

    setTimeout(() => {
      lightboxImage.src = src;
      lightboxImage.alt = caption;
      lightboxImage.style.opacity = '1';
    }, 150);
  }

  if (lightboxCaption) {
    lightboxCaption.textContent = caption;
  }

  // Update current index
  window.lightboxCurrentIndex = index;

  // Preload adjacent images
  preloadAdjacentImages(index, photos);

  // Announce to screen readers
  announceToScreenReader(`Image ${index + 1} of ${photos.length}: ${caption}`);

  console.log(`Lightbox navigated to image ${index + 1}`);
}

/**
 * Initialize touch/swipe support
 *
 * @param {HTMLImageElement} lightboxImage - Lightbox image element
 */
function initTouchSupport(lightboxImage) {
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;

  lightboxImage.addEventListener('touchstart', (e) => {
    if (!e.touches[0]) return;

    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    currentX = startX;
    currentY = startY;
  }, { passive: true });

  lightboxImage.addEventListener('touchmove', (e) => {
    if (!e.touches[0]) return;

    currentX = e.touches[0].clientX;
    currentY = e.touches[0].clientY;
  }, { passive: true });

  lightboxImage.addEventListener('touchend', () => {
    if (!startX || !startY) return;

    const deltaX = currentX - startX;
    const deltaY = currentY - startY;

    // Check if horizontal swipe is more significant than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        navigatePrevious();
      } else {
        navigateNext();
      }
    }

    // Reset values
    startX = 0;
    startY = 0;
    currentX = 0;
    currentY = 0;
  }, { passive: true });
}

/**
 * Handle escape key press
 *
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleEscapeKey(e) {
  if (e.key === 'Escape') {
    closeLightbox();
  }
}

/**
 * Trap focus within lightbox for accessibility
 *
 * @param {HTMLElement} lightbox - Lightbox container element
 */
function trapFocus(lightbox) {
  const focusableElements = lightbox.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length === 0) return;

  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  // Focus first element
  firstFocusable.focus();

  lightbox.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
  });
}

/**
 * Preload adjacent images for better performance
 *
 * @param {number} currentIndex - Current photo index
 * @param {Array} photoItems - Array of all photo elements
 */
function preloadAdjacentImages(currentIndex, photoItems) {
  const preloadIndices = [
    currentIndex - 1,
    currentIndex,
    currentIndex + 1,
    currentIndex + 2,
  ].filter(index => index >= 0 && index < photoItems.length && index !== currentIndex);

  preloadIndices.forEach(index => {
    const photoItem = photoItems[index];
    const img = photoItem.querySelector('img');
    if (!img) return;

    const src = img.dataset.lightboxSrc || img.src;
    if (src) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    }
  });
}

/**
 * Announce message to screen readers
 *
 * @param {string} message - Message to announce
 */
function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    if (announcement.parentNode) {
      announcement.parentNode.removeChild(announcement);
    }
  }, 1000);
}

/**
 * Get animation duration from CSS or config
 *
 * @returns {number} Animation duration in milliseconds
 */
function getAnimationDuration() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return 300;

  const computedStyle = window.getComputedStyle(lightbox);
  const duration = computedStyle.getPropertyValue('--lightbox-animation-duration') || '300ms';

  // Extract numeric value from CSS time value
  const match = duration.match(/(\d+)ms/);
  return match ? parseInt(match[1], 10) : 300;
}

/**
 * Public API functions
 */
export const lightboxAPI = {
  open: (src, caption, index = 0, photos = []) => {
    openLightbox(src, caption, index, photos);
  },

  close: closeLightbox,

  next: navigateNext,

  previous: navigatePrevious,

  goTo: navigateToIndex,

  isOpen: () => {
    const lightbox = document.getElementById('lightbox');
    return lightbox && lightbox.classList.contains('visible');
  },

  getCurrentIndex: () => {
    return window.lightboxCurrentIndex || 0;
  },

  getTotalPhotos: () => {
    return window.lightboxPhotos ? window.lightboxPhotos.length : 0;
  },
};
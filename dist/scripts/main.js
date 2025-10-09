/**
 * Main JavaScript file for katgrapher.studio index page
 *
 * This file initializes all functionality for the homepage including:
 * - Content rendering from Sanity CMS
 * - DOM ready event handling
 * - Error handling and fallbacks
 */

import { initRendering } from './render.js';
import { sanityConfig } from './config.js';

/**
 * Initialize the application when DOM is ready
 */
async function init() {
  try {
    console.log('Initializing katgrapher.studio...');

    // Validate configuration
    validateConfiguration();

    // Initialize content rendering
    await initRendering();

    console.log('katgrapher.studio initialized successfully');

  } catch (error) {
    console.error('Failed to initialize katgrapher.studio:', error);
    handleInitializationError(error);
  }
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
        <p class="font-semibold">Content Loading Issue</p>
        <p class="text-sm mt-1">Some content may not load properly. Please refresh the page or check your connection.</p>
      </div>
      <button class="ml-4 text-white hover:text-gray-200 flex-shrink-0" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `;

  document.body.appendChild(errorDiv);

  // Log detailed error for debugging
  console.error('Initialization error details:', {
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
 * Retry initialization after a delay
 * Useful if there are temporary network issues
 */
async function retryInitialization() {
  try {
    console.log('Retrying initialization...');

    // Wait a bit before retrying
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Re-initialize
    await init();

  } catch (error) {
    console.error('Retry failed:', error);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Expose retry function globally for manual retry capability
window.retryInitialization = retryInitialization;

// Add service worker registration for better performance (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Uncomment the following lines if you want to add service worker support
    // navigator.serviceWorker.register('/sw.js')
    //   .then(registration => console.log('SW registered:', registration))
    //   .catch(error => console.log('SW registration failed:', error));
  });
}

// Add basic analytics placeholder (can be replaced with real analytics)
window.addEventListener('load', () => {
  // Track page load time
  const loadTime = performance.now();
  console.log(`Page loaded in ${Math.round(loadTime)}ms`);

  // Add any additional load-time functionality here
});
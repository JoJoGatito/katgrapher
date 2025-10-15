/**
 * Sanity Configuration for katgrapher.studio
 *
 * This file contains the configuration settings for connecting to your Sanity project.
 * Update these values with your actual Sanity project details.
 *
 * To find these values:
 * 1. Go to your Sanity project dashboard at https://sanity.io/manage
 * 2. Select your project (katgrapher-studio or similar)
 * 3. Go to Settings > API tab
 * 4. Copy the Project ID and create an API token if needed
 *
 * For dataset names:
 * - 'production' - Your live/published content
 * - 'staging' - Preview content (optional)
 * - 'development' - Local development content (optional)
 */

export const sanityConfig = {
  // Your Sanity project ID (found in project settings)
  // Example: 'abc123' or 'your-project-id'
  projectId: 'ncpsxckb',

  // Dataset name - typically 'production' for live site
  // Use 'staging' or 'development' for preview environments
  dataset: 'production',

  // API version - use current date or 'v2024-01-01' for latest stable
  // Format: 'vYYYY-MM-DD' (e.g., 'v2024-01-01')
  apiVersion: 'v2024-01-01',

  // CDN URL for Sanity images
  // This is used by the image URL builder in sanity-client.js
  cdnUrl: 'https://cdn.sanity.io',

  // Optional: API token for authenticated requests (if needed)
  // token: 'your-api-token-here', // Uncomment if you need authenticated queries

  // Optional: Enable preview mode (for draft content)
  // previewMode: false, // Set to true when implementing preview functionality
};

/**
 * Sanity Content Types
 * These match the schema types defined in your Sanity configuration
 */
export const contentTypes = {
  PROJECT: 'project',
  PHOTO: 'photo',
  CATEGORY: 'category',
  SETTINGS: 'settings',
};

/**
 * Sanity Image Options
 * Default options for image transformations
 */
export const imageDefaults = {
  // Default image quality (1-100)
  quality: 85,

  // Default format - webp for better performance, auto for compatibility
  format: 'webp',

  // Fallback format if webp is not supported
  fallbackFormat: 'jpg',
};

/**
 * Gallery Settings
 * Configuration for gallery display and filtering
 */
export const galleryConfig = {
  // Number of photos to load initially
  initialLoadCount: 12,

  // Number of photos to load when "Load More" is clicked
  loadMoreCount: 8,

  // Maximum number of photos to show in lightbox
  maxLightboxPhotos: 50,

  // Enable infinite scroll (alternative to load more button)
  enableInfiniteScroll: false,

  // Animation duration for transitions (in milliseconds)
  animationDuration: 300,
};

/**
 * Project Display Settings
 * Configuration for how projects are displayed
 */
export const projectConfig = {
  // Number of featured projects to show on homepage
  featuredProjectCount: 6,

  // Maximum number of technology tags to display per project
  maxTechTags: 5,

  // Show GitHub link if available
  showGithubLink: true,

  // Show completion date
  showCompletionDate: false,
};

/**
 * Sanity GROQ Query Limits
 * Prevent excessive data fetching
 */
export const queryLimits = {
  // Maximum number of projects to fetch in one query
  maxProjects: 100,

  // Maximum number of photos to fetch in one query
  maxPhotos: 200,

  // Maximum number of categories to fetch
  maxCategories: 50,
};
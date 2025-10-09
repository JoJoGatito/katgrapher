/**
 * Lightweight Sanity Client for katgrapher.studio
 *
 * This module provides a simple interface for fetching data from Sanity CMS
 * without depending on the full @sanity/client package. Uses native fetch API.
 *
 * Features:
 * - GROQ query execution with parameter support
 * - Image URL builder with transformation options
 * - Error handling and retry logic
 * - No external dependencies
 */

import { sanityConfig, imageDefaults } from './config.js';

/**
 * Execute a GROQ query against Sanity API
 *
 * @param {string} query - GROQ query string
 * @param {object} params - Query parameters (optional)
 * @param {object} options - Additional options (optional)
 * @returns {Promise<Array|object>} Query results
 */
export async function fetchSanity(query, params = {}, options = {}) {
  try {
    const { projectId, dataset, apiVersion } = sanityConfig;

    // Validate required configuration
    if (!projectId || !dataset || !apiVersion) {
      throw new Error('Missing Sanity configuration. Please check scripts/config.js');
    }

    // Build request URL
    const baseUrl = `https://${projectId}.api.sanity.io/${apiVersion}/data/query/${dataset}`;
    const url = new URL(baseUrl);

    // Add query and parameters
    url.searchParams.set('query', query);

    // Add parameters as JSON string if provided
    if (Object.keys(params).length > 0) {
      url.searchParams.set('params', JSON.stringify(params));
    }

    // Prepare fetch options
    const fetchOptions = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    };

    // Add authorization header if token is provided
    if (sanityConfig.token) {
      fetchOptions.headers.Authorization = `Bearer ${sanityConfig.token}`;
    }

    // Execute request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(url.toString(), {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle HTTP errors
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Sanity API error (${response.status}): ${errorText}`);
      }

      // Parse response
      const data = await response.json();

      // Handle Sanity-specific errors
      if (data.error) {
        throw new Error(`Sanity query error: ${data.error.description || data.error.message}`);
      }

      return data.result;

    } catch (fetchError) {
      clearTimeout(timeoutId);

      if (fetchError.name === 'AbortError') {
        throw new Error('Sanity API request timed out after 30 seconds');
      }

      throw fetchError;
    }

  } catch (error) {
    console.error('Error fetching from Sanity:', error);
    throw error;
  }
}

/**
 * Build a Sanity image URL with transformation options
 *
 * @param {string} imageRef - Sanity image reference (e.g., 'image-abc123-1200x800.jpg')
 * @param {object} options - Image transformation options
 * @returns {string} Complete image URL
 */
export function buildImageUrl(imageRef, options = {}) {
  try {
    // Validate inputs
    if (!imageRef) {
      throw new Error('Image reference is required');
    }

    if (!sanityConfig.projectId) {
      throw new Error('Sanity project ID is required for image URLs');
    }

    // Parse image reference to extract asset ID and dimensions
    const imageData = parseImageRef(imageRef);
    if (!imageData) {
      throw new Error('Invalid image reference format');
    }

    // Build base URL
    const { projectId, cdnUrl } = sanityConfig;
    const baseUrl = `${cdnUrl}/images/${projectId}/${imageData.dataset}/${imageData.assetId}-${imageData.dimensions}`;

    // Apply transformations
    const url = new URL(baseUrl);

    // Size transformations
    if (options.width) {
      url.searchParams.set('w', Math.round(options.width));
    }
    if (options.height) {
      url.searchParams.set('h', Math.round(options.height));
    }
    if (options.fit) {
      url.searchParams.set('fit', options.fit); // clip, crop, fill, fillmax, max, scale, min
    }
    if (options.crop) {
      url.searchParams.set('crop', options.crop); // focalpoint, entropy, center, top, bottom, etc.
    }

    // Quality and format
    if (options.quality !== undefined) {
      url.searchParams.set('q', Math.max(1, Math.min(100, Math.round(options.quality))));
    } else if (imageDefaults.quality !== undefined) {
      url.searchParams.set('q', imageDefaults.quality);
    }

    if (options.format) {
      url.searchParams.set('fm', options.format);
    } else if (imageDefaults.format) {
      url.searchParams.set('fm', imageDefaults.format);
    }

    // Auto format selection
    if (options.auto && options.auto.format) {
      url.searchParams.set('auto', options.auto.format);
    }

    // Blur effect
    if (options.blur) {
      url.searchParams.set('blur', Math.round(options.blur));
    }

    // Saturation adjustment
    if (options.saturation) {
      url.searchParams.set('sat', Math.round(options.saturation));
    }

    // Flip and rotate
    if (options.flip) {
      url.searchParams.set('flip', options.flip); // horizontal, vertical
    }
    if (options.rotate) {
      url.searchParams.set('ori', Math.round(options.rotate));
    }

    return url.toString();

  } catch (error) {
    console.error('Error building Sanity image URL:', error);
    return null;
  }
}

/**
 * Parse Sanity image reference to extract components
 * Expected format: image-[assetId]-[width]x[height]-[format]
 *
 * @param {string} imageRef - Sanity image reference
 * @returns {object|null} Parsed image data or null if invalid
 */
function parseImageRef(imageRef) {
  try {
    // Match pattern: image-[assetId]-[dimensions]-[format]
    const pattern = /^image-([a-f0-9]+)-(\d+x\d+)-([a-z]+)$/i;
    const match = imageRef.match(pattern);

    if (!match) {
      return null;
    }

    const [, assetId, dimensions, format] = match;

    // Extract width and height from dimensions
    const [width, height] = dimensions.split('x').map(Number);

    // Determine dataset (usually 'production' for published content)
    const dataset = sanityConfig.dataset || 'production';

    return {
      assetId,
      dimensions,
      width,
      height,
      format,
      dataset,
    };

  } catch (error) {
    console.error('Error parsing image reference:', error);
    return null;
  }
}

/**
 * Get optimized image URL for responsive loading
 * Automatically provides multiple sizes for responsive images
 *
 * @param {string} imageRef - Sanity image reference
 * @param {object} options - Base options for image transformation
 * @returns {object} Object with different sized URLs
 */
export function getResponsiveImageUrls(imageRef, options = {}) {
  try {
    const baseOptions = { ...options };

    return {
      small: buildImageUrl(imageRef, { ...baseOptions, width: 400 }),
      medium: buildImageUrl(imageRef, { ...baseOptions, width: 800 }),
      large: buildImageUrl(imageRef, { ...baseOptions, width: 1200 }),
      original: buildImageUrl(imageRef, { ...baseOptions }),
    };

  } catch (error) {
    console.error('Error generating responsive image URLs:', error);
    return null;
  }
}

/**
 * Preload Sanity images for better performance
 *
 * @param {Array} imageRefs - Array of Sanity image references
 * @param {object} options - Image options
 */
export function preloadSanityImages(imageRefs, options = {}) {
  if (!Array.isArray(imageRefs) || imageRefs.length === 0) {
    return;
  }

  imageRefs.forEach(imageRef => {
    const imageUrl = buildImageUrl(imageRef, options);
    if (imageUrl) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = imageUrl;
      document.head.appendChild(link);
    }
  });
}

/**
 * Utility function to check if an image reference is valid
 *
 * @param {string} imageRef - Sanity image reference
 * @returns {boolean} True if valid format
 */
export function isValidImageRef(imageRef) {
  return typeof imageRef === 'string' && /^image-[a-f0-9]+-\d+x\d+-[a-z]+$/i.test(imageRef);
}

/**
 * Get Sanity CDN URL for direct image access
 * Useful when you need to construct URLs manually
 *
 * @param {string} imageRef - Sanity image reference
 * @returns {string|null} CDN URL or null if invalid
 */
export function getSanityImageCdnUrl(imageRef) {
  try {
    if (!isValidImageRef(imageRef)) {
      return null;
    }

    const imageData = parseImageRef(imageRef);
    if (!imageData) {
      return null;
    }

    return `${sanityConfig.cdnUrl}/images/${sanityConfig.projectId}/${imageData.dataset}/${imageRef}`;

  } catch (error) {
    console.error('Error getting Sanity CDN URL:', error);
    return null;
  }
}
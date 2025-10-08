/**
 * Main Schema Configuration for katgrapher.studio
 *
 * This file combines all individual schema types into a single schema
 * configuration that can be used with Sanity Studio. Import this file
 * in your sanity.config.js file.
 *
 * Schema Overview:
 * - category: Photo categorization and filtering
 * - photo: Individual photography portfolio items
 * - project: Web development project showcase
 * - settings: Global site configuration
 *
 * Usage in Sanity Project:
 * 1. Copy these files to your Sanity project
 * 2. Import in sanity.config.js:
 *    import { schemaTypes } from './schemas/schema'
 * 3. Add to config:
 *    schema: { types: schemaTypes }
 *
 * Integration Notes:
 * - These schemas are designed to work with the existing HTML structure
 * - Category references enable photo filtering functionality
 * - Settings provide global configuration for the site
 * - Featured flags help highlight important content
 */

// Import all schema types
import category from './category';
import photo from './photo';
import project from './project';
import settings from './settings';

// Combine all schemas into a single array
export const schemaTypes = [
  // Core content types
  category,
  photo,
  project,

  // Configuration
  settings
];

// Export individual schemas for direct access if needed
export {
  category,
  photo,
  project,
  settings
};

// Schema validation and helpful information
export const schemaInfo = {
  name: 'katgrapher-portfolio',
  version: '1.0.0',
  description: 'Photography portfolio schema with project showcase and site settings',
  types: {
    content: ['category', 'photo', 'project'],
    configuration: ['settings']
  }
};

/**
 * Setup Instructions for New Sanity Project:
 *
 * 1. Install Sanity CLI:
 *    npm install -g @sanity/cli
 *
 * 2. Initialize project (if not already done):
 *    sanity init
 *
 * 3. Copy these schema files to your project
 *
 * 4. Update sanity.config.js:
 *    import { schemaTypes } from './schemas/schema';
 *
 *    export default defineConfig({
 *      // ... other config
 *      schema: {
 *        types: schemaTypes,
 *      },
 *    });
 *
 * 5. Add CORS origins for your domain:
 *    sanity cors add https://yourdomain.com
 *
 * 6. Deploy to production:
 *    sanity deploy
 *
 * 7. Set up webhooks (optional) for automatic rebuilds:
 *    sanity webhook add https://yourdomain.com/api/revalidate
 */
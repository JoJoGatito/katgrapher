import { defineField, defineType } from 'sanity';

/**
 * Settings Schema for katgrapher.studio
 *
 * This schema defines global site settings that will be used across
 * the entire portfolio website. Only one settings document should exist.
 *
 * Usage in Sanity Studio:
 * - Create exactly one settings document
 * - These settings will be pulled into templates and layouts
 * - Social links will be used in footer and contact sections
 * - SEO fields help with search engine optimization
 *
 * Integration with HTML:
 * - Site name appears in header and meta tags
 * - Social links populate footer and contact areas
 * - SEO fields enhance meta descriptions and titles
 */
export default defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Site Name',
      type: 'string',
      validation: Rule => Rule.required().min(2).max(100),
      description: 'Main site name (e.g., "Kat G Rapher Photography")'
    }),
    defineField({
      name: 'tagline',
      title: 'Site Tagline',
      type: 'string',
      validation: Rule => Rule.required().min(10).max(200),
      description: 'Brief description or tagline for the site'
    }),
    defineField({
      name: 'description',
      title: 'Site Description',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.required().min(50).max(300),
      description: 'Detailed description for SEO and meta tags'
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'object',
      fields: [
        defineField({
          name: 'instagram',
          title: 'Instagram',
          type: 'url',
          description: 'Instagram profile URL'
        }),
        defineField({
          name: 'github',
          title: 'GitHub',
          type: 'url',
          description: 'GitHub profile URL'
        }),
        defineField({
          name: 'linkedin',
          title: 'LinkedIn',
          type: 'url',
          description: 'LinkedIn profile URL'
        }),
        defineField({
          name: 'twitter',
          title: 'Twitter/X',
          type: 'url',
          description: 'Twitter/X profile URL'
        }),
        defineField({
          name: 'facebook',
          title: 'Facebook',
          type: 'url',
          description: 'Facebook profile URL'
        }),
        defineField({
          name: 'youtube',
          title: 'YouTube',
          type: 'url',
          description: 'YouTube channel URL'
        }),
        defineField({
          name: 'vimeo',
          title: 'Vimeo',
          type: 'url',
          description: 'Vimeo profile URL'
        }),
        defineField({
          name: 'behance',
          title: 'Behance',
          type: 'url',
          description: 'Behance portfolio URL'
        }),
        defineField({
          name: 'dribbble',
          title: 'Dribbble',
          type: 'url',
          description: 'Dribbble profile URL'
        }),
        defineField({
          name: 'email',
          title: 'Email',
          type: 'email',
          description: 'Contact email address'
        }),
        defineField({
          name: 'phone',
          title: 'Phone',
          type: 'string',
          description: 'Contact phone number'
        })
      ],
      description: 'Social media profiles and contact information'
    }),
    defineField({
      name: 'contactInfo',
      title: 'Contact Information',
      type: 'object',
      fields: [
        defineField({
          name: 'email',
          title: 'Primary Email',
          type: 'email',
          description: 'Main contact email'
        }),
        defineField({
          name: 'phone',
          title: 'Phone Number',
          type: 'string',
          description: 'Contact phone number'
        }),
        defineField({
          name: 'location',
          title: 'Location',
          type: 'string',
          description: 'Business location (city, state/country)'
        }),
        defineField({
          name: 'hours',
          title: 'Business Hours',
          type: 'text',
          rows: 2,
          description: 'Available hours for contact (optional)'
        })
      ],
      description: 'Primary contact information for the business'
    }),
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          validation: Rule => Rule.max(60),
          description: 'Custom meta title (defaults to site name if empty)'
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 2,
          validation: Rule => Rule.max(160),
          description: 'Custom meta description (defaults to site description if empty)'
        }),
        defineField({
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{ type: 'string' }],
          options: {
            layout: 'tags'
          },
          description: 'SEO keywords for search engines'
        }),
        defineField({
          name: 'ogImage',
          title: 'Open Graph Image',
          type: 'image',
          description: 'Image for social media sharing (1200x630px recommended)'
        })
      ],
      description: 'Search engine optimization settings'
    }),
    defineField({
      name: 'analytics',
      title: 'Analytics & Tracking',
      type: 'object',
      fields: [
        defineField({
          name: 'googleAnalyticsId',
          title: 'Google Analytics ID',
          type: 'string',
          description: 'Google Analytics tracking ID (e.g., G-XXXXXXXXXX)'
        }),
        defineField({
          name: 'gtmId',
          title: 'Google Tag Manager ID',
          type: 'string',
          description: 'Google Tag Manager container ID'
        })
      ],
      description: 'Analytics and tracking codes'
    })
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'tagline'
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        title: title || 'Site Settings',
        subtitle: subtitle || 'No tagline set'
      };
    }
  }
});
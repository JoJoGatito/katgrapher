import { defineField, defineType } from 'sanity';

/**
 * Photo Schema for katgrapher.studio
 *
 * This schema defines individual photography portfolio items that will be
 * displayed in the gallery. Each photo can belong to multiple categories
 * for flexible filtering and organization.
 *
 * Usage in Sanity Studio:
 * - Upload high-quality images for portfolio display
 * - Assign relevant categories for filtering functionality
 * - Add descriptive alt text for accessibility
 * - Include captions for additional context when needed
 *
 * Integration with HTML:
 * - Maps to .photo-card elements in gallery.html
 * - Categories enable the filter buttons functionality
 * - Image field supports Sanity's hotspot for responsive cropping
 */
export default defineType({
  name: 'photo',
  title: 'Photography Portfolio Item',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Photo Image',
      type: 'image',
      options: {
        hotspot: true,
        metadata: ['blurhash', 'lqip', 'palette'],
      },
      validation: Rule => Rule.required(),
      description: 'Main portfolio image - use high resolution for best results'
    }),
    defineField({
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
      validation: Rule => Rule.required().min(5).max(200),
      description: 'Descriptive alt text for accessibility and SEO'
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'text',
      rows: 3,
      description: 'Optional caption or description for the photo'
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'category' }]
        }
      ],
      validation: Rule => Rule.required().min(1),
      description: 'Select one or more categories this photo belongs to'
    }),
    defineField({
      name: 'date',
      title: 'Date Taken',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
      description: 'When this photo was taken (for sorting and organization)'
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Where this photo was taken (optional)'
    }),
    defineField({
      name: 'featured',
      title: 'Featured Photo',
      type: 'boolean',
      description: 'Mark as featured to highlight in main portfolio view',
      initialValue: false
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Custom order for this photo (lower numbers appear first)',
      initialValue: 0
    })
  ],
  preview: {
    select: {
      imageUrl: 'image',
      title: 'alt',
      subtitle: 'categories',
      featured: 'featured'
    },
    prepare(selection) {
      const { imageUrl, title, subtitle, featured } = selection;
      return {
        title: title || 'Untitled Photo',
        subtitle: `${subtitle ? subtitle.length + ' categories' : 'No categories'}${featured ? ' • Featured' : ''}`,
        media: imageUrl
      };
    }
  },
  orderings: [
    {
      title: 'Featured First, then Date',
      name: 'featuredDate',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'date', direction: 'desc' }
      ]
    },
    {
      title: 'Display Order',
      name: 'customOrder',
      by: [
        { field: 'order', direction: 'asc' }
      ]
    },
    {
      title: 'Date Newest First',
      name: 'dateDesc',
      by: [
        { field: 'date', direction: 'desc' }
      ]
    }
  ]
});
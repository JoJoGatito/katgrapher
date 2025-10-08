import { defineField, defineType } from 'sanity';

/**
 * Category Schema for katgrapher.studio
 *
 * This schema defines photo categories that can be used to organize and filter
 * photography portfolio items. Categories allow for multiple classification
 * of photos (e.g., "portrait", "landscape", "wedding", "commercial").
 *
 * Usage in Sanity Studio:
 * - Create categories first before assigning them to photos
 * - Categories will appear as filter options in the portfolio gallery
 * - The slug field is auto-generated from the title for URL-friendly references
 */
export default defineType({
  name: 'category',
  title: 'Photo Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Category Title',
      type: 'string',
      validation: Rule => Rule.required().min(2).max(50),
      description: 'Display name for the category (e.g., "Portrait", "Wedding", "Commercial")'
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: input => input
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]+/g, ''),
      },
      validation: Rule => Rule.required(),
      description: 'URL-friendly version of the category title, auto-generated from title'
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Optional description of what this category represents'
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description'
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        title: title || 'Untitled Category',
        subtitle: subtitle || 'No description'
      };
    }
  },
  orderings: [
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [
        { field: 'title', direction: 'asc' }
      ]
    }
  ]
});
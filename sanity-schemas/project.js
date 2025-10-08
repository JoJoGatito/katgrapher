import { defineField, defineType } from 'sanity';

/**
 * Project Schema for katgrapher.studio
 *
 * This schema defines website development projects that will be showcased
 * in the portfolio. Projects can be filtered by technology tags and
 * featured projects will be highlighted prominently.
 *
 * Usage in Sanity Studio:
 * - Add completed web development projects with screenshots/images
 * - Tag projects with relevant technologies for filtering
 * - Mark important projects as featured for homepage display
 * - Include working URLs for live project demonstrations
 *
 * Integration with HTML:
 * - Maps to .project-card elements in the projects section
 * - Tech tags enable filtering functionality
 * - Featured projects appear in hero/featured sections
 */
export default defineType({
  name: 'project',
  title: 'Web Development Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Project Title',
      type: 'string',
      validation: Rule => Rule.required().min(3).max(100),
      description: 'Name of the web project'
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
      description: 'URL-friendly version of the project title'
    }),
    defineField({
      name: 'description',
      title: 'Project Description',
      type: 'text',
      rows: 4,
      validation: Rule => Rule.required().min(10).max(500),
      description: 'Detailed description of the project, its goals, and your role'
    }),
    defineField({
      name: 'url',
      title: 'Project URL',
      type: 'url',
      validation: Rule => Rule.required(),
      description: 'Live URL where the project can be viewed'
    }),
    defineField({
      name: 'image',
      title: 'Project Image',
      type: 'image',
      options: {
        hotspot: true,
        metadata: ['blurhash', 'lqip', 'palette'],
      },
      validation: Rule => Rule.required(),
      description: 'Screenshot or mockup of the project (ideally 1200x800px or similar)'
    }),
    defineField({
      name: 'techTags',
      title: 'Technology Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags'
      },
      validation: Rule => Rule.required().min(1).max(10),
      description: 'Technologies and tools used in this project (e.g., React, Node.js, MongoDB)'
    }),
    defineField({
      name: 'featured',
      title: 'Featured Project',
      type: 'boolean',
      description: 'Mark as featured to highlight on the homepage',
      initialValue: false
    }),
    defineField({
      name: 'githubUrl',
      title: 'GitHub Repository',
      type: 'url',
      description: 'Link to the project\'s source code repository (optional)'
    }),
    defineField({
      name: 'completionDate',
      title: 'Completion Date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
      description: 'When this project was completed'
    }),
    defineField({
      name: 'projectType',
      title: 'Project Type',
      type: 'string',
      options: {
        list: [
          { title: 'Full Website', value: 'full-website' },
          { title: 'Web Application', value: 'web-app' },
          { title: 'E-commerce', value: 'ecommerce' },
          { title: 'Portfolio Site', value: 'portfolio' },
          { title: 'Landing Page', value: 'landing-page' },
          { title: 'Blog/CMS', value: 'blog-cms' },
          { title: 'Other', value: 'other' }
        ],
        layout: 'dropdown'
      },
      description: 'Type of project for categorization'
    }),
    defineField({
      name: 'challenges',
      title: 'Challenges & Solutions',
      type: 'text',
      rows: 3,
      description: 'Interesting challenges faced and how they were overcome (optional)'
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'techTags',
      imageUrl: 'image',
      featured: 'featured'
    },
    prepare(selection) {
      const { title, subtitle, imageUrl, featured } = selection;
      const techString = subtitle ? subtitle.slice(0, 3).join(', ') + (subtitle.length > 3 ? '...' : '') : '';
      return {
        title: title || 'Untitled Project',
        subtitle: `${techString}${featured ? ' • Featured' : ''}`,
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
        { field: 'completionDate', direction: 'desc' }
      ]
    },
    {
      title: 'Newest Projects First',
      name: 'dateDesc',
      by: [
        { field: 'completionDate', direction: 'desc' }
      ]
    },
    {
      title: 'Project Title A-Z',
      name: 'titleAsc',
      by: [
        { field: 'title', direction: 'asc' }
      ]
    }
  ]
});
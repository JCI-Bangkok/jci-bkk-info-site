import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'year', 'category'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'year',
      type: 'number',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Community Impact', value: 'community' },
        { label: 'Youth Development', value: 'youth' },
        { label: 'Sustainability', value: 'sustainability' },
        { label: 'Entrepreneurship', value: 'entrepreneurship' },
        { label: 'International Cooperation', value: 'international' },
      ],
    },
    {
      name: 'problemStatement',
      type: 'textarea',
      required: true,
    },
    {
      name: 'targetBeneficiaries',
      type: 'text',
    },
    {
      name: 'activities',
      type: 'richText',
    },
    {
      name: 'outcomes',
      type: 'richText',
    },
    {
      name: 'impactNumbers',
      type: 'array',
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'sdgTags',
      type: 'select',
      hasMany: true,
      options: Array.from({ length: 17 }, (_, i) => ({
        label: `SDG ${i + 1}: ${[
          'No Poverty',
          'Zero Hunger',
          'Good Health and Well-being',
          'Quality Education',
          'Gender Equality',
          'Clean Water and Sanitation',
          'Affordable and Clean Energy',
          'Decent Work and Economic Growth',
          'Industry, Innovation and Infrastructure',
          'Reduced Inequalities',
          'Sustainable Cities and Communities',
          'Responsible Consumption and Production',
          'Climate Action',
          'Life Below Water',
          'Life on Land',
          'Peace, Justice and Strong Institutions',
          'Partnerships for the Goals',
        ][i]}`,
        value: `sdg-${i + 1}`,
      })),
    },
    {
      name: 'partners',
      type: 'text',
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'reportFile',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'cta',
      type: 'text',
    },
  ],
}

import { validateSingleSlug } from '@/lib/seo-model'
import { editorialTabs } from '@/fields/seo'
import { canEditContent, canReadContent } from './hooks/editorial'
import type { CollectionConfig } from 'payload'
import { revalidateProject, revalidateDeleteProject } from './hooks/revalidate'

export const Projects: CollectionConfig = {
  slug: 'projects',
  versions: { maxPerDoc: 25 },
  access: { read: canReadContent({ status: { equals: 'published' } }), create: canEditContent, update: canEditContent, delete: canEditContent },
  admin: {
    useAsTitle: 'title',
    group: 'Website content',
    defaultColumns: ['title', 'status', 'year', 'category'],
  },
  hooks: {
    afterChange: [revalidateProject],
    afterDelete: [revalidateDeleteProject],
  },
  fields: editorialTabs([
    { name: 'status', label: 'Publication status', type: 'select', defaultValue: 'draft', required: true, options: [{ label: 'Draft', value: 'draft' }, { label: 'Published', value: 'published' }], admin: { position: 'sidebar', description: 'Draft content is visible only to signed-in editors.' } },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      validate: validateSingleSlug,
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
      localized: true,
    },
    {
      name: 'targetBeneficiaries',
      type: 'text',
      localized: true,
    },
    {
      name: 'activities',
      type: 'richText',
      localized: true,
    },
    {
      name: 'outcomes',
      type: 'richText',
      localized: true,
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
          localized: true,
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
      localized: true,
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
      localized: true,
    },
  ]),
}

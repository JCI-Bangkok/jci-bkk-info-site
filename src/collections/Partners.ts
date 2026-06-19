import type { CollectionConfig } from 'payload'

export const Partners: CollectionConfig = {
  slug: 'partners',
  admin: {
    useAsTitle: 'organizationName',
    defaultColumns: ['organizationName', 'partnerType', 'partnershipYear'],
  },
  fields: [
    {
      name: 'organizationName',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'website',
      type: 'text',
    },
    {
      name: 'partnerType',
      type: 'select',
      required: true,
      options: [
        { label: 'Sponsor', value: 'sponsor' },
        { label: 'Partner', value: 'partner' },
        { label: 'Embassy', value: 'embassy' },
        { label: 'University', value: 'university' },
        { label: 'Community', value: 'community' },
      ],
    },
    {
      name: 'partnershipYear',
      type: 'number',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'relatedProjects',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
    },
    {
      name: 'relatedEvents',
      type: 'relationship',
      relationTo: 'events',
      hasMany: true,
    },
  ],
}

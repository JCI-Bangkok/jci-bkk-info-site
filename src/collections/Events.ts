import type { CollectionConfig } from 'payload'
import { revalidateEvent, revalidateDeleteEvent } from './hooks/revalidate'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'eventDate', 'eventType', 'status'],
  },
  hooks: {
    afterChange: [revalidateEvent],
    afterDelete: [revalidateDeleteEvent],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
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
      name: 'eventDate',
      type: 'date',
      required: true,
    },
    {
      name: 'endDate',
      type: 'date',
    },
    {
      name: 'venue',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'googleMapsLink',
      type: 'text',
    },
    {
      name: 'registrationLink',
      type: 'text',
    },
    {
      name: 'eventType',
      type: 'select',
      required: true,
      options: [
        { label: 'Training & Development', value: 'training' },
        { label: 'Business & Networking', value: 'networking' },
        { label: 'Community Project', value: 'community' },
        { label: 'General Meeting', value: 'general' },
        { label: 'International Event', value: 'international' },
        { label: 'Partner Event', value: 'partner' },
      ],
    },
    {
      name: 'hostCommittee',
      type: 'text',
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
      localized: true,
    },
    {
      name: 'fullDescription',
      type: 'richText',
      localized: true,
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
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
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Upcoming', value: 'upcoming' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}

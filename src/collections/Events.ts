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
      timezone: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
          timeIntervals: 15,
        },
      },
    },
    {
      name: 'eventTime',
      type: 'textarea',
      admin: {
        description: 'Enter each time or session on a new line (or rely on time picked in Event Date).',
      },
    },
    {
      name: 'endDate',
      type: 'date',
      timezone: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
          timeIntervals: 15,
        },
      },
    },
    {
      name: 'price',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'e.g. Free, 500 THB, etc. (Can press Enter for multiple lines)'
      }
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
      name: 'facebookPosts',
      type: 'array',
      labels: {
        singular: 'Facebook Post',
        plural: 'Facebook Posts',
      },
      fields: [
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          admin: {
            description: 'Optional (e.g. Day 1 Photos, Summary, etc.)',
          }
        }
      ]
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
      name: 'secondaryPosters',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      admin: {
        description: 'โปสเตอร์รอง (ถ้ามี) เลือกได้หลายรูป จะแสดงอยู่ด้านบนสุด',
      }
    },
    {
      name: 'eventPhotos',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      admin: {
        description: 'แกลเลอรีภาพถ่ายกิจกรรม เลือกทีละหลายๆ รูป และลากจัดลำดับได้ง่าย',
      }
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

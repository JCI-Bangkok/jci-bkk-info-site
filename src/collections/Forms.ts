import type { CollectionConfig } from 'payload'
import { emailInquiryNotification } from './hooks/email'

export const Forms: CollectionConfig = {
  slug: 'forms',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'inquiryType', 'email', 'createdAt'],
  },
  access: {
    create: () => true, // Anyone can submit a form
  },
  hooks: {
    afterChange: [emailInquiryNotification],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'inquiryType',
      type: 'select',
      required: true,
      options: [
        { label: 'Membership Inquiry', value: 'membership' },
        { label: 'Partnership Inquiry', value: 'partnership' },
        { label: 'Media Inquiry', value: 'media' },
        { label: 'General Contact', value: 'general' },
      ],
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'consent',
      type: 'checkbox',
      required: true,
      label: 'I consent to the collection and processing of my personal data for the purpose of this inquiry.',
    },
  ],
}

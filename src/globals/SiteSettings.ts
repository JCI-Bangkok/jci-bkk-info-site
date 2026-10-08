import { canEditContent, revalidateSettings } from '@/collections/hooks/editorial'
import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: { read: () => true, update: canEditContent },
  hooks: { afterChange: [revalidateSettings] },
  fields: [
    { name: 'defaultSocialImage', label: 'Default social sharing image', type: 'upload', relationTo: 'media', localized: true, admin: { description: 'Fallback image for SEO/social cards when content has no image. Recommended 1200 × 630.' } },
    {
      name: 'siteName',
      type: 'text',
      required: true,
      defaultValue: 'JCI Bangkok',
      localized: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'mainNav',
      type: 'array',
      label: 'Main Navigation Menu',
      labels: {
        singular: 'Menu Item',
        plural: 'Menu Items',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'href',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        {
          name: 'facebook',
          type: 'text',
        },
        {
          name: 'linkedin',
          type: 'text',
        },
        {
          name: 'instagram',
          type: 'text',
        },
      ],
    },
    {
      name: 'contactEmail',
      type: 'text',
    },
    {
      name: 'footerText',
      type: 'text',
      localized: true,
    },
    {
      name: 'currentYearTheme',
      type: 'text',
      label: 'Current Year Theme',
      localized: true,
    },
    {
      name: 'membershipFormLink',
      type: 'text',
      label: 'Membership Form Link',
    },
    {
      name: 'membershipCoverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Membership Page Cover Image',
    },
    {
      name: 'aboutCoverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'About Page Cover Image',
    },
    {
      name: 'homeHeroImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Home Page Hero Image',
    },
    {
      name: 'homePathway1',
      type: 'upload',
      relationTo: 'media',
      label: 'Home Pathway 1 (Leadership)',
    },
    {
      name: 'homePathway2',
      type: 'upload',
      relationTo: 'media',
      label: 'Home Pathway 2 (Business)',
    },
    {
      name: 'homePathway3',
      type: 'upload',
      relationTo: 'media',
      label: 'Home Pathway 3 (International)',
    },
    {
      name: 'homePathway4',
      type: 'upload',
      relationTo: 'media',
      label: 'Home Pathway 4 (Community)',
    },
    {
      name: 'memberStoryFallback',
      type: 'upload',
      relationTo: 'media',
      label: 'Member Story Default Image',
    },
  ],
}

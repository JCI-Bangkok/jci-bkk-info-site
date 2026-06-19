import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  fields: [
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
  ],
}

import { canEditContent, revalidateSettings } from '@/collections/hooks/editorial'
import type { GlobalConfig } from 'payload'

/**
 * Site-wide links live independently from page settings so a navigation change
 * does not require editing a template or redeploying the frontend.
 */
export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navigation',
  access: { read: () => true, update: canEditContent },
  hooks: { afterChange: [revalidateSettings] },
  fields: [
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      labels: { singular: 'Navigation item', plural: 'Navigation items' },
      fields: [
        { name: 'label', type: 'text', required: true, label: 'English label' },
        { name: 'labelTh', type: 'text', label: 'Thai label' },
        { name: 'linkType', type: 'radio', defaultValue: 'page', options: [{ label: 'CMS page', value: 'page' }, { label: 'Custom URL', value: 'custom' }] },
        { name: 'page', type: 'relationship', relationTo: 'pages', admin: { condition: (_, siblingData) => siblingData?.linkType !== 'custom', description: 'The link follows this page automatically when its URL changes.' } },
        { name: 'href', type: 'text', admin: { condition: (_, siblingData) => siblingData?.linkType === 'custom', description: 'Relative URL, anchor, email, phone number or full external URL.' } },
        { name: 'openInNewTab', type: 'checkbox', defaultValue: false, admin: { description: 'Recommended only for external websites.' } },
      ],
    },
  ],
}

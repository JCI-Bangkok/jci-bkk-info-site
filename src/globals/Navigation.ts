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
        { name: 'href', type: 'text', required: true, admin: { description: 'Use a relative path, for example /events.' } },
      ],
    },
  ],
}

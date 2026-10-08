import { staticPageKeys, validatePageSlug } from '@/lib/seo-model'
import { editorialTabs } from '@/fields/seo'
import { canEditContent, canReadContent, revalidatePage, revalidateDeletedPage } from './hooks/editorial'
import type { CollectionConfig } from 'payload'
import { validatePuckLayout } from './hooks/builder'

export const Pages: CollectionConfig = {
  slug: 'pages',
  versions: { maxPerDoc: 25, drafts: true },
  access: { read: canReadContent({ status: { equals: 'published' } }), create: canEditContent, update: canEditContent, delete: canEditContent },
  admin: {
    useAsTitle: 'title',
    group: 'Website content',
    description: 'The seven built-in page records control SEO for the existing layouts. Other published paths render their rich text as new website pages. For board-year SEO, use members/board/YYYY.',
    defaultColumns: ['title', 'slug', 'status'],
  },
  hooks: { beforeChange: [validatePuckLayout], afterChange: [revalidatePage], afterDelete: [revalidateDeletedPage] },
  fields: editorialTabs([
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      validate: validatePageSlug,
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'visualEditorLink',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/components/builder/VisualEditorLink',
        },
      }
    },
    {
      name: 'puckLayout',
      type: 'json',
      admin: {
        description: 'Visual layout data managed by the Puck Editor.',
      }
    },
    {
      name: 'content',
      type: 'richText',
      localized: true,
    },
  ]),
}

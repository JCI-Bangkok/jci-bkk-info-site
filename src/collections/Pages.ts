import { validatePageSlug } from '@/lib/seo-model'
import { managedPageTypes } from '@/lib/page-routing'
import { editorialTabs } from '@/fields/seo'
import { canEditContent, canReadContent, revalidatePage, revalidateDeletedPage } from './hooks/editorial'
import type { CollectionConfig } from 'payload'
import { validatePuckLayout } from './hooks/builder'
import type { CollectionBeforeChangeHook } from 'payload'

const preservePageRoute: CollectionBeforeChangeHook = async ({ data, originalDoc, req }) => {
  if (originalDoc?.slug && data.slug && originalDoc.slug !== data.slug) {
    data.legacySlugs = [...new Set([...(originalDoc.legacySlugs || []), originalDoc.slug])].filter(slug => slug !== data.slug)
  }
  if (data.pageType && data.pageType !== 'custom') {
    const existing = await req.payload.find({
      collection: 'pages', limit: 1, overrideAccess: true,
      where: { and: [{ pageType: { equals: data.pageType } }, ...(originalDoc?.id ? [{ id: { not_equals: originalDoc.id } }] : [])] },
    })
    if (existing.totalDocs) throw new Error(`Only one ${data.pageType} page can exist. Edit the existing page instead.`)
  }
  return data
}

const syncVersionStatus: CollectionBeforeChangeHook = async ({ data }) => {
  if (data._status) {
    data.status = data._status
  } else if (data.status) {
    data._status = data.status
  }
  return data
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  versions: { maxPerDoc: 25, drafts: true },
  access: {
    read: canReadContent({ or: [{ _status: { equals: 'published' } }, { status: { equals: 'published' } }] }),
    create: canEditContent,
    update: canEditContent,
    delete: canEditContent,
  },
  admin: {
    useAsTitle: 'title',
    group: 'Website content',
    description: 'Manage every website page, its URL, SEO, publication status and visual layout here. Changing a URL keeps the previous address as a permanent redirect.',
    defaultColumns: ['title', 'pageType', 'slug', '_status'],
  },
  hooks: { beforeChange: [syncVersionStatus, preservePageRoute, validatePuckLayout], afterChange: [revalidatePage], afterDelete: [revalidateDeletedPage] },
  fields: editorialTabs([
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'pageType',
      label: 'Page purpose',
      type: 'select',
      required: true,
      defaultValue: 'custom',
      options: managedPageTypes.map(value => ({
        value,
        label: value === 'custom' ? 'Custom page' : `${value.charAt(0).toUpperCase()}${value.slice(1)} page`,
      })),
      admin: { position: 'sidebar', description: 'Keeps dynamic behavior attached even when the URL changes.' },
    },
    {
      name: 'slug',
      type: 'text',
      validate: validatePageSlug,
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Public URL without the language prefix, for example about-us. Use home for the homepage.',
      },
    },
    {
      name: 'legacySlugs',
      type: 'json',
      defaultValue: [],
      admin: { hidden: true },
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
        hidden: true,
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

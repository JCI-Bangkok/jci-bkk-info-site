import { validateSingleSlug } from '@/lib/seo-model'
import { editorialTabs } from '@/fields/seo'
import { canEditContent, canReadPublishedArticles } from './hooks/editorial'
import type { CollectionConfig } from 'payload'
import { revalidateArticle, revalidateDeleteArticle } from './hooks/revalidate'

export const Articles: CollectionConfig = {
  slug: 'articles',
  versions: { maxPerDoc: 25 },
  access: { read: canReadPublishedArticles, create: canEditContent, update: canEditContent, delete: canEditContent },
  admin: {
    useAsTitle: 'title',
    group: 'Website content',
    defaultColumns: ['title', 'status', 'category', 'publishDate'],
  },
  hooks: {
    afterChange: [revalidateArticle],
    afterDelete: [revalidateDeleteArticle],
  },
  fields: editorialTabs([
    { name: 'status', label: 'Publication status', type: 'select', defaultValue: 'draft', required: true, options: [{ label: 'Draft', value: 'draft' }, { label: 'Published', value: 'published' }], admin: { position: 'sidebar', description: 'Draft content is visible only to signed-in editors.' } },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      validate: validateSingleSlug,
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    { name: 'authorDisplayName', label: 'Public author name', type: 'text', localized: true, admin: { description: 'Approved public byline. Falls back to JCI Bangkok Team; administrative email addresses are never displayed.' } },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'News', value: 'news' },
        { label: 'Event Recap', value: 'event-recap' },
        { label: 'Member Story', value: 'member-story' },
        { label: 'President Message', value: 'president-message' },
        { label: 'Partner Announcement', value: 'partner-announcement' },
        { label: 'Knowledge Article', value: 'knowledge' },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
          localized: true,
        },
      ],
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      localized: true,
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
      localized: true,
    },
    {
      name: 'publishDate',
      type: 'date',
      required: true,
      timezone: true,
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
          timeIntervals: 15,
        },
      },
    },
    {
      name: 'relatedEvent',
      type: 'relationship',
      relationTo: 'events',
    },
    {
      name: 'relatedProject',
      type: 'relationship',
      relationTo: 'projects',
    },
  ]),
}

import type { CollectionConfig } from 'payload'
import { revalidateArticle, revalidateDeleteArticle } from './hooks/revalidate'

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishDate'],
  },
  hooks: {
    afterChange: [revalidateArticle],
    afterDelete: [revalidateDeleteArticle],
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
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
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
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'seoTitle',
      type: 'text',
      localized: true,
    },
    {
      name: 'seoDescription',
      type: 'textarea',
      localized: true,
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
  ],
}

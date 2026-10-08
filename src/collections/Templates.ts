import type { CollectionConfig } from 'payload'
import { canEditContent } from './hooks/editorial'
import { validatePuckLayout, revalidateBuilderTemplates } from './hooks/builder'

export const Templates: CollectionConfig = {
  slug: 'templates',
  admin: {
    useAsTitle: 'title',
    group: 'Design',
  },
  access: {
    read: () => true,
    create: canEditContent,
    update: canEditContent,
    delete: canEditContent,
  },
  versions: {
    drafts: true,
  },
  hooks: { beforeChange: [validatePuckLayout], afterChange: [revalidateBuilderTemplates], afterDelete: [revalidateBuilderTemplates] },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Global Header', value: 'header' },
        { label: 'Global Footer', value: 'footer' },
        { label: 'Single Event', value: 'event-single' },
        { label: 'News Article', value: 'news-single' },
        { label: 'Single Project', value: 'project-single' },
        { label: 'Board Members (Year)', value: 'member-board-year' },
        { label: 'Home Page', value: 'home' },
        { label: 'Events Listing', value: 'events-listing' },
        { label: 'Members Listing', value: 'members-listing' },
        { label: 'About Page', value: 'about' },
        { label: 'Contact Page', value: 'contact' },
        { label: 'Membership Page', value: 'membership' },
        { label: 'PhotoBomb Gallery', value: 'photobomb' },
        { label: 'Custom Archive', value: 'archive' },
      ],
      admin: {
        description: 'What part of the site this template controls.',
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
      name: 'puckLayout',
      type: 'json',
      admin: {
        components: {
          Field: '@/components/builder/VisualEditorLink',
        },
      },
    },
  ],
}

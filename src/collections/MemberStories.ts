import type { CollectionConfig } from 'payload'

export const MemberStories: CollectionConfig = {
  slug: 'member-stories',
  admin: {
    useAsTitle: 'memberName',
    defaultColumns: ['memberName', 'chapterRole', 'yearJoined'],
  },
  fields: [
    {
      name: 'memberName',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'yearJoined',
      type: 'number',
      required: true,
    },
    {
      name: 'chapterRole',
      type: 'text',
      localized: true,
    },
    {
      name: 'profession',
      type: 'text',
      localized: true,
    },
    {
      name: 'storyTitle',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      localized: true,
    },
    {
      name: 'fullStory',
      type: 'richText',
      localized: true,
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'relatedProjects',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
    },
    {
      name: 'relatedEvents',
      type: 'relationship',
      relationTo: 'events',
      hasMany: true,
    },
  ],
}

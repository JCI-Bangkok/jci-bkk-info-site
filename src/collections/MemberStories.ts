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
    },
    {
      name: 'yearJoined',
      type: 'number',
      required: true,
    },
    {
      name: 'chapterRole',
      type: 'text',
    },
    {
      name: 'profession',
      type: 'text',
    },
    {
      name: 'storyTitle',
      type: 'text',
      required: true,
    },
    {
      name: 'quote',
      type: 'textarea',
      required: true,
    },
    {
      name: 'fullStory',
      type: 'richText',
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

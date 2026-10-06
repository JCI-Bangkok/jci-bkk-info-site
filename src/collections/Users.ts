import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['editor'],
      required: true,
      options: [
        { label: 'Super Admin', value: 'super-admin' },
        { label: 'President', value: 'president' },
        { label: 'Secretary', value: 'secretary' },
        { label: 'Marketing', value: 'marketing' },
        { label: 'Event Manager', value: 'event-manager' },
        { label: 'Content Editor', value: 'editor' },
        { label: 'Viewer', value: 'viewer' },
      ],
    },
  ],
}

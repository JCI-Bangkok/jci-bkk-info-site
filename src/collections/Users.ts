import type { Access, CollectionConfig } from 'payload'

const manageUsers: Access = ({ req }) => req.user?.roles?.includes('super-admin') ? true : req.user ? { id: { equals: req.user.id } } : false
const adminOnly: Access = ({ req }) => Boolean(req.user?.roles?.includes('super-admin'))

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  hooks: { beforeChange: [async ({ operation, data, req }) => {
    // Payload's first-user registration bypasses normal access control.
    if (operation === 'create' && (await req.payload.count({ collection: 'users', overrideAccess: true, req })).totalDocs === 0) data.roles = ['super-admin']
    return data
  }] },
  access: { read: manageUsers, update: manageUsers, create: adminOnly, delete: adminOnly },
  fields: [
    {
      name: 'roles',
      access: { create: ({ req }) => Boolean(req.user?.roles?.includes('super-admin')), update: ({ req }) => Boolean(req.user?.roles?.includes('super-admin')) },
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

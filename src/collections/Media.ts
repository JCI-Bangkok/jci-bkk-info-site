import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'alt', 'filesize', 'updatedAt'],
    listSearchableFields: ['alt', 'filename'],
    group: 'Assets',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  upload: {
    staticDir: 'public/media',
    adminThumbnail: ({ doc }) => {
      return (
        (doc?.sizes as Record<string, { url?: string }> | undefined)?.thumbnail?.url ||
        (doc?.url as string) ||
        (doc?.thumbnailURL as string) ||
        null
      )
    },
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1920,
        height: 1080,
        position: 'centre',
      },
    ],
    mimeTypes: ['image/*'],
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-generate alt from filename if missing
        if (!data.alt && data.filename) {
          // Remove extension and replace dashes/underscores with spaces
          let name = data.filename.split('.').slice(0, -1).join(' ');
          name = name.replace(/[-_]/g, ' ');
          data.alt = name;
        }
        return data;
      }
    ]
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: false,
      admin: {
        description: 'Auto-generated from filename if left blank.',
      }
    },
  ],
}

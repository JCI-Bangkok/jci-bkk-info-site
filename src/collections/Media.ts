import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['alt', 'filename', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  upload: {
    staticDir: 'public/media',
    adminThumbnail: 'thumbnail',
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
      ({ data, req }) => {
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

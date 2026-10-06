import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Events } from './collections/Events'
import { Projects } from './collections/Projects'
import { Articles } from './collections/Articles'
import { BoardMembers } from './collections/BoardMembers'
import { Members } from './collections/Members'
import { MemberStories } from './collections/MemberStories'
import { Partners } from './collections/Partners'
import { Forms } from './collections/Forms'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const plugins = []

// Configure S3 plugin if environment variables are present (Vercel deployment)
if (process.env.S3_BUCKET) {
  plugins.push(
    s3Storage({
      collections: {
        media: {
          disablePayloadAccessControl: true,
        },
      },
      bucket: process.env.S3_BUCKET,
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        region: process.env.S3_REGION || 'ap-southeast-1',
        endpoint: process.env.S3_ENDPOINT,
        forcePathStyle: true,
      },
    })
  )
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Pages,
    Events,
    Projects,
    Articles,
    BoardMembers,
    Members,
    MemberStories,
    Partners,
    Forms,
  ],
  globals: [
    SiteSettings,
  ],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || 'fallback-secret-for-dev-only',
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  localization: {
    locales: [
      { label: 'English (US)', code: 'en' },
      { label: 'Thai', code: 'th' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  plugins,
  sharp,
})

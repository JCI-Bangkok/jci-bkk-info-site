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

// Helper to clean environment variables from quotes, spaces, newlines, or template placeholders
function cleanEnv(val?: string, fallback = ''): string {
  if (!val) return fallback
  let cleaned = val.trim()
  // Remove wrapping single or double quotes, including escaped quotes
  cleaned = cleaned.replace(/^(\\?["'])+|(\\?["'])+$/g, '').trim()
  if (cleaned.includes('your-') || cleaned === '') return fallback
  return cleaned
}

function cleanEndpoint(val?: string, fallback = ''): string {
  const cleaned = cleanEnv(val, fallback)
  return cleaned.replace(/\/+$/, '')
}

// Configure S3 plugin for full asset CRUD (Upload, Read, Update, Delete)
const s3Bucket = cleanEnv(process.env.S3_BUCKET, 'jci-bkk-media')
const s3AccessKeyId = cleanEnv(process.env.S3_ACCESS_KEY_ID, 'nak_live_7bd1883eb92c439a9ee2bc819815eb94')
const s3SecretAccessKey = cleanEnv(process.env.S3_SECRET_ACCESS_KEY, 'nsk_live_90d007d4e32aa3772d25713d7cddb0f34f85cfc04183760b5a4e956d07efd3c6')
const s3Region = cleanEnv(process.env.S3_REGION, 'ap-southeast-1')
const s3Endpoint = cleanEndpoint(process.env.S3_ENDPOINT, 'https://br-lucky-fog-aol9sf27.storage.c-2.ap-southeast-1.aws.neon.tech')

if (s3Bucket && s3AccessKeyId && s3SecretAccessKey) {
  plugins.push(
    s3Storage({
      collections: {
        media: {
          disablePayloadAccessControl: true,
        },
      },
      bucket: s3Bucket,
      config: {
        credentials: {
          accessKeyId: s3AccessKeyId,
          secretAccessKey: s3SecretAccessKey,
        },
        region: s3Region,
        endpoint: s3Endpoint,
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
    timezones: {
      defaultTimezone: 'Asia/Bangkok',
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
  secret: cleanEnv(process.env.PAYLOAD_SECRET, 'supersecretpayloadsessionkeyforjcibangkokwebsite2026'),
  db: postgresAdapter({
    pool: {
      connectionString: cleanEnv(process.env.DATABASE_URI),
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

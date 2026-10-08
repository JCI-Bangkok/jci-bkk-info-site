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
import { Templates } from "./collections/Templates"
import { SiteSettings } from './globals/SiteSettings'
import { Navigation } from './globals/Navigation'
import { BuilderSettings } from './globals/BuilderSettings'
import { BuilderPresets } from './collections/BuilderPresets'

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

function requiredPayloadSecret(): string {
  const secret = cleanEnv(process.env.PAYLOAD_SECRET)
  if (!secret) throw new Error('Set PAYLOAD_SECRET in the server environment before starting the CMS.')
  return secret
}

// Configure S3 plugin for full asset CRUD (Upload, Read, Update, Delete)
const s3Bucket = cleanEnv(process.env.S3_BUCKET, 'jci-bkk-media')
const s3AccessKeyId = cleanEnv(process.env.S3_ACCESS_KEY_ID)
const s3SecretAccessKey = cleanEnv(process.env.S3_SECRET_ACCESS_KEY)
const s3Region = cleanEnv(process.env.S3_REGION, 'ap-southeast-1')
const s3Endpoint = cleanEndpoint(process.env.S3_ENDPOINT, 'https://br-lucky-fog-aol9sf27.storage.c-2.ap-southeast-1.aws.neon.tech')

if (process.env.S3_ENABLED !== 'false' && s3Bucket && s3AccessKeyId && s3SecretAccessKey) {
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
    Templates,
    BuilderPresets,
  ],
  globals: [
    SiteSettings,
    Navigation,
    BuilderSettings,
  ],
  editor: lexicalEditor({}),
  secret: requiredPayloadSecret(),
  db: postgresAdapter({
    push: false,
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

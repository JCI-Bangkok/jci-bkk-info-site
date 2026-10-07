// Creates fixtures only in an explicitly selected localhost test database.
import assert from 'node:assert/strict'
import { copyFile } from 'node:fs/promises'
import { Pool } from 'pg'
import { PgDialect } from 'drizzle-orm/pg-core'
import { getPayload } from 'payload'
import type { MigrateUpArgs } from '@payloadcms/db-postgres'
import config from '../src/payload.config'
import { up as baseline } from '../src/migrations/20261007_072713_cms_baseline'
import { up as upgrade } from '../src/migrations/20261007_073412_cms_seo_editor'

async function main() {
const uri = new URL(process.env.DATABASE_URI || '')
assert.ok(['localhost', '127.0.0.1'].includes(uri.hostname) && uri.pathname.endsWith('_test') && process.env.S3_ENABLED === 'false', 'Requires an isolated localhost *_test database and S3_ENABLED=false')
const pool = new Pool({ connectionString: uri.toString() })
const dialect = new PgDialect()
await pool.query('DROP DATABASE IF EXISTS jci_cms_legacy_test WITH (FORCE)')
await pool.query('CREATE DATABASE jci_cms_legacy_test')
const legacyUri = new URL(uri)
legacyUri.pathname = '/jci_cms_legacy_test'
const legacy = new Pool({ connectionString: legacyUri.toString() })
const db = { execute: async (statement: Parameters<PgDialect['sqlToQuery']>[0]) => { const query = dialect.sqlToQuery(statement); return legacy.query(query.sql, query.params) } }
const args = { db } as unknown as MigrateUpArgs
await baseline(args)
// Empty nullable relations suffice to prove migration preserves existing rows and localized SEO columns.
await legacy.query(`INSERT INTO users(email) VALUES('legacy@example.test'); INSERT INTO media(url, filename, mime_type) VALUES('/images/home/hero-cover.jpg', 'legacy-fixture.jpg', 'image/jpeg');`)
await legacy.query(`INSERT INTO projects(slug, year, category) VALUES('legacy-project', 2026, 'community'); INSERT INTO articles(slug, author_id, category, cover_image_id, publish_date) VALUES('legacy-article', 1, 'news', 1, NOW());`)
await legacy.query(`INSERT INTO articles_locales(title, summary, body, seo_title, seo_description, _locale, _parent_id) VALUES('Legacy article', 'Legacy summary', '{"root":{"children":[]}}', 'Preserved SEO title', 'Preserved SEO description', 'en', 1);`)
await baseline(args) // Existing schema adoption must not recreate or truncate tables.
await upgrade(args)
const preserved = await legacy.query('SELECT a.status, l.seo_title, l.seo_description FROM articles a JOIN articles_locales l ON a.id = l._parent_id')
assert.equal(preserved.rows[0].status, 'published')
assert.equal(preserved.rows[0].seo_title, 'Preserved SEO title')
assert.equal(preserved.rows[0].seo_description, 'Preserved SEO description')
assert.equal((await legacy.query('SELECT status FROM projects')).rows[0].status, 'published')
assert.equal((await legacy.query('SELECT count(*)::int AS count FROM pages')).rows[0].count, 7)
await legacy.end()
await pool.end()

await copyFile('public/images/home/hero-cover.jpg', 'public/media/cms-local-fixture.jpg')
const payload = await getPayload({ config })
const editor = (await payload.find({ collection: 'users', where: { email: { equals: 'cms-editor@example.test' } } })).docs[0] || await payload.create({ collection: 'users', data: { email: 'cms-editor@example.test', password: 'cms-editor-local-test-only', roles: ['super-admin'] } })
const viewer = (await payload.find({ collection: 'users', where: { email: { equals: 'cms-viewer@example.test' } } })).docs[0] || await payload.create({ collection: 'users', data: { email: 'cms-viewer@example.test', password: 'cms-viewer-local-test-only', roles: ['viewer'] } })
// A media fixture uses an existing local image; no uploads or remote storage writes occur.
const fixturePool = new Pool({ connectionString: uri.toString() })
const media = (await fixturePool.query(`INSERT INTO media(url, filename, mime_type, width, height, alt) VALUES('/images/home/hero-cover.jpg', 'cms-local-fixture.jpg', 'image/jpeg', 1600, 900, 'JCI Bangkok test image') ON CONFLICT(filename) DO UPDATE SET alt=EXCLUDED.alt RETURNING id`)).rows[0]

await fixturePool.end()
const body = { root: { type: 'root', version: 1, format: '', indent: 0, direction: 'ltr', children: [{ type: 'paragraph', version: 1, format: '', indent: 0, direction: 'ltr', children: [{ type: 'text', version: 1, text: 'Test fixture content for the isolated CMS database.', format: 0, mode: 'normal', style: '', detail: 0 }] }] } }
const article = await payload.create({ collection: 'articles', locale: 'en', data: { title: 'CMS test article', slug: 'cms-test-article', summary: 'A published article fixture with SEO controls and a social image.', author: editor.id, category: 'news', coverImage: media.id, publishDate: '2026-01-01T00:00:00Z', status: 'published', body, seo: { title: 'CMS test article' } } })
assert.ok(editor.roles.includes('super-admin'))
const original = await payload.findVersions({ collection: 'articles', where: { parent: { equals: article.id } } })
await payload.update({ collection: 'articles', id: article.id, data: { seo: { title: 'Revised test article' } } })
assert.ok((await payload.findVersions({ collection: 'articles', where: { parent: { equals: article.id } } })).totalDocs > original.totalDocs)
await payload.restoreVersion({ collection: 'articles', id: original.docs[0].id })
assert.equal((await payload.findByID({ collection: 'articles', id: article.id })).seo?.title, 'CMS test article')
const draft = await payload.create({ collection: 'articles', data: { title: 'Private draft', slug: 'private-draft', summary: 'Not public', author: editor.id, category: 'news', coverImage: media.id, publishDate: '2026-01-01T00:00:00Z', status: 'draft', body } })
assert.equal((await payload.find({ collection: 'articles', overrideAccess: false, where: { id: { equals: draft.id } } })).totalDocs, 0)
await assert.rejects(payload.update({ collection: 'articles', id: article.id, overrideAccess: false, user: viewer, data: { title: 'Forbidden edit' } }))
const project = await payload.create({ collection: 'projects', data: { title: 'CMS test project', slug: 'cms-test-project', year: 2026, category: 'community', status: 'published', problemStatement: 'A local project fixture for SEO testing.', targetBeneficiaries: 'Test participants', activities: body, outcomes: body } })
await payload.create({ collection: 'events', data: { title: 'CMS test event', slug: 'cms-test-event', eventDate: '2026-12-01T12:00:00Z', venue: 'Test venue', eventType: 'training', status: 'upcoming', shortDescription: 'A leadership event fixture for SEO testing.', coverImage: media.id } })
const page = await payload.create({ collection: 'pages', data: { title: 'CMS custom page', slug: 'cms-custom-page', status: 'published', content: body, seo: { description: 'A custom CMS page fixture.' } } })
assert.ok(project.id && page.id)
console.log('CMS tests passed: fresh migrations, legacy content/SEO preservation, seeded page controls, revision restore, private drafts and viewer write restrictions.')
await payload.destroy()
process.exit(0)

}
main().catch(error => { console.error(error); process.exit(1) })

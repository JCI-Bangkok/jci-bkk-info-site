import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { absoluteUrl, locales } from '@/lib/seo'
import { publicEvents, publishedArticles } from '@/lib/public-content'

// Query current published records on each request, including newly published articles.
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config })
  const [events, projects, articles, board] = await Promise.all([
    payload.find({ collection: 'events', where: publicEvents, pagination: false, depth: 0 }),
    payload.find({ collection: 'projects', pagination: false, depth: 0 }),
    payload.find({ collection: 'articles', where: publishedArticles(), pagination: false, depth: 0 }),
    payload.find({ collection: 'board-members', pagination: false, depth: 0 }),
  ])
  const paths: { path: string; updatedAt?: string }[] = [
    ...['', '/about', '/events', '/members', '/membership', '/contact', '/photobomb'].map(path => ({ path })),
    ...events.docs.map(doc => ({ path: `/events/${encodeURIComponent(doc.slug)}`, updatedAt: doc.updatedAt })),
    ...projects.docs.map(doc => ({ path: `/events/projects/${encodeURIComponent(doc.slug)}`, updatedAt: doc.updatedAt })),
    ...articles.docs.map(doc => ({ path: `/events/updates/${encodeURIComponent(doc.slug)}`, updatedAt: doc.updatedAt })),
    ...[...new Set(board.docs.map(doc => doc.year))].map(year => ({ path: `/members/board/${year}` })),
  ]
  return paths.flatMap(({ path, updatedAt }) => locales.map(locale => ({
    url: absoluteUrl(`/${locale}${path}`),
    ...(updatedAt ? { lastModified: updatedAt } : {}),
  })))
}

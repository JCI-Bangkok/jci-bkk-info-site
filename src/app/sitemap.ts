import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { absoluteUrl, locales } from '@/lib/seo'
import { publicEvents, publishedArticles, publishedProjects } from '@/lib/public-content'
import { contentPath, isSitemapEligible, staticPageKeys, validatePageSlug } from '@/lib/seo-model'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config })
  const entries = await Promise.all(locales.map(async locale => {
    const [events, projects, articles, pages, board] = await Promise.all([
      payload.find({ collection: 'events', locale, where: publicEvents, pagination: false, depth: 0 }),
      payload.find({ collection: 'projects', locale, where: publishedProjects, pagination: false, depth: 0 }),
      payload.find({ collection: 'articles', locale, where: publishedArticles(), pagination: false, depth: 0 }),
      payload.find({ collection: 'pages', locale, where: { status: { equals: 'published' } }, pagination: false, depth: 0 }),
      payload.find({ collection: 'board-members', locale, pagination: false, depth: 0 }),
    ])
    const paths = new Map<string, string | undefined>()
    for (const page of staticPageKeys) paths.set(contentPath('pages', page), undefined)
    for (const year of new Set(board.docs.map(doc => doc.year))) paths.set(`/members/board/${year}`, undefined)
    for (const [collection, docs] of [['events', events.docs], ['projects', projects.docs], ['articles', articles.docs], ['pages', pages.docs]] as const) {
      for (const doc of docs) {
        if (collection === 'pages' && validatePageSlug(doc.slug) !== true) continue
        if (collection === 'pages' && /^members\/board\/\d{4}$/.test(doc.slug) && !board.docs.some(member => String(member.year) === doc.slug.split('/')[2])) continue
        const path = contentPath(collection, doc.slug)
        if (isSitemapEligible(doc.seo)) paths.set(path, doc.updatedAt)
        else paths.delete(path)
      }
    }
    return [...paths].map(([path, lastModified]) => ({ url: absoluteUrl(`/${locale}${path}`), ...(lastModified ? { lastModified } : {}) }))
  }))
  return entries.flat()
}

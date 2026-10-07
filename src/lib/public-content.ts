import { cache } from 'react'
import { getPayload, type Where } from 'payload'
import config from '@/payload.config'
import { validLocale } from './seo'

export const publicEvents: Where = { status: { in: ['upcoming', 'completed', 'cancelled'] } }
export const publishedProjects: Where = { status: { equals: 'published' } }
export function publishedArticles(): Where { return { and: [{ status: { equals: 'published' } }, { publishDate: { less_than_equal: new Date().toISOString() } }] } }

// Share the lookup between page rendering and metadata within a request.
export const getPublicContent = cache(async (collection: 'events' | 'articles' | 'projects', locale: string, slug: string) => {
  const payload = await getPayload({ config })
  const visibility = collection === 'events' ? publicEvents : collection === 'articles' ? publishedArticles() : publishedProjects
  const result = await payload.find({ collection, locale: validLocale(locale), depth: 1, limit: 1,
    where: { and: [{ slug: { equals: slug } }, ...(visibility ? [visibility] : [])] },
  })
  return result.docs[0]
})

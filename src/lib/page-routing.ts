import { cache } from 'react'
import { getPayload, type Where } from 'payload'
import configPromise from '@/payload.config'
import { validLocale } from './seo'
import { permanentRedirect } from 'next/navigation'

export const managedPageTypes = ['home', 'about', 'events', 'members', 'membership', 'contact', 'photobomb', 'news', 'projects', 'board', 'custom'] as const
export type ManagedPageType = typeof managedPageTypes[number]
export type BuiltinPageType = Exclude<ManagedPageType, 'custom'>

export const legacyPagePaths: Record<BuiltinPageType, string> = {
  home: '', about: 'about', events: 'events', members: 'members', membership: 'membership',
  contact: 'contact', photobomb: 'photobomb', news: 'news', projects: 'projects', board: 'about/board',
}

export function localizedPagePath(locale: string, slug: string) {
  return `/${validLocale(locale)}${slug ? `/${slug}` : ''}`
}

export const getManagedPageByType = cache(async (locale: string, pageType: BuiltinPageType) => {
  const payload = await getPayload({ config: configPromise })
  const publishedFilter: Where = { or: [{ _status: { equals: 'published' } }, { status: { equals: 'published' } }] } as Where
  const result = await payload.find({
    collection: 'pages', locale: validLocale(locale), depth: 1, limit: 1,
    where: { and: [{ pageType: { equals: pageType } }, publishedFilter] },
  })
  // Backward compatibility before the migration/seed has run.
  if (result.docs[0]) return result.docs[0]
  const legacy = legacyPagePaths[pageType] || 'home'
  const fallback = await payload.find({
    collection: 'pages', locale: validLocale(locale), depth: 1, limit: 1,
    where: { and: [{ slug: { equals: legacy || 'home' } }, publishedFilter] },
  })
  return fallback.docs[0]
})

export const resolveManagedPage = cache(async (locale: string, slug: string) => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'pages', locale: validLocale(locale), depth: 1, pagination: false,
    where: { or: [{ _status: { equals: 'published' } }, { status: { equals: 'published' } }] } as Where,
  })
  const current = result.docs.find(page => page.slug === slug)
  if (current) return { page: current, redirect: false }
  const previous = result.docs.find(page => Array.isArray((page as any).legacySlugs) && (page as any).legacySlugs.includes(slug))
  return previous ? { page: previous, redirect: true } : null
})

export async function enforceManagedPagePath(locale: string, pageType: BuiltinPageType, skip = false) {
  const page = await getManagedPageByType(locale, pageType)
  if (!skip && page?.slug && page.slug !== (legacyPagePaths[pageType] || 'home')) {
    permanentRedirect(localizedPagePath(locale, page.slug === 'home' ? '' : page.slug))
  }
  return page
}

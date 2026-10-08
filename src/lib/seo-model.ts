import { seoCopy } from './seo-copy'

export type SeoOverrides = {
  title?: string | null
  description?: string | null
  focusKeyphrase?: string | null
  image?: unknown
  imageAlt?: string | null
  socialTitle?: string | null
  socialDescription?: string | null
  canonicalUrl?: string | null
  noIndex?: boolean | null
  noFollow?: boolean | null
  excludeFromSitemap?: boolean | null
}
export type SeoSource = {
  seo?: SeoOverrides | null
  title?: string | null
  summary?: string | null
  shortDescription?: string | null
  problemStatement?: string | null
  slug?: string | null
  seoTitle?: string | null
  seoDescription?: string | null
  coverImage?: unknown
  gallery?: { image?: unknown }[] | null
  status?: string | null
}
export const defaultOrigin = 'https://www.jcibangkok.org'
export const defaultImage = '/images/home/hero-cover.jpg'
export const staticPageKeys = ['home', 'about', 'events', 'members', 'membership', 'contact', 'photobomb'] as const
export type StaticPageKey = typeof staticPageKeys[number]
export function contentPath(collection: string, slug: string) {
  const encoded = slug.split('/').map(encodeURIComponent).join('/')
  if (collection === 'articles') return `/events/updates/${encoded}`
  if (collection === 'projects') return `/events/projects/${encoded}`
  if (collection === 'events') return `/events/${encoded}`
  return slug === 'home' || !slug ? '' : `/${encoded}`
}
export function brandedTitle(title: string) {
  return /\|\s*JCI Bangkok\s*$/i.test(title) ? title : `${title} | JCI Bangkok`
}
export function staticSeoFallback(locale: string, slug: string) {
  const key = staticPageKeys.find(key => key === slug)
  const language = locale === 'th' ? 'th' : 'en'
  const year = slug.match(/^members\/board\/(\d{4})$/)?.[1]
  if (year) return { title: language === 'th' ? `คณะกรรมการบริหารปี ${year}` : `Board of Directors ${year}`, description: language === 'th' ? `รู้จักคณะกรรมการบริหาร JCI Bangkok ประจำปี ${year} และทีมงานผู้ขับเคลื่อนกิจกรรมพัฒนาผู้นำและโครงการเพื่อสังคม` : `Meet the JCI Bangkok board of directors for ${year}, the team supporting our chapter leadership programs, events and community projects.` }
  return key ? { title: seoCopy[language][key][0], description: seoCopy[language][key][1] } : undefined
}
export function resolveSeo(source: SeoSource, fallback: { title: string; description: string; image?: unknown }) {
  const seo = source.seo || {}
  const title = seo.title?.trim() || source.seoTitle?.trim() || fallback.title
  const description = seo.description?.trim() || source.seoDescription?.trim() || fallback.description
  return {
    title: brandedTitle(title), description,
    socialTitle: seo.socialTitle?.trim() || brandedTitle(title),
    socialDescription: seo.socialDescription?.trim() || description,
    image: seo.image || fallback.image || defaultImage,
    imageAlt: seo.imageAlt?.trim() || title,
    canonicalUrl: seo.canonicalUrl?.trim() || undefined,
    noIndex: Boolean(seo.noIndex), noFollow: Boolean(seo.noFollow),
    excludeFromSitemap: Boolean(seo.excludeFromSitemap || seo.noIndex || seo.canonicalUrl),
  }
}
export function validateCanonical(value: unknown): true | string {
  if (!value) return true
  try {
    const url = new URL(String(value))
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.hash) throw new Error('Invalid URL')
    return true
  } catch { return 'Enter a complete HTTP(S) URL without credentials or a fragment, or leave this empty.' }
}

export function validateContentSlug(value: unknown): true | string {
  return typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/.test(value)
    ? true : 'Use lowercase words separated by hyphens, with optional slash-separated page paths. Do not include a domain, language prefix, query or fragment.'
}
export function isSitemapEligible(seo?: SeoOverrides | null) {
  return !seo?.noIndex && !seo?.excludeFromSitemap && !seo?.canonicalUrl
}

export function validateSingleSlug(value: unknown): true | string {
  return typeof value === 'string' && !value.includes('/') ? validateContentSlug(value) : 'Use a single lowercase URL slug with hyphens, without slashes.'
}
export function validatePageSlug(value: unknown): true | string {
  const valid = validateContentSlug(value)
  if (valid !== true) return valid
  const slug = String(value)
  if (staticPageKeys.some(key => key === slug) || /^members\/board\/\d{4}$/.test(slug)) return true
  return ['en', 'th', 'admin', 'api', 'news', 'projects', 'about', 'events', 'members', 'membership', 'contact', 'photobomb', 'home'].includes(slug.split('/')[0]) ? 'This path is reserved for an existing site route. Use its supported page key or choose a different path.' : true
}

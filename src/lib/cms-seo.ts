import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { mediaUrl } from './media'
import { pageMetadata, staticMetadata, validLocale } from './seo'
import { resolveSeo, type SeoSource, type StaticPageKey } from './seo-model'
import { getManagedPageByType } from './page-routing'

export const getSiteSeo = cache(async (locale: string) => {
  const payload = await getPayload({ config })
  return payload.findGlobal({ slug: 'site-settings', locale: validLocale(locale), depth: 1 })
})
export const getCmsPage = cache(async (locale: string, slug: string) => {
  const payload = await getPayload({ config })
  const result = await payload.find({ collection: 'pages', locale: validLocale(locale), depth: 1, limit: 1,
    where: { and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }] },
  })
  return result.docs[0]
})
export async function contentMetadata(locale: string, path: string, source: SeoSource, fallback: { title: string; description: string; image?: string }, article?: { publishedTime: string; modifiedTime?: string }) {
  const settings = await getSiteSeo(locale)
  const resolved = resolveSeo(source, { ...fallback, image: fallback.image || mediaUrl(settings.defaultSocialImage) })
  const image = typeof resolved.image === 'string' ? resolved.image : mediaUrl(resolved.image)
  return pageMetadata(locale, path, resolved.title, resolved.description, image, article, { ...source.seo, imageAlt: resolved.imageAlt, socialTitle: resolved.socialTitle, socialDescription: resolved.socialDescription })
}
export async function cmsStaticMetadata(locale: string, page: StaticPageKey) {
  const fallback = staticMetadata(locale, page)
  const source = await getManagedPageByType(locale, page)
  const path = source?.slug === 'home' ? '' : `/${source?.slug || page}`
  return contentMetadata(locale, path, source || {}, { title: (fallback.title as { absolute: string }).absolute, description: fallback.description || '' })
}

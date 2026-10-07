import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { Locale } from './i18n'
import { seoCopy as copy } from './seo-copy'
import { resolveSeo, type SeoOverrides } from './seo-model'

export const locales = ['en', 'th'] as const
export function validLocale(locale: string): Locale {
  if (locale !== 'en' && locale !== 'th') notFound()
  return locale
}

// Use the canonical production origin even on preview deployments.
export function siteOrigin() {
  const url = new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.jcibangkok.org')
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('NEXT_PUBLIC_SERVER_URL must be an HTTP(S) URL')
  return url.origin
}
export function absoluteUrl(path: string) { return new URL(path, siteOrigin()).toString() }
export function localizedPath(locale: string, path = '') { return `/${locale}${path}` }

export function pageMetadata(locale: string, path: string, title: string, description: string, image = '/images/home/hero-cover.jpg', article?: { publishedTime: string; modifiedTime?: string }, overrides: SeoOverrides = {}): Metadata {
  validLocale(locale)
  const url = overrides.canonicalUrl || absoluteUrl(localizedPath(locale, path))
  const resolved = resolveSeo({ seo: overrides }, { title, description, image })
  const fullTitle = resolved.title
  return {
    title: { absolute: fullTitle }, description,
    alternates: {
      canonical: url,
      ...(overrides.canonicalUrl ? {} : { languages: { en: absoluteUrl(localizedPath('en', path)), th: absoluteUrl(localizedPath('th', path)), 'x-default': absoluteUrl(localizedPath('en', path)) } }),
    },
    robots: { index: !resolved.noIndex, follow: !resolved.noFollow, googleBot: { index: !resolved.noIndex, follow: !resolved.noFollow, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
    openGraph: {
      title: resolved.socialTitle, description: resolved.socialDescription, url, siteName: 'JCI Bangkok',
      locale: locale === 'th' ? 'th_TH' : 'en_US', alternateLocale: [locale === 'th' ? 'en_US' : 'th_TH'],
      images: [{ url: absoluteUrl(image), alt: resolved.imageAlt }],
      ...(article ? { type: 'article', ...article } : { type: 'website' }),
    },
    twitter: { card: 'summary_large_image', title: resolved.socialTitle, description: resolved.socialDescription, images: [absoluteUrl(image)] },
  }
}


export function staticMetadata(locale: string, page: keyof typeof copy.en) {
  const language = validLocale(locale)
  const [title, description] = copy[language][page]
  return pageMetadata(language, page === 'home' ? '' : `/${page}`, title, description)
}

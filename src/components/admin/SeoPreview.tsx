'use client'
/* eslint-disable @next/next/no-img-element -- CMS previews show the selected asset directly without fetching its optimized rendition. */

import { useEffect, useState } from 'react'
import { useAllFormFields, useDocumentInfo, useForm, useLocale } from '@payloadcms/ui'
import { contentPath, defaultOrigin, resolveSeo, staticSeoFallback, type SeoSource } from '@/lib/seo-model'
import './seo-preview.css'

export function SeoPreview() {
  useAllFormFields() // Subscribe to unsaved changes, including locale switches.
  const { getData } = useForm()
  const { collectionSlug } = useDocumentInfo()
  const { code: locale } = useLocale()
  const source = getData() as SeoSource
  const fallback = (collectionSlug === 'pages' ? staticSeoFallback(locale, source.slug || '') : undefined) || {
    title: source.title || 'Untitled page',
    description: source.shortDescription || source.problemStatement || source.summary || (collectionSlug === 'pages' ? `${source.title || 'Untitled page'} — JCI Bangkok` : ''),
  }
  const [siteImage, setSiteImage] = useState<unknown>()
  useEffect(() => {
    const controller = new AbortController()
    fetch(`/api/globals/site-settings?locale=${encodeURIComponent(locale)}&depth=1`, { credentials: 'same-origin', signal: controller.signal })
      .then(response => response.ok ? response.json() : undefined)
      .then(settings => { if (!controller.signal.aborted) setSiteImage(settings?.defaultSocialImage) })
      .catch(() => {})
    return () => controller.abort()
  }, [locale])
  const resolved = resolveSeo(source, { ...fallback, image: source.coverImage || source.gallery?.[0]?.image || siteImage })
  const origin = process.env.NEXT_PUBLIC_SERVER_URL || defaultOrigin
  const path = contentPath(collectionSlug || 'pages', source.slug || '')
  const url = resolved.canonicalUrl || `${origin.replace(/\/$/, '')}/${locale}${path}`
  const selectedImage = resolved.image
  const imageId = typeof selectedImage === 'number' || (typeof selectedImage === 'string' && !/^(https?:\/\/|\/)/.test(selectedImage)) ? String(selectedImage) : undefined
  const [loaded, setLoaded] = useState<{ id: string; image: { url?: string; width?: number; height?: number } }>()
  useEffect(() => {
    const controller = new AbortController()
    if (imageId) fetch(`/api/media/${encodeURIComponent(imageId)}?depth=0`, { signal: controller.signal, credentials: 'same-origin' })
      .then(response => response.ok ? response.json() : undefined)
      .then(data => { if (!controller.signal.aborted && data) setLoaded({ id: imageId, image: data }) })
      .catch(() => { /* Field upload control displays its own retrieval errors. */ })
    return () => controller.abort()
  }, [imageId])
  const image = typeof selectedImage === 'string' && !imageId ? { url: selectedImage } : selectedImage && typeof selectedImage === 'object' ? selectedImage as { url?: string; width?: number; height?: number } : loaded?.id === imageId ? loaded?.image : undefined
  const [failedImageUrl, setFailedImageUrl] = useState<string>()
  const issues: string[] = []
  if (image?.url && failedImageUrl === image.url) issues.push('The selected image could not be loaded. Check the media file before publishing.')
  if (!source.slug) issues.push('Save a stable URL slug before publishing.')
  if (!resolved.description) issues.push('Add a description or a content summary.')
  if (resolved.title.length > 65) issues.push('The search title is long and may be shortened in results.')
  if (resolved.description.length > 170) issues.push('The search description is long and may be shortened in results.')
  if (resolved.description && resolved.description.length < 70) issues.push('The description is brief. Consider a more specific summary.')
  if (source.seo?.focusKeyphrase && !`${resolved.title} ${resolved.description}`.toLocaleLowerCase().includes(source.seo.focusKeyphrase.toLocaleLowerCase())) issues.push('The editorial focus phrase does not appear in the search title or description. Use it only if it reads naturally.')
  if (image?.width && image.width < 1200) issues.push('The selected image is below the recommended 1200 pixel width.')
  if (resolved.noIndex) issues.push('This page is marked noindex and will be omitted from the sitemap.')
  if (resolved.canonicalUrl) issues.push('A canonical override is active; this page will be omitted from the sitemap.')
  if (source.status === 'draft') issues.push('This record is a draft. Publish it before its content or SEO changes can affect the public website.')
  let domain = 'JCI Bangkok'
  try { domain = new URL(url).hostname } catch { /* URL field validation supplies the actionable error. */ }
  return <section className="jci-seo" aria-label="SEO and social previews">
    <header className="jci-seo__heading"><div><h3>Preview your first impression</h3><p>Updates as you edit. Unsaved changes are shown here.</p></div><span className="jci-seo__locale">{locale === 'th' ? 'Thai · ไทย' : 'English · EN'}</span></header>
    <div className="jci-seo__grid">
      <div><p className="jci-seo__label">Search result</p><div className="jci-seo__search"><strong>JCI Bangkok</strong><div className="jci-seo__url">{url}</div><p className="jci-seo__search-title">{resolved.title}</p><p className="jci-seo__description">{resolved.description || 'Your page description will appear here.'}</p></div><div className="jci-seo__counts"><span>Title: {resolved.title.length} characters</span><span>Description: {resolved.description.length} characters</span></div></div>
      <div><p className="jci-seo__label">Open Graph · Facebook / LinkedIn / X</p><div className="jci-seo__social"><div className="jci-seo__image">{image?.url && failedImageUrl !== image.url ? <img src={image.url} alt={resolved.imageAlt} onError={() => setFailedImageUrl(image.url)} /> : <span>Select a social image to preview it</span>}</div><div className="jci-seo__social-copy"><div className="jci-seo__url">{domain}</div><h4>{resolved.socialTitle}</h4><p className="jci-seo__description">{resolved.socialDescription}</p></div></div></div>
    </div>
    <div className="jci-seo__checks"><strong>Publishing guidance</strong>{issues.length ? <ul>{issues.map(issue => <li key={issue} className="jci-seo__warning">{issue}</li>)}</ul> : <p>Title, description and URL are present.</p>}<p className="jci-seo__note">These are approximate previews, not a ranking score. Search engines and social platforms may rewrite text, crop images, or cache an earlier version. Indexing controls apply to both languages.</p></div>
  </section>
}

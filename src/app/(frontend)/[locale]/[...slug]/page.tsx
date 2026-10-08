import { notFound } from 'next/navigation'
import { contentMetadata } from '@/lib/cms-seo'
import { validLocale, absoluteUrl } from '@/lib/seo'
import { PageIntro } from '@/components/page-intro'
import { RichText } from '@/components/rich-text'
import { StructuredData } from '@/components/structured-data'
import { PuckRenderer } from "@/components/builder/PuckRenderer";
import type { Data } from "@puckeditor/core"
import { permanentRedirect } from 'next/navigation'
import { localizedPagePath, resolveManagedPage } from '@/lib/page-routing'


type Props = { params: Promise<{ locale: string; slug: string[] }> }
export const revalidate = 300
export async function generateStaticParams() {
  // Static built-in pages win over this route; extra CMS pages render on demand.
  return []
}
export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params
  const resolved = await resolveManagedPage(locale, slug.join('/'))
  if (!resolved) notFound()
  const doc = resolved.page
  return contentMetadata(locale, `/${doc.slug.split('/').map(encodeURIComponent).join('/')}`, doc as any, { title: doc.title, description: doc.seo?.description || `${doc.title} — JCI Bangkok` })
}
export default async function CmsPage({ params }: Props) {
  const { locale, slug } = await params
  validLocale(locale)
  const resolved = await resolveManagedPage(locale, slug.join('/'))
  if (!resolved) notFound()
  const doc = resolved.page
  if (resolved.redirect) permanentRedirect(localizedPagePath(locale, doc.slug === 'home' ? '' : doc.slug))

  const shared = { params: Promise.resolve({ locale: validLocale(locale), __cmsRoute: true }) }
  const pageType = (doc as any).pageType
  if (pageType === 'home') { const Page = (await import('../page')).default; return <Page {...shared} /> }
  if (pageType === 'about') { const Page = (await import('../about/page')).default; return <Page {...shared} /> }
  if (pageType === 'events') { const Page = (await import('../events/page')).default; return <Page {...shared} /> }
  if (pageType === 'members') { const Page = (await import('../members/page')).default; return <Page {...shared} searchParams={Promise.resolve({})} /> }
  if (pageType === 'membership') { const Page = (await import('../membership/page')).default; return <Page {...shared} /> }
  if (pageType === 'contact') { const Page = (await import('../contact/page')).default; return <Page {...shared} /> }
  if (pageType === 'photobomb') { const Page = (await import('../photobomb/page')).default; return <Page {...shared} /> }
  if (pageType === 'news') { const Page = (await import('../news/page')).default; return <Page {...shared} /> }
  if (pageType === 'projects') { const Page = (await import('../projects/page')).default; return <Page {...shared} /> }
  if (pageType === 'board') { const Page = (await import('../about/board/page')).default; return <Page {...shared} /> }
  return <>
    <StructuredData data={{ '@type': 'WebPage', name: doc.title, url: absoluteUrl(`/${locale}/${slug.map(encodeURIComponent).join('/')}`), inLanguage: locale }} />
    {doc.puckLayout && (doc.puckLayout as any).content ? (
      <PuckRenderer data={doc.puckLayout as Data} documentData={{ ...doc, currentLocale: locale }} />
    ) : (
      <>
        <PageIntro title={doc.title} lead={doc.seo?.description || ''} />
        <article className="section-space mx-auto w-full max-w-4xl px-5 lg:px-8"><RichText content={doc.content} /></article>
      </>
    )}
  </>
}

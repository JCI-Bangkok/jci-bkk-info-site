import { notFound } from 'next/navigation'
import { getCmsPage, contentMetadata } from '@/lib/cms-seo'
import { validLocale, absoluteUrl } from '@/lib/seo'
import { PageIntro } from '@/components/page-intro'
import { RichText } from '@/components/rich-text'
import { StructuredData } from '@/components/structured-data'
import { PuckRenderer } from "@/components/builder/PuckRenderer";
import type { Data } from "@puckeditor/core"


type Props = { params: Promise<{ locale: string; slug: string[] }> }
export const revalidate = 300
export async function generateStaticParams() {
  // Static built-in pages win over this route; extra CMS pages render on demand.
  return []
}
export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params
  const doc = await getCmsPage(locale, slug.join('/'))
  if (!doc) notFound()
  return contentMetadata(locale, `/${slug.map(encodeURIComponent).join('/')}`, doc as any, { title: doc.title, description: doc.seo?.description || `${doc.title} — JCI Bangkok` })
}
export default async function CmsPage({ params }: Props) {
  const { locale, slug } = await params
  validLocale(locale)
  const doc = await getCmsPage(locale, slug.join('/'))
  if (!doc) notFound()
  return <>
    <StructuredData data={{ '@type': 'WebPage', name: doc.title, url: absoluteUrl(`/${locale}/${slug.map(encodeURIComponent).join('/')}`), inLanguage: locale }} />
    {doc.puckLayout && (doc.puckLayout as any).content ? (
      <PuckRenderer data={doc.puckLayout as Data} />
    ) : (
      <>
        <PageIntro title={doc.title} lead={doc.seo?.description || ''} />
        <article className="section-space mx-auto w-full max-w-4xl px-5 lg:px-8"><RichText content={doc.content} /></article>
      </>
    )}
  </>
}

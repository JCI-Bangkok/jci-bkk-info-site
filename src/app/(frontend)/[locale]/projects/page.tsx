import { permanentRedirect } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  const payload = await getPayload({ config: configPromise })
  const pageResult = await payload.find({
    collection: 'pages',
    where: {
      slug: { equals: 'projects' },
      status: { equals: 'published' },
    },
    limit: 1,
  })
  const pageDoc = pageResult.docs[0]
  if (pageDoc?.puckLayout && (pageDoc.puckLayout as any).content?.length > 0) {
    const { PuckRenderer } = await import('@/components/builder/PuckRenderer')
    return <PuckRenderer data={pageDoc.puckLayout as any} documentData={{ currentLocale: locale }} />
  }

  permanentRedirect(`/${locale}/events#past`)
}

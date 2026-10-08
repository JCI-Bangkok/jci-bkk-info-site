import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { renderLegacyPage } from '@/components/legacy-pages/render'

export default async function LegacyPreview({ params, searchParams }: {
  params: Promise<{ kind: string }>
  searchParams: Promise<{ locale?: string; slug?: string; year?: string }>
}) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) redirect('/admin/login')
  const { kind } = await params
  const query = await searchParams
  return renderLegacyPage(kind, { currentLocale: query.locale, slug: query.slug, year: query.year })
}

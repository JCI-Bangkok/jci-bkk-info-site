import { permanentRedirect } from 'next/navigation'
import { enforceManagedPagePath } from '@/lib/page-routing'
import { PuckRenderer } from '@/components/builder/PuckRenderer'
import { getPublishedTemplate } from '@/lib/templates'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export default async function BoardArchive({ params }: { params: Promise<{ locale: string; __cmsRoute?: boolean }> }) {
  const { locale, __cmsRoute } = await params
  const page = await enforceManagedPagePath(locale, 'board', __cmsRoute)
  const payload = await getPayload({ config: configPromise })
  const board = await payload.find({ collection: 'board-members', locale: locale as any, pagination: false, sort: 'displayOrder' })
  const years = [...new Set(board.docs.map(member => member.year))].sort((a, b) => b - a)
  const activeYear = years[0]
  const members = board.docs.filter(member => member.year === activeYear)
  const template = await getPublishedTemplate('board-listing').catch(() => null)
  const layout = template?.puckLayout || page?.puckLayout
  if (layout && (layout as any).content?.length) return <PuckRenderer data={layout as any} documentData={{ ...page, members, years, activeYear, currentLocale: locale }} />
  permanentRedirect(`/${locale}/members#board`)
}

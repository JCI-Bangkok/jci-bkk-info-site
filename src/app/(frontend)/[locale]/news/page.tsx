import { permanentRedirect } from 'next/navigation'
import { enforceManagedPagePath } from '@/lib/page-routing'
import { PuckRenderer } from '@/components/builder/PuckRenderer'
import { getPublishedTemplate } from '@/lib/templates'
import { getActivities } from '@/lib/activity-data'

export default async function NewsPage({ params }: { params: Promise<{ locale: string; __cmsRoute?: boolean }> }) {
  const { locale, __cmsRoute } = await params
  const page = await enforceManagedPagePath(locale, 'news', __cmsRoute)
  const { activities, today } = await getActivities(locale as any)
  const template = await getPublishedTemplate('news-listing').catch(() => null)
  const layout = template?.puckLayout || page?.puckLayout
  if (layout && (layout as any).content?.length) return <PuckRenderer data={layout as any} documentData={{ ...page, activities, today, currentLocale: locale }} />
  permanentRedirect(`/${locale}/events#updates`)
}

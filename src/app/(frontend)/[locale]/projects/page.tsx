import { permanentRedirect } from 'next/navigation'
import { enforceManagedPagePath } from '@/lib/page-routing'
import { getPublishedTemplate } from '@/lib/templates'
import { getActivities } from '@/lib/activity-data'

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string; __cmsRoute?: boolean }> }) {
  const { locale, __cmsRoute } = await params
  const pageDoc = await enforceManagedPagePath(locale, 'projects', __cmsRoute)
  const { activities } = await getActivities(locale as any)
  const template = await getPublishedTemplate('projects-listing').catch(() => null)
  const layout = template?.puckLayout || pageDoc?.puckLayout
  if (layout && (layout as any).content?.length > 0) {
    const { PuckRenderer } = await import('@/components/builder/PuckRenderer')
    return <PuckRenderer data={layout as any} documentData={{ ...pageDoc, activities, currentLocale: locale }} />
  }

  permanentRedirect(`/${locale}/events#past`)
}

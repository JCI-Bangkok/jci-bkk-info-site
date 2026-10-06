import { bangkokDay } from './calendar-date'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Locale } from '@/lib/i18n'

export type Activity = {
  id: string
  title: string
  href: string
  summary: string
  image: string
  date?: string
  year?: number
  venue?: string
  registration?: string
  upcoming: boolean
  kind: 'event' | 'project' | 'update'
}

export function mediaUrl(media: unknown): string | undefined {
  if (media && typeof media === 'object' && 'url' in media && typeof media.url === 'string') return media.url
}

export function isUpcoming(event: { status?: string | null; eventDate: string; endDate?: string | null }, today: string) {
  return event.status === 'upcoming' && bangkokDay(event.endDate || event.eventDate) >= today
}

export async function getActivities(locale: Locale) {
  const payload = await getPayload({ config })
  const today = bangkokDay(new Date())
  const [events, projects, articles] = await Promise.all([
    payload.find({ collection: 'events', locale, depth: 1, pagination: false, sort: 'eventDate', where: { status: { in: ['upcoming', 'completed'] } } }),
    payload.find({ collection: 'projects', locale, depth: 1, pagination: false, sort: '-year' }),
    payload.find({ collection: 'articles', locale, depth: 1, pagination: false, sort: '-publishDate', where: { publishDate: { less_than_equal: new Date().toISOString() } } }),
  ])
  const activities: Activity[] = [
    ...events.docs.map(event => ({
      id: 'event-' + event.id, title: event.title, href: `/${locale}/events/${event.slug}`,
      summary: event.shortDescription, image: mediaUrl(event.coverImage) || '/images/home/leadership-workshop.png',
      date: event.eventDate, venue: event.venue, registration: event.registrationLink || undefined,
      upcoming: isUpcoming({ status: event.status, eventDate: event.eventDate, endDate: event.endDate }, today), kind: 'event' as const,
    })),
    ...projects.docs.map(project => ({
      id: 'project-' + project.id, title: project.title, href: `/${locale}/events/projects/${project.slug}`,
      summary: project.problemStatement, image: mediaUrl(project.gallery?.[0]?.image) || '/images/home/community-project.png',
      year: project.year, upcoming: false, kind: 'project' as const,
    })),
    ...articles.docs.map(article => ({
      id: 'update-' + article.id, title: article.title, href: `/${locale}/events/updates/${article.slug}`,
      summary: article.summary, image: mediaUrl(article.coverImage) || '/images/home/hero-community.png',
      date: article.publishDate, upcoming: false, kind: 'update' as const,
    })),
  ]
  return { activities, today }
}

export async function getGalleryPhotos(locale: Locale) {
  const payload = await getPayload({ config })
  const today = bangkokDay(new Date())
  const [events, projects] = await Promise.all([
    payload.find({ collection: 'events', locale, depth: 1, pagination: false, sort: '-eventDate', where: { status: { in: ['upcoming', 'completed'] } } }),
    payload.find({ collection: 'projects', locale, depth: 1, pagination: false, sort: '-year' }),
  ])
  const photos: { src: string; alt: string }[] = []
  for (const event of events.docs.filter(event => !isUpcoming({ status: event.status, eventDate: event.eventDate, endDate: event.endDate }, today))) {
    // eventPhotos is a hasMany relationship (array of media objects)
    for (const media of (event.eventPhotos || [])) {
      const src = mediaUrl(media)
      if (src) photos.push({ src, alt: event.title })
    }
  }
  for (const project of projects.docs) {
    for (const entry of project.gallery || []) {
      const src = mediaUrl(entry.image)
      if (src) photos.push({ src, alt: project.title })
    }
  }
  return photos.filter((photo, index) => photos.findIndex(item => item.src === photo.src) === index)
}

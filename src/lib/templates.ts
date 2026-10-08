import { getPayload, type Where } from 'payload'
import configPromise from '@/payload.config'

export type TemplateType =
  | 'header'
  | 'footer'
  | 'event-single'
  | 'news-single'
  | 'project-single'
  | 'member-board-year'
  | 'home'
  | 'events-listing'
  | 'members-listing'
  | 'about'
  | 'contact'
  | 'membership'
  | 'photobomb'
  | 'news-listing'
  | 'projects-listing'
  | 'board-listing'
  | 'archive'

/** Returns only a deliberately published template; callers retain their fallback. */
export async function getPublishedTemplate(type: TemplateType) {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'templates',
    where: {
      and: [
        { type: { equals: type } },
        { or: [{ _status: { equals: 'published' } }, { status: { equals: 'published' } }] },
      ],
    } as Where,
    limit: 1,
    sort: '-updatedAt',
  })
  return result.docs[0] ?? null
}

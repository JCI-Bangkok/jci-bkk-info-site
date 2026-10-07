import type { Access, CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook, Where } from 'payload'

export const canEditContent: Access = ({ req }) => Boolean(req.user && !req.user.roles?.includes('viewer'))
export const canReadPublishedArticles: Access = ({ req }) => req.user ? true : { and: [{ status: { equals: 'published' } }, { publishDate: { less_than_equal: new Date().toISOString() } }] } as Where
export const canReadContent = (visibility: Where): Access => ({ req }) => req.user ? true : visibility

export const revalidatePage: CollectionAfterChangeHook = async ({ doc, previousDoc }) => {
  const { safeRevalidate: revalidatePath } = await import('./revalidate')
  for (const locale of ['en', 'th']) {
    for (const slug of new Set([doc.slug, previousDoc?.slug].filter(Boolean))) {
      await revalidatePath(slug === 'home' ? `/${locale}` : `/${locale}/${slug}`)
    }
  }
  await revalidatePath('/sitemap.xml')
  return doc
}
export const revalidateDeletedPage: CollectionAfterDeleteHook = async ({ doc }) => {
  const { safeRevalidate: revalidatePath } = await import('./revalidate')
  for (const locale of ['en', 'th']) await revalidatePath(doc.slug === 'home' ? `/${locale}` : `/${locale}/${doc.slug}`)
  await revalidatePath('/sitemap.xml')
  return doc
}
export const revalidateSettings: GlobalAfterChangeHook = async ({ doc }) => {
  const { safeRevalidate: revalidatePath } = await import('./revalidate')
  for (const locale of ['en', 'th']) await revalidatePath(`/${locale}`)
  return doc
}

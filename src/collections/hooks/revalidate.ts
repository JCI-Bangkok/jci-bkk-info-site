import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

const locales = ['en', 'th']

// Helper to safely revalidate paths
export const safeRevalidate = async (path: string) => {
  try {
    const { revalidatePath } = await import('next/cache')
    revalidatePath(path)
    // Also revalidate as layout to clear header/footer caches if any
    revalidatePath(path, 'layout')
    console.log(`[Revalidate] Success: ${path}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)

    if (message.includes('static generation store missing')) {
      console.log(`[Revalidate] Skipped outside request context: ${path}`)
      return
    }

    console.error(`[Revalidate] Error revalidating ${path}:`, error)
  }
}

// Revalidate Projects
export const revalidateProject: CollectionAfterChangeHook = async ({ doc, previousDoc }) => {
  for (const locale of locales) {
    await safeRevalidate(`/${locale}`)
    await safeRevalidate(`/${locale}/events`)
    await safeRevalidate(`/${locale}/photobomb`)
    if (doc.slug) {
      await safeRevalidate(`/${locale}/events/projects/${doc.slug}`)
    }
    if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
      await safeRevalidate(`/${locale}/events/projects/${previousDoc.slug}`)
    }
  }
  await safeRevalidate('/sitemap.xml')
  await safeRevalidate('/')
  return doc
}

export const revalidateDeleteProject: CollectionAfterDeleteHook = async ({ doc }) => {
  for (const locale of locales) {
    await safeRevalidate(`/${locale}`)
    await safeRevalidate(`/${locale}/events`)
    await safeRevalidate(`/${locale}/photobomb`)
    if (doc.slug) {
      await safeRevalidate(`/${locale}/events/projects/${doc.slug}`)
    }
  }
  await safeRevalidate('/sitemap.xml')
  await safeRevalidate('/')
  return doc
}

// Revalidate Events
export const revalidateEvent: CollectionAfterChangeHook = async ({ doc, previousDoc }) => {
  for (const locale of locales) {
    await safeRevalidate(`/${locale}`)
    await safeRevalidate(`/${locale}/events`)
    await safeRevalidate(`/${locale}/photobomb`)
    if (doc.slug) {
      await safeRevalidate(`/${locale}/events/${doc.slug}`)
    }
    if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
      await safeRevalidate(`/${locale}/events/${previousDoc.slug}`)
    }
  }
  await safeRevalidate('/sitemap.xml')
  await safeRevalidate('/')
  return doc
}

export const revalidateDeleteEvent: CollectionAfterDeleteHook = async ({ doc }) => {
  for (const locale of locales) {
    await safeRevalidate(`/${locale}`)
    await safeRevalidate(`/${locale}/events`)
    await safeRevalidate(`/${locale}/photobomb`)
    if (doc.slug) {
      await safeRevalidate(`/${locale}/events/${doc.slug}`)
    }
  }
  await safeRevalidate('/sitemap.xml')
  await safeRevalidate('/')
  return doc
}

// Revalidate Articles (News)
export const revalidateArticle: CollectionAfterChangeHook = async ({ doc, previousDoc }) => {
  for (const locale of locales) {
    await safeRevalidate(`/${locale}`)
    await safeRevalidate(`/${locale}/events`)
    await safeRevalidate(`/${locale}/photobomb`)
    if (doc.slug) {
      await safeRevalidate(`/${locale}/events/updates/${doc.slug}`)
    }
    if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
      await safeRevalidate(`/${locale}/events/updates/${previousDoc.slug}`)
    }
  }
  await safeRevalidate('/sitemap.xml')
  await safeRevalidate('/')
  return doc
}

export const revalidateDeleteArticle: CollectionAfterDeleteHook = async ({ doc }) => {
  for (const locale of locales) {
    await safeRevalidate(`/${locale}`)
    await safeRevalidate(`/${locale}/events`)
    await safeRevalidate(`/${locale}/photobomb`)
    if (doc.slug) {
      await safeRevalidate(`/${locale}/events/updates/${doc.slug}`)
    }
  }
  await safeRevalidate('/sitemap.xml')
  await safeRevalidate('/')
  return doc
}

// Revalidate Board Members
export const revalidateBoardMember: CollectionAfterChangeHook = async ({ doc, previousDoc }) => {
  for (const locale of locales) {
    await safeRevalidate(`/${locale}/members`)
    if (doc.year) {
      await safeRevalidate(`/${locale}/members/board/${doc.year}`)
    }
    if (previousDoc?.year && previousDoc.year !== doc.year) {
      await safeRevalidate(`/${locale}/members/board/${previousDoc.year}`)
    }
  }
  return doc
}

export const revalidateDeleteBoardMember: CollectionAfterDeleteHook = async ({ doc }) => {
  for (const locale of locales) {
    await safeRevalidate(`/${locale}/members`)
    if (doc.year) {
      await safeRevalidate(`/${locale}/members/board/${doc.year}`)
    }
  }
  return doc
}

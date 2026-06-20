import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath } from 'next/cache'

const locales = ['en', 'th']

// Helper to safely revalidate paths
const safeRevalidate = (path: string) => {
  try {
    revalidatePath(path)
    // Also revalidate as layout to clear header/footer caches if any
    revalidatePath(path, 'layout')
    console.log(`[Revalidate] Success: ${path}`)
  } catch (error) {
    console.error(`[Revalidate] Error revalidating ${path}:`, error)
  }
}

// Revalidate Projects
export const revalidateProject: CollectionAfterChangeHook = ({ doc, previousDoc }) => {
  locales.forEach((locale) => {
    safeRevalidate(`/${locale}`)
    safeRevalidate(`/${locale}/projects`)
    if (doc.slug) {
      safeRevalidate(`/${locale}/projects/${doc.slug}`)
    }
    if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
      safeRevalidate(`/${locale}/projects/${previousDoc.slug}`)
    }
  })
  safeRevalidate('/')
  return doc
}

export const revalidateDeleteProject: CollectionAfterDeleteHook = ({ doc }) => {
  locales.forEach((locale) => {
    safeRevalidate(`/${locale}`)
    safeRevalidate(`/${locale}/projects`)
    if (doc.slug) {
      safeRevalidate(`/${locale}/projects/${doc.slug}`)
    }
  })
  safeRevalidate('/')
  return doc
}

// Revalidate Events
export const revalidateEvent: CollectionAfterChangeHook = ({ doc, previousDoc }) => {
  locales.forEach((locale) => {
    safeRevalidate(`/${locale}`)
    safeRevalidate(`/${locale}/events`)
    if (doc.slug) {
      safeRevalidate(`/${locale}/events/${doc.slug}`)
    }
    if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
      safeRevalidate(`/${locale}/events/${previousDoc.slug}`)
    }
  })
  safeRevalidate('/')
  return doc
}

export const revalidateDeleteEvent: CollectionAfterDeleteHook = ({ doc }) => {
  locales.forEach((locale) => {
    safeRevalidate(`/${locale}`)
    safeRevalidate(`/${locale}/events`)
    if (doc.slug) {
      safeRevalidate(`/${locale}/events/${doc.slug}`)
    }
  })
  safeRevalidate('/')
  return doc
}

// Revalidate Articles (News)
export const revalidateArticle: CollectionAfterChangeHook = ({ doc, previousDoc }) => {
  locales.forEach((locale) => {
    safeRevalidate(`/${locale}`)
    safeRevalidate(`/${locale}/news`)
    if (doc.slug) {
      safeRevalidate(`/${locale}/news/${doc.slug}`)
    }
    if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
      safeRevalidate(`/${locale}/news/${previousDoc.slug}`)
    }
  })
  safeRevalidate('/')
  return doc
}

export const revalidateDeleteArticle: CollectionAfterDeleteHook = ({ doc }) => {
  locales.forEach((locale) => {
    safeRevalidate(`/${locale}`)
    safeRevalidate(`/${locale}/news`)
    if (doc.slug) {
      safeRevalidate(`/${locale}/news/${doc.slug}`)
    }
  })
  safeRevalidate('/')
  return doc
}

// Revalidate Board Members
export const revalidateBoardMember: CollectionAfterChangeHook = ({ doc, previousDoc }) => {
  locales.forEach((locale) => {
    safeRevalidate(`/${locale}/about/board`)
    if (doc.year) {
      safeRevalidate(`/${locale}/about/board/${doc.year}`)
    }
    if (previousDoc?.year && previousDoc.year !== doc.year) {
      safeRevalidate(`/${locale}/about/board/${previousDoc.year}`)
    }
  })
  return doc
}

export const revalidateDeleteBoardMember: CollectionAfterDeleteHook = ({ doc }) => {
  locales.forEach((locale) => {
    safeRevalidate(`/${locale}/about/board`)
    if (doc.year) {
      safeRevalidate(`/${locale}/about/board/${doc.year}`)
    }
  })
  return doc
}

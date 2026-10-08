import 'server-only'
import { notFound } from 'next/navigation'
import { legacyPageTypes, type LegacyPageType } from '@/lib/builder/legacy-page-types'

const loaders = {
  home: () => import('./home'), about: () => import('./about'),
  contact: () => import('./contact'), events: () => import('./events'),
  members: () => import('./members'), membership: () => import('./membership'),
  news: () => import('./news'), projects: () => import('./projects'), board: () => import('./board'),
  photobomb: () => import('./photobomb'), 'event-single': () => import('./event-single'),
  'project-single': () => import('./project-single'), 'news-single': () => import('./news-single'),
  'member-board-year': () => import('./member-board-year'),
}

export async function renderLegacyPage(pageType: string, data: any = {}) {
  if (!legacyPageTypes.includes(pageType as LegacyPageType)) notFound()
  const { default: Page } = await loaders[pageType as LegacyPageType]()
  return (Page as any)({
    params: Promise.resolve({ locale: data.currentLocale === 'th' ? 'th' : 'en', slug: data.slug, year: String(data.year || data.activeYear || 2026) }),
    searchParams: Promise.resolve({ year: data.activeYear ? String(data.activeYear) : undefined }),
  })
}

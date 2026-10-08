export const legacyPageTypes = ['home', 'about', 'contact', 'events', 'members', 'membership', 'photobomb', 'news', 'projects', 'board', 'event-single', 'project-single', 'news-single', 'member-board-year'] as const
export type LegacyPageType = typeof legacyPageTypes[number]
export function legacyPageLayout(pageType: string) {
  const aliases: Record<string, string> = { 'events-listing': 'events', 'members-listing': 'members', 'news-listing': 'news', 'projects-listing': 'projects', 'board-listing': 'board' }
  return { root: { props: {} }, content: [{ type: 'LegacyPage', props: { id: `legacy-page-${pageType}`, pageType: aliases[pageType] || pageType, visible: true } }] }
}

import { getPayload } from 'payload'
import configPromise from './src/payload.config'
import { legacyPageLayout } from './src/lib/builder/legacy-page-types'

const templates = [
  ['Home Page', 'home', ['LegacyPage']],
  ['Events Listing', 'events-listing', ['DynamicEventsList']],
  ['Members Listing', 'members-listing', ['DynamicMemberGrid']],
  ['About Page', 'about', ['DynamicHero', 'Text']],
  ['Contact Page', 'contact', ['DynamicHero', 'DynamicContactForm']],
  ['Membership Page', 'membership', ['DynamicHero', 'DynamicContactForm']],
  ['PhotoBomb Gallery', 'photobomb', ['Hero', 'Text']],
  ['Global Header', 'header', ['GlobalHeader']],
  ['Global Footer', 'footer', ['GlobalFooter']],
  ['News Listing', 'news-listing', ['DynamicEventsList']],
  ['Projects Listing', 'projects-listing', ['DynamicProjectsList']],
  ['Board Listing', 'board-listing', ['DynamicMemberGrid']],
] as const

const defaults: Record<string, object> = {
  Text: { content: 'Edit this page content before publishing.', align: 'left', size: 'normal' },
  Hero: { title: 'PhotoBomb', description: 'Moments from JCI Bangkok.', align: 'center' },
}

const migratedPageLayouts = Object.fromEntries(['home', 'about', 'events', 'members', 'membership', 'contact', 'photobomb', 'news', 'projects', 'board'].map(type => [type, legacyPageLayout(type).content]))
async function seed() {
  const payload = await getPayload({ config: configPromise })
  const managedPages = [
    ['home', 'home', 'Home', 'หน้าแรก'], ['about', 'about', 'About', 'เกี่ยวกับเรา'],
    ['events', 'events', 'Events', 'กิจกรรม'], ['members', 'members', 'Members', 'สมาชิก'],
    ['membership', 'membership', 'Membership', 'สมัครสมาชิก'], ['contact', 'contact', 'Contact', 'ติดต่อเรา'],
    ['photobomb', 'photobomb', 'PhotoBomb', 'PhotoBomb'], ['news', 'news', 'News', 'ข่าวสาร'],
    ['projects', 'projects', 'Projects', 'โครงการ'], ['board', 'about/board', 'Board archive', 'ทำเนียบคณะกรรมการ'],
  ] as const
  const pageByType = new Map<string, any>()
  for (const [pageType, slug, title, titleTh] of managedPages) {
    const found = await payload.find({ collection: 'pages', where: { or: [{ pageType: { equals: pageType } }, { slug: { equals: slug } }] }, limit: 1, overrideAccess: true })
    let page = found.docs[0]
    if (page) page = await payload.update({ collection: 'pages', id: page.id, locale: 'en', data: { pageType, slug } as any })
    else page = await payload.create({ collection: 'pages', locale: 'en', data: { title, pageType, slug, status: 'published', content: null } as any })
    const migratedBlocks = migratedPageLayouts[pageType]
    if (migratedBlocks && !(page.puckLayout as any)?.content?.length) {
      await payload.update({
        collection: 'pages', id: page.id, locale: 'en',
        data: { puckLayout: { root: { props: {} }, content: migratedBlocks.map((block, index) => ({ ...block, props: { ...block.props, id: `legacy-${pageType}-${index}` } })) } } as any,
      })
    }
    await payload.update({ collection: 'pages', id: page.id, locale: 'th', data: { title: titleTh } as any })
    pageByType.set(pageType, page)
  }
  for (const [title, type, blocks] of templates) {
    const existing = await payload.find({ collection: 'templates', where: { type: { equals: type } }, limit: 1 })
    if (existing.totalDocs) continue
    await payload.create({
      collection: 'templates',
      data: {
        title,
        type: type as any,
        // Draft by default: existing layouts continue until an editor chooses to publish.
        status: 'draft',
        puckLayout: type === 'header' || type === 'footer' ? { root: { props: {} }, content: blocks.map((block, index) => ({ type: block, props: { ...defaults[block], id: `${type}-${index}` } })) } : legacyPageLayout(type),
      },
    })
  }
  const navigation = await payload.findGlobal({ slug: 'navigation', depth: 1 })
  const navDefaults = [
    ['Home', 'หน้าแรก', 'home'], ['Events', 'กิจกรรม', 'events'], ['Members', 'สมาชิก', 'members'],
    ['PhotoBomb', 'PhotoBomb', 'photobomb'], ['About', 'เกี่ยวกับเรา', 'about'], ['Contact', 'ติดต่อเรา', 'contact'],
  ] as const
  if (!navigation.items?.length || navigation.items.every((item: any) => !item.page)) await payload.updateGlobal({
    slug: 'navigation',
    data: { items: navDefaults.map(([label, labelTh, pageType]) => ({ label, labelTh, linkType: 'page' as const, page: pageByType.get(pageType)?.id, openInNewTab: false })) },
  })
}

seed().then(() => process.exit(0)).catch((error) => { console.error(error); process.exit(1) })

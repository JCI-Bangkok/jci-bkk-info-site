import { getPayload } from 'payload'
import config from '../src/payload.config'

async function check() {
  const payload = await getPayload({ config })
  const result = await payload.find({ collection: 'templates', pagination: false, overrideAccess: true })
  const pages = await payload.find({ collection: 'pages', pagination: false, overrideAccess: true })
  const navigation = await payload.findGlobal({ slug: 'navigation', depth: 1, overrideAccess: true })
  const types = ['home', 'events-listing', 'members-listing', 'about', 'contact', 'membership', 'photobomb', 'header', 'footer', 'news-listing', 'projects-listing', 'board-listing']
  const state = { templates: result.docs.map(({ type, status }) => ({ type, status })), pages: pages.docs.map(({ id, slug, pageType, status, puckLayout }) => ({ id, slug, pageType, status, blocks: (puckLayout as any)?.content?.map((block: any) => block.type) || [] })), navigationItems: navigation.items?.length || 0, linkedNavigationItems: navigation.items?.filter(item => item.linkType === 'page' && item.page).length || 0 }
  console.log(JSON.stringify(state, null, 2))
  for (const type of types) if (!result.docs.some(template => template.type === type)) throw new Error(`Missing template: ${type}`)
  if (!navigation.items?.length) throw new Error('Navigation has no items.')
}
check().then(() => process.exit(0)).catch(error => { console.error(error); process.exit(1) })

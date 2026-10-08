import { getPayload } from 'payload'
import config from '../src/payload.config'
import { legacyPageLayout } from '../src/lib/builder/legacy-page-types'

async function repair() {
  const payload = await getPayload({ config })
  const apply = process.argv.includes('--apply')
  const managed = ['home', 'about', 'events', 'members', 'membership', 'contact', 'photobomb', 'news', 'projects', 'board']
  const pages = await payload.find({ collection: 'pages', pagination: false, depth: 0, overrideAccess: true })
  for (const page of pages.docs) {
    if (!managed.includes(page.pageType || '')) continue
    const content = (page.puckLayout as any)?.content || []
    const replacement = legacyPageLayout(page.pageType!)
    if (JSON.stringify(page.puckLayout) === JSON.stringify(replacement)) continue
    // Only replace the known incomplete generated migration, never editor-built content.
    if (content.length && !content.every((block: any) => (block.type === 'LegacyDynamic' && block.props?.id?.startsWith(`legacy-${page.pageType}-`)) || (block.type === 'LegacyPage' && block.props?.id === `legacy-page-${page.pageType}`))) continue
    console.log(`${apply ? 'Repair' : 'Would repair'} Page ${page.id}: ${page.pageType}`)
    if (apply) await payload.update({ collection: 'pages', id: page.id, overrideAccess: true, data: { puckLayout: legacyPageLayout(page.pageType!) } })
  }
  const types = [...managed, 'events-listing', 'members-listing', 'news-listing', 'projects-listing', 'board-listing', 'event-single', 'project-single', 'news-single', 'member-board-year']
  const templates = await payload.find({ collection: 'templates', pagination: false, depth: 0, overrideAccess: true })
  const originalIds = new Set(['header', 'content', 'gallery', 'p-header', 'p-columns', 'article-layout', 'board-members-layout'])
  for (const template of templates.docs) {
    if (!types.includes(template.type)) continue
    const content = (template.puckLayout as any)?.content || []
    if (JSON.stringify(template.puckLayout) === JSON.stringify(legacyPageLayout(template.type))) continue
    if (!content.length || !content.every((block: any) => block.props?.id?.startsWith(`${template.type}-`) || originalIds.has(block.props?.id) || (block.type === 'LegacyPage' && block.props?.id === `legacy-page-${template.type}`))) continue
    console.log(`${apply ? 'Repair' : 'Would repair'} Template ${template.id}: ${template.type}`)
    if (apply) await payload.update({ collection: 'templates', id: template.id, overrideAccess: true, data: { puckLayout: legacyPageLayout(template.type) } })
  }
  console.log('Existing Payload revisions preserve the replaced layouts for rollback.')
}
repair().then(() => process.exit(0)).catch(error => { console.error(error); process.exit(1) })

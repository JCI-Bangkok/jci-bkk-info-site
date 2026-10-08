import { getPayload } from 'payload'
import config from '../src/payload.config'

async function inspect() {
const payload = await getPayload({ config })
const [pages, templates] = await Promise.all([
  payload.find({ collection: 'pages', pagination: false, overrideAccess: true, depth: 0, draft: true }),
  payload.find({ collection: 'templates', pagination: false, overrideAccess: true, depth: 0, draft: true }),
])
const versionCounts: Record<string, number> = {}
for (const page of pages.docs as any[]) versionCounts[`pages:${page.id}`] = (await payload.findVersions({ collection: 'pages', where: { parent: { equals: page.id } }, limit: 100, overrideAccess: true })).totalDocs
for (const template of templates.docs as any[]) versionCounts[`templates:${template.id}`] = (await payload.findVersions({ collection: 'templates', where: { parent: { equals: template.id } }, limit: 100, overrideAccess: true })).totalDocs
const signature = (layout: any) => (layout?.content || []).map((item: any) => `${item.type}:${item.props?.functionName || item.props?.id || ''}`)
console.log(JSON.stringify({
  pages: pages.docs.map((page: any) => ({ id: page.id, slug: page.slug, pageType: page.pageType, status: page.status, layout: signature(page.puckLayout) })),
  templates: templates.docs.map((template: any) => ({ id: template.id, title: template.title, type: template.type, status: template.status, layout: signature(template.puckLayout) })), versionCounts,
}, null, 2))
}
inspect().then(() => process.exit(0)).catch(error => { console.error(error); process.exit(1) })

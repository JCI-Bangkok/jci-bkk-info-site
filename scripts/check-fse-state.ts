import { getPayload } from 'payload'
import config from '../src/payload.config'

async function check() {
  const payload = await getPayload({ config })
  const result = await payload.find({ collection: 'templates', pagination: false })
  const navigation = await payload.findGlobal({ slug: 'navigation' })
  const types = ['home', 'events-listing', 'members-listing', 'about', 'contact', 'membership', 'photobomb']
  for (const type of types) {
    if (!result.docs.some(template => template.type === type)) throw new Error(`Missing template: ${type}`)
  }
  if (!navigation.items?.length) throw new Error('Navigation has no items.')
  console.log(JSON.stringify({ templates: result.docs.map(({ type, status }) => ({ type, status })), navigationItems: navigation.items.length }, null, 2))
}
check().then(() => process.exit(0)).catch(error => { console.error(error); process.exit(1) })

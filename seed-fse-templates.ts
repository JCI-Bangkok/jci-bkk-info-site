import { getPayload } from 'payload'
import configPromise from './src/payload.config'

const templates = [
  ['Home Page', 'home', ['DynamicHero', 'DynamicEventsList']],
  ['Events Listing', 'events-listing', ['DynamicEventsList']],
  ['Members Listing', 'members-listing', ['DynamicMemberGrid']],
  ['About Page', 'about', ['DynamicHero', 'Text']],
  ['Contact Page', 'contact', ['DynamicHero', 'DynamicContactForm']],
  ['Membership Page', 'membership', ['DynamicHero', 'DynamicContactForm']],
  ['PhotoBomb Gallery', 'photobomb', ['Hero', 'Text']],
] as const

const defaults: Record<string, object> = {
  Text: { content: 'Edit this page content before publishing.', align: 'left', size: 'normal' },
  Hero: { title: 'PhotoBomb', description: 'Moments from JCI Bangkok.', align: 'center' },
}

async function seed() {
  const payload = await getPayload({ config: configPromise })
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
        puckLayout: { root: { props: {} }, content: blocks.map((block, index) => ({ type: block, props: { ...defaults[block], id: `${type}-${index}` } })) },
      },
    })
  }
  const navigation = await payload.findGlobal({ slug: 'navigation' })
  if (!navigation.items?.length) await payload.updateGlobal({
    slug: 'navigation',
    data: { items: [
      { label: 'Home', labelTh: 'หน้าแรก', href: '/' }, { label: 'Events', labelTh: 'กิจกรรม', href: '/events' },
      { label: 'Members', labelTh: 'สมาชิก', href: '/members' }, { label: 'PhotoBomb', labelTh: 'PhotoBomb', href: '/photobomb' },
      { label: 'About', labelTh: 'เกี่ยวกับเรา', href: '/about' }, { label: 'Contact', labelTh: 'ติดต่อเรา', href: '/contact' },
    ] },
  })
}

seed().then(() => process.exit(0)).catch((error) => { console.error(error); process.exit(1) })

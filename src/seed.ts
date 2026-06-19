import { loadEnvConfig } from '@next/env'
loadEnvConfig(process.cwd())

import { getPayload } from 'payload'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  events as seedEvents,
  projects as seedProjects,
  stories as seedStories,
  articles as seedArticles,
  boardYears as seedBoardYears,
  partners as seedPartners,
} from './lib/site-data'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

function toRichText(text: string) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text,
              type: 'text',
              version: 1,
            },
          ],
        },
      ],
    },
  }
}

function parseDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    if (!isNaN(d.getTime())) {
      return d.toISOString()
    }
  } catch {
    // ignore
  }
  return new Date().toISOString()
}

async function run() {
  console.log('Starting Payload CMS seeding...')
  console.log('DATABASE_URI from env:', process.env.DATABASE_URI)
  console.log('PAYLOAD_SECRET from env:', process.env.PAYLOAD_SECRET)
  
  const configModule = await import('./payload.config')
  const configPromise = configModule.default
  const payload = await getPayload({ config: configPromise })

  // 1. Create Admin User
  console.log('Seeding Admin User...')
  const existingUsers = await payload.find({
    collection: 'users',
    where: {
      email: {
        equals: 'admin@jcibangkok.org',
      },
    },
  })

  let adminUser
  if (existingUsers.docs.length === 0) {
    adminUser = await payload.create({
      collection: 'users',
      data: {
        email: 'admin@jcibangkok.org',
        password: 'Password123!',
        roles: ['super-admin'],
      },
    })
    console.log('Admin User created successfully.')
  } else {
    adminUser = existingUsers.docs[0]
    console.log('Admin User already exists.')
  }

  // 2. Upload Media Images
  console.log('Seeding Media images...')
  const imageNames = [
    'hero-community.png',
    'community-project.png',
    'leadership-workshop.png',
    'member-story.png',
    'ux-concept.png',
  ]

  interface SeedMedia {
    id: string | number
  }

  const mediaDocs: Record<string, SeedMedia> = {}

  for (const name of imageNames) {
    const existingMedia = await payload.find({
      collection: 'media',
      where: {
        filename: {
          equals: name,
        },
      },
    })

    if (existingMedia.docs.length === 0) {
      const filePath = path.resolve(dirname, '../public/images/home', name)
      if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath)
        const mediaDoc = await payload.create({
          collection: 'media',
          data: {
            alt: name.replace('-', ' ').replace('.png', ''),
          },
          file: {
            data: fileBuffer,
            name,
            mimetype: 'image/png',
            size: fileBuffer.length,
          },
        })
        mediaDocs[name] = mediaDoc as unknown as SeedMedia
        console.log(`Uploaded media image: ${name}`)
      } else {
        console.warn(`File not found: ${filePath}`)
      }
    } else {
      mediaDocs[name] = existingMedia.docs[0] as unknown as SeedMedia
      console.log(`Media image ${name} already exists.`)
    }
  }

  // Helper to get fallback media ID
  const getFallbackMediaId = () => {
    const keys = Object.keys(mediaDocs)
    return keys.length > 0 ? mediaDocs[keys[0]].id : null
  }

  // 3. Seed Events
  console.log('Seeding Events...')
  interface SeedEvent {
    id: string | number
  }
  const createdEvents: Record<string, SeedEvent> = {}
  for (const event of seedEvents) {
    const existing = await payload.find({
      collection: 'events',
      where: {
        slug: {
          equals: event.slug,
        },
      },
    })

    if (existing.docs.length === 0) {
      // Determine cover image
      let coverImageId = getFallbackMediaId()
      if (event.slug === 'bangkok-leadership-lab' && mediaDocs['leadership-workshop.png']) {
        coverImageId = mediaDocs['leadership-workshop.png'].id
      } else if (event.slug === 'community-action-day' && mediaDocs['community-project.png']) {
        coverImageId = mediaDocs['community-project.png'].id
      } else if (mediaDocs['hero-community.png']) {
        coverImageId = mediaDocs['hero-community.png'].id
      }

      const eventTypeMap: Record<string, string> = {
        'Training': 'training',
        'Networking': 'networking',
        'Community Project': 'community',
        'General Meeting': 'general',
        'International Event': 'international',
        'Partner Event': 'partner',
      }

      const statusMap: Record<string, string> = {
        'Upcoming': 'upcoming',
        'Completed': 'completed',
      }

      const doc = await payload.create({
        collection: 'events',
        data: {
          title: event.title,
          slug: event.slug,
          eventDate: parseDate(event.date),
          venue: event.venue,
          eventType: eventTypeMap[event.type] || 'training',
          shortDescription: event.summary,
          fullDescription: toRichText(event.highlight),
          coverImage: coverImageId,
          status: statusMap[event.status] || 'upcoming',
          featured: event.slug === 'bangkok-leadership-lab',
        },
      })
      createdEvents[event.slug] = doc as unknown as SeedEvent
      console.log(`Created Event: ${event.title}`)
    } else {
      createdEvents[event.slug] = existing.docs[0] as unknown as SeedEvent
      console.log(`Event already exists: ${event.title}`)
    }
  }

  // 4. Seed Projects
  console.log('Seeding Projects...')
  for (const project of seedProjects) {
    const existing = await payload.find({
      collection: 'projects',
      where: {
        slug: {
          equals: project.slug,
        },
      },
    })

    if (existing.docs.length === 0) {
      const categoryMap: Record<string, string> = {
        'Youth Development': 'youth',
        'Sustainability': 'sustainability',
        'Entrepreneurship': 'entrepreneurship',
        'Community Impact': 'community',
        'International Cooperation': 'international',
      }

      await payload.create({
        collection: 'projects',
        data: {
          title: project.title,
          slug: project.slug,
          year: parseInt(project.year) || 2026,
          category: categoryMap[project.category] || 'community',
          problemStatement: project.summary,
          targetBeneficiaries: project.beneficiaries,
          activities: toRichText(project.impact),
          outcomes: toRichText('Successful execution with target objectives met.'),
          impactNumbers: [
            { value: '100+', label: 'Participants' },
            { value: '5+', label: 'Partner Organizations' },
          ],
          sdgTags: ['sdg-4', 'sdg-8', 'sdg-17'],
        },
      })
      console.log(`Created Project: ${project.title}`)
    } else {
      console.log(`Project already exists: ${project.title}`)
    }
  }

  // 5. Seed Articles (News)
  console.log('Seeding Articles...')
  for (const article of seedArticles) {
    const existing = await payload.find({
      collection: 'articles',
      where: {
        slug: {
          equals: article.slug,
        },
      },
    })

    if (existing.docs.length === 0) {
      // Determine cover image
      let coverImageId = getFallbackMediaId()
      if (article.slug === 'inside-community-action-day' && mediaDocs['community-project.png']) {
        coverImageId = mediaDocs['community-project.png'].id
      } else if (mediaDocs['hero-community.png']) {
        coverImageId = mediaDocs['hero-community.png'].id
      }

      const categoryMap: Record<string, string> = {
        'Knowledge Article': 'knowledge',
        'Event Recap': 'event-recap',
        'President Message': 'president-message',
        'News': 'news',
      }

      // Link to related event/project if applicable
      let relatedEvent
      if (article.slug === 'inside-community-action-day' && createdEvents['community-action-day']) {
        relatedEvent = createdEvents['community-action-day'].id
      }

      await payload.create({
        collection: 'articles',
        data: {
          title: article.title,
          slug: article.slug,
          author: adminUser.id,
          category: categoryMap[article.category] || 'news',
          coverImage: coverImageId,
          summary: article.summary,
          body: toRichText(article.summary),
          publishDate: parseDate(article.publishedAt),
          relatedEvent,
        },
      })
      console.log(`Created Article: ${article.title}`)
    } else {
      console.log(`Article already exists: ${article.title}`)
    }
  }

  // 6. Seed Board Members
  console.log('Seeding Board Members...')
  for (const yearEntry of seedBoardYears) {
    for (const member of yearEntry.members) {
      const existing = await payload.find({
        collection: 'board-members',
        where: {
          and: [
            { name: { equals: member.name } },
            { year: { equals: parseInt(yearEntry.year) } },
          ],
        },
      })

      if (existing.docs.length === 0) {
        // Use member story image as fallback
        const photoId = mediaDocs['member-story.png']
          ? mediaDocs['member-story.png'].id
          : getFallbackMediaId()

        await payload.create({
          collection: 'board-members',
          data: {
            name: member.name,
            position: member.role,
            year: parseInt(yearEntry.year),
            photo: photoId,
            bio: toRichText(member.bio),
            companyRole: member.company,
            displayOrder: member.role.includes('President') ? 1 : 10,
          },
        })
        console.log(`Created Board Member: ${member.name} for ${yearEntry.year}`)
      } else {
        console.log(`Board Member ${member.name} already exists for ${yearEntry.year}`)
      }
    }
  }

  // 7. Seed Member Stories
  console.log('Seeding Member Stories...')
  for (const story of seedStories) {
    const existing = await payload.find({
      collection: 'member-stories',
      where: {
        memberName: {
          equals: story.name,
        },
      },
    })

    if (existing.docs.length === 0) {
      const photoId = mediaDocs['member-story.png']
        ? mediaDocs['member-story.png'].id
        : getFallbackMediaId()

      await payload.create({
        collection: 'member-stories',
        data: {
          memberName: story.name,
          yearJoined: parseInt(story.yearJoined) || 2024,
          chapterRole: story.role,
          storyTitle: story.highlight,
          quote: story.quote,
          fullStory: toRichText(story.quote),
          photo: photoId,
        },
      })
      console.log(`Created Member Story for: ${story.name}`)
    } else {
      console.log(`Member Story already exists for: ${story.name}`)
    }
  }

  // 8. Seed Partners
  console.log('Seeding Partners...')
  for (const partnerName of seedPartners) {
    const existing = await payload.find({
      collection: 'partners',
      where: {
        organizationName: {
          equals: partnerName,
        },
      },
    })

    if (existing.docs.length === 0) {
      const logoId = mediaDocs['ux-concept.png']
        ? mediaDocs['ux-concept.png'].id
        : getFallbackMediaId()

      await payload.create({
        collection: 'partners',
        data: {
          organizationName: partnerName,
          logo: logoId,
          partnerType: partnerName.includes('Sponsor') ? 'sponsor' : 'partner',
          partnershipYear: 2026,
          description: `Seeded partner: ${partnerName}`,
        },
      })
      console.log(`Created Partner: ${partnerName}`)
    } else {
      console.log(`Partner already exists: ${partnerName}`)
    }
  }

  // 9. Global Site Settings
  console.log('Updating Global Site Settings...')
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: 'JCI Bangkok',
      currentYearTheme: seedBoardYears[0]?.theme || 'Lead forward, build local trust.',
      footerText: '© 2026 JCI Bangkok. All Rights Reserved.',
    },
  })
  console.log('Global Site Settings updated.')

  console.log('Seeding process completed successfully!')
  process.exit(0)
}

run().catch((err) => {
  console.error('Seeding failed:', err)
  process.exit(1)
})

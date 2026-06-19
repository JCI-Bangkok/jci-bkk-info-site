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

const TRANSLATIONS: Record<string, string> = {
  // Event Titles
  "Bangkok Leadership Lab": "ห้องปฏิบัติการความเป็นผู้นำกรุงเทพฯ",
  "Impact Mixer with Mission-Driven Founders": "งานพบปะสังสรรค์และแลกเปลี่ยนความรู้กับผู้ก่อตั้งธุรกิจ",
  "Community Action Day": "วันบำเพ็ญประโยชน์เพื่อชุมชน",

  // Event Venues
  "Creative Hall, Sukhumvit": "ครีเอทีฟฮอลล์ สุขุมวิท",
  "Riverside Commons, Bangkok": "ริเวอร์ไซด์ คอมมอนส์ กรุงเทพฯ",
  "Khlong Toei District": "เขตคลองเตย",

  // Event Summaries & Highlights
  "A practical leadership intensive focused on facilitation, speaking, and leading across committees.": "หลักสูตรเร่งรัดเพื่อฝึกฝนภาวะผู้นำเชิงปฏิบัติ มุ่งเน้นการอำนวยความสะดวก การพูดในที่สาธารณะ และการนำคณะทำงาน",
  "Designed for first-time and emerging chapter leaders.": "ออกแบบสำหรับผู้นำสมาคมที่เป็นครั้งแรกและผู้นำที่กำลังเติบโต",
  "An evening of founder stories, civic entrepreneurship, and cross-sector introductions for young professionals.": "ค่ำคืนแห่งการแบ่งปันเรื่องราวของผู้ก่อตั้ง การเป็นผู้ประกอบการเพื่อสังคม และการสร้างเครือข่ายสำหรับคนทำงานรุ่นใหม่",
  "Blends networking with live case studies from Bangkok builders.": "ผสมผสานการสร้างเครือข่ายกับการศึกษากรณีศึกษาจริงจากผู้สร้างกรุงเทพฯ",
  "A volunteer activation that paired local partners, members, and youth leaders around a targeted neighborhood initiative.": "การทำกิจกรรมอาสาสมัครที่รวมพลังพันธมิตรท้องถิ่น สมาชิก และผู้นำเยาวชนเพื่อพัฒนาชุมชนในพื้นที่เป้าหมาย",
  "Built to demonstrate visible local action, not abstract volunteering.": "จัดทำขึ้นเพื่อแสดงการลงมือทำจริงในระดับท้องถิ่น ไม่ใช่งานอาสาสมัครที่เป็นนามธรรม",

  // Project Titles
  "Future Skills for Bangkok Youth": "ทักษะแห่งอนาคตสำหรับเยาวชนกรุงเทพฯ",
  "Green District Challenge": "โครงการท้าทายเขตพื้นที่สีเขียว",
  "Bangkok Social Enterprise Exchange": "แพลตฟอร์มแลกเปลี่ยนวิสาหกิจเพื่อสังคมกรุงเทพฯ",

  // Project Summaries, Beneficiaries, Impacts
  "A workshop series connecting communication, leadership, and career-readiness for young people entering the workforce.": "ชุดการประชุมเชิงปฏิบัติการที่เชื่อมโยงการสื่อสาร ภาวะผู้นำ และความพร้อมในอาชีพสำหรับคนรุ่นใหม่ที่กำลังก้าวเข้าสู่ตลาดแรงงาน",
  "Upper secondary and university-aged participants": "ผู้เข้าร่วมในระดับมัธยมศึกษาตอนปลายและมหาวิทยาลัย",
  "Training pathways with volunteer mentors and partner organizations.": "เส้นทางการเรียนรู้พร้อมเมนเทอร์อาสาสมัครและองค์กรพันธมิตร",
  "A community initiative that turns environmental awareness into local action through public campaigns and partnerships.": "โครงการริเริ่มของชุมชนที่เปลี่ยนความตระหนักรู้ด้านสิ่งแวดล้อมเป็นการปฏิบัติในท้องถิ่นผ่านการรณรงค์และพันธมิตร",
  "Neighborhood communities and civic partners": "ชุมชนและพันธมิตรภาคประชาสังคมในพื้นที่",
  "Creates a visible route from participation to measurable city impact.": "สร้างเส้นทางที่ชัดเจนจากการมีส่วนร่วมไปสู่ผลลัพธ์ที่วัดผลได้ของเมือง",
  "A collaborative platform for founders, members, and partner organizations to exchange ideas around responsible business growth.": "แพลตฟอร์มการทำงานร่วมกันสำหรับผู้ก่อตั้ง สมาชิก และองค์กรพันธมิตรเพื่อแลกเปลี่ยนแนวคิดการเติบโตทางธุรกิจอย่างรับผิดชอบ",
  "Early-stage founders and young professionals": "ผู้ก่อตั้งธุรกิจระยะเริ่มต้นและคนทำงานรุ่นใหม่",
  "Bridges networking with mentorship and real collaboration.": "เชื่อมโยงเครือข่ายเข้ากับเมนเทอร์และการทำงานร่วมกันจริง",
  "Successful execution with target objectives met.": "การดำเนินงานที่ประสบความสำเร็จตามวัตถุประสงค์ที่ตั้งไว้",
  "Participants": "ผู้เข้าร่วม",
  "Partner Organizations": "องค์กรพันธมิตร",

  // Article Titles & Summaries
  "Why young leaders in Bangkok need practice, not just inspiration": "ทำไมผู้นำรุ่นใหม่ในกรุงเทพฯ ถึงต้องการการลงมือปฏิบัติจริง ไม่ใช่แค่แรงบันดาลใจ",
  "A perspective on building confidence through committees, projects, and public-facing responsibility.": "มุมมองในการสร้างความมั่นใจผ่านการทำงานในคณะทำงาน โครงการ และการรับผิดชอบงานสาธารณะ",
  "Inside Community Action Day: what local impact looked like on the ground": "เจาะลึกวันบำเพ็ญประโยชน์เพื่อชุมชน: ภาพสะท้อนของการสร้างผลลัพธ์ในพื้นที่จริง",
  "A recap of how local partners and members worked together on a focused district initiative.": "สรุปผลการทำงานร่วมกันของพันธมิตรท้องถิ่นและสมาชิกในโครงการระดับเขต",
  "A new chapter year with a global mission and a Bangkok mindset": "ปีแห่งบทบาทใหม่กับพันธกิจระดับโลกและแนวคิดแบบคนกรุงเทพฯ",
  "A message about turning the JCI mission into grounded local opportunities for young active citizens.": "ข้อความเกี่ยวกับการแปลงพันธกิจของ JCI เป็นโอกาสในการปฏิบัติจริงสำหรับพลเมืองตื่นรู้รุ่นใหม่",

  // Member Names & Roles & Quotes
  "Mina S.": "มินา เอส.",
  "Member and program lead": "สมาชิกและผู้นำโครงการ",
  "JCI Bangkok gave me a place to test my leadership in public, with real stakes and a supportive team behind me.": "JCI กรุงเทพฯ มอบพื้นที่ให้ฉันได้ทดสอบความเป็นผู้นำในที่สาธารณะ ด้วยโครงการจริงและทีมงานที่คอยสนับสนุนอยู่เบื้องหลัง",
  "From event volunteer to committee lead within one year.": "จากอาสาสมัครกิจกรรมสู่ผู้นำคณะทำงานภายในหนึ่งปี",
  
  "Narin T.": "นรินทร์ ที.",
  "Partnership committee": "คณะทำงานฝ่ายพันธมิตร",
  "I joined for community impact and stayed because the network pushed me to think bigger than my day job.": "ฉันเข้าร่วมเพราะอยากสร้างผลลัพธ์เพื่อชุมชน และยังคงอยู่เพราะเครือข่ายผลักดันให้ฉันคิดได้ไกลกว่างานประจำที่ทำ",
  "Built sponsor conversations into long-term partner relationships.": "พัฒนาการเจรจากับผู้สนับสนุนสู่ความสัมพันธ์พันธมิตรระยะยาว",
  
  "Aiko P.": "ไอโกะ พี.",
  "International relations": "ฝ่ายความสัมพันธ์ระหว่างประเทศ",
  "The international side of JCI made Bangkok feel connected to something much bigger, while still keeping the work local.": "ด้านการต่างประเทศ of JCI ทำให้กรุงเทพฯ รู้สึกเชื่อมโยงกับสิ่งที่ใหญ่กว่ามากในระดับสากล ในขณะเดียวกันก็ยังคงลงมือทำในท้องถิ่นของเรา",
  "Led collaboration with visiting delegates and regional partners.": "นำทีมประสานงานร่วมกับผู้แทนที่มาเยือนและพันธมิตรในภูมิภาค",

  // Board Members
  "Pimnara L.": "พิมนารา แอล.",
  "Local President": "นายกสมาคมปี 2026",
  "Strategy and partnerships": "กลยุทธ์และพันธมิตร",
  "Leads the yearly chapter direction, external relations, and board alignment.": "นำทางทิศทางประจำปีของสมาคม ความสัมพันธ์ภายนอก และการประสานงานของคณะกรรมการ",
  
  "Thanawat C.": "ธนวัฒน์ ซี.",
  "Executive Vice President": "รองนายกสมาคมฝ่ายบริหาร",
  "Operations": "การดำเนินงาน",
  "Coordinates chapter execution across committees and annual goals.": "ประสานงานการดำเนินงานของสมาคมข้ามคณะทำงานและเป้าหมายประจำปี",
  
  "Kanya R.": "กันยา อาร์.",
  "Vice President for Membership": "รองนายกสมาคมฝ่ายสมาชิกภาพ",
  "Member development": "ฝ่ายพัฒนาสมาชิก",
  "Focuses on recruitment, onboarding, and tracking active member pathways.": "มุ่งเน้นการสรรหา ปฐมนิเทศ และติดตามเส้นทางการเรียนรู้ของสมาชิกภาพ",

  "Sarut T.": "ศรุต ที.",
  "Vice President for Projects": "รองนายกสมาคมฝ่ายโครงการ",
  "Civic projects": "โครงการเพื่อสังคม",
  "Oversees execution and partner coordination for major community events.": "ดูแลการดำเนินงานและการประสานงานพันธมิตรสำหรับกิจกรรมหลักของชุมชน",

  "Nutcha J.": "ณัฐชา เจ.",
  "Secretary General": "เลขาธิการ",
  "Governance and communication": "การกำกับดูแลและการสื่อสาร",
  "Manages chapter documentation, communications, and administrative compliance.": "จัดการเอกสารของสมาคม การสื่อสาร และการปฏิบัติตามกฎระเบียบการบริหารงาน",

  "Chaiwat S.": "ชัยวัฒน์ เอส.",
  "Treasurer": "เหรัญญิก",
  "Finance": "การเงิน",
  "Manages chapter accounts, budget tracking, and corporate filings.": "จัดการบัญชีของสมาคม ติดตามงบประมาณ และยื่นเอกสารทางการเงินของนิติบุคคล",

  "Lead forward, build local trust.": "นำพาไปข้างหน้า สร้างความไว้วางใจในท้องถิ่น",
  "A board focused on member growth, stronger partnerships, and visible project delivery in Bangkok.": "คณะกรรมการที่มุ่งเน้นการเติบโตของสมาชิก พันธมิตรที่เข้มแข็ง และการส่งมอบโครงการที่จับต้องได้ในกรุงเทพฯ",

  // Partners
  "Global Sponsor A": "ผู้สนับสนุนระดับโลก A",
  "Local Partner B": "พันธมิตรท้องถิ่น B",
  "Embassy Partner C": "พันธมิตรสถานทูต C",
  "University D": "มหาวิทยาลัย D",
  "Community Sponsor E": "ผู้สนับสนุนชุมชน E",

  // General Settings
  "JCI Bangkok": "JCI กรุงเทพฯ",
  "© 2026 JCI Bangkok. All Rights Reserved.": "© 2026 JCI กรุงเทพฯ สงวนลิขสิทธิ์ทั้งหมด"
}

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

function t(text: string): { en: string; th: string } {
  return {
    en: text,
    th: TRANSLATIONS[text] || text,
  }
}

function toRichTextLocalized(text: string) {
  return {
    en: toRichText(text),
    th: toRichText(TRANSLATIONS[text] || text),
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
  console.log('Starting Payload CMS seeding with localized data...')
  
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
        locale: 'all',
        data: {
          title: t(event.title),
          slug: event.slug,
          eventDate: parseDate(event.date),
          venue: t(event.venue),
          eventType: eventTypeMap[event.type] || 'training',
          shortDescription: t(event.summary),
          fullDescription: toRichTextLocalized(event.highlight),
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
        locale: 'all',
        data: {
          title: t(project.title),
          slug: project.slug,
          year: parseInt(project.year) || 2026,
          category: categoryMap[project.category] || 'community',
          problemStatement: t(project.summary),
          targetBeneficiaries: t(project.beneficiaries),
          activities: toRichTextLocalized(project.impact),
          outcomes: toRichTextLocalized('Successful execution with target objectives met.'),
          impactNumbers: [
            { value: '100+', label: t('Participants') },
            { value: '5+', label: t('Partner Organizations') },
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
        locale: 'all',
        data: {
          title: t(article.title),
          slug: article.slug,
          author: adminUser.id,
          category: categoryMap[article.category] || 'news',
          coverImage: coverImageId,
          summary: t(article.summary),
          body: toRichTextLocalized(article.summary),
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
      })

      // Check if this specific name is already in the list
      const memberExists = existing.docs.some(doc => {
        const docName = typeof doc.name === 'object' ? doc.name.en : doc.name
        return docName === member.name
      })

      if (!memberExists) {
        // Use member story image as fallback
        const photoId = mediaDocs['member-story.png']
          ? mediaDocs['member-story.png'].id
          : getFallbackMediaId()

        await payload.create({
          collection: 'board-members',
          locale: 'all',
          data: {
            name: t(member.name),
            position: t(member.role),
            year: parseInt(yearEntry.year),
            photo: photoId,
            bio: toRichTextLocalized(member.bio),
            companyRole: t(member.company),
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
    })

    const storyExists = existing.docs.some(doc => {
      const docName = typeof doc.memberName === 'object' ? doc.memberName.en : doc.memberName
      return docName === story.name
    })

    if (!storyExists) {
      const photoId = mediaDocs['member-story.png']
        ? mediaDocs['member-story.png'].id
        : getFallbackMediaId()

      await payload.create({
        collection: 'member-stories',
        locale: 'all',
        data: {
          memberName: t(story.name),
          yearJoined: parseInt(story.yearJoined) || 2024,
          chapterRole: t(story.role),
          storyTitle: t(story.highlight),
          quote: t(story.quote),
          fullStory: toRichTextLocalized(story.quote),
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
    })

    const partnerExists = existing.docs.some(doc => {
      const docOrgName = typeof doc.organizationName === 'object' ? doc.organizationName.en : doc.organizationName
      return docOrgName === partnerName
    })

    if (!partnerExists) {
      const logoId = mediaDocs['ux-concept.png']
        ? mediaDocs['ux-concept.png'].id
        : getFallbackMediaId()

      await payload.create({
        collection: 'partners',
        locale: 'all',
        data: {
          organizationName: t(partnerName),
          logo: logoId,
          partnerType: partnerName.includes('Sponsor') ? 'sponsor' : 'partner',
          partnershipYear: 2026,
          description: t(`Seeded partner: ${partnerName}`),
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
    locale: 'all',
    data: {
      siteName: t('JCI Bangkok'),
      currentYearTheme: t(seedBoardYears[0]?.theme || 'Lead forward, build local trust.'),
      footerText: t('© 2026 JCI Bangkok. All Rights Reserved.'),
    },
  })
  console.log('Global Site Settings updated.')

  console.log('Seeding process completed successfully!')
  process.exit(0)
}

run().catch((err) => {
  console.error('Seeding failed:')
  console.dir(err, { depth: null })
  process.exit(1)
})

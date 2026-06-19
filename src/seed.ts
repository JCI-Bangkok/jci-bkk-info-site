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

  // Clean existing data to allow fresh seed
  console.log('Cleaning existing data (except users)...')
  await payload.delete({ collection: 'events', where: { id: { exists: true } } })
  await payload.delete({ collection: 'projects', where: { id: { exists: true } } })
  await payload.delete({ collection: 'articles', where: { id: { exists: true } } })
  await payload.delete({ collection: 'board-members', where: { id: { exists: true } } })
  await payload.delete({ collection: 'member-stories', where: { id: { exists: true } } })
  await payload.delete({ collection: 'partners', where: { id: { exists: true } } })
  await payload.delete({ collection: 'media', where: { id: { exists: true } } })

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

    // A. Create in English
    const doc = await payload.create({
      collection: 'events',
      locale: 'en',
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

    // B. Update in Thai
    await payload.update({
      collection: 'events',
      id: doc.id,
      locale: 'th',
      data: {
        title: TRANSLATIONS[event.title] || event.title,
        venue: TRANSLATIONS[event.venue] || event.venue,
        shortDescription: TRANSLATIONS[event.summary] || event.summary,
        fullDescription: toRichText(TRANSLATIONS[event.highlight] || event.highlight),
      },
    })

    createdEvents[event.slug] = doc as unknown as SeedEvent
    console.log(`Created Event: ${event.title}`)
  }

  // 4. Seed Projects
  console.log('Seeding Projects...')
  const createdProjects: Record<string, any> = {}
  for (const project of seedProjects) {
    const categoryMap: Record<string, string> = {
      'Youth Development': 'youth',
      'Sustainability': 'sustainability',
      'Entrepreneurship': 'entrepreneurship',
      'Community Impact': 'community',
      'International Cooperation': 'international',
    }

    // A. Create in English
    const doc = await payload.create({
      collection: 'projects',
      locale: 'en',
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

    // B. Update in Thai
    await payload.update({
      collection: 'projects',
      id: doc.id,
      locale: 'th',
      data: {
        title: TRANSLATIONS[project.title] || project.title,
        problemStatement: TRANSLATIONS[project.summary] || project.summary,
        targetBeneficiaries: TRANSLATIONS[project.beneficiaries] || project.beneficiaries,
        activities: toRichText(TRANSLATIONS[project.impact] || project.impact),
        outcomes: toRichText(TRANSLATIONS['Successful execution with target objectives met.'] || 'Successful execution with target objectives met.'),
        impactNumbers: [
          { value: '100+', label: TRANSLATIONS['Participants'] || 'Participants' },
          { value: '5+', label: TRANSLATIONS['Partner Organizations'] || 'Partner Organizations' },
        ],
      },
    })

    createdProjects[project.slug] = doc
    console.log(`Created Project: ${project.title}`)
  }

  // 5. Seed Articles
  console.log('Seeding Articles...')
  for (const article of seedArticles) {
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

    // A. Create in English
    const doc = await payload.create({
      collection: 'articles',
      locale: 'en',
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

    // B. Update in Thai
    await payload.update({
      collection: 'articles',
      id: doc.id,
      locale: 'th',
      data: {
        title: TRANSLATIONS[article.title] || article.title,
        summary: TRANSLATIONS[article.summary] || article.summary,
        body: toRichText(TRANSLATIONS[article.summary] || article.summary),
      },
    })

    console.log(`Created Article: ${article.title}`)
  }

  // 6. Seed Board Members
  console.log('Seeding Board Members...')
  for (const yearEntry of seedBoardYears) {
    for (const member of yearEntry.members) {
      // Use member story image as fallback
      const photoId = mediaDocs['member-story.png']
        ? mediaDocs['member-story.png'].id
        : getFallbackMediaId()

      // A. Create in English
      const doc = await payload.create({
        collection: 'board-members',
        locale: 'en',
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

      // B. Update in Thai
      await payload.update({
        collection: 'board-members',
        id: doc.id,
        locale: 'th',
        data: {
          name: TRANSLATIONS[member.name] || member.name,
          position: TRANSLATIONS[member.role] || member.role,
          bio: toRichText(TRANSLATIONS[member.bio] || member.bio),
          companyRole: TRANSLATIONS[member.company] || member.company,
        },
      })

      console.log(`Created Board Member: ${member.name} for ${yearEntry.year}`)
    }
  }

  // 7. Seed Member Stories
  console.log('Seeding Member Stories...')
  for (const story of seedStories) {
    const photoId = mediaDocs['member-story.png']
      ? mediaDocs['member-story.png'].id
      : getFallbackMediaId()

    // A. Create in English
    const doc = await payload.create({
      collection: 'member-stories',
      locale: 'en',
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

    // B. Update in Thai
    await payload.update({
      collection: 'member-stories',
      id: doc.id,
      locale: 'th',
      data: {
        memberName: TRANSLATIONS[story.name] || story.name,
        chapterRole: TRANSLATIONS[story.role] || story.role,
        storyTitle: TRANSLATIONS[story.highlight] || story.highlight,
        quote: TRANSLATIONS[story.quote] || story.quote,
        fullStory: toRichText(TRANSLATIONS[story.quote] || story.quote),
      },
    })

    console.log(`Created Member Story for: ${story.name}`)
  }

  // 8. Seed Partners
  console.log('Seeding Partners...')
  for (const partnerName of seedPartners) {
    const logoId = mediaDocs['ux-concept.png']
      ? mediaDocs['ux-concept.png'].id
      : getFallbackMediaId()

    // A. Create in English
    const doc = await payload.create({
      collection: 'partners',
      locale: 'en',
      data: {
        organizationName: partnerName,
        logo: logoId,
        partnerType: partnerName.includes('Sponsor') ? 'sponsor' : 'partner',
        partnershipYear: 2026,
        description: `Seeded partner: ${partnerName}`,
      },
    })

    // B. Update in Thai
    await payload.update({
      collection: 'partners',
      id: doc.id,
      locale: 'th',
      data: {
        organizationName: TRANSLATIONS[partnerName] || partnerName,
        description: TRANSLATIONS[`Seeded partner: ${partnerName}`] || `Seeded partner: ${partnerName}`,
      },
    })

    console.log(`Created Partner: ${partnerName}`)
  }

  // 9. Global Site Settings
  console.log('Updating Global Site Settings...')
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'en',
    data: {
      siteName: 'JCI Bangkok',
      currentYearTheme: seedBoardYears[0]?.theme || 'Lead forward, build local trust.',
      footerText: '© 2026 JCI Bangkok. All Rights Reserved.',
    },
  })

  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'th',
    data: {
      siteName: TRANSLATIONS['JCI Bangkok'] || 'JCI Bangkok',
      currentYearTheme: TRANSLATIONS[seedBoardYears[0]?.theme || 'Lead forward, build local trust.'] || (seedBoardYears[0]?.theme || 'Lead forward, build local trust.'),
      footerText: TRANSLATIONS['© 2026 JCI Bangkok. All Rights Reserved.'] || '© 2026 JCI Bangkok. All Rights Reserved.',
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

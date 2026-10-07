import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { Locale } from './i18n'

export const locales = ['en', 'th'] as const
export function validLocale(locale: string): Locale {
  if (locale !== 'en' && locale !== 'th') notFound()
  return locale
}

// Use the canonical production origin even on preview deployments.
export function siteOrigin() {
  const url = new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.jcibangkok.org')
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('NEXT_PUBLIC_SERVER_URL must be an HTTP(S) URL')
  return url.origin
}
export function absoluteUrl(path: string) { return new URL(path, siteOrigin()).toString() }
export function localizedPath(locale: string, path = '') { return `/${locale}${path}` }

export function pageMetadata(locale: string, path: string, title: string, description: string, image = '/images/home/hero-cover.jpg', article?: { publishedTime: string; modifiedTime?: string }): Metadata {
  validLocale(locale)
  const url = absoluteUrl(localizedPath(locale, path))
  const fullTitle = `${title} | JCI Bangkok`
  return {
    title: { absolute: fullTitle }, description,
    alternates: {
      canonical: url,
      languages: { en: absoluteUrl(localizedPath('en', path)), th: absoluteUrl(localizedPath('th', path)), 'x-default': absoluteUrl(localizedPath('en', path)) },
    },
    openGraph: {
      title: fullTitle, description, url, siteName: 'JCI Bangkok',
      locale: locale === 'th' ? 'th_TH' : 'en_US', alternateLocale: [locale === 'th' ? 'en_US' : 'th_TH'],
      images: [{ url: absoluteUrl(image), alt: title }],
      ...(article ? { type: 'article', ...article } : { type: 'website' }),
    },
    twitter: { card: 'summary_large_image', title: fullTitle, description, images: [absoluteUrl(image)] },
  }
}

const copy = {
  en: {
    home: ['Young Leaders, Networking & Community Impact', 'Join JCI Bangkok, a local chapter of JCI Thailand. Develop leadership skills, connect with young professionals and take part in community projects in Bangkok.'],
    about: ['About Our Bangkok Leadership Community', 'Learn about JCI Bangkok and our mission to develop young leaders through leadership training, business networking, international cooperation and community action.'],
    events: ['Bangkok Events, Workshops & Chapter Updates', 'Explore JCI Bangkok events, leadership workshops, business networking, community projects and chapter news. Find dates, venues and registration details.'],
    members: ['Members & Board of Directors', 'Meet the JCI Bangkok board of directors and read member stories. Discover the people behind our leadership programs and community projects.'],
    membership: ['Join Our Young Leaders Community', 'Become a JCI Bangkok member. Explore leadership development, business networking, international connections and opportunities to contribute to community projects.'],
    contact: ['Contact & Partnership Enquiries', 'Contact JCI Bangkok about membership, events, volunteering and partnerships. Connect with our team to get involved in leadership and community initiatives.'],
    photobomb: ['PhotoBomb: Event & Community Photo Gallery', 'Explore photos from JCI Bangkok events and community projects. See members in action through our chapter photo gallery.'],
  },
  th: {
    home: ['เครือข่ายผู้นำรุ่นใหม่และกิจกรรมเพื่อสังคม', 'ร่วมกับ JCI Bangkok เครือข่ายผู้นำรุ่นใหม่ในกรุงเทพฯ พัฒนาทักษะความเป็นผู้นำ สร้างเครือข่ายธุรกิจ และร่วมโครงการเพื่อชุมชนภายใต้ JCI Thailand'],
    about: ['เกี่ยวกับเครือข่ายผู้นำรุ่นใหม่ในกรุงเทพฯ', 'รู้จัก JCI Bangkok และพันธกิจในการพัฒนาผู้นำรุ่นใหม่ ผ่านการฝึกอบรม เครือข่ายธุรกิจ ความร่วมมือนานาชาติ และกิจกรรมเพื่อสังคม'],
    events: ['กิจกรรม อบรม และข่าวสารในกรุงเทพฯ', 'ติดตามกิจกรรม JCI Bangkok การอบรมผู้นำ เครือข่ายธุรกิจ โครงการเพื่อสังคม และข่าวสาร พร้อมรายละเอียดวันเวลา สถานที่ และการสมัครเข้าร่วม'],
    members: ['สมาชิกและคณะกรรมการบริหาร', 'รู้จักคณะกรรมการบริหาร JCI Bangkok และเรื่องราวสมาชิก ผู้ร่วมขับเคลื่อนการพัฒนาผู้นำรุ่นใหม่และโครงการเพื่อชุมชน'],
    membership: ['สมัครสมาชิกเครือข่ายผู้นำรุ่นใหม่', 'สมัครสมาชิก JCI Bangkok เพื่อพัฒนาความเป็นผู้นำ สร้างเครือข่ายธุรกิจ เชื่อมต่อเพื่อนนานาชาติ และร่วมสร้างผลกระทบเชิงบวกให้ชุมชน'],
    contact: ['ติดต่อและร่วมเป็นพันธมิตร', 'ติดต่อ JCI Bangkok เพื่อสอบถามการสมัครสมาชิก กิจกรรม การเป็นอาสาสมัคร และความร่วมมือกับพันธมิตรเพื่อพัฒนาผู้นำและชุมชน'],
    photobomb: ['PhotoBomb: ภาพกิจกรรมและโครงการเพื่อสังคม', 'ชมภาพกิจกรรมและโครงการเพื่อชุมชนของ JCI Bangkok พบกับบรรยากาศการทำงานร่วมกันและการมีส่วนร่วมของสมาชิก'],
  },
} satisfies Record<Locale, Record<string, [string, string]>>
export function staticMetadata(locale: string, page: keyof typeof copy.en) {
  const language = validLocale(locale)
  const [title, description] = copy[language][page]
  return pageMetadata(language, page === 'home' ? '' : `/${page}`, title, description)
}

import { absoluteUrl } from '@/lib/seo'
import { StructuredData } from '@/components/structured-data'
import { cmsStaticMetadata } from '@/lib/cms-seo'
import Image from "next/image";
import Link from "next/link";
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { opportunities } from "@/lib/site-data";
import { getDictionary, Locale } from "@/lib/i18n";
import { getActivities, mediaUrl } from '@/lib/activity-data'
import { EventCalendar } from '@/components/event-calendar'
import { SocialLinks } from '@/components/social-links'
import { PartnerMarquee } from '@/components/partner-marquee'
import { getPublishedTemplate } from '@/lib/templates'

export const revalidate = 300

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 20 20" fill="none">
      <path d="M4 10h11M11 6l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2 text-sm font-semibold text-[var(--jci-blue)]">
      {children}
      <Arrow className="h-5 w-5 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const dict = getDictionary(locale)
  const payload = await getPayload({ config: configPromise })
  const [{ activities, today }, settings, storiesResult, partnersResult] = await Promise.all([
    getActivities(locale),
    payload.findGlobal({ slug: 'site-settings', locale }),
    payload.find({ collection: 'member-stories', locale, limit: 2 }),
    payload.find({ collection: 'partners', locale, limit: 20, sort: '-partnershipYear' }),
  ])

  const template = await getPublishedTemplate('home').catch(() => null)
  if (template?.puckLayout && (template.puckLayout as any).content?.length > 0) {
    const { PuckRenderer } = await import('@/components/builder/PuckRenderer')
    return <PuckRenderer data={template.puckLayout as any} documentData={{ activities, today, settings, storiesResult, partnersResult, currentLocale: locale }} />
  }

  const pageResult = await payload.find({
    collection: 'pages',
    where: {
      slug: { equals: 'home' },
      status: { equals: 'published' },
    },
    limit: 1,
  })
  const pageDoc = pageResult.docs[0]
  if (pageDoc?.puckLayout && (pageDoc.puckLayout as any).content?.length > 0) {
    const { PuckRenderer } = await import('@/components/builder/PuckRenderer')
    return <PuckRenderer data={pageDoc.puckLayout as any} documentData={{ activities, today, settings, storiesResult, partnersResult, currentLocale: locale }} />
  }

  const homePartners = [...partnersResult.docs]
  const dindeepromIndex = homePartners.findIndex(p => p.organizationName === 'ดินดีพร้อม')
  if (dindeepromIndex > -1) {
    const [dindeeprom] = homePartners.splice(dindeepromIndex, 1)
    homePartners.unshift(dindeeprom)
  }
  const stories = storiesResult.docs.filter(s => s.memberName.includes("Nattapat"))

  const pathways = dict.home.pathways.map((pathway, index) => ({ ...pathway, number: String(index + 1).padStart(2, '0') }))
  const sponsorCTA = locale === 'th' ? 'ร่วมเป็นผู้สนับสนุน' : 'Become a Sponsor'

  // Localize opportunities
  const localizedOpportunities = opportunities.map((opp, idx) => {
    const thOpp = [
      {
        title: "การพัฒนาภาวะผู้นำ",
        summary: "โอกาสในการลงมือปฏิบัติจริงเพื่อนำคณะทำงาน ขับเคลื่อนโปรแกรม และสร้างความมั่นใจผ่านประสบการณ์ตรง",
        accent: "สำหรับพลเมืองตื่นรู้รุ่นใหม่",
        stat: "อายุระหว่าง 18-40 ปี"
      },
      {
        title: "ธุรกิจและการเป็นผู้ประกอบการ",
        summary: "เครือข่ายสำหรับคนทำงานรุ่นใหม่และผู้ก่อตั้งธุรกิจที่ต้องการพัฒนาการสื่อสาร สร้างคอนเนคชัน และเติบโตอย่างมีความรับผิดชอบ",
        accent: "ธุรกิจ, สังคม และความคิดสร้างสรรค์",
        stat: "หลากหลายภาคส่วน"
      },
      {
        title: "ความร่วมมือระหว่างประเทศ",
        summary: "เชื่อมต่อกับสาขาของ JCI องค์กรระดับชาติ และกิจกรรมระดับโลกเพื่อเปิดมุมมองและสร้างความร่วมมือ",
        accent: "เครือข่าย JCI ระดับโลก",
        stat: "กว่า 100 ประเทศ"
      },
      {
        title: "ผลกระทบต่อสังคม",
        summary: "โครงการที่ลงรากฐานในกรุงเทพฯ ซึ่งเปลี่ยนไอเดียให้เป็นผลลัพธ์ที่วัดผลได้สำหรับชุมชน พันธมิตร และผู้นำในอนาคต",
        accent: "มุ่งเน้นผลลัพธ์เพื่อชุมชน",
        stat: "สร้างผลลัพธ์ที่วัดผลได้"
      }
    ][idx];

    return {
      title: locale === 'th' ? thOpp.title : opp.title,
      summary: locale === 'th' ? thOpp.summary : opp.summary,
      accent: locale === 'th' ? thOpp.accent : opp.accent,
      stat: locale === 'th' ? thOpp.stat : opp.stat
    }
  });

  const opportunityImages = [
    settings?.homePathway1 ? (mediaUrl(settings.homePathway1) || "/images/home/pathway-leadership.jpg") : "/images/home/pathway-leadership.jpg",
    settings?.homePathway2 ? (mediaUrl(settings.homePathway2) || "/images/home/pathway-business.jpg") : "/images/home/pathway-business.jpg",
    settings?.homePathway3 ? (mediaUrl(settings.homePathway3) || "/images/home/pathway-international.jpg") : "/images/home/pathway-international.jpg",
    settings?.homePathway4 ? (mediaUrl(settings.homePathway4) || "/images/home/pathway-community.jpg") : "/images/home/pathway-community.jpg",
  ] as const;

  return (
    <>
      <StructuredData data={{ '@graph': [
        { '@type': 'Organization', '@id': absoluteUrl('/#organization'), name: 'JCI Bangkok', url: absoluteUrl(`/${locale}`), logo: absoluteUrl('/brand/footer-logo.png'), description: dict.home.heroSub, parentOrganization: { '@type': 'Organization', name: 'JCI Thailand' }, sameAs: Object.values(settings.socialLinks || {}).filter((value): value is string => typeof value === 'string' && /^https?:\/\//.test(value)) },
        { '@type': 'WebSite', '@id': absoluteUrl('/#website'), name: 'JCI Bangkok', url: absoluteUrl('/'), inLanguage: ['en', 'th'], publisher: { '@id': absoluteUrl('/#organization') } },
      ] }} />
      <section className="hero-grid relative overflow-hidden border-b border-[var(--line)] bg-white">
        <div className="hero-ripple" aria-hidden="true" />
        <div className="mx-auto grid min-h-[38rem] w-full max-w-[90rem] lg:grid-cols-[0.84fr_1.16fr]">
          <div className="relative z-10 flex flex-col justify-center px-5 py-16 sm:px-8 lg:px-14 lg:py-24 xl:px-20">
            <div className="max-w-[34rem]">
              <p className="text-[clamp(1.65rem,3vw,2.25rem)] font-semibold uppercase tracking-[0.1em] text-[var(--ink)]">
                {dict.home.heroTitlePrefix.trim()}
              </p>
              <h1 className="mt-3 max-w-[10ch] text-[clamp(5.85rem,10.5vw,10.2rem)] font-semibold leading-[0.9] tracking-[-0.06em] text-[var(--jci-blue)]">
                {dict.home.heroTitleHighlight.trim()}
              </h1>
              <p className="mt-7 text-[clamp(1.7rem,3.3vw,2.55rem)] font-medium leading-[1.1] text-[var(--ink)]">
                {dict.home.heroTitleSuffix.trim()}
              </p>
            </div>
            <p className="mt-7 max-w-xl text-lg leading-8 text-[var(--muted)]">
              {dict.home.heroSub}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/${locale}/membership`} className="button-primary group">
                {dict.nav.becomeMember} <Arrow className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href={`/${locale}/about`} className="button-secondary group">
                {dict.home.explore} <Arrow className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
          <div className="relative min-h-[25rem] overflow-hidden lg:min-h-full">
            <Image
              src={settings?.homeHeroImage ? (mediaUrl(settings.homeHeroImage) || "/images/home/hero-cover.jpg") : "/images/home/hero-cover.jpg"}
              alt="Young Bangkok professionals connecting at a community event beside the river"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover object-[62%_center]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/10 to-transparent lg:block" />
          </div>
        </div>
      </section>

      <section aria-labelledby="membership-steps-title" className="border-b border-[var(--line)] bg-[var(--paper-soft)]">
        <div className="mx-auto w-full max-w-7xl px-5 py-10 lg:px-8 lg:py-12">
          <div className="mb-8 flex flex-col gap-3 sm:max-w-3xl">
            <p className="section-label">{dict.nav.becomeMember}</p>
            <h2 id="membership-steps-title" className="text-3xl font-semibold leading-tight tracking-[-0.03em] text-[var(--ink)] sm:text-4xl">
              {dict.home.membershipStepsHeading}
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">
              {dict.home.membershipStepsSub}
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
          {pathways.map((pathway) => (
            <article key={pathway.title} className="grid gap-4 rounded-[1.5rem] border border-[var(--line)] bg-white p-5 shadow-[0_18px_45px_rgba(19,15,45,0.06)] sm:grid-cols-[5rem_1fr] sm:items-start sm:p-6">
              <div className="flex items-center gap-3 sm:block">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--paper-soft)] font-accent text-xl text-[var(--jci-blue)]">
                  {pathway.number}
                </div>
                <h3 className="text-lg font-semibold text-[var(--ink)] sm:hidden">{pathway.title}</h3>
              </div>
              <div>
                <h3 className="hidden text-lg font-semibold text-[var(--ink)] sm:block">{pathway.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  {pathway.detail}
                </p>
              </div>
            </article>
          ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Link href={`/${locale}/membership`} className="button-secondary">
              {dict.home.learnAboutUs}
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--line)] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
          <div className="mb-10 flex flex-col items-center text-center">
            <h2 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">{dict.home.pathwaysHeading}</h2>
            <p className="mt-3 max-w-2xl text-lg text-[var(--muted)]">{dict.home.pathwaysSub}</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:gap-10">
            {localizedOpportunities.map((opp, i) => (
              <article key={opp.title} className="group relative overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--paper-soft)] text-left transition-all">
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <Image src={opportunityImages[i]} alt={opp.title} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="flex flex-col p-6 sm:p-8">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--jci-blue)]">{opp.accent}</span>
                  <h3 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">{opp.title}</h3>
                  <p className="mt-3 leading-7 text-[var(--muted)]">{opp.summary}</p>
                  <p className="mt-6 text-sm font-semibold text-[var(--ink)]">{opp.stat}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-[var(--paper-soft)]">
        <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-3xl font-semibold">{locale === 'th' ? 'กิจกรรมและโครงการ' : 'Events & Projects'}</h2>
            <TextLink href={`/${locale}/events`}>{dict.home.viewAllEvents}</TextLink>
          </div>
          <EventCalendar events={activities.filter(item => item.kind === 'event')} locale={locale} today={today} />
        </div>
      </section>

      {stories.length > 0 && stories.map((featuredStory, idx) => {
        const storyImageUrl = mediaUrl(featuredStory?.photo) || (settings?.memberStoryFallback ? mediaUrl(settings.memberStoryFallback) : null) || "/images/home/member-story.png"
        return (
          <section key={idx} className="member-story overflow-hidden bg-[var(--paper-tint)] border-b border-[var(--line)]">
            <div className={`mx-auto grid w-full max-w-[90rem] lg:grid-cols-[0.92fr_1.08fr] ${idx % 2 === 1 ? 'lg:grid-cols-[1.08fr_0.92fr]' : ''}`}>
              <div className={`relative flex min-h-[22rem] flex-col justify-center px-5 py-16 sm:px-10 lg:px-20 lg:order-2 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                <span className="font-accent text-7xl leading-none text-[var(--jci-blue)]">&ldquo;</span>
                <blockquote className="font-accent max-w-3xl text-2xl leading-[1.35] text-[var(--ink)] sm:text-3xl">{featuredStory.quote}</blockquote>
                <div className="mt-8 border-l-2 border-[var(--jci-blue)] pl-4">
                  <p className="font-semibold text-[var(--ink)]">{featuredStory.memberName}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{featuredStory.chapterRole} • {locale === 'th' ? 'เข้าร่วมเมื่อปี' : 'Joined'} {featuredStory.yearJoined}</p>
                </div>
              </div>
              <div className={`relative min-h-[22rem] lg:min-h-full lg:order-1 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                {storyImageUrl && (
                  <Image
                    src={storyImageUrl}
                    alt={featuredStory.memberName}
                    fill
                    sizes="(max-width: 1024px) 100vw, 46vw"
                    className="object-cover object-center"
                  />
                )}
              </div>
            </div>
          </section>
        )
      })}
      
<section className="bg-[var(--paper-soft)] overflow-hidden">
        <div className="mx-auto max-w-7xl px-5 pt-16 pb-2 lg:px-8 text-center flex flex-col items-center">
          <p className="text-sm font-semibold text-[var(--jci-blue)]">{locale === 'th' ? 'ผู้สนับสนุนและพันธมิตร' : 'Sponsorship / Partners'}</p>
          <h2 className="mt-2 text-3xl font-semibold">{locale === 'th' ? 'ร่วมสร้างโอกาสไปด้วยกัน' : 'Build opportunities with us.'}</h2>
          <p className="mt-3 max-w-xl text-base leading-6 text-[var(--muted)]">{locale === 'th' ? 'ร่วมสนับสนุนโครงการและกิจกรรมเพื่อพัฒนาคนรุ่นใหม่ในกรุงเทพฯ' : 'Partner with JCI Bangkok to support projects and opportunities for young people.'}</p>
          <Link href={`/${locale}/contact#inquiry`} className="button-primary mt-6">{sponsorCTA}</Link>
        </div>
        <div className="w-full relative pb-16 pt-4">
          <PartnerMarquee partners={homePartners as any} locale={locale} />
        </div>
      </section>
      
      <section className="border-t border-[var(--line)]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-5 py-8 lg:px-8">
          <h2 className="text-xl font-semibold">{locale === 'th' ? 'ติดตาม JCI Bangkok' : 'Follow JCI Bangkok'}</h2>
          <SocialLinks links={settings.socialLinks} />
        </div>
      </section>
      <section className="relative overflow-hidden bg-[var(--jci-blue)] text-white">
        <div className="cta-ripple" aria-hidden="true" />
        <div className="relative mx-auto flex w-full max-w-7xl flex-col justify-between gap-8 px-5 py-16 sm:flex-row sm:items-center lg:px-8">
          <div>
            <h2 className="max-w-2xl text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
              {locale === 'th' ? 'ร่วมเป็นส่วนหนึ่งของสิ่งที่ยิ่งใหญ่กว่า' : 'Be part of something bigger.'}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/80">
              {locale === 'th' 
                ? 'สมัครสมาชิก JCI Bangkok วันนี้เพื่อเริ่มต้นพัฒนาทักษะความเป็นผู้นำของคุณผ่านการลงมือทำ การเชื่อมต่อเครือข่าย และการรับใช้สังคม' 
                : 'Join JCI Bangkok and start building your leadership through action, connection, and service.'}
            </p>
          </div>
          <Link href={`/${locale}/membership`} className="group inline-flex w-fit items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[var(--jci-blue)] transition hover:bg-[var(--jci-black)] hover:text-white">
            {dict.nav.becomeMember} <Arrow className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return cmsStaticMetadata(locale, 'home')
}

import 'server-only'
// Original page layout preserved from Git commit 8410ea1. CMS data stays live.
import { cmsStaticMetadata } from '@/lib/cms-seo'
import { getDictionary, type Locale } from '@/lib/i18n'
import Image from 'next/image'
import Link from 'next/link'

import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { mediaUrl } from '@/lib/media'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return cmsStaticMetadata(locale, 'about')
}

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const dict = getDictionary(locale)
  const payload = await getPayload({ config: configPromise })
  const settings = await payload.findGlobal({ slug: 'site-settings', locale }).catch(() => null)
  
  return (
    <>
      <section className="relative overflow-hidden bg-[var(--jci-black)] text-white border-b border-white/10">
        <div className="absolute inset-0 opacity-20">
          <Image src={settings?.aboutCoverImage ? (mediaUrl(settings.aboutCoverImage) || "/images/home/hero-cover.jpg") : "/images/home/hero-cover.jpg"} alt="JCI Bangkok" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--jci-black)] to-transparent" />
        
        <div className="relative mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-32">
          <h1 className="text-4xl lg:text-6xl font-semibold tracking-tight">{dict.about.title}</h1>
          <p className="mt-6 max-w-2xl text-lg text-white/80 leading-relaxed">
            {dict.about.intro}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2">
          
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-semibold text-[var(--ink)] border-b border-[var(--line)] pb-4 mb-6">
                {dict.about.historyTitle}
              </h2>
              <p className="text-lg leading-8 text-[var(--muted)]">
                {dict.about.historyText}
              </p>
              
              <div className="mt-8 flex flex-col gap-4">
                <a href="https://www.jci.cc" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-xl border border-[var(--line)] hover:border-[var(--jci-blue)] hover:bg-[var(--jci-blue)]/5 transition group">
                  <div className="w-12 h-12 bg-[var(--paper-soft)] rounded-lg flex items-center justify-center shrink-0 group-hover:bg-white transition">
                    <svg className="w-6 h-6 text-[var(--jci-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--ink)] group-hover:text-[var(--jci-blue)] transition">Junior Chamber International (JCI)</p>
                    <p className="text-sm text-[var(--muted)]">{locale === 'th' ? 'เว็บไซต์หลัก JCI ระดับโลก' : 'Global JCI Website'}</p>
                  </div>
                </a>
                
                <a href="https://www.jcithailand.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-xl border border-[var(--line)] hover:border-[var(--jci-blue)] hover:bg-[var(--jci-blue)]/5 transition group">
                  <div className="w-12 h-12 bg-[var(--paper-soft)] rounded-lg flex items-center justify-center shrink-0 group-hover:bg-white transition">
                    <svg className="w-6 h-6 text-[var(--jci-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--ink)] group-hover:text-[var(--jci-blue)] transition">JCI Thailand</p>
                    <p className="text-sm text-[var(--muted)]">{locale === 'th' ? 'เว็บไซต์ประจำประเทศไทย' : 'National Organization Website'}</p>
                  </div>
                </a>
                
                <a href="https://apicc.net" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-xl border border-[var(--line)] hover:border-[var(--jci-blue)] hover:bg-[var(--jci-blue)]/5 transition group">
                  <div className="w-12 h-12 bg-[var(--paper-soft)] rounded-lg flex items-center justify-center shrink-0 group-hover:bg-white transition">
                    <svg className="w-6 h-6 text-[var(--jci-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--ink)] group-hover:text-[var(--jci-blue)] transition">APICC</p>
                    <p className="text-sm text-[var(--muted)]">{locale === 'th' ? 'เครือข่ายความร่วมมือระดับภูมิภาคเอเชียแปซิฟิก' : 'Asia Pacific Inter-City Conference'}</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-6">
            <div className="p-10 bg-white shadow-xl shadow-[var(--jci-blue)]/5 rounded-[2rem] border border-[var(--line)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 text-9xl text-[var(--jci-blue)]/10 leading-none font-serif select-none pointer-events-none">&ldquo;</div>
              <h3 className="text-2xl font-semibold text-[var(--ink)]">{locale === 'th' ? 'ปณิธาน JCI (JCI Creed)' : 'JCI Creed'}</h3>
              <div className="mt-6 text-[15px] italic leading-relaxed text-[var(--muted)] space-y-3 relative z-10">
                <p>We believe . . .</p>
                <p>That faith in God gives meaning and purpose to human life;</p>
                <p>That the brotherhood of man transcends the sovereignty of nations;</p>
                <p>That economic justice can best be won by free men through free enterprise;</p>
                <p>That government should be of laws rather than of men;</p>
                <p>That earth&rsquo;s great treasure lies in human personality;</p>
                <p className="font-semibold text-[var(--jci-blue)] not-italic mt-6 pt-6 border-t border-[var(--line)] text-lg">And that service to humanity is the best work of life.</p>
              </div>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6 mt-2">
              <div className="p-8 bg-[var(--paper-soft)] rounded-3xl border border-[var(--line)] flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-[var(--ink)]">{locale === 'th' ? 'พันธกิจ (JCI Mission)' : 'JCI Mission'}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[var(--muted)]">To provide leadership development opportunities that empower young people to create positive change.</p>
              </div>
              <div className="p-8 bg-[var(--paper-soft)] rounded-3xl border border-[var(--line)] flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-[var(--ink)]">{locale === 'th' ? 'วิสัยทัศน์ (JCI Vision)' : 'JCI Vision'}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[var(--muted)]">To be the foremost global network of young leaders.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--paper-soft)] border-t border-[var(--line)] py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 text-center">
          <h2 className="text-3xl font-semibold text-[var(--ink)] mb-6">{dict.about.structureTitle}</h2>
          <p className="max-w-3xl mx-auto text-lg leading-8 text-[var(--muted)] mb-10">
            {dict.about.structureText}
          </p>
          <Link href={`/${locale}/members/board/2026`} className="button-primary inline-flex items-center gap-2">
            {locale === 'th' ? 'ทำความรู้จักคณะกรรมการของเรา' : 'Meet our Board of Directors'}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
      </section>
    </>
  )
}


import Link from "next/link";
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { PageIntro } from "@/components/page-intro";
import React from 'react'
import { getDictionary, Locale } from "@/lib/i18n";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    title: locale === 'th' ? 'กิจกรรม' : 'Events'
  };
}

const eventTypeLabelsTh: Record<string, string> = {
  training: 'การฝึกอบรมและพัฒนา',
  networking: 'ธุรกิจและการสร้างเครือข่าย',
  community: 'โครงการเพื่อชุมชน',
  general: 'การประชุมทั่วไป',
  international: 'กิจกรรมระดับนานาชาติ',
  partner: 'กิจกรรมร่วมกับพันธมิตร',
}

const eventTypeLabelsEn: Record<string, string> = {
  training: 'Training & Development',
  networking: 'Business & Networking',
  community: 'Community Project',
  general: 'General Meeting',
  international: 'International Event',
  partner: 'Partner Event',
}

function formatDate(dateStr: string, locale: string) {
  const code = locale === 'th' ? 'th-TH' : 'en-US'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString(code, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function EventsPage({ params }: PageProps) {
  const { locale } = await params
  const dict = getDictionary(locale as Locale)
  const payload = await getPayload({ config: configPromise })
  
  const result = await payload.find({
    collection: 'events',
    locale,
    limit: 100,
    sort: '-eventDate',
  })
  
  const upcoming = result.docs.filter((event) => event.status === "upcoming");
  const completed = result.docs.filter((event) => event.status === "completed");
  const eventTypeLabels = locale === 'th' ? eventTypeLabelsTh : eventTypeLabelsEn

  return (
    <>
      <PageIntro
        title={locale === 'th' ? 'กิจกรรมที่ขับเคลื่อนสมาคมให้เติบโต' : 'Events that keep the chapter visible and active.'}
        lead={locale === 'th' ? 'ตั้งแต่กิจกรรมฝึกอบรม การสร้างเครือข่ายธุรกิจ ไปจนถึงโครงการพัฒนาชุมชนและความร่วมมือระหว่างประเทศ กิจกรรมต่างๆ จะช่วยให้เข้าใจวิถีชีวิตและการลงมือทำจริงของ JCI กรุงเทพฯ' : 'From training and networking to community projects and international opportunities, the event section should help visitors understand how JCI Bangkok shows up in real life.'}
      />
      <section className="section-space mx-auto w-full max-w-7xl px-5 lg:px-8">
        <div className="space-y-12">
          {upcoming.length > 0 && (
            <div>
              <h2 className="font-display text-4xl leading-none text-[var(--ink)]">
                {dict.events.upcoming}
              </h2>
              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                {upcoming.map((event) => (
                  <article key={event.slug} className="paper-frame p-6">
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                      <span>{eventTypeLabels[event.eventType] || event.eventType}</span>
                      <span>{formatDate(event.eventDate, locale)}</span>
                    </div>
                    <h3 className="mt-5 font-display text-4xl leading-none text-[var(--ink)]">
                      {event.title}
                    </h3>
                    <p className="mt-5 text-base leading-7 text-[var(--muted)]">
                      {event.shortDescription}
                    </p>
                    <p className="mt-4 text-sm font-semibold text-[var(--ink)]">
                      {event.venue}
                    </p>
                    <Link
                      href={`/${locale}/events/${event.slug}`}
                      className="mt-6 inline-flex text-sm font-semibold text-[var(--ink)]"
                    >
                      {locale === 'th' ? 'ดูรายละเอียดกิจกรรม' : 'Read event detail'}
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          )}
          
          {completed.length > 0 && (
            <div>
              <h2 className="font-display text-4xl leading-none text-[var(--ink)]">
                {dict.events.past}
              </h2>
              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                {completed.map((event) => (
                  <article key={event.slug} className="paper-frame p-6">
                    <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                      {eventTypeLabels[event.eventType] || event.eventType}
                    </p>
                    <h3 className="mt-5 font-display text-4xl leading-none text-[var(--ink)]">
                      {event.title}
                    </h3>
                    <p className="mt-5 text-base leading-7 text-[var(--muted)]">
                      {event.shortDescription}
                    </p>
                    <p className="mt-4 text-sm font-semibold text-[var(--ink)]">
                      {formatDate(event.eventDate, locale)}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

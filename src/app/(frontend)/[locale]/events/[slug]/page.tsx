import { notFound } from "next/navigation";
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { PageIntro } from "@/components/page-intro";
import { RichText } from "@/components/rich-text";
import React from 'react'
import { getDictionary, Locale } from "@/lib/i18n";

type EventDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

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

const statusLabelsTh: Record<string, string> = {
  draft: 'แบบร่าง',
  upcoming: 'กำลังจะมาถึง',
  completed: 'เสร็จสิ้นแล้ว',
  cancelled: 'ยกเลิกแล้ว',
}

const statusLabelsEn: Record<string, string> = {
  draft: 'Draft',
  upcoming: 'Upcoming',
  completed: 'Completed',
  cancelled: 'Cancelled',
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

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'events',
    limit: 100,
  })
  
  const params: { locale: string; slug: string }[] = []
  for (const locale of ['en', 'th']) {
    for (const event of result.docs) {
      params.push({ locale, slug: event.slug })
    }
  }
  return params;
}

export async function generateMetadata({ params }: EventDetailPageProps) {
  const { locale, slug } = await params;
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'events',
    locale,
    where: {
      slug: {
        equals: slug,
      },
    },
  })
  const event = result.docs[0];

  if (!event) {
    return { title: locale === 'th' ? "ไม่พบกิจกรรม" : "Event not found" };
  }

  return {
    title: event.title
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { locale, slug } = await params;
  const dict = getDictionary(locale as Locale)
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'events',
    locale,
    where: {
      slug: {
        equals: slug,
      },
    },
  })
  const event = result.docs[0];

  if (!event) {
    notFound();
  }

  const eventTypeLabels = locale === 'th' ? eventTypeLabelsTh : eventTypeLabelsEn
  const statusLabels = locale === 'th' ? statusLabelsTh : statusLabelsEn

  return (
    <>
      <PageIntro
        title={event.title}
        lead={event.shortDescription}
        aside={
          <div className="space-y-3 text-sm text-[var(--muted)]">
            <p className="font-semibold text-[var(--jci-blue)]">
              {eventTypeLabels[event.eventType] || event.eventType}
            </p>
            <p>{locale === 'th' ? 'วันที่:' : 'Date:'} {formatDate(event.eventDate, locale)}</p>
            <p>{locale === 'th' ? 'สถานที่:' : 'Venue:'} {event.venue}</p>
            <p className="font-semibold text-[var(--ink)]">
              {locale === 'th' ? 'สถานะ:' : 'Status:'} {statusLabels[event.status] || event.status}
            </p>
          </div>
        }
      />
      <section className="section-space mx-auto grid w-full max-w-7xl gap-5 px-5 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <article className="paper-frame p-7">
          <h2 className="font-display text-4xl leading-none text-[var(--ink)] mb-4">
            {locale === 'th' ? 'ภาพรวมกิจกรรม' : 'Event Overview'}
          </h2>
          {event.fullDescription ? (
            <RichText content={event.fullDescription} />
          ) : (
            <p className="text-base leading-7 text-[var(--muted)]">
              {locale === 'th' ? 'ไม่มีรายละเอียดกิจกรรมเพิ่มเติม' : 'No detailed overview provided.'}
            </p>
          )}
        </article>
        <div className="space-y-5">
          <article className="paper-frame p-7">
            <h2 className="font-display text-4xl leading-none text-[var(--ink)] mb-4">
              {locale === 'th' ? 'การเข้าร่วมกิจกรรม' : 'Participation'}
            </h2>
            <div className="space-y-4">
              {event.registrationLink ? (
                <a
                  href={event.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button-primary w-full text-center block font-bold text-sm"
                >
                  {dict.events.register}
                </a>
              ) : (
                <p className="text-sm text-[var(--muted)]">
                  {locale === 'th' ? 'ยังไม่เปิดลงทะเบียนหรือไม่มีความจำเป็นต้องลงทะเบียน' : 'Registration is not open or not required.'}
                </p>
              )}
              {event.googleMapsLink && (
                <a
                  href={event.googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button-secondary w-full text-center block text-sm font-semibold"
                >
                  {locale === 'th' ? 'แผนที่การเดินทาง (Google Maps)' : 'Get Directions (Google Maps)'}
                </a>
              )}
            </div>
          </article>
          {event.hostCommittee && (
            <article className="paper-frame p-7">
              <h2 className="font-display text-2xl leading-none text-[var(--ink)] mb-3">
                {locale === 'th' ? 'จัดโดย' : 'Organized By'}
              </h2>
              <p className="text-sm text-[var(--muted)]">
                {locale === 'th' ? 'คณะทำงานเจ้าภาพ:' : 'Host Committee:'} <span className="font-semibold text-[var(--ink)]">{event.hostCommittee}</span>
              </p>
            </article>
          )}
        </div>
      </section>
    </>
  );
}

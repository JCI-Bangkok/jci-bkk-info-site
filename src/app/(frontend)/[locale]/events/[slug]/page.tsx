import Image from 'next/image';
import { mediaUrl } from '@/lib/activity-data';
import { notFound } from "next/navigation";
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

import { RichText } from "@/components/rich-text";
import React from 'react'

type EventDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

const eventTypeLabelsTh: Record<string, string> = {
  training: 'การฝึกอบรมและพัฒนา',
  networking: 'ธุรกิจและเครือข่าย',
  community: 'โครงการเพื่อสังคม',
  general: 'ประชุมทั่วไป',
  international: 'กิจกรรมนานาชาติ',
  partner: 'กิจกรรมพันธมิตร',
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
  draft: 'ฉบับร่าง',
  upcoming: 'กำลังจะมาถึง',
  completed: 'เสร็จสิ้น',
  cancelled: 'ยกเลิก',
}

const statusLabelsEn: Record<string, string> = {
  draft: 'Draft',
  upcoming: 'Upcoming',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

import { formatBangkokDate, formatBangkokTime, hasSpecificBangkokTime, bangkokDay } from '@/lib/calendar-date'

function formatDate(dateStr: string, locale: string) {
  return formatBangkokDate(dateStr, locale)
}

export async function generateStaticParams() {
  try {
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
  } catch (error) {
    console.error("Error generating static params for events [slug]:", error)
    return []
  }
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

export default async function EventDetailPage({
  params
}: EventDetailPageProps) {
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
    notFound();
  }

  const eventTypeLabels = locale === 'th' ? eventTypeLabelsTh : eventTypeLabelsEn
  const statusLabels = locale === 'th' ? statusLabelsTh : statusLabelsEn

  return (
    <>
            <div className="relative w-full bg-[#0a1526] text-white overflow-hidden pb-10 min-h-[70vh] flex items-center">
        {event.coverImage && mediaUrl(event.coverImage) && (
          <div className="absolute inset-0 opacity-20 blur-2xl scale-110 pointer-events-none">
            <Image src={mediaUrl(event.coverImage)!} alt="" fill className="object-cover" />
          </div>
        )}
        
        <div className="relative z-10 w-full mx-auto max-w-7xl px-5 pt-12 pb-12 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 lg:gap-14 items-center md:items-start">
            
            <div className="w-full md:w-1/2 lg:w-[45%] flex-shrink-0 sticky top-24">
              <div className="relative w-full h-auto rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-white/10 bg-white/5">
                {event.coverImage && mediaUrl(event.coverImage) ? (
                  <Image src={mediaUrl(event.coverImage)!} alt={event.title} width={800} height={1000} className="w-full h-auto" priority sizes="(max-width: 768px) 100vw, 45vw" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/50">No Image</div>
                )}
              </div>
            </div>

            <div className="w-full md:w-1/2 lg:w-[55%] flex flex-col justify-center">
              <div className="inline-flex flex-wrap gap-2 mb-4">
                <span className="rounded-full bg-[var(--jci-blue)]/20 px-3 py-1 text-xs font-semibold text-[var(--jci-blue)] border border-[var(--jci-blue)]/30">
                  {eventTypeLabels[event.eventType] || event.eventType}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                  {statusLabels[event.status] || event.status}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 text-white drop-shadow-md">
                {event.title}
              </h1>

              {event.shortDescription && (
                <p className="text-white/80 text-lg mb-6 leading-relaxed">
                  {event.shortDescription}
                </p>
              )}

              <div className="bg-[#0b1f38]/90 backdrop-blur-xl rounded-2xl p-6 lg:p-8 shadow-2xl border border-white/10 flex flex-col gap-5">
                {event.eventDate && (
                  <div className="flex items-start gap-4">
                    <svg className="w-6 h-6 text-[var(--jci-blue)] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <div className="grid min-w-0 flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">{locale === 'th' ? 'วันที่' : 'Date'}</p>
                        <p className="text-white font-medium text-base md:text-lg">
                          {event.endDate && bangkokDay(event.endDate) !== bangkokDay(event.eventDate)
                            ? `${formatDate(event.eventDate, locale)} – ${formatDate(event.endDate, locale)}`
                            : formatDate(event.eventDate, locale)}
                        </p>
                      </div>
                      {(event.eventTime || hasSpecificBangkokTime(event.eventDate)) && (
                        <div>
                          <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">{locale === 'th' ? 'เวลา' : 'Time'}</p>
                          <p className="whitespace-pre-wrap text-white font-medium text-base md:text-lg">
                            {event.eventTime || (
                              <>
                                {formatBangkokTime(event.eventDate, locale)}
                                {event.endDate && hasSpecificBangkokTime(event.endDate) ? ` – ${formatBangkokTime(event.endDate, locale)}` : ''}
                              </>
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {event.venue && (
                  <div className="flex items-start gap-4">
                    <svg className="w-6 h-6 text-[var(--jci-blue)] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <div>
                      <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">{locale === 'th' ? 'สถานที่' : 'Venue'}</p>
                      <p className="text-white font-medium text-base md:text-lg">
                        {event.venue}
                        {event.googleMapsLink && (
                          <a href={event.googleMapsLink} target="_blank" rel="noopener noreferrer" className="ml-2 text-[var(--jci-blue)] hover:text-white transition-colors text-sm underline underline-offset-2">
                            ({locale === 'th' ? 'ดูแผนที่' : 'Map'})
                          </a>
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {event.price && (
                  <div className="flex items-start gap-4">
                    <svg className="w-6 h-6 text-[var(--jci-blue)] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <div>
                      <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">{locale === 'th' ? 'ราคา' : 'Price'}</p>
                      <p className="text-white font-medium text-base md:text-lg whitespace-pre-wrap">{event.price}</p>
                    </div>
                  </div>
                )}

                {(event.registrationLink || (event.facebookPosts && event.facebookPosts.length > 0)) && (
                  <div className="mt-3 pt-5 border-t border-white/10 flex flex-col gap-4 items-start w-full">
                    {event.registrationLink && event.status === 'upcoming' && (
                      <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto text-center px-8 py-3.5 rounded-full bg-white text-[var(--jci-black)] hover:bg-[var(--jci-blue)] hover:text-white font-bold transition-all shadow-lg text-lg">
                        {locale === 'th' ? 'ลงทะเบียนเข้าร่วม' : 'Register Now'}
                      </a>
                    )}
                    {event.facebookPosts && event.facebookPosts.length > 0 && (
                      <div className="flex flex-col gap-2.5 w-full sm:max-w-md">
                        {event.facebookPosts.map((post: { url: string; label?: string }, i: number) => (
                          <a key={i} href={post.url} target="_blank" rel="noopener noreferrer" className="w-full text-left px-5 py-2.5 rounded-full bg-transparent border border-white/20 text-white/80 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all text-sm font-medium flex items-center gap-3">
                            <svg className="w-4 h-4 shrink-0 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                            <span className="truncate">{post.label || (locale === 'th' ? 'ดูโพสต์บน Facebook' : 'View on Facebook')}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {event.secondaryPosters && event.secondaryPosters.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-5 pt-4 pb-2 lg:px-8">
            <article className="paper-frame p-5 sm:p-7">
              <h2 className="font-display text-2xl leading-tight text-[var(--ink)] mb-5">
                {locale === 'th' ? 'โปสเตอร์เพิ่มเติม' : 'Additional Posters'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {event.secondaryPosters.map((image: { alt?: string }, idx: number) => {
              const url = mediaUrl(image);
              if (!url) return null;
              return (
                <div key={idx} className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-[var(--line)] shadow-lg group bg-[var(--paper-soft)]">
                  <Image src={url} alt={image.alt || event.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              );
            })}
          </div>
          </article>
        </section>
      )}

      {event.fullDescription && (
        <section className="mx-auto w-full max-w-7xl px-5 pt-5 pb-12 lg:px-8 lg:pt-8 lg:pb-16">
          <article className="paper-frame p-7">
            <h2 className="font-display text-3xl leading-none text-[var(--ink)] mb-6">
              {locale === 'th' ? 'รายละเอียดกิจกรรม' : 'Event Details'}
            </h2>
            <RichText content={event.fullDescription} />
          </article>
        </section>
      )}

      {event.eventPhotos && event.eventPhotos.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-5 pb-16 lg:px-8 lg:pb-24">
          <article className="paper-frame p-7">
            <h2 className="font-display text-3xl leading-none text-[var(--ink)] mb-6">
              {locale === 'th' ? 'ภาพบรรยากาศ' : 'Event Gallery'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {event.eventPhotos.map((image: { alt?: string }, idx: number) => {
                const url = mediaUrl(image);
                if (!url) return null;
                return (
                  <div key={idx} className="relative aspect-square w-full rounded-xl overflow-hidden border border-[var(--line)] shadow-sm group bg-[var(--paper-soft)]">
                    <Image src={url} alt={image.alt || event.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                );
              })}
            </div>
          </article>
        </section>
      )}
    </>
  );
}

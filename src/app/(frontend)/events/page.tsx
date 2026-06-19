import Link from "next/link";
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { PageIntro } from "@/components/page-intro";
import React from 'react'

export const metadata = {
  title: "Events"
};

const eventTypeLabels: Record<string, string> = {
  training: 'Training & Development',
  networking: 'Business & Networking',
  community: 'Community Project',
  general: 'General Meeting',
  international: 'International Event',
  partner: 'Partner Event',
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export default async function EventsPage() {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'events',
    limit: 100,
    sort: '-eventDate',
  })
  
  const upcoming = result.docs.filter((event) => event.status === "upcoming");
  const completed = result.docs.filter((event) => event.status === "completed");

  return (
    <>
      <PageIntro
        title="Events that keep the chapter visible and active."
        lead="From training and networking to community projects and international opportunities, the event section should help visitors understand how JCI Bangkok shows up in real life."
      />
      <section className="section-space mx-auto w-full max-w-7xl px-5 lg:px-8">
        <div className="space-y-12">
          <div>
            <h2 className="font-display text-4xl leading-none text-[var(--ink)]">
              Upcoming events
            </h2>
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              {upcoming.map((event) => (
                <article key={event.slug} className="paper-frame p-6">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                    <span>{eventTypeLabels[event.eventType] || event.eventType}</span>
                    <span>{formatDate(event.eventDate)}</span>
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
                    href={`/events/${event.slug}`}
                    className="mt-6 inline-flex text-sm font-semibold text-[var(--ink)]"
                  >
                    Read event detail
                  </Link>
                </article>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-display text-4xl leading-none text-[var(--ink)]">
              Recent archive
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
                    {formatDate(event.eventDate)}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


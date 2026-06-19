import { notFound } from "next/navigation";
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { PageIntro } from "@/components/page-intro";
import { RichText } from "@/components/rich-text";
import React from 'react'

type EventDetailPageProps = {
  params: Promise<{ slug: string }>;
};

const eventTypeLabels: Record<string, string> = {
  training: 'Training & Development',
  networking: 'Business & Networking',
  community: 'Community Project',
  general: 'General Meeting',
  international: 'International Event',
  partner: 'Partner Event',
}

const statusLabels: Record<string, string> = {
  draft: 'Draft',
  upcoming: 'Upcoming',
  completed: 'Completed',
  cancelled: 'Cancelled',
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

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'events',
    limit: 100,
  })
  return result.docs.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'events',
    where: {
      slug: {
        equals: slug,
      },
    },
  })
  const event = result.docs[0];

  if (!event) {
    return { title: "Event not found" };
  }

  return {
    title: event.title
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'events',
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
            <p>Date: {formatDate(event.eventDate)}</p>
            <p>Venue: {event.venue}</p>
            <p className="font-semibold text-[var(--ink)]">
              Status: {statusLabels[event.status] || event.status}
            </p>
          </div>
        }
      />
      <section className="section-space mx-auto grid w-full max-w-7xl gap-5 px-5 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <article className="paper-frame p-7">
          <h2 className="font-display text-4xl leading-none text-[var(--ink)] mb-4">
            Event Overview
          </h2>
          {event.fullDescription ? (
            <RichText content={event.fullDescription} />
          ) : (
            <p className="text-base leading-7 text-[var(--muted)]">
              No detailed overview provided.
            </p>
          )}
        </article>
        <div className="space-y-5">
          <article className="paper-frame p-7">
            <h2 className="font-display text-4xl leading-none text-[var(--ink)] mb-4">
              Participation
            </h2>
            <div className="space-y-4">
              {event.registrationLink ? (
                <a
                  href={event.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button-primary w-full text-center block"
                >
                  Register for Event
                </a>
              ) : (
                <p className="text-sm text-[var(--muted)]">
                  Registration is not open or not required.
                </p>
              )}
              {event.googleMapsLink && (
                <a
                  href={event.googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button-secondary w-full text-center block text-sm font-semibold"
                >
                  Get Directions (Google Maps)
                </a>
              )}
            </div>
          </article>
          {event.hostCommittee && (
            <article className="paper-frame p-7">
              <h2 className="font-display text-2xl leading-none text-[var(--ink)] mb-3">
                Organized By
              </h2>
              <p className="text-sm text-[var(--muted)]">
                Host Committee: <span className="font-semibold text-[var(--ink)]">{event.hostCommittee}</span>
              </p>
            </article>
          )}
        </div>
      </section>
    </>
  );
}

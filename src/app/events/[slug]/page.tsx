import { notFound } from "next/navigation";

import { PageIntro } from "@/components/page-intro";
import { events, getEvent } from "@/lib/site-data";

type EventDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const event = getEvent(slug);

  if (!event) {
    return { title: "Event not found" };
  }

  return {
    title: event.title
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const event = getEvent(slug);

  if (!event) {
    notFound();
  }

  return (
    <>
      <PageIntro
        title={event.title}
        lead={event.summary}
        aside={
          <div className="space-y-3 text-sm text-[var(--muted)]">
            <p>{event.type}</p>
            <p>{event.date}</p>
            <p>{event.venue}</p>
            <p className="font-semibold text-[var(--ink)]">{event.status}</p>
          </div>
        }
      />
      <section className="section-space mx-auto grid w-full max-w-7xl gap-5 px-5 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
        <article className="paper-frame p-7">
          <h2 className="font-display text-4xl leading-none text-[var(--ink)]">
            Event overview
          </h2>
          <p className="mt-6 text-base leading-7 text-[var(--muted)]">
            {event.highlight} This detail page is ready to evolve into a CMS-fed
            event page with agenda, registration links, gallery, host committee,
            and recap content.
          </p>
        </article>
        <article className="paper-frame p-7">
          <h2 className="font-display text-4xl leading-none text-[var(--ink)]">
            Planned CMS fields
          </h2>
          <ul className="mt-6 space-y-3 text-base leading-7 text-[var(--muted)]">
            <li>Event date and end date</li>
            <li>Venue and map link</li>
            <li>Registration link</li>
            <li>Status and featured flag</li>
            <li>Short and full description</li>
            <li>Cover image and gallery</li>
          </ul>
        </article>
      </section>
    </>
  );
}

import Link from "next/link";

import { PageIntro } from "@/components/page-intro";
import { events } from "@/lib/site-data";

export const metadata = {
  title: "Events"
};

export default function EventsPage() {
  const upcoming = events.filter((event) => event.status === "Upcoming");
  const completed = events.filter((event) => event.status === "Completed");

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
                    <span>{event.type}</span>
                    <span>{event.date}</span>
                  </div>
                  <h3 className="mt-5 font-display text-4xl leading-none text-[var(--ink)]">
                    {event.title}
                  </h3>
                  <p className="mt-5 text-base leading-7 text-[var(--muted)]">
                    {event.summary}
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
                    {event.type}
                  </p>
                  <h3 className="mt-5 font-display text-4xl leading-none text-[var(--ink)]">
                    {event.title}
                  </h3>
                  <p className="mt-5 text-base leading-7 text-[var(--muted)]">
                    {event.summary}
                  </p>
                  <p className="mt-4 text-sm font-semibold text-[var(--ink)]">
                    {event.date}
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

import Link from "next/link";
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { CtaBanner } from "@/components/cta-banner";
import { PageIntro } from "@/components/page-intro";
import { opportunities } from "@/lib/site-data";
import React from 'react'

export const metadata = {
  title: "About"
};

const boardYearMetadata: Record<string, { theme: string; summary: string }> = {
  "2026": {
    theme: "Lead forward, build local trust.",
    summary: "A board focused on member growth, stronger partnerships, and visible project delivery in Bangkok."
  },
  "2025": {
    theme: "Action that connects.",
    summary: "A year centered on visible programming, stronger event cadence, and rebuilding chapter momentum."
  }
}

export default async function AboutPage() {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'board-members',
    limit: 150,
  })

  const years = Array.from(new Set(result.docs.map((member) => member.year)))
    .sort((a, b) => b - a)


  const boardYearsList = years.map((yr) => {
    const yearStr = yr.toString()
    const metadata = boardYearMetadata[yearStr] || {
      theme: "Serving JCI Bangkok",
      summary: `The board of directors for the year ${yearStr}.`
    }
    return {
      year: yearStr,
      theme: metadata.theme,
      summary: metadata.summary
    }
  })

  return (
    <>
      <PageIntro
        title="JCI Bangkok turns a global mission into local opportunities."
        lead="As a local chapter of JCI Thailand, JCI Bangkok creates leadership opportunities, projects, and networks for young active citizens who want to grow while contributing to their city."
        aside={
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">
              Organization hierarchy
            </p>
            <div className="space-y-3 text-sm leading-7 text-[var(--muted)]">
              <p>Junior Chamber International Global</p>
              <p className="pl-5">JCI Thailand</p>
              <p className="pl-10 font-semibold text-[var(--ink)]">JCI Bangkok</p>
            </div>
          </div>
        }
      />

      <section className="section-space mx-auto grid w-full max-w-7xl gap-6 px-5 lg:grid-cols-2 lg:px-8">
        <article className="paper-frame p-7">
          <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">
            Who we are
          </p>
          <h2 className="mt-4 font-display text-4xl leading-none text-[var(--ink)]">
            A chapter for young leaders who want practice, not just inspiration.
          </h2>
          <p className="mt-6 text-base leading-7 text-[var(--muted)]">
            JCI Bangkok exists for people aged 18 to 40 who want to develop
            through real projects, meaningful roles, and a network that blends
            professional growth with community impact.
          </p>
        </article>
        <article className="paper-frame p-7">
          <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">
            Mission and vision
          </p>
          <div className="mt-6 grid gap-5">
            <div className="rounded-[1.6rem] border border-[var(--line)] bg-white/75 p-5">
              <p className="font-semibold text-[var(--ink)]">Mission</p>
              <p className="mt-2 text-base leading-7 text-[var(--muted)]">
                Provide leadership development opportunities that empower young
                people to create positive change.
              </p>
            </div>
            <div className="rounded-[1.6rem] border border-[var(--line)] bg-white/75 p-5">
              <p className="font-semibold text-[var(--ink)]">Vision</p>
              <p className="mt-2 text-base leading-7 text-[var(--muted)]">
                Be the foremost global network of young leaders, expressed in
                Bangkok through visible local action and collaboration.
              </p>
            </div>
          </div>
        </article>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-20 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-2">
          {opportunities.map((item) => (
            <article key={item.title} className="paper-frame p-7">
              <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">
                {item.accent}
              </p>
              <h2 className="mt-4 font-display text-4xl leading-none text-[var(--ink)]">
                {item.title}
              </h2>
              <p className="mt-5 text-base leading-7 text-[var(--muted)]">
                {item.summary}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-20 lg:px-8">
        <div className="paper-frame p-7 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">
                Board archive
              </p>
              <h2 className="mt-4 font-display text-5xl leading-none text-[var(--ink)]">
                Yearly leadership matters here.
              </h2>
            </div>
            <Link href="/about/board" className="text-sm font-semibold text-[var(--ink)]">
              View full board archive
            </Link>
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {boardYearsList.map((year) => (
              <article
                key={year.year}
                className="rounded-[1.6rem] border border-[var(--line)] bg-white/75 p-6"
              >
                <div className="flex items-center justify-between">
                  <p className="font-display text-4xl leading-none text-[var(--ink)]">
                    {year.year}
                  </p>
                  <Link
                    href={`/about/board/${year.year}`}
                    className="text-sm font-semibold text-[var(--ink)]"
                  >
                    Explore year
                  </Link>
                </div>
                <p className="mt-4 text-sm uppercase tracking-[0.22em] text-[var(--muted)]">
                  {year.theme}
                </p>
                <p className="mt-5 text-base leading-7 text-[var(--muted)]">
                  {year.summary}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        title="See how leadership is organized year by year."
        description="Board archives help members, partners, and the wider JCI network understand governance, continuity, and chapter direction."
        primaryHref="/about/board"
        primaryLabel="Open board archive"
        secondaryHref="/contact"
        secondaryLabel="Contact the chapter"
      />
    </>
  );
}


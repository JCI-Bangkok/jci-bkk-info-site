import Link from "next/link";
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { PageIntro } from "@/components/page-intro";
import React from 'react'

export const metadata = {
  title: "Board Archive"
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

export default async function BoardArchivePage() {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'board-members',
    limit: 150,
  })

  // Group by year and find president
  const presidentsByYear: Record<number, string> = {}
  
  result.docs.forEach((member) => {
    const yr = member.year
    
    // President check (displayOrder === 1 or position contains "President")
    if (member.displayOrder === 1 || member.position.toLowerCase().includes('president')) {
      presidentsByYear[yr] = member.name
    } else if (!presidentsByYear[yr]) {
      presidentsByYear[yr] = 'JCI Bangkok President'
    }
  })

  const sortedYears = Object.keys(presidentsByYear)
    .map(Number)
    .sort((a, b) => b - a)


  const boardYearsList = sortedYears.map((yr) => {
    const yearStr = yr.toString()
    const metadata = boardYearMetadata[yearStr] || {
      theme: "Serving JCI Bangkok",
      summary: `The board of directors for the year ${yearStr}.`
    }
    return {
      year: yearStr,
      theme: metadata.theme,
      summary: metadata.summary,
      president: presidentsByYear[yr]
    }
  })

  return (
    <>
      <PageIntro
        title="Board of directors archive"
        lead="JCI Bangkok leadership changes yearly, so the public site should make governance, continuity, and yearly themes easy to browse."
      />
      <section className="section-space mx-auto w-full max-w-7xl px-5 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-2">
          {boardYearsList.map((year) => (
            <article key={year.year} className="paper-frame p-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">
                    {year.theme}
                  </p>
                  <h2 className="mt-4 font-display text-5xl leading-none text-[var(--ink)]">
                    {year.year}
                  </h2>
                </div>
                <Link
                  href={`/about/board/${year.year}`}
                  className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold text-[var(--ink)]"
                >
                  View year
                </Link>
              </div>
              <p className="mt-6 text-base leading-7 text-[var(--muted)]">
                {year.summary}
              </p>
              <div className="mt-8 border-t border-[var(--line)] pt-5">
                <p className="text-sm text-[var(--muted)]">Local President</p>
                <p className="mt-1 text-lg font-semibold text-[var(--ink)]">
                  {year.president}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}


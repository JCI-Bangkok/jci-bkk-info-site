import Link from "next/link";

import { PageIntro } from "@/components/page-intro";
import { boardYears } from "@/lib/site-data";

export const metadata = {
  title: "Board Archive"
};

export default function BoardArchivePage() {
  return (
    <>
      <PageIntro
        title="Board of directors archive"
        lead="JCI Bangkok leadership changes yearly, so the public site should make governance, continuity, and yearly themes easy to browse."
      />
      <section className="section-space mx-auto w-full max-w-7xl px-5 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-2">
          {boardYears.map((year) => (
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

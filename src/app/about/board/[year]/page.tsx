import { notFound } from "next/navigation";

import { PageIntro } from "@/components/page-intro";
import { boardYears, getBoardYear } from "@/lib/site-data";

type BoardYearPageProps = {
  params: Promise<{ year: string }>;
};

export async function generateStaticParams() {
  return boardYears.map((year) => ({ year: year.year }));
}

export async function generateMetadata({ params }: BoardYearPageProps) {
  const { year } = await params;
  const entry = getBoardYear(year);

  if (!entry) {
    return { title: "Board year not found" };
  }

  return {
    title: `Board ${entry.year}`
  };
}

export default async function BoardYearPage({ params }: BoardYearPageProps) {
  const { year } = await params;
  const entry = getBoardYear(year);

  if (!entry) {
    notFound();
  }

  return (
    <>
      <PageIntro
        title={`${entry.year} board of directors`}
        lead={entry.summary}
        aside={
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">
              Annual theme
            </p>
            <p className="font-display text-3xl leading-none text-[var(--ink)]">
              {entry.theme}
            </p>
            <p className="text-sm text-[var(--muted)]">
              Local President: {entry.president}
            </p>
          </div>
        }
      />
      <section className="section-space mx-auto w-full max-w-7xl px-5 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-2">
          {entry.members.map((member) => (
            <article key={member.name} className="paper-frame p-7">
              <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">
                {member.role}
              </p>
              <h2 className="mt-4 font-display text-4xl leading-none text-[var(--ink)]">
                {member.name}
              </h2>
              <p className="mt-4 text-base leading-7 text-[var(--muted)]">
                {member.bio}
              </p>
              <p className="mt-5 border-t border-[var(--line)] pt-5 text-sm font-semibold text-[var(--ink)]">
                {member.company}
              </p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

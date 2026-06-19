import Link from "next/link";
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { PageIntro } from "@/components/page-intro";
import React from 'react'

export const metadata = {
  title: "Projects"
};

const categoryLabels: Record<string, string> = {
  community: 'Community Impact',
  youth: 'Youth Development',
  sustainability: 'Sustainability',
  entrepreneurship: 'Entrepreneurship',
  international: 'International Cooperation',
}

export default async function ProjectsPage() {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'projects',
    limit: 100,
    sort: '-year',
  })
  const projects = result.docs

  return (
    <>
      <PageIntro
        title="Projects that make chapter impact visible."
        lead="The projects section shows that JCI Bangkok is more than a networking group. It is a chapter that turns leadership into outcomes with real community relevance."
      />
      <section className="section-space mx-auto w-full max-w-7xl px-5 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {projects.map((project) => (
            <article key={project.slug} className="paper-frame p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                  <span className="font-semibold text-[var(--jci-blue)]">
                    {categoryLabels[project.category] || project.category}
                  </span>
                  <span>{project.year}</span>
                </div>
                <h2 className="mt-5 font-display text-4xl leading-none text-[var(--ink)]">
                  {project.title}
                </h2>
                <p className="mt-5 text-base leading-7 text-[var(--muted)] line-clamp-3">
                  {project.problemStatement}
                </p>
                <p className="mt-5 text-sm font-semibold text-[var(--ink)]">
                  Target: {project.targetBeneficiaries}
                </p>
              </div>
              <Link
                href={`/projects/${project.slug}`}
                className="mt-6 inline-flex text-sm font-semibold text-[var(--jci-blue)] hover:underline"
              >
                Read project detail &rarr;
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}



import Link from "next/link";

import { PageIntro } from "@/components/page-intro";
import { projects } from "@/lib/site-data";

export const metadata = {
  title: "Projects"
};

export default function ProjectsPage() {
  return (
    <>
      <PageIntro
        title="Projects that make chapter impact visible."
        lead="The projects section should show that JCI Bangkok is more than a networking group. It is a chapter that turns leadership into outcomes with real community relevance."
      />
      <section className="section-space mx-auto w-full max-w-7xl px-5 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {projects.map((project) => (
            <article key={project.slug} className="paper-frame p-6">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                <span>{project.category}</span>
                <span>{project.year}</span>
              </div>
              <h2 className="mt-5 font-display text-4xl leading-none text-[var(--ink)]">
                {project.title}
              </h2>
              <p className="mt-5 text-base leading-7 text-[var(--muted)]">
                {project.summary}
              </p>
              <p className="mt-5 text-sm font-semibold text-[var(--ink)]">
                {project.beneficiaries}
              </p>
              <Link
                href={`/projects/${project.slug}`}
                className="mt-6 inline-flex text-sm font-semibold text-[var(--ink)]"
              >
                Read project detail
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

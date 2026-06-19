import { notFound } from "next/navigation";

import { PageIntro } from "@/components/page-intro";
import { getProject, projects } from "@/lib/site-data";

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return { title: "Project not found" };
  }

  return {
    title: project.title
  };
}

export default async function ProjectDetailPage({
  params
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <PageIntro
        title={project.title}
        lead={project.summary}
        aside={
          <div className="space-y-3 text-sm text-[var(--muted)]">
            <p>{project.category}</p>
            <p>{project.year}</p>
            <p className="font-semibold text-[var(--ink)]">
              {project.beneficiaries}
            </p>
          </div>
        }
      />
      <section className="section-space mx-auto grid w-full max-w-7xl gap-5 px-5 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
        <article className="paper-frame p-7">
          <h2 className="font-display text-4xl leading-none text-[var(--ink)]">
            Problem and response
          </h2>
          <p className="mt-6 text-base leading-7 text-[var(--muted)]">
            This page is structured to expand with Payload content for problem
            statement, outcomes, SDG tags, partner visibility, galleries, and
            downloadable reports.
          </p>
          <p className="mt-5 text-base leading-7 text-[var(--muted)]">
            Current draft impact direction: {project.impact}
          </p>
        </article>
        <article className="paper-frame p-7">
          <h2 className="font-display text-4xl leading-none text-[var(--ink)]">
            Suggested CMS fields
          </h2>
          <ul className="mt-6 space-y-3 text-base leading-7 text-[var(--muted)]">
            <li>Problem statement and target beneficiaries</li>
            <li>Outcomes and impact numbers</li>
            <li>Partner organizations and gallery</li>
            <li>SDG tags and report file</li>
            <li>Year archive support</li>
          </ul>
        </article>
      </section>
    </>
  );
}

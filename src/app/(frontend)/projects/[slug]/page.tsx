import { notFound } from "next/navigation";
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { PageIntro } from "@/components/page-intro";
import { RichText } from "@/components/rich-text";
import React from 'react'

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

const categoryLabels: Record<string, string> = {
  community: 'Community Impact',
  youth: 'Youth Development',
  sustainability: 'Sustainability',
  entrepreneurship: 'Entrepreneurship',
  international: 'International Cooperation',
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'projects',
    limit: 100,
  })
  return result.docs.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'projects',
    where: {
      slug: {
        equals: slug,
      },
    },
  })
  const project = result.docs[0];

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
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'projects',
    where: {
      slug: {
        equals: slug,
      },
    },
  })
  const project = result.docs[0];

  if (!project) {
    notFound();
  }

  return (
    <>
      <PageIntro
        title={project.title}
        lead={project.problemStatement}
        aside={
          <div className="space-y-3 text-sm text-[var(--muted)]">
            <p className="font-semibold text-[var(--jci-blue)]">
              {categoryLabels[project.category] || project.category}
            </p>
            <p>Year: {project.year}</p>
            <p className="text-[var(--ink)]">
              Target: {project.targetBeneficiaries}
            </p>
          </div>
        }
      />
      <section className="section-space mx-auto grid w-full max-w-7xl gap-5 px-5 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div className="space-y-5">
          {project.activities && (
            <article className="paper-frame p-7">
              <h2 className="font-display text-4xl leading-none text-[var(--ink)] mb-4">
                Activities & Implementation
              </h2>
              <RichText content={project.activities} />
            </article>
          )}
          {project.outcomes && (
            <article className="paper-frame p-7">
              <h2 className="font-display text-4xl leading-none text-[var(--ink)] mb-4">
                Outcomes & Impact
              </h2>
              <RichText content={project.outcomes} />
            </article>
          )}
        </div>
        <div className="space-y-5">
          {project.impactNumbers && project.impactNumbers.length > 0 && (
            <article className="paper-frame p-7">
              <h2 className="font-display text-4xl leading-none text-[var(--ink)] mb-6">
                Impact Numbers
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {project.impactNumbers.map((stat: { value: string; label: string }, i: number) => (
                  <div key={i} className="text-center p-4 bg-[var(--paper-soft)] rounded-lg">
                    <p className="text-3xl font-bold text-[var(--jci-blue)]">{stat.value}</p>
                    <p className="text-xs text-[var(--muted)] mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </article>
          )}
          <article className="paper-frame p-7">
            <h2 className="font-display text-4xl leading-none text-[var(--ink)] mb-4">
              Project Details
            </h2>
            <ul className="space-y-3 text-sm text-[var(--muted)]">
              {project.partners && (
                <li>
                  <strong className="text-[var(--ink)]">Partners:</strong> {project.partners}
                </li>
              )}
              {project.sdgTags && project.sdgTags.length > 0 && (
                <li>
                  <strong className="text-[var(--ink)]">SDGs:</strong>{' '}
                  {project.sdgTags.map((tag: string) => tag.replace('sdg-', 'SDG ')).join(', ')}
                </li>
              )}
            </ul>
          </article>
        </div>
      </section>
    </>
  );
}

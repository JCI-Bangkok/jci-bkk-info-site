import { contentMetadata } from '@/lib/cms-seo'
import { publishedProjects, getPublicContent } from '@/lib/public-content'
import { absoluteUrl } from '@/lib/seo'
import { notFound } from "next/navigation";
import { mediaUrl } from "@/lib/activity-data";
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import React from 'react'

type ProjectDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

const categoryLabelsTh: Record<string, string> = {
  community: 'พัฒนาชุมชน',
  youth: 'พัฒนาเยาวชน',
  sustainability: 'ความยั่งยืน',
  entrepreneurship: 'ผู้ประกอบการ',
  international: 'ความร่วมมือระหว่างประเทศ',
}

const categoryLabelsEn: Record<string, string> = {
  community: 'Community Impact',
  youth: 'Youth Development',
  sustainability: 'Sustainability',
  entrepreneurship: 'Entrepreneurship',
  international: 'International Cooperation',
}

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'projects',
      where: publishedProjects,
      pagination: false,
    })
    
    const params: { locale: string; slug: string }[] = []
    for (const locale of ['en', 'th']) {
      for (const project of result.docs) {
        params.push({ locale, slug: project.slug })
      }
    }
    return params;
  } catch (error) {
    console.error("Error generating static params for projects [slug]:", error)
    return []
  }
}

export async function generateMetadata({ params }: ProjectDetailPageProps) {
  const { locale, slug } = await params;
  const project = await getPublicContent('projects', locale, slug) as any;

  if (!project) notFound();

  return contentMetadata(locale, `/events/projects/${encodeURIComponent(slug)}`, project, { title: project.title, description: project.problemStatement, image: mediaUrl(project.gallery?.[0]?.image) });
}

export default async function ProjectDetailPage({
  params
}: ProjectDetailPageProps) {
  const { locale, slug } = await params;
  const project = await getPublicContent('projects', locale, slug) as any;

  if (!project) {
    notFound();
  }

  const payload = await getPayload({ config: configPromise });
  const templates = await payload.find({
    collection: "templates",
    where: {
      type: {
        equals: "project-single",
      },
      status: {
        equals: "published",
      },
    },
    limit: 1,
  });
  const template = templates.docs[0];

  if (template && template.puckLayout) {
    const { PuckRenderer } = await import('@/components/builder/PuckRenderer');
    return <PuckRenderer data={template.puckLayout as any} documentData={{...project, currentLocale: locale}} />;
  }

  return (
    <div className="min-h-[50vh] flex items-center justify-center bg-gray-50 text-gray-400">
      <p>No template configured. Please publish a Single Project Template in the FSE Visual Builder.</p>
    </div>
  );
}

export const revalidate = 300

import 'server-only'
// Original page layout preserved from Git commit 8410ea1. CMS data stays live.
import { contentMetadata } from '@/lib/cms-seo'
import { publishedProjects, getPublicContent } from '@/lib/public-content'
import { absoluteUrl } from '@/lib/seo'
import { Breadcrumbs, StructuredData, breadcrumbData } from '@/components/structured-data'
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { mediaUrl } from "@/lib/activity-data";
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { PageIntro } from "@/components/page-intro";
import { RichText } from "@/components/rich-text";
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

  const categoryLabels = locale === 'th' ? categoryLabelsTh : categoryLabelsEn

  const path = `/${locale}/events/projects/${encodeURIComponent(slug)}`
  return (
    <>
      <Breadcrumbs locale={locale} title={project.title} />
      <StructuredData data={breadcrumbData(locale, `/events/projects/${encodeURIComponent(slug)}`, project.title)} />
      <StructuredData data={{ '@type': 'WebPage', name: project.title, description: project.problemStatement, url: absoluteUrl(path), inLanguage: locale }} />
      <PageIntro
        title={project.title}
        lead={project.problemStatement}
        aside={
          <div className="space-y-3 text-sm text-[var(--muted)]">
            <p className="font-semibold text-[var(--jci-blue)]">
              {categoryLabels[project.category] || project.category}
            </p>
            <p>{locale === 'th' ? 'ปีที่ดำเนินโครงการ:' : 'Project Year:'} {project.year}</p>
          </div>
        }
      />
      <section className="section-space mx-auto grid w-full max-w-7xl gap-5 px-5 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div className="space-y-5">
          {project.gallery && project.gallery.length > 0 ? (
            <div className="relative w-full h-[28rem] rounded-[2rem] overflow-hidden border border-[var(--line)]">
              {mediaUrl(project.gallery[0].image) && (
                <Image
                  src={mediaUrl(project.gallery[0].image)!}
                  alt={project.title}
                  fill sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  className="object-cover"
                />
              )}
            </div>
          ) : null}
          <article className="paper-frame p-7">
            <h2 className="font-display text-3xl leading-none text-[var(--ink)] mb-6">
              {locale === 'th' ? 'เกี่ยวกับโครงการ' : 'About the Project'}
            </h2>
            <div className="mt-4 text-[var(--muted)] space-y-4 leading-7 text-sm">
              <RichText content={project.activities} />
            </div>
          </article>
        </div>
        
        <div className="space-y-5">
          <article className="paper-frame p-7 bg-[var(--jci-blue)] text-white border-none">
            <h2 className="font-display text-3xl leading-none mb-6">
              {locale === 'th' ? 'ผลลัพธ์ที่ได้' : 'Project Impact'}
            </h2>
            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-white/70 font-semibold mb-2">
                  {locale === 'th' ? 'กลุ่มผู้ได้รับประโยชน์' : 'Beneficiaries'}
                </p>
                <p className="text-lg font-medium">{project.targetBeneficiaries}</p>
              </div>
              <div className="border-t border-white/20 pt-6">
                <p className="text-xs uppercase tracking-wider text-white/70 font-semibold mb-2">
                  {locale === 'th' ? 'ผลกระทบเชิงบวก' : 'Key Impact'}
                </p>
                <div className="[&_*]:!text-white"><RichText content={project.outcomes} /></div>
              </div>
            </div>
          </article>
          
          <article className="paper-frame p-7">
            <h2 className="font-display text-3xl leading-none text-[var(--ink)] mb-4">
              {locale === 'th' ? 'ร่วมสร้างสรรค์กับเรา' : 'Build with us'}
            </h2>
            <p className="text-sm text-[var(--muted)] leading-6">
              {locale === 'th' 
                ? 'สนใจร่วมเป็นส่วนหนึ่งหรือเป็นพันธมิตรในโครงการพัฒนาสังคมและพัฒนาเยาวชนกับ JCI Bangkok ติดต่อเราเพื่อพูดคุยถึงโอกาสในการร่วมงาน' 
                : 'Interested in partnering with JCI Bangkok on community impact or youth development projects? Get in touch to discuss collaboration opportunities.'}
            </p>
            <Link
              href={`/${locale}/contact`}
              className="button-primary mt-6 text-center block text-sm"
            >
              {locale === 'th' ? 'เป็นพันธมิตรกับเรา' : 'Partner with us'}
            </Link>
          </article>
        </div>
      </section>
    </>
  );
}

export const revalidate = 300


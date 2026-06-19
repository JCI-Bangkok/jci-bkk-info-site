import { notFound } from "next/navigation";
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { PageIntro } from "@/components/page-intro";
import { RichText } from "@/components/rich-text";
import React from 'react'

type ProjectDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

const categoryLabelsTh: Record<string, string> = {
  community: 'การพัฒนาสังคมและชุมชน',
  youth: 'การพัฒนาเยาวชน',
  sustainability: 'สิ่งแวดล้อมและความยั่งยืน',
  entrepreneurship: 'ธุรกิจและการเป็นผู้ประกอบการ',
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
      limit: 100,
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
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'projects',
    locale,
    where: {
      slug: {
        equals: slug,
      },
    },
  })
  const project = result.docs[0];

  if (!project) {
    return { title: locale === 'th' ? "ไม่พบโครงการ" : "Project not found" };
  }

  return {
    title: project.title
  };
}

export default async function ProjectDetailPage({
  params
}: ProjectDetailPageProps) {
  const { locale, slug } = await params;
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'projects',
    locale,
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

  const categoryLabels = locale === 'th' ? categoryLabelsTh : categoryLabelsEn

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
            <p>{locale === 'th' ? 'ปีที่ดำเนินงาน:' : 'Year:'} {project.year}</p>
            <p className="text-[var(--ink)]">
              {locale === 'th' ? 'กลุ่มเป้าหมาย:' : 'Target:'} {project.targetBeneficiaries}
            </p>
          </div>
        }
      />
      <section className="section-space mx-auto grid w-full max-w-7xl gap-5 px-5 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div className="space-y-5">
          {project.activities && (
            <article className="paper-frame p-7">
              <h2 className="font-display text-4xl leading-none text-[var(--ink)] mb-4">
                {locale === 'th' ? 'กิจกรรมและการดำเนินงาน' : 'Activities & Implementation'}
              </h2>
              <RichText content={project.activities} />
            </article>
          )}
          {project.outcomes && (
            <article className="paper-frame p-7">
              <h2 className="font-display text-4xl leading-none text-[var(--ink)] mb-4">
                {locale === 'th' ? 'ผลลัพธ์และผลกระทบ' : 'Outcomes & Impact'}
              </h2>
              <RichText content={project.outcomes} />
            </article>
          )}
        </div>
        <div className="space-y-5">
          {project.impactNumbers && project.impactNumbers.length > 0 && (
            <article className="paper-frame p-7">
              <h2 className="font-display text-4xl leading-none text-[var(--ink)] mb-6">
                {locale === 'th' ? 'ตัวเลขผลลัพธ์โครงการ' : 'Impact Numbers'}
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
              {locale === 'th' ? 'รายละเอียดโครงการ' : 'Project Details'}
            </h2>
            <ul className="space-y-3 text-sm text-[var(--muted)]">
              {project.partners && (
                <li>
                  <strong className="text-[var(--ink)]">{locale === 'th' ? 'พันธมิตรโครงการ:' : 'Partners:'}</strong> {project.partners}
                </li>
              )}
              {project.sdgTags && project.sdgTags.length > 0 && (
                <li>
                  <strong className="text-[var(--ink)]">{locale === 'th' ? 'เป้าหมาย SDGs:' : 'SDGs:'}</strong>{' '}
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

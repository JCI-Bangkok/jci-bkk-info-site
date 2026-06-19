import { notFound } from "next/navigation";
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { PageIntro } from "@/components/page-intro";
import { RichText } from "@/components/rich-text";
import React from 'react'

type BoardYearPageProps = {
  params: Promise<{ locale: string; year: string }>;
};

const boardYearMetadataEn: Record<string, { theme: string; summary: string }> = {
  "2026": {
    theme: "Lead forward, build local trust.",
    summary: "A board focused on member growth, stronger partnerships, and visible project delivery in Bangkok."
  },
  "2025": {
    theme: "Action that connects.",
    summary: "A year centered on visible programming, stronger event cadence, and rebuilding chapter momentum."
  }
}

const boardYearMetadataTh: Record<string, { theme: string; summary: string }> = {
  "2026": {
    theme: "นำไปข้างหน้า สร้างความเชื่อมั่นในท้องถิ่น",
    summary: "คณะกรรมการบริหารที่มุ่งเน้นการเติบโตของสมาชิก พันธมิตรที่เข้มแข็ง และการส่งมอบโครงการที่จับต้องได้ในกรุงเทพฯ"
  },
  "2025": {
    theme: "การลงมือทำที่เชื่อมโยงถึงกัน",
    summary: "ปีที่เน้นแผนงานที่ชัดเจน การจัดกิจกรรมอย่างต่อเนื่อง และการฟื้นฟูพลังขับเคลื่อนของสมาคม"
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'board-members',
    limit: 150,
  })
  
  const years = Array.from(new Set(result.docs.map((member) => member.year)))
  const params: { locale: string; year: string }[] = []
  
  for (const locale of ['en', 'th']) {
    for (const year of years) {
      params.push({ locale, year: year.toString() })
    }
  }
  return params;
}

export async function generateMetadata({ params }: BoardYearPageProps) {
  const { locale, year } = await params;
  return {
    title: locale === 'th' ? `คณะกรรมการบริหารปี ${year}` : `Board ${year}`
  };
}

export default async function BoardYearPage({ params }: BoardYearPageProps) {
  const { locale, year } = await params;
  const yearInt = parseInt(year);
  
  if (isNaN(yearInt)) {
    notFound();
  }

  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'board-members',
    locale,
    where: {
      year: {
        equals: yearInt,
      },
    },
    sort: 'displayOrder',
    limit: 100,
  })

  const members = result.docs;

  if (members.length === 0) {
    notFound();
  }

  // Find president
  const presidentMember = members.find((m) => {
    const pos = m.position || ''
    return m.displayOrder === 1 || pos.toLowerCase().includes('president') || pos.includes('นายกสมาคม')
  });
  
  const defaultPresident = locale === 'th' ? 'นายกสมาคม JCI กรุงเทพฯ' : 'JCI Bangkok President'
  const presidentName = presidentMember ? presidentMember.name : defaultPresident;

  const metadata = locale === 'th'
    ? (boardYearMetadataTh[year] || { theme: "รับใช้ JCI กรุงเทพฯ", summary: `คณะกรรมการบริหารสำหรับปี ${year}` })
    : (boardYearMetadataEn[year] || { theme: "Serving JCI Bangkok", summary: `The board of directors for the year ${year}.` })

  return (
    <>
      <PageIntro
        title={locale === 'th' ? `คณะกรรมการบริหารปี ${year}` : `${year} board of directors`}
        lead={metadata.summary}
        aside={
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">
              {locale === 'th' ? 'แนวคิดหลักประจำปี' : 'Annual theme'}
            </p>
            <p className="font-display text-3xl leading-none text-[var(--ink)]">
              {metadata.theme}
            </p>
            <p className="text-sm text-[var(--muted)]">
              {locale === 'th' ? 'นายกสมาคม:' : 'Local President:'} {presidentName}
            </p>
          </div>
        }
      />
      <section className="section-space mx-auto w-full max-w-7xl px-5 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-2">
          {members.map((member) => (
            <article key={member.id} className="paper-frame p-7 flex flex-col justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">
                  {member.position}
                </p>
                <h2 className="mt-4 font-display text-4xl leading-none text-[var(--ink)]">
                  {member.name}
                </h2>
                <div className="mt-4 text-base leading-7 text-[var(--muted)]">
                  {member.bio ? (
                    <RichText content={member.bio} />
                  ) : (
                    <p>{locale === 'th' ? 'ไม่มีข้อมูลประวัติ' : 'No bio available.'}</p>
                  )}
                </div>
              </div>
              <p className="mt-5 border-t border-[var(--line)] pt-5 text-sm font-semibold text-[var(--ink)]">
                {member.companyRole || (locale === 'th' ? 'JCI กรุงเทพฯ' : 'JCI Bangkok')}
              </p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

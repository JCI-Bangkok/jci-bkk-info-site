import Link from "next/link";
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { PageIntro } from "@/components/page-intro";
import React from 'react'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    title: locale === 'th' ? 'จดหมายเหตุคณะกรรมการ' : 'Board Archive'
  };
}

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

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function BoardArchivePage({ params }: PageProps) {
  const { locale } = await params
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'board-members',
    locale,
    limit: 150,
  })

  // Group by year and find president
  const presidentsByYear: Record<number, string> = {}
  
  result.docs.forEach((member) => {
    const yr = member.year
    const positionStr = member.position || ''
    const isPresident = member.displayOrder === 1 || 
                        positionStr.toLowerCase().includes('president') || 
                        positionStr.includes('นายกสมาคม')
    
    if (isPresident) {
      presidentsByYear[yr] = member.name
    } else if (!presidentsByYear[yr]) {
      presidentsByYear[yr] = locale === 'th' ? 'นายกสมาคม JCI กรุงเทพฯ' : 'JCI Bangkok President'
    }
  })

  const sortedYears = Object.keys(presidentsByYear)
    .map(Number)
    .sort((a, b) => b - a)

  const boardYearsList = sortedYears.map((yr) => {
    const yearStr = yr.toString()
    const metadata = locale === 'th'
      ? (boardYearMetadataTh[yearStr] || { theme: "รับใช้ JCI กรุงเทพฯ", summary: `คณะกรรมการบริหารสำหรับปี ${yearStr}` })
      : (boardYearMetadataEn[yearStr] || { theme: "Serving JCI Bangkok", summary: `The board of directors for the year ${yearStr}.` })
    return {
      year: yearStr,
      theme: metadata.theme,
      summary: metadata.summary,
      president: presidentsByYear[yr]
    }
  })

  return (
    <>
      <PageIntro
        title={locale === 'th' ? 'จดหมายเหตุคณะกรรมการบริหาร' : 'Board of directors archive'}
        lead={locale === 'th' ? 'ความเป็นผู้นำของ JCI กรุงเทพฯ มีการเปลี่ยนแปลงทุกปี ดังนั้นเว็บไซต์ควรช่วยให้การเข้าชมการกำกับดูแล ความต่อเนื่อง และธีมงานประจำปีเป็นไปได้อย่างราบรื่น' : 'JCI Bangkok leadership changes yearly, so the public site should make governance, continuity, and yearly themes easy to browse.'}
      />
      <section className="section-space mx-auto w-full max-w-7xl px-5 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-2">
          {boardYearsList.map((year) => (
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
                  href={`/${locale}/about/board/${year.year}`}
                  className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold text-[var(--ink)]"
                >
                  {locale === 'th' ? 'ดูข้อมูลคณะกรรมการ' : 'View year'}
                </Link>
              </div>
              <p className="mt-6 text-base leading-7 text-[var(--muted)]">
                {year.summary}
              </p>
              <div className="mt-8 border-t border-[var(--line)] pt-5">
                <p className="text-sm text-[var(--muted)]">{locale === 'th' ? 'นายกสมาคมประจำปี' : 'Local President'}</p>
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

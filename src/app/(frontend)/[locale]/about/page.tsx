import Link from "next/link";
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { CtaBanner } from "@/components/cta-banner";
import { PageIntro } from "@/components/page-intro";
import { opportunities } from "@/lib/site-data";
import React from 'react'
import { getDictionary, Locale } from "@/lib/i18n";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    title: locale === 'th' ? 'เกี่ยวกับเรา' : 'About'
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

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params
  const dict = getDictionary(locale as Locale)
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'board-members',
    locale,
    limit: 150,
  })

  const years = Array.from(new Set(result.docs.map((member) => member.year)))
    .sort((a, b) => b - a)

  const boardYearsList = years.map((yr) => {
    const yearStr = yr.toString()
    const metadata = locale === 'th'
      ? (boardYearMetadataTh[yearStr] || { theme: "รับใช้ JCI กรุงเทพฯ", summary: `คณะกรรมการบริหารสำหรับปี ${yearStr}` })
      : (boardYearMetadataEn[yearStr] || { theme: "Serving JCI Bangkok", summary: `The board of directors for the year ${yearStr}.` })
    return {
      year: yearStr,
      theme: metadata.theme,
      summary: metadata.summary
    }
  })

  // Localize opportunities
  const localizedOpportunities = opportunities.map((opp, idx) => {
    const thOpp = [
      {
        title: "การพัฒนาภาวะผู้นำ",
        summary: "โอกาสในการลงมือปฏิบัติจริงเพื่อนำคณะทำงาน จัดโปรแกรมกิจกรรม และเติบโตอย่างมั่นใจผ่านประสบการณ์ตรง",
        accent: "สำหรับพลเมืองตื่นรู้รุ่นใหม่",
        stat: "อายุระหว่าง 18-40 ปี"
      },
      {
        title: "ธุรกิจและการเป็นผู้ประกอบการ",
        summary: "เครือข่ายสำหรับคนทำงานรุ่นใหม่และผู้ก่อตั้งธุรกิจที่ต้องการฝึกทักษะการสื่อสารที่เฉียบคม คอนเนกชันที่แข็งแกร่ง และการเติบโตอย่างรับผิดชอบ",
        accent: "ธุรกิจ ประชาสังคม และความคิดสร้างสรรค์",
        stat: "ข้ามภาคส่วน"
      },
      {
        title: "ความร่วมมือระหว่างประเทศ",
        summary: "คอนเนกชันไปยังสมาคมท้องถิ่นและองค์กรระดับชาติของ JCI ทั่วโลก รวมถึงกิจกรรมนานาชาติที่จะขยายมุมมองและการร่วมมือของคุณ",
        accent: "เครือข่าย JCI ทั่วโลก",
        stat: "กว่า 100 ประเทศ"
      },
      {
        title: "การสร้างผลกระทบต่อชุมชน",
        summary: "โครงการริเริ่มในกรุงเทพฯ ที่เปลี่ยนไอเดียให้เป็นผลลัพธ์ที่จับต้องได้สำหรับชุมชน พันธมิตร และผู้นำแห่งอนาคต",
        accent: "ผลลัพธ์ที่มีจุดมุ่งหมาย",
        stat: "การลงมือทำในพื้นที่"
      }
    ][idx];

    return {
      title: locale === 'th' ? thOpp.title : opp.title,
      summary: locale === 'th' ? thOpp.summary : opp.summary,
      accent: locale === 'th' ? thOpp.accent : opp.accent,
      stat: locale === 'th' ? thOpp.stat : opp.stat
    }
  });

  return (
    <>
      <PageIntro
        title={locale === 'th' ? 'JCI กรุงเทพฯ เปลี่ยนพันธกิจระดับโลกให้เป็นโอกาสระดับท้องถิ่น' : 'JCI Bangkok turns a global mission into local opportunities.'}
        lead={locale === 'th' ? 'ในฐานะสมาคมท้องถิ่นของ JCI ประเทศไทย JCI กรุงเทพฯ มุ่งสร้างโอกาสความเป็นผู้นำ โครงการ และเครือข่ายสำหรับพลเมืองตื่นรู้รุ่นใหม่ที่ต้องการเติบโตควบคู่ไปกับการทำประโยชน์ให้แก่เมืองของตน' : 'As a local chapter of JCI Thailand, JCI Bangkok creates leadership opportunities, projects, and networks for young active citizens who want to grow while contributing to their city.'}
        aside={
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">
              {locale === 'th' ? 'โครงสร้างองค์กร' : 'Organization hierarchy'}
            </p>
            <div className="space-y-3 text-sm leading-7 text-[var(--muted)]">
              <p>{locale === 'th' ? 'สมาพันธ์สภาวิชาชีพเยาวชนนานาชาติระดับโลก' : 'Junior Chamber International Global'}</p>
              <p className="pl-5">JCI Thailand</p>
              <p className="pl-10 font-semibold text-[var(--ink)]">JCI Bangkok</p>
            </div>
          </div>
        }
      />

      <section className="section-space mx-auto grid w-full max-w-7xl gap-6 px-5 lg:grid-cols-2 lg:px-8">
        <article className="paper-frame p-7">
          <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">
            {dict.about.structureTitle}
          </p>
          <h2 className="mt-4 font-display text-4xl leading-none text-[var(--ink)]">
            {locale === 'th' ? 'บทบาทสำคัญสำหรับผู้นำรุ่นใหม่ที่ต้องการฝึกฝน ไม่ใช่เพียงแค่แรงบันดาลใจ' : 'A chapter for young leaders who want practice, not just inspiration.'}
          </h2>
          <p className="mt-6 text-base leading-7 text-[var(--muted)]">
            {locale === 'th'
              ? 'JCI กรุงเทพฯ ขับเคลื่อนเพื่อคนรุ่นใหม่อายุระหว่าง 18 ถึง 40 ปี ที่ต้องการพัฒนาตนเองผ่านโครงการจริง บทบาทหน้าที่ที่มีความหมาย และเครือข่ายที่พัฒนาวิชาชีพควบคู่ไปกับผลกระทบต่อชุมชน'
              : 'JCI Bangkok exists for people aged 18 to 40 who want to develop through real projects, meaningful roles, and a network that blends professional growth with community impact.'}
          </p>
        </article>
        <article className="paper-frame p-7">
          <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">
            {locale === 'th' ? 'พันธกิจและวิสัยทัศน์' : 'Mission and vision'}
          </p>
          <div className="mt-6 grid gap-5">
            <div className="rounded-[1.6rem] border border-[var(--line)] bg-white/75 p-5">
              <p className="font-semibold text-[var(--ink)]">{locale === 'th' ? 'พันธกิจ' : 'Mission'}</p>
              <p className="mt-2 text-base leading-7 text-[var(--muted)]">
                {locale === 'th'
                  ? 'มอบโอกาสการพัฒนาภาวะผู้นำที่เสริมสร้างพลังให้คนรุ่นใหม่สร้างการเปลี่ยนแปลงเชิงบวก'
                  : 'Provide leadership development opportunities that empower young people to create positive change.'}
              </p>
            </div>
            <div className="rounded-[1.6rem] border border-[var(--line)] bg-white/75 p-5">
              <p className="font-semibold text-[var(--ink)]">{locale === 'th' ? 'วิสัยทัศน์' : 'Vision'}</p>
              <p className="mt-2 text-base leading-7 text-[var(--muted)]">
                {locale === 'th'
                  ? 'เป็นเครือข่ายระดับโลกชั้นนำของผู้นำรุ่นใหม่ ซึ่งแสดงออกในกรุงเทพฯ ผ่านการลงมือทำจริงและความร่วมมือในท้องถิ่น'
                  : 'Be the foremost global network of young leaders, expressed in Bangkok through visible local action and collaboration.'}
              </p>
            </div>
          </div>
        </article>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-20 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-2">
          {localizedOpportunities.map((item) => (
            <article key={item.title} className="paper-frame p-7">
              <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">
                {item.accent}
              </p>
              <h2 className="mt-4 font-display text-4xl leading-none text-[var(--ink)]">
                {item.title}
              </h2>
              <p className="mt-5 text-base leading-7 text-[var(--muted)]">
                {item.summary}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-20 lg:px-8">
        <div className="paper-frame p-7 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">
                {locale === 'th' ? 'จดหมายเหตุคณะกรรมการ' : 'Board archive'}
              </p>
              <h2 className="mt-4 font-display text-5xl leading-none text-[var(--ink)]">
                {locale === 'th' ? 'ความเป็นผู้นำในแต่ละปีมีความสำคัญที่นี่' : 'Yearly leadership matters here.'}
              </h2>
            </div>
            <Link href={`/${locale}/about/board`} className="text-sm font-semibold text-[var(--ink)]">
              {locale === 'th' ? 'ดูจดหมายเหตุคณะกรรมการทั้งหมด' : 'View full board archive'}
            </Link>
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {boardYearsList.map((year) => (
              <article
                key={year.year}
                className="rounded-[1.6rem] border border-[var(--line)] bg-white/75 p-6"
              >
                <div className="flex items-center justify-between">
                  <p className="font-display text-4xl leading-none text-[var(--ink)]">
                    {year.year}
                  </p>
                  <Link
                    href={`/${locale}/about/board/${year.year}`}
                    className="text-sm font-semibold text-[var(--ink)]"
                  >
                    {locale === 'th' ? 'สำรวจรายปี' : 'Explore year'}
                  </Link>
                </div>
                <p className="mt-4 text-sm uppercase tracking-[0.22em] text-[var(--muted)]">
                  {year.theme}
                </p>
                <p className="mt-5 text-base leading-7 text-[var(--muted)]">
                  {year.summary}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        title={locale === 'th' ? 'ดูวิธีการจัดระเบียบความเป็นผู้นำปีต่อปี' : 'See how leadership is organized year by year.'}
        description={locale === 'th' ? 'หอจดหมายเหตุคณะกรรมการช่วยให้สมาชิก พันธมิตร และเครือข่าย JCI ในวงกว้างเข้าใจการกำกับดูแล ความต่อเนื่อง และทิศทางของสมาคม' : 'Board archives help members, partners, and the wider JCI network understand governance, continuity, and chapter direction.'}
        primaryHref={`/${locale}/about/board`}
        primaryLabel={locale === 'th' ? 'เปิดจดหมายเหตุคณะกรรมการ' : 'Open board archive'}
        secondaryHref={`/${locale}/contact`}
        secondaryLabel={locale === 'th' ? 'ติดต่อสมาคม' : 'Contact the chapter'}
      />
    </>
  );
}

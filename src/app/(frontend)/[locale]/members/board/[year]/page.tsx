import { notFound } from "next/navigation";
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { PageIntro } from "@/components/page-intro";
import { RichText } from "@/components/rich-text";
import Image from "next/image";
import React from 'react'

type BoardYearPageProps = {
  params: Promise<{ locale: string; year: string }>;
};

const boardYearMetadataEn: Record<string, { theme: string; summary: string }> = {
  "2026": {
    theme: "Young to Yak",
    summary: "A board focused on member growth, stronger partnerships, and visible project delivery in Bangkok."
  },
  "2025": {
    theme: "Action that connects.",
    summary: "A year centered on visible programming, stronger event cadence, and rebuilding chapter momentum."
  }
}

const boardYearMetadataTh: Record<string, { theme: string; summary: string }> = {
  "2026": {
    theme: "Young to Yak",
    summary: "คณะกรรมการที่มุ่งเน้นการเติบโตของสมาชิก การสร้างพันธมิตรที่แข็งแกร่ง และโครงการที่เห็นผลชัดเจนในกรุงเทพฯ"
  },
  "2025": {
    theme: "การลงมือทำที่เชื่อมโยงถึงกัน",
    summary: "ปีที่มุ่งเน้นกิจกรรมที่เห็นผลชัดเจน ความต่อเนื่องของงาน และการสร้างแรงขับเคลื่อนใหม่ให้สมาคม"
  }
}

export async function generateStaticParams() {
  try {
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
  } catch (error) {
    console.error("Error generating static params for board [year]:", error)
    return []
  }
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

  const membersResult = await payload.find({
    collection: 'members',
    locale,
    sort: 'displayOrder',
    limit: 200,
  })
  const regularMembers = membersResult.docs;

  const members = result.docs;

  if (members.length === 0) {
    notFound();
  }

  // Find president
  const presidentMember = members.find((m) => {
    const pos = m.position || ''
    return m.displayOrder === 1 || pos.toLowerCase().includes('president') || pos.includes('นายกสมาคม')
  });
  
  const defaultPresident = locale === 'th' ? 'นายกสมาคม JCI Bangkok' : 'JCI Bangkok President'
  const presidentName = presidentMember ? presidentMember.name : defaultPresident;

  const metadata = locale === 'th'
    ? (boardYearMetadataTh[year] || { theme: "รับใช้ JCI Bangkok", summary: `คณะกรรมการบริหารประจำปี ${year}` })
    : (boardYearMetadataEn[year] || { theme: "Serving JCI Bangkok", summary: `The board of directors for the year ${year}.` })

  return (
    <>
      <PageIntro
        title={locale === 'th' ? `คณะกรรมการบริหารปี ${year}` : `${year} board of directors`}
        lead={metadata.summary}
        aside={
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">
              {locale === 'th' ? 'ธีมประจำปี' : 'Annual theme'}
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
      <section className="mx-auto w-full max-w-7xl px-5 pb-24 lg:px-8 lg:pb-32">
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
          {members.map((member) => (
            <li
              key={member.id}
              className="group flex flex-col overflow-hidden rounded-[2rem] border border-[var(--line)] bg-white transition-shadow hover:shadow-[0_18px_45px_rgba(19,15,45,0.06)]"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--paper-soft)]">
                {member.photo && typeof member.photo === 'object' && member.photo.url ? (
                  <Image
                    src={member.photo.url}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-4xl font-display text-[var(--muted)] opacity-20">
                    JCI
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-2xl leading-none text-[var(--ink)]">
                  {member.name}
                </h3>
                <p className="mt-2 font-medium text-[var(--jci-blue)]">
                  {member.position}
                </p>
                
                {(member.companyRole || member.yearJoined) && (
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                    {member.companyRole && <span>{member.companyRole}</span>}
                    {member.companyRole && member.yearJoined && <span>&bull;</span>}
                    {member.yearJoined && <span>Joined {member.yearJoined}</span>}
                  </div>
                )}

                <div className="mt-4 flex flex-1 flex-col">
                  {member.bio && (
                    <div className="relative mt-4 text-sm leading-6 text-[var(--ink-soft)] italic before:content-['\x22'] before:absolute before:-left-3 before:-top-2 before:text-3xl before:text-[var(--jci-blue)] before:opacity-30 ml-3">
                      <RichText content={member.bio} />
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* General Members Section */}
      {regularMembers.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-5 pb-24 lg:px-8 lg:pb-32 border-t border-[var(--line)] pt-24 mt-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-semibold text-[var(--ink)]">
              {locale === 'th' ? 'ทำเนียบสมาชิก JCI Bangkok' : 'JCI Bangkok Member Directory'}
            </h2>
            <p className="mt-4 text-lg text-[var(--muted)] max-w-2xl mx-auto">
              {locale === 'th' ? 'เหล่าสมาชิกผู้ขับเคลื่อนองค์กรและสร้างพลังการเปลี่ยนแปลง' : 'The active members driving our chapter and creating positive change.'}
            </p>
          </div>

          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {regularMembers.map((member) => (
              <li key={member.id} className="flex flex-col items-center group text-center">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-[var(--paper-soft)] relative mb-4">
                  {member.photo && typeof member.photo === 'object' && member.photo.url ? (
                    <Image 
                      src={member.photo.url} 
                      alt={member.name} 
                      fill 
                      sizes="128px"
                      className="object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-xl font-display text-[var(--muted)] opacity-20">
                      JCI
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-[var(--ink)] text-sm sm:text-base">{member.name}</h3>
                <p className="text-xs text-[var(--muted)] mt-1">{member.companyRole || (locale === 'th' ? 'สมาชิกทั่วไป' : 'Active Member')}</p>
                {member.yearJoined && (
                  <p className="text-[10px] uppercase tracking-wider text-[var(--jci-blue)] font-bold mt-2">Joined {member.yearJoined}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

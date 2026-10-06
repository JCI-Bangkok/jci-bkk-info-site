import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { mediaUrl } from '@/lib/activity-data'
import { getDictionary, type Locale } from '@/lib/i18n'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return { title: locale === 'th' ? 'สมาชิกและคณะกรรมการบริหาร' : 'Members' }
}

export default async function MembersPage({ params, searchParams }: {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{ year?: string }>
}) {
  const { locale } = await params
  const { year } = await searchParams
  const dict = getDictionary(locale)
  const payload = await getPayload({ config })
  const [board, stories] = await Promise.all([
    payload.find({ collection: 'board-members', locale, depth: 1, pagination: false, sort: 'displayOrder' }),
    payload.find({ collection: 'member-stories', locale, depth: 1, limit: 6 }),
  ])
  const years: number[] = [...new Set<number>(board.docs.map(member => member.year))].sort((a, b) => b - a)
  const activeYear = years.includes(Number(year)) ? Number(year) : years[0]
  const members = board.docs.filter(member => member.year === activeYear)

  return <>
    <section className="border-b border-[var(--line)] bg-[var(--paper-soft)]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-5 py-10 lg:px-8">
        <div>
          <h1 className="text-4xl font-semibold">{dict.nav.members}</h1>
          <p className="mt-3 text-[var(--muted)]">{dict.about.boardSub}</p>
        </div>
        <Link href={`/${locale}/membership`} className="button-primary">{dict.nav.becomeMember}</Link>
      </div>
    </section>
    <section id="board" className="mx-auto max-w-7xl scroll-mt-40 px-5 py-10 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">{dict.about.boardTitle}{activeYear ? ` ปี ${activeYear}` : ''}</h2>
        <nav aria-label={locale === 'th' ? 'ปีคณะกรรมการ' : 'Board year'} className="flex flex-wrap gap-4">
          {years.map(value => <Link key={value} href={`/${locale}/members?year=${value}#board`} aria-current={value === activeYear ? 'page' : undefined} className={`text-sm font-semibold ${value === activeYear ? 'text-[var(--jci-blue)] underline underline-offset-4' : 'text-[var(--muted)]'}`}>{value}</Link>)}
        </nav>
      </div>
      {members.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {members.map(member => <article key={member.id} className="min-w-0">
          {mediaUrl(member.photo) && <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
            <Image src={mediaUrl(member.photo)!} alt={member.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover" />
          </div>}
          <h3 className="mt-4 text-lg font-semibold">{member.name}</h3>
          <p className="mt-1 text-sm text-[var(--jci-blue)]">{member.position}</p>
          
        </article>)}
      </div> : <p className="text-[var(--muted)]">{dict.common.noData}</p>}
      {activeYear && <Link href={`/${locale}/members/board/${activeYear}`} className="mt-6 inline-block text-sm font-semibold text-[var(--jci-blue)]">{locale === 'th' ? 'ดูประวัติคณะกรรมการและธีมประจำปี' : 'Board biographies & annual profile'}</Link>}
    </section>
    {stories.docs.length > 0 && <section className="border-t border-[var(--line)]">
      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <h2 className="mb-6 text-2xl font-semibold">{dict.home.memberVoice}</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {stories.docs.map(story => <figure key={story.id}>
            {mediaUrl(story.photo) && <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-lg"><Image src={mediaUrl(story.photo)!} alt={story.memberName} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" /></div>}
            <blockquote className="text-sm leading-7 text-[var(--muted)]">{story.quote}</blockquote>
            <figcaption className="mt-3 font-semibold">{story.memberName}<span className="mt-1 block text-sm font-normal text-[var(--muted)]">{story.chapterRole}</span></figcaption>
          </figure>)}
        </div>
      </div>
    </section>}
  </>
}

import { cmsStaticMetadata } from '@/lib/cms-seo'
import Link from 'next/link'
import { getActivities } from '@/lib/activity-data'
import { PaginatedGrid } from '@/components/paginated-grid'
import { EventCalendar } from '@/components/event-calendar'
import { getDictionary, type Locale } from '@/lib/i18n'

export const revalidate = 300

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return cmsStaticMetadata(locale, 'events')
}

export default async function EventsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const dict = getDictionary(locale)
  const { activities, today } = await getActivities(locale)
  const groups = [
    { id: 'upcoming', title: dict.events.upcoming, items: activities.filter(item => item.upcoming) },
    { id: 'past', title: locale === 'th' ? 'กิจกรรมและโครงการที่ผ่านมา' : 'Past Events & Projects', items: activities.filter(item => !item.upcoming && item.kind !== 'update').sort((a, b) => (b.date || String(b.year)).localeCompare(a.date || String(a.year))) },
    { id: 'updates', title: locale === 'th' ? 'ข่าวสารเพิ่มเติม' : 'Chapter Updates', items: activities.filter(item => item.kind === 'update') },
  ]
  return <>
    <section className="border-b border-[var(--line)] bg-[var(--paper-soft)]">
      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <h1 className="text-4xl font-semibold">{dict.events.title}</h1>
        <p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">{dict.events.sub}</p>
        <nav aria-label={dict.events.title} className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-[var(--jci-blue)]">
          <a href="#calendar">{locale === 'th' ? 'ปฏิทิน' : 'Calendar'}</a>
          {groups.map(group => <a key={group.id} href={`#${group.id}`}>{group.title}</a>)}
        </nav>
      </div>
    </section>
    <section id="calendar" className="mx-auto max-w-7xl scroll-mt-40 px-5 py-10 lg:px-8">
      <h2 className="mb-5 text-2xl font-semibold">{locale === 'th' ? 'ปฏิทินกิจกรรม' : 'Event Calendar'}</h2>
      <EventCalendar events={activities.filter(item => item.kind === 'event')} locale={locale} today={today} />
    </section>
    {groups.map(group => <section key={group.id} id={group.id} className="scroll-mt-40 border-t border-[var(--line)]">
      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <h2 className="mb-5 text-2xl font-semibold">{group.title}</h2>
        <PaginatedGrid items={group.items} locale={locale} itemsPerPage={6} />
        {group.items.length > 6 && <details className="mt-6 rounded-xl border border-[var(--line)] p-5">
          <summary className="cursor-pointer font-semibold">{locale === 'th' ? 'ดูรายการทั้งหมด' : 'Browse the full archive'}</summary>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {group.items.map(item => <li key={item.id}><Link href={item.href} className="text-[var(--jci-blue)] hover:underline">{item.title}</Link></li>)}
          </ul>
        </details>}
      </div>
    </section>)}
    <section className="border-t border-[var(--line)] bg-[var(--paper-soft)]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-8 lg:px-8">
        <h2 className="text-xl font-semibold">{locale === 'th' ? 'ร่วมเป็นส่วนหนึ่งของ JCI Bangkok' : 'Be part of JCI Bangkok.'}</h2>
        <Link href={`/${locale}/membership`} className="button-primary">{dict.nav.becomeMember}</Link>
      </div>
    </section>
  </>
}

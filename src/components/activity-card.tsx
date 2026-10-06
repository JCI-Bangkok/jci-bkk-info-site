import Image from 'next/image'
import Link from 'next/link'
import type { Activity } from '@/lib/activity-data'
import type { Locale } from '@/lib/i18n'
import { formatBangkokDate, formatBangkokTime, hasSpecificBangkokTime, bangkokDay } from '@/lib/calendar-date'

export function ActivityCard({ activity, locale }: { activity: Activity; locale: Locale }) {
  const dateText = activity.date
    ? activity.endDate && bangkokDay(activity.endDate) !== bangkokDay(activity.date)
      ? `${formatBangkokDate(activity.date, locale)} – ${formatBangkokDate(activity.endDate, locale)}`
      : formatBangkokDate(activity.date, locale)
    : activity.year

  const timeText = activity.time || (activity.date && hasSpecificBangkokTime(activity.date) ? formatBangkokTime(activity.date, locale) : null)

  return <article className="min-w-0 overflow-hidden rounded-lg border border-[var(--line)] bg-white">
    <Link href={activity.href} tabIndex={-1} aria-hidden="true" className="relative block aspect-[16/9]">
      <Image src={activity.image} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" />
    </Link>
    <div className="p-5">
      <div className="flex flex-wrap items-center gap-x-2 text-xs text-[var(--muted)]">
        <span>{dateText}</span>
        {timeText && <span>&middot; {timeText}</span>}
      </div>
      <h3 className="mt-2 text-xl font-semibold leading-snug"><Link href={activity.href} className="hover:text-[var(--jci-blue)]">{activity.title}</Link></h3>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--muted)]">{activity.summary}</p>
      {activity.venue && <p className="mt-3 text-sm">{activity.venue}</p>}
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <Link href={activity.href} className="text-sm font-semibold text-[var(--jci-blue)]">{locale === 'th' ? 'ดูรายละเอียด' : 'View details'}</Link>
        {activity.upcoming && activity.registration && <a href={activity.registration} target="_blank" rel="noopener noreferrer" className="button-primary">{locale === 'th' ? 'ลงทะเบียน' : 'Register'}</a>}
      </div>
    </div>
  </article>
}

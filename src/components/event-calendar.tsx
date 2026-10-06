'use client'

import { useState } from 'react'
import Link from 'next/link'
import { bangkokDay } from '@/lib/calendar-date'
import type { Activity } from '@/lib/activity-data'
import type { Locale } from '@/lib/i18n'

export function EventCalendar({ events, locale, today }: { events: Activity[]; locale: Locale; today: string }) {
  const [month, setMonth] = useState(today.slice(0, 7))
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  
  const [year, monthNumber] = month.split('-').map(Number)
  const days = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate()
  const offset = new Date(Date.UTC(year, monthNumber - 1, 1)).getUTCDay()
  
  const monthOptions = Array.from({ length: 12 }, (_, index) => ({
    value: index + 1,
    label: new Intl.DateTimeFormat(locale === 'th' ? 'th-TH' : 'en-GB', { month: 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(2026, index, 1))),
  }))
  
  const eventYears = events.flatMap(event => event.date ? [Number(bangkokDay(event.date).slice(0, 4))] : [])
  const currentYear = Number(today.slice(0, 4))
  const yearOptions = Array.from(new Set([...eventYears, currentYear - 1, currentYear, currentYear + 1])).sort((a, b) => a - b)
  
  // Use proper Thai abbreviations
  const labels = locale === 'th' ? ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  const inMonth = events.filter(event => event.date && bangkokDay(event.date).startsWith(month))
  const visible = selectedDay ? inMonth.filter(event => bangkokDay(event.date!) === selectedDay) : inMonth
  
  // Split visible events into Upcoming and Past
  const upcomingEvents = visible.filter(e => e.upcoming)
  const pastEvents = visible.filter(e => !e.upcoming)

  const formattedMonth = new Intl.DateTimeFormat(locale === 'th' ? 'th-TH' : 'en-GB', {
    month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, monthNumber - 1, 1)))
  
  const updateMonth = (nextYear: number, nextMonth: number) => {
    setMonth(`${nextYear}-${String(nextMonth).padStart(2, '0')}`)
    setSelectedDay(null)
  }
  
  const goToNextMonth = () => {
    const nextDate = new Date(Date.UTC(year, monthNumber, 1))
    updateMonth(nextDate.getUTCFullYear(), nextDate.getUTCMonth() + 1)
  }
  
  const goToPreviousMonth = () => {
    const previousDate = new Date(Date.UTC(year, monthNumber - 2, 1))
    updateMonth(previousDate.getUTCFullYear(), previousDate.getUTCMonth() + 1)
  }

  return (
    <div className="grid min-w-0 gap-8 lg:gap-12 lg:grid-cols-2">
      <div className="min-w-0">
        <div className="mb-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <button type="button" onClick={goToPreviousMonth}
              className="flex h-9 w-9 items-center justify-center rounded border border-[var(--line)] bg-white text-sm font-semibold text-[var(--jci-blue)] hover:bg-[var(--paper-soft)]">
              &larr;
            </button>
            <h3 className="text-lg font-semibold text-center" aria-live="polite">{formattedMonth}</h3>
            <button type="button" onClick={goToNextMonth}
              className="flex h-9 w-9 items-center justify-center rounded border border-[var(--line)] bg-white text-sm font-semibold text-[var(--jci-blue)] hover:bg-[var(--paper-soft)]">
              &rarr;
            </button>
          </div>
          <div className="flex items-end justify-center gap-2">
            <label className="grid gap-1 text-xs">
              {locale === 'th' ? 'เดือน' : 'Month'}
              <select value={monthNumber} onChange={event => updateMonth(year, Number(event.target.value))}
                className="w-full rounded border border-[var(--line)] bg-white p-2 text-sm">
                {monthOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
            <label className="grid gap-1 text-xs">
              {locale === 'th' ? 'ปี' : 'Year'}
              <select value={year} onChange={event => updateMonth(Number(event.target.value), monthNumber)}
                className="w-full rounded border border-[var(--line)] bg-white p-2 text-sm">
                {yearOptions.map(option => <option key={option} value={option}>{locale === 'th' ? option + 543 : option}</option>)}
              </select>
            </label>
            <button type="button" onClick={() => { setMonth(today.slice(0, 7)); setSelectedDay(null) }}
              className="whitespace-nowrap rounded border border-[var(--line)] bg-white p-2 text-sm font-semibold text-[var(--jci-blue)] hover:bg-[var(--paper-soft)]">
              {locale === 'th' ? 'วันนี้' : 'Today'}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 border-l border-t border-[var(--line)]">
          {labels.map(label => <div key={label} className="border-b border-r border-[var(--line)] bg-[var(--paper-soft)] py-2 text-center text-xs">{label}</div>)}
          {Array.from({ length: Math.ceil((offset + days) / 7) * 7 }, (_, index) => {
            const day = index - offset + 1
            if (day < 1 || day > days) return <div key={index} aria-hidden="true" className="border-b border-r border-[var(--line)] bg-[var(--paper-soft)]" />
            const date = `${year}-${String(monthNumber).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const count = inMonth.filter(event => bangkokDay(event.date!) === date).length
            return <button key={index} type="button"
              aria-label={`${date}, ${count} ${locale === 'th' ? 'กิจกรรม' : 'events'}`}
              aria-pressed={selectedDay === date}
              aria-current={date === today ? 'date' : undefined}
              onClick={() => setSelectedDay(selectedDay === date ? null : date)}
              className={`relative flex min-h-12 min-w-0 flex-col items-center justify-center border-b border-r border-[var(--line)] p-1 text-sm focus-visible:outline-2 focus-visible:outline-offset-[-2px] ${selectedDay === date ? 'bg-[var(--jci-blue)] text-white' : date === today ? 'bg-[var(--paper-tint)] font-bold' : 'bg-white hover:bg-[var(--paper-soft)]'}`}>
              {day}<span className={`mt-1 h-1.5 w-1.5 rounded-full ${count ? 'bg-current' : 'bg-transparent'}`} />
            </button>
          })}
        </div>
      </div>
      
      {/* Right Sidebar: Events List */}
      <div className="min-w-0 lg:pl-8" aria-live="polite">
        <h3 className="mb-4 text-lg font-semibold">
          {selectedDay 
            ? new Intl.DateTimeFormat(locale === 'th' ? 'th-TH' : 'en-GB', { dateStyle: 'long', timeZone: 'Asia/Bangkok' }).format(new Date(selectedDay + 'T00:00:00+07:00')) 
            : locale === 'th' ? 'กิจกรรมในเดือนนี้' : 'In this month'}
        </h3>
        
        {!visible.length ? (
          <p className="text-sm text-[var(--muted)]">{locale === 'th' ? 'ไม่มีกิจกรรม' : 'No events found.'}</p>
        ) : (
          <div className="space-y-6">
            {upcomingEvents.length > 0 && (
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--jci-blue)] mb-2 border-b border-[var(--line)] pb-1">
                  {locale === 'th' ? 'กำลังจะเกิด' : 'Upcoming'}
                </h4>
                <ul className="divide-y divide-[var(--line)]">
                  {upcomingEvents.map(event => (
                    <li key={event.id} className="py-3">
                      <Link href={event.href} className="font-semibold hover:text-[var(--jci-blue)]">{event.title}</Link>
                      <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-sm text-[var(--muted)]">
                        <time dateTime={event.date!}>{new Intl.DateTimeFormat(locale === 'th' ? 'th-TH' : 'en-GB', { dateStyle: 'medium', timeZone: 'Asia/Bangkok' }).format(new Date(event.date!))}</time>
                        {event.venue && <span className="truncate">&middot; {event.venue}</span>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {pastEvents.length > 0 && (
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--muted)] mb-2 border-b border-[var(--line)] pb-1">
                  {locale === 'th' ? 'ผ่านไปแล้ว' : 'Past'}
                </h4>
                <ul className="divide-y divide-[var(--line)]">
                  {pastEvents.map(event => (
                    <li key={event.id} className="py-3">
                      <Link href={event.href} className="font-semibold text-[var(--muted)] hover:text-[var(--jci-blue)]">{event.title}</Link>
                      <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-sm text-[var(--muted)]">
                        <time dateTime={event.date!}>{new Intl.DateTimeFormat(locale === 'th' ? 'th-TH' : 'en-GB', { dateStyle: 'medium', timeZone: 'Asia/Bangkok' }).format(new Date(event.date!))}</time>
                        {event.venue && <span className="truncate">&middot; {event.venue}</span>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

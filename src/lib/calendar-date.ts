export function bangkokDay(date: string | Date): string {
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return ''
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(parsed)
}

export function formatBangkokDate(date: string | Date, locale: string = 'en'): string {
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return typeof date === 'string' ? date : ''
  const code = locale === 'th' ? 'th-TH' : 'en-US'
  return parsed.toLocaleDateString(code, {
    timeZone: 'Asia/Bangkok',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatBangkokTime(date: string | Date, locale: string = 'en'): string {
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return ''
  const formatted = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Bangkok',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(parsed)
  return locale === 'th' ? `${formatted} น.` : `${formatted} (BKK)`
}

export function hasSpecificBangkokTime(dateStr?: string | null): boolean {
  if (!dateStr || typeof dateStr !== 'string') return false
  const parsed = new Date(dateStr)
  if (Number.isNaN(parsed.getTime())) return false

  // If the time is UTC midnight (00:00:00.000Z) or Bangkok midnight (17:00:00.000Z prev day),
  // it was entered as a date-only timestamp without specific hours/minutes.
  const utcHours = parsed.getUTCHours()
  const utcMinutes = parsed.getUTCMinutes()
  const utcSeconds = parsed.getUTCSeconds()

  if (utcHours === 0 && utcMinutes === 0 && utcSeconds === 0) return false
  if (utcHours === 17 && utcMinutes === 0 && utcSeconds === 0) return false

  return true
}

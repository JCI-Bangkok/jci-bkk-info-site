'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { Locale } from '@/lib/i18n'

export function LanguageSelector({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale === currentLocale) return

    // Set cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`

    // Reconstruct pathname with new locale
    const segments = pathname.split('/')
    // segments[0] is empty because pathname starts with /
    // segments[1] is the current locale (en or th)
    if (segments[1] === 'en' || segments[1] === 'th') {
      segments[1] = newLocale
    } else {
      // Fallback just in case pathname doesn't have locale
      segments.splice(1, 0, newLocale)
    }

    const newPathname = segments.join('/')
    const queryStr = searchParams.toString()
    const targetUrl = queryStr ? `${newPathname}?${queryStr}` : newPathname

    // Navigate to target URL with a full page reload to ensure document lang and layouts refresh correctly
    window.location.href = targetUrl
  }

  return (
    <div className="relative inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--paper-soft)] p-1">
      <button
        onClick={() => handleLocaleChange('en')}
        className={`px-3 py-1 text-xs font-bold transition-all duration-200 rounded-full ${
          currentLocale === 'en'
            ? 'bg-white text-[var(--jci-blue)] shadow-sm'
            : 'text-[var(--muted)] hover:text-[var(--ink)]'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <span className="text-[var(--line)] select-none">|</span>
      <button
        onClick={() => handleLocaleChange('th')}
        className={`px-3 py-1 text-xs font-bold transition-all duration-200 rounded-full ${
          currentLocale === 'th'
            ? 'bg-white text-[var(--jci-blue)] shadow-sm'
            : 'text-[var(--muted)] hover:text-[var(--ink)]'
        }`}
        aria-label="สลับเป็นภาษาไทย"
      >
        TH
      </button>
    </div>
  )
}

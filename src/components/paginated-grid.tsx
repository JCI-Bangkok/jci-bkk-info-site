'use client'

import React, { useState, useRef } from 'react'
import { ActivityCard } from './activity-card'
import type { Activity } from '@/lib/activity-data'

import type { Locale } from '@/lib/i18n'

type PaginatedGridProps = {
  items: Activity[]
  locale: Locale
  itemsPerPage?: number
}

export function PaginatedGrid({ items, locale, itemsPerPage = 6 }: PaginatedGridProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)

  const totalPages = Math.ceil(items.length / itemsPerPage)
  
  const [prevItems, setPrevItems] = useState(items)
  if (items !== prevItems) {
    setPrevItems(items)
    setCurrentPage(1)
  }

  if (items.length === 0) {
    return <p className="py-4 text-[var(--muted)]">{locale === 'th' ? 'ไม่มีข้อมูล' : 'No data available.'}</p>
  }

  const startIndex = (currentPage - 1) * itemsPerPage
  const visibleItems = items.slice(startIndex, startIndex + itemsPerPage)

  const goToPage = (page: number) => {
    setCurrentPage(page)
    // Optional: Scroll to top of the grid smoothly
    if (containerRef.current) {
      const top = containerRef.current.getBoundingClientRect().top + window.scrollY - 100
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <div ref={containerRef}>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visibleItems.map(activity => (
          <ActivityCard key={activity.id} activity={activity} locale={locale} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <button
            onClick={() => goToPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-white text-[var(--ink)] hover:bg-[var(--paper-tint)] disabled:opacity-50 disabled:hover:bg-white"
            aria-label="Previous Page"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  currentPage === page 
                    ? 'bg-[var(--jci-blue)] text-white' 
                    : 'bg-white text-[var(--ink)] hover:bg-[var(--paper-tint)] border border-[var(--line)]'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-white text-[var(--ink)] hover:bg-[var(--paper-tint)] disabled:opacity-50 disabled:hover:bg-white"
            aria-label="Next Page"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      )}
    </div>
  )
}

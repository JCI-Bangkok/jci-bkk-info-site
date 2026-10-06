'use client'
import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { mediaUrl } from '@/lib/media'

export function PaginatedGallery({ images, alt }: { images: any[], alt: string }) {
  const [currentPage, setCurrentPage] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)
  const itemsPerPage = 9

  const validImages = images.filter(item => item && item.image && mediaUrl(item.image))
  if (validImages.length === 0) return null

  const totalPages = Math.ceil(validImages.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const visibleItems = validImages.slice(startIndex, startIndex + itemsPerPage)

  const goToPage = (page: number) => {
    setCurrentPage(page)
    if (containerRef.current) {
      const top = containerRef.current.getBoundingClientRect().top + window.scrollY - 100
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <div ref={containerRef}>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {visibleItems.map((item, i) => (
          <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden border border-[var(--line)]">
            <Image src={mediaUrl(item.image)!} alt={alt} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover" />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button onClick={() => goToPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-white text-[var(--ink)] hover:bg-[var(--paper-tint)] disabled:opacity-50 disabled:hover:bg-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button key={page} onClick={() => goToPage(page)} className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors ${currentPage === page ? 'bg-[var(--jci-blue)] text-white' : 'bg-white text-[var(--ink)] hover:bg-[var(--paper-tint)] border border-[var(--line)]'}`}>
                {page}
              </button>
            ))}
          </div>
          <button onClick={() => goToPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-white text-[var(--ink)] hover:bg-[var(--paper-tint)] disabled:opacity-50 disabled:hover:bg-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      )}
    </div>
  )
}

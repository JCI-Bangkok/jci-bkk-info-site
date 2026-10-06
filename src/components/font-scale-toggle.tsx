'use client'

import { useEffect, useState } from 'react'

const FONT_SCALES = [
  { key: 'sm', label: 'A', scale: 1 },
  { key: 'md', label: 'A+', scale: 1.5 },
  { key: 'lg', label: 'A++', scale: 2 },
] as const

type FontScaleKey = (typeof FONT_SCALES)[number]['key']

const STORAGE_KEY = 'jci-font-scale'

function applyFontScale(scale: number) {
  document.documentElement.style.setProperty('--font-scale', String(scale))
}

export function FontScaleToggle() {
  const [activeScale, setActiveScale] = useState<FontScaleKey>('sm')

  useEffect(() => {
    const savedScale = window.localStorage.getItem(STORAGE_KEY) as FontScaleKey | null
    const selected = FONT_SCALES.find((option) => option.key === savedScale) ?? FONT_SCALES[0]
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveScale(selected.key)
    applyFontScale(selected.scale)
  }, [])

  const handleChange = (nextScale: FontScaleKey) => {
    const selected = FONT_SCALES.find((option) => option.key === nextScale)
    if (!selected) return

    setActiveScale(nextScale)
    applyFontScale(selected.scale)
    window.localStorage.setItem(STORAGE_KEY, nextScale)
  }

  return (
    <div
      className="relative inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--paper-soft)] p-1"
      aria-label="Font size controls"
    >
      {FONT_SCALES.map((option) => (
        <button
          key={option.key}
          type="button"
          onClick={() => handleChange(option.key)}
          className={`rounded-full px-3 py-1 text-xs font-bold transition-all duration-200 ${
            activeScale === option.key
              ? 'bg-white text-[var(--jci-blue)] shadow-sm'
              : 'text-[var(--muted)] hover:text-[var(--ink)]'
          }`}
          aria-pressed={activeScale === option.key}
          aria-label={`Set font size to ${option.scale}x`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

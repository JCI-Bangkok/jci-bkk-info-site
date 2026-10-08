import Link from "next/link";
import React from "react";
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

import { BrandMark } from "@/components/brand-mark";
import { FontScaleToggle } from "@/components/font-scale-toggle";
import { getDictionary, Locale } from "@/lib/i18n";
import { LanguageSelector } from "./language-selector";

export async function SiteHeader({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  let settings: { logo?: unknown; mainNav?: { label: string; href: string }[] } | null = null
  let navigationGlobal: { items?: { label: string; labelTh?: string; href: string }[] } | null = null
  try {
    const payload = await getPayload({ config: configPromise })
    settings = await payload.findGlobal({
      slug: 'site-settings',
      locale: locale as any,
    }) as any
    navigationGlobal = await payload.findGlobal({ slug: 'navigation' }) as any
  } catch (error) {
    console.error('Error fetching site settings in header:', error)
  }

  const logoUrl = (settings?.logo && typeof settings.logo === 'object' && 'url' in settings.logo && typeof (settings.logo as { url: unknown }).url === 'string') ? (settings.logo as { url: string }).url : '/brand/logo-ribbon.png'

  const navItems = navigationGlobal?.items?.length
    ? navigationGlobal.items.map((item) => ({ label: locale === 'th' ? item.labelTh || item.label : item.label, href: item.href }))
    : settings?.mainNav?.length
      ? settings.mainNav
      : [
          { href: '/', label: dict.nav.home }, { href: '/events', label: dict.nav.events },
          { href: '/members', label: dict.nav.members }, { href: '/photobomb', label: 'PhotoBomb' },
          { href: '/about', label: dict.nav.about }, { href: '/contact', label: dict.nav.contact },
        ]

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[color:rgba(255,255,255,0.92)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-5 py-3 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <BrandMark locale={locale} logoUrl={logoUrl} />
          <div className="flex flex-wrap items-center gap-2 lg:hidden">
            <FontScaleToggle />
            <LanguageSelector currentLocale={locale} />
            <Link
              href={`/${locale}/membership`}
              className="inline-flex rounded-full bg-[var(--jci-blue)] px-4 py-2 text-[0.8125rem] font-semibold text-white transition hover:bg-[var(--jci-navy)]"
            >
              {dict.nav.join}
            </Link>
          </div>
        </div>
        <nav className="flex gap-x-6 gap-y-2 overflow-x-auto whitespace-nowrap pb-1 text-[0.8125rem] font-semibold text-[var(--muted)] [scrollbar-width:none] lg:flex-wrap lg:overflow-visible lg:whitespace-normal lg:pb-0">
          {navItems.map((item) => {
            const href = item.href === "/" ? `/${locale}` : item.href.startsWith(`/${locale}`) ? item.href : `/${locale}${item.href.startsWith('/') ? '' : '/'}${item.href}`;
            return (
              <Link
                key={item.href}
                href={href}
                className="transition hover:text-[var(--jci-blue)]"
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden items-center gap-4 lg:inline-flex">
          <FontScaleToggle />
          <LanguageSelector currentLocale={locale} />
          <Link
            href={`/${locale}/membership`}
            className="rounded-full bg-[var(--jci-blue)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--jci-navy)]"
          >
            {dict.nav.becomeMember}
          </Link>
        </div>
      </div>
    </header>
  );
}


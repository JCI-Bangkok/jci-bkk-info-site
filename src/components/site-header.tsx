import Link from "next/link";
import React from "react";
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

import { BrandMark } from "@/components/brand-mark";
import { FontScaleToggle } from "@/components/font-scale-toggle";
import { navigation } from "@/lib/site-data";
import { getDictionary, Locale } from "@/lib/i18n";
import { LanguageSelector } from "./language-selector";

export async function SiteHeader({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  let settings: { logo?: unknown } | null = null
  try {
    const payload = await getPayload({ config: configPromise })
    settings = await payload.findGlobal({
      slug: 'site-settings',
      locale: locale as any,
    }) as any
  } catch (error) {
    console.error('Error fetching site settings in header:', error)
  }

  const logoUrl = (settings?.logo && typeof settings.logo === 'object' && 'url' in settings.logo && typeof (settings.logo as { url: unknown }).url === 'string') ? (settings.logo as { url: string }).url : '/brand/logo-ribbon.png'

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
          {navigation.map((item) => {
            const navKey = item.label.toLowerCase() as keyof typeof dict.nav;
            const label = dict.nav[navKey] || item.label;
            const href = item.href === "/" ? `/${locale}` : `/${locale}${item.href}`;
            return (
              <Link
                key={item.href}
                href={href}
                className="transition hover:text-[var(--jci-blue)]"
              >
                {label}
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



"use client"

import React from 'react'
import { useDocumentData } from './DocumentContext'
import { resolveNavigationItems } from '@/lib/navigation'
import { mediaUrl } from '@/lib/media'

export function GlobalHeaderBlock({ showNavigation, showLanguageSwitch, ctaLabel, ctaHref, style }: { showNavigation: boolean; showLanguageSwitch: boolean; ctaLabel: string; ctaHref: string; style: 'floating' | 'solid' | 'minimal' }) {
  const data = useDocumentData() || {}
  const locale = data.currentLocale || 'en'
  const nav = resolveNavigationItems(data.navigation?.items, locale)
  const cta = resolveNavigationItems([{ label: ctaLabel, linkType: 'custom', href: ctaHref || '/membership' }], locale)[0]
  const logo = mediaUrl(data.settings?.logo) || '/brand/logo-ribbon.png'
  const classes = style === 'floating' ? 'mx-auto mt-3 max-w-7xl rounded-2xl border shadow-lg' : style === 'minimal' ? 'border-b' : 'border-b bg-white'
  return <header className={`relative z-40 border-[var(--line)] bg-white/95 backdrop-blur-xl ${classes}`}>
    <div className="mx-auto flex min-h-20 max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-3 lg:px-8">
      <a href={`/${locale}`} className="flex items-center gap-3" aria-label="JCI Bangkok home"><img src={logo} alt="JCI Bangkok" className="h-12 w-auto object-contain" /></a>
      {showNavigation && <nav aria-label="Main navigation" className="order-3 flex w-full gap-5 overflow-x-auto py-2 text-sm font-semibold text-[var(--muted)] lg:order-none lg:w-auto">
        {nav.map(item => <a key={item.href} href={item.href} target={item.newTab ? '_blank' : undefined} rel={item.newTab ? 'noopener noreferrer' : undefined} className="whitespace-nowrap transition hover:text-[var(--jci-blue)]">{item.label}</a>)}
      </nav>}
      <div className="flex items-center gap-2">
        {showLanguageSwitch && <a href={`/${locale === 'th' ? 'en' : 'th'}`} className="rounded-full border border-[var(--line)] px-3 py-2 text-xs font-bold uppercase">{locale === 'th' ? 'EN' : 'TH'}</a>}
        {ctaLabel && cta && <a href={cta.href} className="rounded-full bg-[var(--jci-blue)] px-4 py-2 text-sm font-semibold text-white">{ctaLabel}</a>}
      </div>
    </div>
  </header>
}

export function GlobalFooterBlock({ showNavigation, showSocialLinks, heading, copyright }: { showNavigation: boolean; showSocialLinks: boolean; heading: string; copyright: string }) {
  const data = useDocumentData() || {}
  const locale = data.currentLocale || 'en'
  const nav = resolveNavigationItems(data.navigation?.items, locale)
  const settings = data.settings || {}
  const social = settings.socialLinks || {}
  return <footer className="border-t border-white/10 bg-[var(--jci-black)] text-white">
    <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.2fr_1fr_1fr] lg:px-8">
      <div><img src="/brand/footer-logo.png" alt="JCI Bangkok" className="h-16 w-auto" /><p className="mt-5 max-w-md text-sm leading-7 text-white/65">{heading}</p></div>
      {showNavigation && <div><h2 className="text-xs font-bold uppercase tracking-[.22em] text-white/50">Explore</h2><nav className="mt-5 grid gap-3 text-sm">{nav.map(item => <a key={item.href} href={item.href} className="text-white/75 hover:text-white">{item.label}</a>)}</nav></div>}
      <div><h2 className="text-xs font-bold uppercase tracking-[.22em] text-white/50">Connect</h2><a className="mt-5 block text-sm text-white/75" href={`mailto:${settings.contactEmail || 'hello@jcibangkok.org'}`}>{settings.contactEmail || 'hello@jcibangkok.org'}</a>{showSocialLinks && <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold">{Object.entries(social).map(([name, href]) => typeof href === 'string' && href ? <a key={name} href={href} target="_blank" rel="noopener noreferrer" className="capitalize text-white/65 hover:text-white">{name}</a> : null)}</div>}</div>
    </div>
    <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-white/40">{copyright || settings.footerText}</div>
  </footer>
}

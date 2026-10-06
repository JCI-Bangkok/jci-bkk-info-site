import Link from "next/link";
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

import { BrandMark } from "@/components/brand-mark";
import { navigation } from "@/lib/site-data";
import { getDictionary, Locale } from "@/lib/i18n";

export async function SiteFooter({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  let settings: any = null
  try {
    const payload = await getPayload({ config: configPromise })
    settings = await payload.findGlobal({
      slug: 'site-settings',
      locale,
    })
  } catch (error) {
    console.error('Error fetching site settings in footer:', error)
  }

  const contactEmail = settings?.contactEmail || 'hello@jcibangkok.org'
  const footerText = settings?.footerText || 'Â© 2026 JCI Bangkok. All Rights Reserved.'

  return (
    <footer className="border-t border-[var(--line)] bg-[var(--jci-black)] text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div className="flex flex-col gap-3 lg:pr-10">
          <BrandMark locale={locale} logoUrl="/brand/footer-logo.png" />
          <p className="max-w-sm sm:max-w-md text-sm leading-7 text-white/70 whitespace-pre-line">
            {dict.footer.intro}
          </p>
          <p className="text-xs text-white/40 mt-4">
            {footerText}
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">
            {dict.footer.explore}
          </h2>
          <div className="mt-5 grid gap-3 text-sm">
            {navigation.map((item) => {
              const navKey = item.label.toLowerCase() as keyof typeof dict.nav;
              const label = dict.nav[navKey] || item.label;
              const href = item.href === "/" ? `/${locale}` : `/${locale}${item.href}`;
              return (
                <Link
                  key={item.href}
                  href={href}
                  className="text-white/75 transition hover:text-white"
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">
            {dict.footer.contact}
          </h2>
          <div className="mt-5 space-y-3 text-sm text-white/75">
            <p>
              <a href={`mailto:${contactEmail}`} className="flex items-center gap-2 hover:text-white transition group">
                <svg className="w-4 h-4 opacity-70 group-hover:opacity-100 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <span className="group-hover:underline underline-offset-4">{contactEmail}</span>
              </a>
            </p>
            <p className="whitespace-pre-line leading-relaxed">{dict.footer.desc}</p>
            
            {settings?.socialLinks && (
              <div className="flex flex-col gap-3 mt-6">
                {settings.socialLinks.facebook && (
                  <a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#1877F2] hover:opacity-80 transition text-xs font-bold tracking-wider uppercase">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                    </svg>
                    Facebook
                  </a>
                )}
                {settings.socialLinks.instagram && (
                  <a href={settings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#E1306C] hover:opacity-80 transition text-xs font-bold tracking-wider uppercase">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                    Instagram
                  </a>
                )}
                {settings.socialLinks.linkedin && (
                  <a href={settings.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#0A66C2] hover:opacity-80 transition text-xs font-bold tracking-wider uppercase">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.924 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}


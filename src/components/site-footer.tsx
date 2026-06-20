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
  const footerText = settings?.footerText || '© 2026 JCI Bangkok. All Rights Reserved.'

  return (
    <footer className="border-t border-[var(--line)] bg-[var(--jci-black)] text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div className="space-y-5">
          <BrandMark locale={locale} />
          <p className="max-w-xl text-sm leading-7 text-white/70">
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
            <p>{dict.footer.address}</p>
            <p>
              <a href={`mailto:${contactEmail}`} className="hover:underline transition">
                {contactEmail}
              </a>
            </p>
            <p>{dict.footer.desc}</p>
            
            {settings?.socialLinks && (
              <div className="flex gap-4 mt-6">
                {settings.socialLinks.facebook && (
                  <a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition text-xs font-semibold tracking-wider uppercase">
                    Facebook
                  </a>
                )}
                {settings.socialLinks.instagram && (
                  <a href={settings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition text-xs font-semibold tracking-wider uppercase">
                    Instagram
                  </a>
                )}
                {settings.socialLinks.linkedin && (
                  <a href={settings.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition text-xs font-semibold tracking-wider uppercase">
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


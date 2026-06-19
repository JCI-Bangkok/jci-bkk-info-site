import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import { navigation } from "@/lib/site-data";
import { getDictionary, Locale } from "@/lib/i18n";

export function SiteFooter({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <footer className="border-t border-[var(--line)] bg-[var(--jci-black)] text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div className="space-y-5">
          <BrandMark locale={locale} />
          <p className="max-w-xl text-sm leading-7 text-white/70">
            {dict.footer.intro}
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
            <p>hello@jcibangkok.org</p>
            <p>{dict.footer.desc}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}


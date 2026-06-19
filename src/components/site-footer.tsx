import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import { navigation } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--jci-black)] text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div className="space-y-5">
          <BrandMark />
          <p className="max-w-xl text-sm leading-7 text-white/70">
            JCI Bangkok is a local chapter of JCI Thailand, building leadership,
            business opportunity, international cooperation, and community
            impact for young active citizens in Bangkok.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">
            Explore
          </h2>
          <div className="mt-5 grid gap-3 text-sm">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white/75 transition hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">
            Contact
          </h2>
          <div className="mt-5 space-y-3 text-sm text-white/75">
            <p>Bangkok, Thailand</p>
            <p>hello@jcibangkok.org</p>
            <p>Membership, partnership, and media inquiries welcome.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

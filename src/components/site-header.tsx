import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import { navigation } from "@/lib/site-data";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[color:rgba(255,255,255,0.92)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-5 py-3 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <BrandMark />
          <Link
            href="/membership"
            className="inline-flex rounded-full bg-[var(--jci-blue)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--jci-navy)] lg:hidden"
          >
            Join JCI Bangkok
          </Link>
        </div>
        <nav className="flex gap-x-6 gap-y-2 overflow-x-auto whitespace-nowrap pb-1 text-[0.8125rem] font-semibold text-[var(--muted)] [scrollbar-width:none] lg:flex-wrap lg:overflow-visible lg:whitespace-normal lg:pb-0">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-[var(--jci-blue)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/membership"
          className="hidden rounded-full bg-[var(--jci-blue)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--jci-navy)] lg:inline-flex"
        >
          Become a Member
        </Link>
      </div>
    </header>
  );
}

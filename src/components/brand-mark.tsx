import Image from "next/image";
import Link from "next/link";
import { Locale } from "@/lib/i18n";

// export function BrandMark({ locale = 'en', logoUrl = '/brand/jci-primary.svg' }: { locale?: Locale; logoUrl?: string }) {
export function BrandMark({ locale = 'en', logoUrl = '/brand/logo-ribbon.png' }: { locale?: Locale; logoUrl?: string }) {
  return (
    <Link
      href={`/${locale}`}
      className="inline-flex shrink-0 flex-col items-start gap-2"
      aria-label="JCI Bangkok home"
    >
      {/* <span className="rounded-[1.15rem] bg-white px-3 py-2 shadow-[0_14px_34px_rgba(19,15,45,0.08)]"> */}
      <span>  
        <Image
          src={logoUrl}
          alt="JCI"
          width={400}
          height={200}
          className="h-auto w-[7.75rem]"
          priority
        />
      </span>
      <span className="pl-2 text-[0.98rem] font-bold leading-none text-[var(--jci-blue)]">
      </span>
    </Link>
  );
}

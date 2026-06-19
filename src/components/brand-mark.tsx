import Image from "next/image";
import Link from "next/link";

export function BrandMark() {
  return (
    <Link
      href="/"
      className="inline-flex flex-col items-start gap-2"
      aria-label="JCI Bangkok home"
    >
      <span className="rounded-[1.15rem] bg-white px-3 py-2 shadow-[0_14px_34px_rgba(19,15,45,0.08)]">
        <Image
          src="/brand/jci-primary.svg"
          alt="JCI"
          width={176}
          height={64}
          className="h-auto w-[7.75rem]"
          priority
        />
      </span>
      <span className="pl-2 text-[0.98rem] font-bold leading-none text-[var(--jci-blue)]">
        Bangkok
      </span>
    </Link>
  );
}

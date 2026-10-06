import Link from "next/link";

type CtaBannerProps = {
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function CtaBanner({
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel
}: CtaBannerProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-20 lg:px-8">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-[var(--line)] bg-[var(--jci-black)] px-8 py-12 text-white shadow-[0_28px_80px_rgba(19,15,45,0.16)] sm:px-10 lg:flex lg:items-end lg:justify-between lg:px-14 lg:py-14">
        <div className="absolute inset-0 bg-[repeating-radial-gradient(circle_at_92%_20%,transparent_0_28px,rgba(87,188,188,0.28)_28px_38px,transparent_38px_56px)]" />
        <div className="relative max-w-3xl space-y-4">
          <h2 className="text-4xl font-semibold leading-tight sm:text-5xl">
            {title}
          </h2>
          <p className="max-w-2xl text-base leading-7 text-white/72">
            {description}
          </p>
        </div>
        <div className="relative mt-8 flex flex-wrap gap-3 lg:mt-0 lg:justify-end">
          <Link
            href={primaryHref}
            className="rounded-full bg-[var(--jci-blue)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--jci-teal)]"
          >
            {primaryLabel}
          </Link>
          {secondaryHref && secondaryLabel ? (
            <Link
              href={secondaryHref}
              className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/8"
            >
              {secondaryLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}

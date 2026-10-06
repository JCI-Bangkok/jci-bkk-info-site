import { ReactNode } from "react";

type SectionHeadingProps = {
  title: string;
  description: string;
  aside?: ReactNode;
};

export function SectionHeading({
  title,
  description,
  aside
}: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-6 border-b border-[var(--line)] pb-8 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl space-y-3">
        <h2 className="text-4xl font-semibold leading-tight text-[var(--ink)] sm:text-5xl">
          {title}
        </h2>
        <p className="max-w-2xl text-base leading-7 text-[var(--muted)]">
          {description}
        </p>
      </div>
      {aside ? <div className="text-sm text-[var(--muted)]">{aside}</div> : null}
    </div>
  );
}

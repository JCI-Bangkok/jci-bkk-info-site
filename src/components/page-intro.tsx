import { ReactNode } from "react";

type PageIntroProps = {
  title: string;
  lead: string;
  aside?: ReactNode;
};

export function PageIntro({ title, lead, aside }: PageIntroProps) {
  return (
    <section className="relative overflow-hidden border-b border-[var(--line)]">
      <div className="absolute right-0 top-0 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(0,151,215,0.14),transparent_64%)] blur-3xl" />
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div className="space-y-6">
          <h1 className="max-w-4xl text-5xl font-semibold leading-[0.96] text-[var(--ink)] sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
            {lead}
          </p>
        </div>
        {aside ? (
          <div className="flex items-end lg:justify-end">
            <div className="soft-panel w-full rounded-[2rem] border p-6 shadow-[0_24px_60px_rgba(19,15,45,0.08)] backdrop-blur">
              {aside}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

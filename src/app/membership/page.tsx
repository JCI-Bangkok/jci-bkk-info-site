import { CtaBanner } from "@/components/cta-banner";
import { PageIntro } from "@/components/page-intro";

export const metadata = {
  title: "Membership"
};

const benefits = [
  "Leadership practice through committees, events, and projects",
  "Business and professional networking across sectors",
  "Training opportunities in speaking, facilitation, and communication",
  "International JCI exposure through regional and global connections",
  "Meaningful friendships built through collaboration and service"
];

const faq = [
  {
    question: "Who can join?",
    answer:
      "People aged 18 to 40 who are based in or connected to Bangkok and interested in personal growth, leadership, and community impact."
  },
  {
    question: "Is this only for entrepreneurs?",
    answer:
      "No. The chapter should feel relevant to professionals, founders, creatives, civic-minded members, and emerging leaders."
  },
  {
    question: "How does the application process work?",
    answer:
      "This page is prepared for a CMS-managed inquiry workflow, with routing that can later point either to JCI Bangkok directly or through JCI Thailand."
  }
];

export default function MembershipPage() {
  return (
    <>
      <PageIntro
        title="Membership should feel concrete, welcoming, and worth the commitment."
        lead="The role of this page is to answer the most important question for potential members: why join JCI Bangkok instead of another networking or volunteer group?"
      />
      <section className="section-space mx-auto grid w-full max-w-7xl gap-5 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <article className="paper-frame p-7">
          <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">
            Who can join
          </p>
          <h2 className="mt-4 font-display text-4xl leading-none text-[var(--ink)]">
            Young active citizens aged 18 to 40 with a Bangkok connection.
          </h2>
          <p className="mt-6 text-base leading-7 text-[var(--muted)]">
            Membership is designed for people who want practical leadership
            experience, meaningful networks, and community-facing work that feels
            bigger than a social calendar.
          </p>
        </article>
        <article className="paper-frame p-7">
          <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">
            Why join
          </p>
          <div className="mt-5 grid gap-4">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="rounded-[1.4rem] border border-[var(--line)] bg-white/75 px-5 py-4 text-base leading-7 text-[var(--muted)]"
              >
                {benefit}
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 pb-20 lg:grid-cols-[0.86fr_1.14fr] lg:px-8">
        <article className="paper-frame p-7">
          <h2 className="font-display text-4xl leading-none text-[var(--ink)]">
            Application process
          </h2>
          <ol className="mt-6 space-y-4 text-base leading-7 text-[var(--muted)]">
            <li>1. Submit a short inquiry with your interests and background.</li>
            <li>2. Receive a response from the chapter team or membership lead.</li>
            <li>3. Join an upcoming event or orientation touchpoint.</li>
            <li>4. Continue with the formal chapter application flow.</li>
          </ol>
        </article>
        <article className="paper-frame p-7">
          <h2 className="font-display text-4xl leading-none text-[var(--ink)]">
            Membership inquiry
          </h2>
          <form className="mt-6 grid gap-4">
            <input
              className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--ink)] outline-none"
              placeholder="Full name"
            />
            <input
              className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--ink)] outline-none"
              placeholder="Email address"
              type="email"
            />
            <input
              className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--ink)] outline-none"
              placeholder="Phone number"
            />
            <textarea
              className="min-h-36 rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--ink)] outline-none"
              placeholder="Tell us what you want to explore through JCI Bangkok."
            />
            <label className="flex items-start gap-3 rounded-2xl border border-[var(--line)] bg-white/72 px-4 py-3 text-sm leading-6 text-[var(--muted)]">
              <input type="checkbox" className="mt-1" />
              <span>
                I consent to JCI Bangkok collecting this information for
                membership follow-up and chapter communications.
              </span>
            </label>
            <button
              type="button"
              className="rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-white"
            >
              Submit inquiry
            </button>
          </form>
        </article>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-20 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {faq.map((item) => (
            <article key={item.question} className="paper-frame p-6">
              <h2 className="font-display text-3xl leading-none text-[var(--ink)]">
                {item.question}
              </h2>
              <p className="mt-5 text-base leading-7 text-[var(--muted)]">
                {item.answer}
              </p>
            </article>
          ))}
        </div>
      </section>

      <CtaBanner
        title="The next version of this page can connect directly to Payload forms."
        description="For now, the structure is ready: benefits, eligibility, inquiry capture, consent handling, and an onboarding-friendly narrative."
        primaryHref="/contact"
        primaryLabel="Open contact page"
      />
    </>
  );
}

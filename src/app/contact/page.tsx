import { PageIntro } from "@/components/page-intro";

export const metadata = {
  title: "Contact"
};

const inquiryTypes = [
  "Membership inquiry",
  "Partnership inquiry",
  "Media inquiry",
  "General contact"
];

export default function ContactPage() {
  return (
    <>
      <PageIntro
        title="One place for membership, partner, and media conversations."
        lead="The contact page should centralize inquiries cleanly, set expectations, and prepare the site for privacy-conscious form handling."
      />
      <section className="section-space mx-auto grid w-full max-w-7xl gap-5 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <article className="paper-frame p-7">
          <h2 className="font-display text-4xl leading-none text-[var(--ink)]">
            How to reach the chapter
          </h2>
          <div className="mt-6 space-y-4 text-base leading-7 text-[var(--muted)]">
            <p>General email: hello@jcibangkok.org</p>
            <p>Location focus: Bangkok, Thailand</p>
            <p>Typical topics: membership, partnerships, events, media</p>
            <p>Privacy note: collect only what is necessary and clearly explain why.</p>
          </div>
        </article>
        <article className="paper-frame p-7">
          <h2 className="font-display text-4xl leading-none text-[var(--ink)]">
            Send an inquiry
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
            <select className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--ink)] outline-none">
              <option>Inquiry type</option>
              {inquiryTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
            <textarea
              className="min-h-36 rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--ink)] outline-none"
              placeholder="Message"
            />
            <label className="flex items-start gap-3 rounded-2xl border border-[var(--line)] bg-white/72 px-4 py-3 text-sm leading-6 text-[var(--muted)]">
              <input type="checkbox" className="mt-1" />
              <span>
                I consent to JCI Bangkok collecting this information to respond
                to my inquiry.
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
    </>
  );
}

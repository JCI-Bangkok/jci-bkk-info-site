import { PageIntro } from "@/components/page-intro";
import { ContactForm } from "./contact-form";
import React from 'react'

export const metadata = {
  title: "Contact"
};

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
        <ContactForm />
      </section>
    </>
  );
}


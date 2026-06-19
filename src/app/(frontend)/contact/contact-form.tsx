'use client'

import React, { useActionState } from 'react'
import { submitInquiry, FormState } from './actions'

const inquiryTypes = [
  { label: 'Membership Inquiry', value: 'membership' },
  { label: 'Partnership Inquiry', value: 'partnership' },
  { label: 'Media Inquiry', value: 'media' },
  { label: 'General Contact', value: 'general' }
]

const initialState: FormState = {
  success: false,
  message: '',
}

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitInquiry, initialState)

  return (
    <article className="paper-frame p-7">
      <h2 className="font-display text-4xl leading-none text-[var(--ink)]">
        Send an inquiry
      </h2>
      <form action={formAction} className="mt-6 grid gap-4">
        <input
          name="name"
          required
          className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--jci-blue)]"
          placeholder="Full name"
        />
        <input
          name="email"
          type="email"
          required
          className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--jci-blue)]"
          placeholder="Email address"
        />
        <input
          name="phone"
          className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--jci-blue)]"
          placeholder="Phone number (optional)"
        />
        <select
          name="inquiryType"
          required
          className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--jci-blue)]"
        >
          <option value="">Select inquiry type</option>
          {inquiryTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        <textarea
          name="message"
          required
          className="min-h-36 rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--jci-blue)]"
          placeholder="Message"
        />
        <label className="flex items-start gap-3 rounded-2xl border border-[var(--line)] bg-white/72 px-4 py-3 text-sm leading-6 text-[var(--muted)] cursor-pointer">
          <input name="consent" required type="checkbox" className="mt-1" />
          <span>
            I consent to JCI Bangkok collecting this information to respond
            to my inquiry.
          </span>
        </label>
        
        {state.message && (
          <div className={`p-4 rounded-2xl text-sm ${state.success ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {state.message}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--jci-blue)] transition disabled:opacity-50"
        >
          {isPending ? 'Submitting...' : 'Submit inquiry'}
        </button>
      </form>
    </article>
  )
}

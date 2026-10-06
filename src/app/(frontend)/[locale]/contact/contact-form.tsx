'use client'

import React, { useActionState } from 'react'
import { submitInquiry, FormState } from './actions'
import { Locale } from '@/lib/i18n'

const inquiryTypesEn = [
  { label: 'Membership Inquiry', value: 'membership' },
  { label: 'Partnership Inquiry', value: 'partnership' },
  { label: 'Media Inquiry', value: 'media' },
  { label: 'General Contact', value: 'general' }
]

const inquiryTypesTh = [
  { label: 'ติดต่อเรื่องสมัครสมาชิก', value: 'membership' },
  { label: 'ติดต่อเรื่องพันธมิตร/ผู้สนับสนุน', value: 'partnership' },
  { label: 'ติดต่อเรื่องสื่อมวลชน', value: 'media' },
  { label: 'สอบถามข้อมูลทั่วไป', value: 'general' }
]

const initialState: FormState = {
  success: false,
  message: '',
}

export function ContactForm({ locale }: { locale: Locale }) {
  const [state, formAction, isPending] = useActionState(submitInquiry, initialState)
  const inquiryTypes = locale === 'th' ? inquiryTypesTh : inquiryTypesEn

  return (
    <article className="paper-frame p-7">
      <h2 className="font-display text-4xl leading-none text-[var(--ink)]">
        {locale === 'th' ? 'ส่งข้อความหาเรา' : 'Send an inquiry'}
      </h2>
      <form action={formAction} className="mt-6 grid gap-4">
        <input type="hidden" name="locale" value={locale} />
        <input
          name="name"
          required
          className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--jci-blue)]"
          placeholder={locale === 'th' ? 'ชื่อ - นามสกุล' : 'Full name'}
        />
        <input
          name="email"
          type="email"
          required
          className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--jci-blue)]"
          placeholder={locale === 'th' ? 'อีเมล' : 'Email address'}
        />
        <input
          name="phone"
          className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--jci-blue)]"
          placeholder={locale === 'th' ? 'เบอร์โทรศัพท์ (ไม่บังคับ)' : 'Phone number (optional)'}
        />
        <select
          name="inquiryType"
          required
          className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--jci-blue)]"
        >
          <option value="">{locale === 'th' ? 'เลือกประเภทการติดต่อ' : 'Select inquiry type'}</option>
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
          placeholder={locale === 'th' ? 'ข้อความ' : 'Message'}
        />
        <label className="flex items-start gap-3 rounded-2xl border border-[var(--line)] bg-white/72 px-4 py-3 text-sm leading-6 text-[var(--muted)] cursor-pointer">
          <input name="consent" required type="checkbox" className="mt-1" />
          <span>
            {locale === 'th'
              ? 'ข้าพเจ้ายินยอมให้ JCI Bangkok จัดเก็บข้อมูลนี้เพื่อใช้ในการตอบกลับการติดต่อ'
              : 'I consent to JCI Bangkok collecting this information to respond to my inquiry.'}
          </span>
        </label>

        <button
          type="submit"
          disabled={isPending}
          className="mt-2 w-full rounded-2xl bg-[var(--jci-blue)] py-3 font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50"
        >
          {isPending 
            ? (locale === 'th' ? 'กำลังส่ง...' : 'Sending...') 
            : (locale === 'th' ? 'ส่งข้อความ' : 'Submit inquiry')}
        </button>

        {state.message && (
          <div
            className={`mt-2 rounded-xl p-4 text-sm ${
              state.success
                ? 'bg-green-50 text-green-900 border border-green-200'
                : 'bg-red-50 text-red-900 border border-red-200'
            }`}
          >
            {state.message}
          </div>
        )}
      </form>
    </article>
  )
}

'use client'

import React, { useActionState } from 'react'
import { submitInquiry, FormState } from '../contact/actions'
import { Locale } from '@/lib/i18n'

const initialState: FormState = {
  success: false,
  message: '',
}

export function MembershipForm({ locale }: { locale: Locale }) {
  const [state, formAction, isPending] = useActionState(submitInquiry, initialState)

  return (
    <article className="paper-frame p-7">
      <h2 className="font-display text-4xl leading-none text-[var(--ink)]">
        {locale === 'th' ? 'ส่งแบบแสดงความสนใจ' : 'Membership inquiry'}
      </h2>
      <form action={formAction} className="mt-6 grid gap-4">
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="inquiryType" value="membership" />
        
        <input
          name="name"
          required
          onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Please fill out this field.')}
          onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
          className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--jci-blue)]"
          placeholder={locale === 'th' ? 'ชื่อ - นามสกุล' : 'Full name'}
        />
        <input
          name="email"
          type="email"
          required
          onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Please enter a valid email address.')}
          onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
          className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--jci-blue)]"
          placeholder={locale === 'th' ? 'อีเมล' : 'Email address'}
        />
        <input
          name="phone"
          className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--jci-blue)]"
          placeholder={locale === 'th' ? 'เบอร์โทรศัพท์' : 'Phone number'}
        />
        <textarea
          name="message"
          required
          onInvalid={(e) => (e.target as HTMLTextAreaElement).setCustomValidity('Please fill out this field.')}
          onInput={(e) => (e.target as HTMLTextAreaElement).setCustomValidity('')}
          className="min-h-36 rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--jci-blue)]"
          placeholder={
            locale === 'th'
              ? 'บอกเราหน่อยว่าคุณสนใจอยากเรียนรู้หรือพัฒนาทักษะด้านใดกับ JCI Bangkok'
              : 'Tell us what you want to explore through JCI Bangkok.'
          }
        />
        <label className="flex items-start gap-3 rounded-2xl border border-[var(--line)] bg-white/72 px-4 py-3 text-sm leading-6 text-[var(--muted)] cursor-pointer">
          <input 
            name="consent" 
            required 
            type="checkbox" 
            className="mt-1" 
            onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Please check this box if you want to proceed.')}
            onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
          />
          <span>
            {locale === 'th'
              ? 'ข้าพเจ้ายินยอมให้ JCI Bangkok จัดเก็บข้อมูลนี้เพื่อใช้สำหรับการติดต่อและให้ข้อมูลเกี่ยวกับสมาชิกภาพ'
              : 'I consent to JCI Bangkok collecting this information for membership follow-up and chapter communications.'}
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
          {isPending 
            ? (locale === 'th' ? 'กำลังส่ง...' : 'Submitting...') 
            : (locale === 'th' ? 'ส่งแบบสอบถาม' : 'Submit inquiry')}
        </button>
      </form>
    </article>
  )
}

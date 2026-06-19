'use server'

import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { getDictionary, Locale } from '@/lib/i18n'

export type FormState = {
  success: boolean
  message: string
}

export async function submitInquiry(prevState: FormState | null, formData: FormData): Promise<FormState> {
  const locale = (formData.get('locale') as Locale) || 'en'
  const dict = getDictionary(locale)

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const inquiryType = formData.get('inquiryType') as string
  const message = formData.get('message') as string
  const consent = formData.get('consent') === 'on'

  if (!name || !email || !inquiryType || !message) {
    return {
      success: false,
      message: locale === 'th' ? 'กรุณากรอกข้อมูลในช่องที่จำเป็นให้ครบถ้วน' : 'Please fill in all required fields.',
    }
  }

  if (!consent) {
    return {
      success: false,
      message: locale === 'th' ? 'คุณต้องให้ความยินยอมตามข้อกำหนดความเป็นส่วนตัวเพื่อส่งแบบฟอร์ม' : 'You must consent to the privacy terms to submit the inquiry.',
    }
  }

  try {
    const payload = await getPayload({ config: configPromise })
    await payload.create({
      collection: 'forms',
      data: {
        name,
        email,
        phone: phone || undefined,
        inquiryType: inquiryType as 'membership' | 'partnership' | 'media' | 'general',
        message,
        consent,
      },
    })

    return {
      success: true,
      message: dict.contact.success,
    }
  } catch (error) {
    console.error('Error submitting contact form:', error)
    return {
      success: false,
      message: dict.contact.error,
    }
  }
}


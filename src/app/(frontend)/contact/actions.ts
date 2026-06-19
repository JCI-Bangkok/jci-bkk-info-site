'use server'

import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export type FormState = {
  success: boolean
  message: string
}

export async function submitInquiry(prevState: FormState | null, formData: FormData): Promise<FormState> {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const inquiryType = formData.get('inquiryType') as string
  const message = formData.get('message') as string
  const consent = formData.get('consent') === 'on'

  if (!name || !email || !inquiryType || !message) {
    return {
      success: false,
      message: 'Please fill in all required fields.',
    }
  }

  if (!consent) {
    return {
      success: false,
      message: 'You must consent to the privacy terms to submit the inquiry.',
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
      message: 'Your inquiry has been submitted successfully! We will get back to you shortly.',
    }
  } catch (error) {
    console.error('Error submitting contact form:', error)
    return {
      success: false,
      message: 'An error occurred while submitting your inquiry. Please try again later.',
    }
  }
}

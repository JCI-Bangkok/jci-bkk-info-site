import { PageIntro } from "@/components/page-intro";
import { ContactForm } from "./contact-form";
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { Locale } from "@/lib/i18n";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    title: locale === 'th' ? 'ติดต่อเรา' : 'Contact'
  };
}

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params

  let settings: any = null
  try {
    const payload = await getPayload({ config: configPromise })
    settings = await payload.findGlobal({
      slug: 'site-settings',
      locale,
    })
  } catch (error) {
    console.error('Error fetching site settings on contact page:', error)
  }

  const contactEmail = settings?.contactEmail || 'hello@jcibangkok.org'

  return (
    <>
      <PageIntro
        title={locale === 'th' ? 'ศูนย์รวมสำหรับการติดต่อสมาชิกภาพ พันธมิตรโครงการ และข้อมูลข่าวสาร' : 'One place for membership, partner, and media conversations.'}
        lead={locale === 'th' ? 'หน้าติดต่อสอบถามจัดทำขึ้นเพื่อรวบรวมคำขอรับข้อมูลของคุณ จัดการหมวดหมู่ข้อความ และรองรับการจัดการฟอร์มที่เป็นส่วนตัวอย่างปลอดภัย' : 'The contact page should centralize inquiries cleanly, set expectations, and prepare the site for privacy-conscious form handling.'}
      />
      <section className="section-space mx-auto grid w-full max-w-7xl gap-5 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <article className="paper-frame p-7">
          <h2 className="font-display text-4xl leading-none text-[var(--ink)]">
            {locale === 'th' ? 'ช่องทางการติดต่อสมาคม' : 'How to reach the chapter'}
          </h2>
          <div className="mt-6 space-y-4 text-base leading-7 text-[var(--muted)]">
            <p>
              {locale === 'th' ? 'อีเมลทั่วไป: ' : 'General email: '}
              <a href={`mailto:${contactEmail}`} className="hover:underline transition text-[var(--jci-blue)] font-semibold">
                {contactEmail}
              </a>
            </p>
            <p>{locale === 'th' ? 'พื้นที่ดำเนินงาน: กรุงเทพมหานคร ประเทศไทย' : 'Location focus: Bangkok, Thailand'}</p>
            <p>{locale === 'th' ? 'เรื่องที่ติดต่อ: สมัครสมาชิก, พันธมิตรโครงการ, กิจกรรมสมาคม, สื่อมวลชน' : 'Typical topics: membership, partnerships, events, media'}</p>
            <p>{locale === 'th' ? 'คำชี้แจงความเป็นส่วนตัว: เราจัดเก็บเฉพาะข้อมูลที่จำเป็นและอธิบายเหตุผลอย่างโปร่งใส' : 'Privacy note: collect only what is necessary and clearly explain why.'}</p>
          </div>
        </article>
        <ContactForm locale={locale as Locale} />
      </section>
    </>
  );
}



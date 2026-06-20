import { CtaBanner } from "@/components/cta-banner";
import { PageIntro } from "@/components/page-intro";
import { MembershipForm } from "./membership-form";
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
    title: locale === 'th' ? 'สมัครสมาชิก' : 'Membership'
  };
}

const benefitsEn = [
  "Leadership practice through committees, events, and projects",
  "Business and professional networking across sectors",
  "Training opportunities in speaking, facilitation, and communication",
  "International JCI exposure through regional and global connections",
  "Meaningful friendships built through collaboration and service"
];

const benefitsTh = [
  "การฝึกฝนความเป็นผู้นำผ่านคณะทำงาน กิจกรรม และโครงการต่างๆ",
  "เครือข่ายธุรกิจและวิชาชีพในหลากหลายภาคส่วน",
  "โอกาสการฝึกอบรมการพูด การอำนวยความสะดวก และการสื่อสาร",
  "การเรียนรู้ระดับนานาชาติของ JCI ผ่านการเชื่อมต่อภูมิภาคและระดับโลก",
  "มิตรภาพที่มีความหมายที่สร้างขึ้นผ่านการทำงานร่วมกันและการบริการสังคม"
];

const faqEn = [
  {
    question: "Who can join?",
    answer: "People aged 18 to 40 who are based in or connected to Bangkok and interested in personal growth, leadership, and community impact."
  },
  {
    question: "Is this only for entrepreneurs?",
    answer: "No. The chapter is relevant to professionals, founders, creatives, civic-minded members, and emerging leaders."
  },
  {
    question: "How does the application process work?",
    answer: "Submit a membership inquiry form. Once received, our membership committee will contact you for a brief chat, onboarding, and orientation."
  }
];

const faqTh = [
  {
    question: "ใครสามารถเข้าร่วมได้บ้าง?",
    answer: "บุคคลที่มีอายุระหว่าง 18 ถึง 40 ปี ซึ่งมีพื้นที่อาศัยหรือเชื่อมโยงกับกรุงเทพมหานคร และมีความสนใจในการพัฒนาตนเอง ความเป็นผู้นำ และการสร้างผลกระทบต่อชุมชน"
  },
  {
    question: "สำหรับผู้ประกอบการเท่านั้นหรือไม่?",
    answer: "ไม่ใช่ สมาคมกรุงเทพฯ ยินดีต้อนรับทั้งคนทำงานประจำ ผู้ก่อตั้งธุรกิจ ศิลปินนักสร้างสรรค์ สมาชิกฝ่ายประชาสังคม และผู้นำรุ่นใหม่จากหลากหลายสาขาอาชีพ"
  },
  {
    question: "ขั้นตอนการสมัครสมาชิกเป็นอย่างไร?",
    answer: "ส่งแบบฟอร์มแสดงความสนใจเข้าร่วม คณะทำงานฝ่ายสมาชิกภาพจะติดต่อกลับเพื่อพูดคุยสั้นๆ ปฐมนิเทศ และแนะแนวทางการมีส่วนร่วมในสมาคม"
  }
];

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function MembershipPage({ params }: PageProps) {
  const { locale } = await params
  const benefits = locale === 'th' ? benefitsTh : benefitsEn
  const faq = locale === 'th' ? faqTh : faqEn

  let settings: any = null
  try {
    const payload = await getPayload({ config: configPromise })
    settings = await payload.findGlobal({
      slug: 'site-settings',
      locale,
    })
  } catch (error) {
    console.error('Error fetching site settings on membership page:', error)
  }

  return (
    <>
      <PageIntro
        title={locale === 'th' ? 'การร่วมเป็นสมาชิกที่สร้างการเติบโตและการมีส่วนร่วมที่คุ้มค่า' : 'Membership should feel concrete, welcoming, and worth the commitment.'}
        lead={locale === 'th' ? 'หน้าสมาชิกภาพนี้ช่วยตอบคำถามสำคัญสำหรับผู้สมัครใหม่: ทำไมต้องร่วมงานกับ JCI กรุงเทพฯ นอกเหนือไปจากการสร้างเครือข่ายหรืออาสาสมัครทั่วไป' : 'The role of this page is to answer the most important question for potential members: why join JCI Bangkok instead of another networking or volunteer group?'}
      />
      <section className="section-space mx-auto grid w-full max-w-7xl gap-5 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <article className="paper-frame p-7">
          <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">
            {locale === 'th' ? 'ผู้ที่สามารถสมัครสมาชิก' : 'Who can join'}
          </p>
          <h2 className="mt-4 font-display text-4xl leading-none text-[var(--ink)]">
            {locale === 'th' ? 'พลเมืองตื่นรู้คนรุ่นใหม่อายุ 18 ถึง 40 ปี ที่เชื่อมต่อกรุงเทพฯ' : 'Young active citizens aged 18 to 40 with a Bangkok connection.'}
          </h2>
          <p className="mt-6 text-base leading-7 text-[var(--muted)]">
            {locale === 'th'
              ? 'สมาชิกภาพออกแบบขึ้นสำหรับผู้ที่ต้องการหาประสบการณ์ภาวะผู้นำเชิงปฏิบัติ คอนเนกชันที่มีความหมาย และผลการทำงานเพื่อสังคมที่เป็นรูปธรรมมากกว่าตารางสังสรรค์ทั่วไป'
              : 'Membership is designed for people who want practical leadership experience, meaningful networks, and community-facing work that feels bigger than a social calendar.'}
          </p>
        </article>
        <article className="paper-frame p-7">
          <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">
            {locale === 'th' ? 'ทำไมต้องสมัครสมาชิก' : 'Why join'}
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
            {locale === 'th' ? 'ขั้นตอนการสมัครสมาชิก' : 'Application process'}
          </h2>
          <ol className="mt-6 space-y-4 text-base leading-7 text-[var(--muted)]">
            <li>{locale === 'th' ? '1. ส่งคำติดต่อสั้นๆ ระบุความสนใจและภูมิหลังของคุณ' : '1. Submit a short inquiry with your interests and background.'}</li>
            <li>{locale === 'th' ? '2. รอการตอบรับและการติดต่อจากทีมงานฝ่ายสมาชิกภาพ' : '2. Receive a response from the chapter team or membership lead.'}</li>
            <li>{locale === 'th' ? '3. เข้าร่วมกิจกรรมสมาคมหรือเข้ารับการปฐมนิเทศ' : '3. Join an upcoming event or orientation touchpoint.'}</li>
            <li>{locale === 'th' ? '4. ดำเนินการสมัครสมาชิกสมาคมอย่างเป็นทางการและชำระค่าบำรุงประจำปี' : '4. Continue with the formal chapter application flow.'}</li>
          </ol>
        </article>
        
        {settings?.membershipFormLink ? (
          <article className="paper-frame p-7 flex flex-col justify-between h-full bg-[var(--paper-soft)]">
            <div>
              <h2 className="font-display text-4xl leading-none text-[var(--ink)]">
                {locale === 'th' ? 'สมัครสมาชิกผ่านระบบภายนอก' : 'External Application'}
              </h2>
              <p className="mt-6 text-base leading-7 text-[var(--muted)]">
                {locale === 'th'
                  ? 'ขณะนี้สมาคมเปิดรับสมัครสมาชิกผ่านระบบภายนอกอย่างเป็นทางการ กรุณาคลิกปุ่มด้านล่างเพื่อกรอกใบสมัครของคุณ'
                  : 'Our chapter is currently accepting formal membership applications through our external application portal.'}
              </p>
            </div>
            <a
              href={settings.membershipFormLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 rounded-full bg-[var(--jci-blue)] px-6 py-4 text-center text-sm font-semibold text-white hover:bg-[var(--jci-navy)] transition block"
            >
              {locale === 'th' ? 'เปิดใบสมัครสมาชิก →' : 'Open Membership Application →'}
            </a>
          </article>
        ) : (
          <MembershipForm locale={locale as Locale} />
        )}
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
        title={locale === 'th' ? 'มีคำถามอื่นๆ เกี่ยวกับการสมัครสมาชิกหรือไม่?' : 'Have more questions about membership?'}
        description={locale === 'th' ? 'คณะทำงานยินดีให้ข้อมูลและต้อนรับคุณเข้าสู่สมาคมเพื่อเป็นพลังขับเคลื่อนกรุงเทพฯ ร่วมกัน' : 'Our team is happy to help and welcome you to the chapter to drive Bangkok forward together.'}
        primaryHref={`/${locale}/contact`}
        primaryLabel={locale === 'th' ? 'ติดต่อสมาคม' : 'Contact the chapter'}
      />
    </>
  );
}

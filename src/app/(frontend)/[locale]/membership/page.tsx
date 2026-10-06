import { MembershipForm } from "./membership-form";
import { CtaBanner } from "@/components/cta-banner";
import { getDictionary, Locale } from "@/lib/i18n";
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import Image from "next/image";
import { mediaUrl } from "@/lib/media";

export const metadata = {
  title: "Membership",
};

const benefitsEn = [
  "Hands-on practice leading projects and managing diverse teams.",
  "Direct connections to business owners, professionals, and civic leaders.",
  "Opportunities to attend international JCI academies and conferences.",
  "A platform to launch community initiatives with organizational backing.",
];

const benefitsTh = [
  "โอกาสในการลงมือปฏิบัติจริงเพื่อบริหารโครงการและนำทีมงานที่หลากหลาย",
  "สร้างคอนเนคชันโดยตรงกับเจ้าของธุรกิจ คนทำงานมืออาชีพ และผู้นำในสังคม",
  "โอกาสในการเข้าร่วมงานประชุมและสถาบันฝึกอบรมของ JCI ในระดับนานาชาติ",
  "พื้นที่สำหรับริเริ่มโครงการเพื่อชุมชนพร้อมการสนับสนุนจากองค์กร",
];

const faqEn = [
  {
    question: "Time commitment",
    answer: "Members are free to participate as much as they are comfortable with, but we highly recommend attending our monthly general meetings and trying to lead at least one project to get the most out of JCI Bangkok."
  },
  {
    question: "Age limits",
    answer: "Active membership is strictly for ages 18-40. This ensures opportunities flow continuously to the next generation of young leaders."
  },
  {
    question: "Background",
    answer: "You do not need to be an entrepreneur. Our members come from all professions—corporate professionals, founders, creatives, and more—united by a desire to build leadership skills through action."
  }
];

const faqTh = [
  {
    question: "เวลาที่ต้องใช้",
    answer: "สมาชิกสามารถจัดสรรเวลาเข้าร่วมกิจกรรมที่สะดวกได้เลย แต่เราขอแนะนำให้เข้าร่วมการประชุมใหญ่ประจำเดือน และลองเป็นผู้นำ (Lead) โครงการดูสัก 1 โครงการ เพื่อให้ได้รับประโยชน์สูงสุดจาก JCI Bangkok"
  },
  {
    question: "ข้อจำกัดด้านอายุ",
    answer: "สมาชิกสามัญจำกัดอายุระหว่าง 18-40 ปีเท่านั้น เพื่อให้แน่ใจว่าโอกาสต่างๆ จะถูกส่งต่อไปยังผู้นำเยาวชนรุ่นใหม่อย่างต่อเนื่อง"
  },
  {
    question: "คุณสมบัติเบื้องต้น",
    answer: "คุณไม่จำเป็นต้องเป็นเจ้าของธุรกิจ สมาชิกของเรามาจากทุกสาขาอาชีพ ไม่ว่าจะเป็นพนักงานบริษัท ผู้ก่อตั้งธุรกิจ ครีเอทีฟ และอีกมากมาย ที่รวมตัวกันด้วยความตั้งใจที่จะพัฒนาทักษะความเป็นผู้นำผ่านการลงมือทำ"
  }
];

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function MembershipPage({ params }: PageProps) {
  const { locale } = await params
  const dict = getDictionary(locale as Locale)
  const benefits = locale === 'th' ? benefitsTh : benefitsEn
  const faq = locale === 'th' ? faqTh : faqEn

  let settings: { membershipCoverImage?: unknown; membershipFormLink?: string } | null = null
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
    <div className="cursor-chinchin">
      <section className="relative overflow-hidden bg-[var(--jci-black)] text-white border-b border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
          <h1 className="text-4xl lg:text-6xl font-semibold tracking-tight">{dict.membership.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/70">{dict.membership.sub}</p>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="bg-[var(--paper-soft)] border-b border-[var(--line)] py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-0 lg:grid-cols-2 bg-white rounded-[2rem] shadow-xl border border-[var(--line)] overflow-hidden">
            
            {/* Image/Pitch Side */}
            <div className="relative p-8 lg:p-12 flex flex-col justify-between overflow-hidden bg-[#0c2340]">
              <div className="absolute inset-0 opacity-40">
                <Image src={settings?.membershipCoverImage ? (mediaUrl(settings.membershipCoverImage) || "/images/home/hero-cover.jpg") : "/images/home/hero-cover.jpg"} alt="JCI Bangkok Members" fill className="object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#061121] via-[#0c2340]/80 to-transparent" />
              
              <div className="relative z-10 flex-grow" />
              
              <div className="relative z-10 mt-20">
                <span className="font-accent text-6xl leading-none text-[var(--jci-blue)] opacity-60">&ldquo;</span>
                <p className="text-2xl font-medium text-white leading-snug">
                  {locale === 'th' 
                    ? 'พื้นที่แห่งการเรียนรู้ผ่านการลงมือทำ เครือข่ายที่จะช่วยดึงศักยภาพที่ดีที่สุดในตัวคุณออกมา'
                    : 'A space for learning by doing, a network that brings out the best in you.'}
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <div>
                    <p className="font-semibold text-white">Join JCI Bangkok</p>
                    <p className="text-sm text-white/60">{locale === 'th' ? 'องค์กรพัฒนาผู้นำรุ่นใหม่' : 'Leadership Development Organization'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Side */}
            <div className="p-8 lg:p-12 flex flex-col justify-center bg-white">
              <div className="mb-8">
                <h2 className="text-3xl font-semibold text-[var(--ink)]">
                  {locale === 'th' ? 'แบบฟอร์มแสดงความสนใจ' : 'Membership Interest Form'}
                </h2>
                <p className="mt-2 text-[var(--muted)]">
                  {locale === 'th' 
                    ? 'กรอกข้อมูลของคุณด้านล่าง แล้วทีมงานจะติดต่อกลับไปเพื่อพูดคุยถึงก้าวต่อไป' 
                    : 'Fill out your details below and our team will get in touch with you about the next steps.'}
                </p>
              </div>

              {settings?.membershipFormLink ? (
                <a
                  href={settings.membershipFormLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-[var(--jci-blue)] px-6 py-4 text-center text-sm font-semibold text-white hover:bg-[var(--jci-navy)] transition block"
                >
                  {locale === 'th' ? 'เปิดแบบฟอร์มรับสมัคร ↗' : 'Open Membership Application ↗'}
                </a>
              ) : (
                <MembershipForm locale={locale as Locale} />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          
          <div>
            <h2 className="text-2xl font-semibold text-[var(--ink)] mb-6">
              {locale === 'th' ? 'ทำไมถึงควรเข้าร่วม' : 'Why join'}
            </h2>
            <div className="space-y-4">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--jci-blue)]/10 text-[var(--jci-blue)]">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <p className="text-[var(--muted)] leading-relaxed mt-1">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-[var(--ink)] mb-6">
              {locale === 'th' ? 'ขั้นตอนการสมัครสมาชิก' : 'Application process'}
            </h2>
            <div className="relative border-l border-[var(--line)] ml-4 space-y-8 pl-8 pb-4">
              {dict.home.pathways.map((step, index) => (
                <div key={index} className="relative">
                  <div className="absolute -left-[41px] top-0 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--line)] bg-white text-xs font-semibold text-[var(--muted)]">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold text-[var(--ink)]">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{step.detail}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-[var(--paper-soft)] border-t border-[var(--line)]">
        <div className="mx-auto w-full max-w-7xl px-5 py-20 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-semibold text-[var(--ink)]">
              {locale === 'th' ? 'คำถามที่พบบ่อย' : 'Frequently Asked Questions'}
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {faq.map((item) => (
              <article key={item.question} className="bg-white p-6 rounded-2xl border border-[var(--line)] shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-[var(--ink)]">
                  {item.question}
                </h3>
                <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        title={locale === 'th' ? 'มีคำถามเพิ่มเติมใช่ไหม?' : 'Have more questions about membership?'}
        description={locale === 'th' ? 'ทีมงานยินดีให้ข้อมูลและต้อนรับคุณเข้าร่วมกิจกรรมเพื่อพัฒนาตัวเองและขับเคลื่อนสังคมไปพร้อมกับเรา' : 'Our team is happy to help and welcome you to the chapter to drive Bangkok forward together.'}
        primaryHref={`/${locale}/contact`}
        primaryLabel={locale === 'th' ? 'ติดต่อสอบถาม' : 'Contact the chapter'}
      />
    </div>
  );
}

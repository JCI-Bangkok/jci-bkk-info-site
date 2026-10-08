import { cmsStaticMetadata } from '@/lib/cms-seo'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { ContactForm } from './contact-form'
import { SocialLinks } from '@/components/social-links'
import { getDictionary, type Locale } from '@/lib/i18n'
import { getPublishedTemplate } from '@/lib/templates'
import { enforceManagedPagePath } from '@/lib/page-routing'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return cmsStaticMetadata(locale, 'contact')
}

export default async function ContactPage({ params }: { params: Promise<{ locale: Locale; __cmsRoute?: boolean }> }) {
  const { locale, __cmsRoute } = await params
  const dict = getDictionary(locale)
  const payload = await getPayload({ config })
  const pageDoc = await enforceManagedPagePath(locale, 'contact', __cmsRoute)
  const settings = await payload.findGlobal({ slug: 'site-settings', locale })
  const email = settings.contactEmail || 'hello@jcibangkok.org'

  const template = await getPublishedTemplate('contact').catch(() => null)
  if (template?.puckLayout && (template.puckLayout as any).content?.length > 0) {
    const { PuckRenderer } = await import('@/components/builder/PuckRenderer')
    return <PuckRenderer data={template.puckLayout as any} documentData={{ settings, email, currentLocale: locale }} />
  }

  if (pageDoc?.puckLayout && (pageDoc.puckLayout as any).content?.length > 0) {
    const { PuckRenderer } = await import('@/components/builder/PuckRenderer')
    return <PuckRenderer data={pageDoc.puckLayout as any} documentData={{ settings, email, currentLocale: locale }} />
  }
  
  return (
    <>
      <section className="relative overflow-hidden bg-[var(--jci-black)] text-white border-b border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
          <h1 className="text-4xl lg:text-6xl font-semibold tracking-tight">{dict.contact.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/70">{dict.contact.sub}</p>
        </div>
      </section>

      <section id="inquiry" className="scroll-mt-40 bg-[var(--paper-soft)] border-b border-[var(--line)] py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-0 lg:grid-cols-2 bg-white rounded-[2rem] shadow-xl border border-[var(--line)] overflow-hidden">
            <div className="p-8 lg:p-12 bg-gradient-to-br from-[#0c2340] to-[#061121] text-white flex flex-col justify-center">
              <h2 className="text-3xl font-semibold">{locale === 'th' ? 'พูดคุยกับทีมงาน' : 'Talk to the chapter'}</h2>
              <p className="mt-4 text-white/80 leading-relaxed max-w-md">{dict.footer.desc}</p>
              
              <div className="mt-10 space-y-6">
                <div>
                  <p className="text-white/50 text-sm font-semibold uppercase tracking-wider mb-1">Email</p>
                  <a href={`mailto:${email}`} className="text-xl font-medium hover:underline">{email}</a>
                </div>
                <div>
                  <p className="text-white/50 text-sm font-semibold uppercase tracking-wider mb-1">Address</p>
                  <p className="text-xl font-medium">{dict.footer.address}</p>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-white/20">
                <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white/50">{locale === 'th' ? 'ติดตามเรา' : 'Follow us'}</h3>
                <div className="bg-white/10 p-5 rounded-2xl w-fit inline-block backdrop-blur-md border border-white/10 shadow-inner">
                  <SocialLinks links={settings.socialLinks} />
                </div>
              </div>
            </div>
            
            <div className="p-8 lg:p-12 flex flex-col justify-center bg-white">
              <ContactForm locale={locale} />
            </div>
          </div>
        </div>
      </section>


    </>
  )
}

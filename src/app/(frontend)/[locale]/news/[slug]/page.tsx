import { permanentRedirect } from 'next/navigation'

export default async function RedirectPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  permanentRedirect(`/${locale}/events/updates/${slug}`)
}

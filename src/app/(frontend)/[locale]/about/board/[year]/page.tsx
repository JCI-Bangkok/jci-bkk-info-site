import { permanentRedirect } from 'next/navigation'

export default async function RedirectPage({ params }: { params: Promise<{ locale: string; year: string }> }) {
  const { locale, year } = await params
  permanentRedirect(`/${locale}/members/board/${year}`)
}

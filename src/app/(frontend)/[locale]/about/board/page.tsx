import { permanentRedirect } from 'next/navigation'

export default async function BoardArchive({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  permanentRedirect(`/${locale}/members#board`)
}

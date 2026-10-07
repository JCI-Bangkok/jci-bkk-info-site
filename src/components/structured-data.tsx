import Link from 'next/link'
import { absoluteUrl } from '@/lib/seo'

export function StructuredData({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', ...data }).replace(/</g, '\\u003c') }} />
}

export function Breadcrumbs({ locale, title }: { locale: string; title: string }) {
  const items = [
    { name: locale === 'th' ? 'หน้าแรก' : 'Home', path: `/${locale}` },
    { name: locale === 'th' ? 'กิจกรรมและข่าวสาร' : 'Events & Updates', path: `/${locale}/events` },
  ]
  return <nav aria-label={locale === 'th' ? 'เส้นทางนำทาง' : 'Breadcrumb'} className="mx-auto flex max-w-7xl flex-wrap gap-2 px-5 py-4 text-sm lg:px-8">
    {items.map(item => <span key={item.path}><Link href={item.path} className="text-[var(--jci-blue)] hover:underline">{item.name}</Link><span aria-hidden="true" className="mx-2">/</span></span>)}
    <span aria-current="page">{title}</span>
  </nav>
}

export function breadcrumbData(locale: string, path: string, title: string) {
  return { '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: locale === 'th' ? 'หน้าแรก' : 'Home', item: absoluteUrl(`/${locale}`) },
    { '@type': 'ListItem', position: 2, name: locale === 'th' ? 'กิจกรรมและข่าวสาร' : 'Events & Updates', item: absoluteUrl(`/${locale}/events`) },
    { '@type': 'ListItem', position: 3, name: title, item: absoluteUrl(`/${locale}${path}`) },
  ] }
}

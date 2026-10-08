import { safeBuilderHref } from './builder/bindings'

type NavigationItem = {
  label: string
  labelTh?: string | null
  linkType?: 'page' | 'custom' | null
  page?: number | { slug?: string | null; status?: string | null } | null
  href?: string | null
  openInNewTab?: boolean | null
}

export function resolveNavigationItems(items: NavigationItem[] | null | undefined, locale: string) {
  return (items || []).flatMap(item => {
    const page = item.page && typeof item.page === 'object' ? item.page : null
    const rawHref = item.linkType !== 'custom' && page?.slug
      ? (page.slug === 'home' ? '/' : `/${page.slug}`)
      : item.href
    if (!rawHref) return []
    const safeHref = safeBuilderHref(rawHref)
    if (safeHref === '#') return []
    const internal = safeHref === '/' || safeHref.startsWith('/') && !safeHref.startsWith('//')
    const href = internal
      ? (safeHref === '/' ? `/${locale}` : safeHref.startsWith(`/${locale}/`) ? safeHref : `/${locale}${safeHref}`)
      : safeHref
    return [{ label: locale === 'th' ? item.labelTh || item.label : item.label, href, external: !internal, newTab: Boolean(item.openInNewTab) }]
  })
}

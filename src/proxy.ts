import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'th']
const defaultLocale = 'en'

// Helper to determine preferred locale
function getPreferredLocale(request: NextRequest): string {
  // 1. Check cookie
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale
  }

  // 2. Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    if (acceptLanguage.toLowerCase().includes('th')) {
      return 'th'
    }
  }

  // 3. Fallback
  return defaultLocale
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip /builder paths so the visual editor stays on unlocalized URLs
  if (pathname.startsWith('/builder')) {
    return NextResponse.next()
  }

  // Check if pathname starts with a supported locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  // Redirect to localized URL
  const locale = getPreferredLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Skip internal paths (_next), API routes (/api), Payload admin (/admin), builder (/builder)
    // and all static files with an extension (containing a dot)
    '/((?!api|admin|builder|_next/static|_next/image|.*\\..*$).*)',
  ],
}

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { regions } from '@/lib/helper'; // e.g., ['en-AU', 'fr-CH', 'nl-BE', ...]

const defaultLocale = 'en-AU';

function getPreferredLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language');
  if (!acceptLanguage) return defaultLocale;

  const languages = acceptLanguage.split(',');
  for (const lang of languages) {
    const code = lang.split(';')[0].trim();
    if (regions.includes(code)) {
      return code;
    }
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Redirect /en-AU or /en-AU/... to /
  if (pathname === `/${defaultLocale}` || pathname.startsWith(`/${defaultLocale}/`)) {
    const newPath = pathname.replace(`/${defaultLocale}`, '') || '/';
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  // Check if URL already contains a locale
  const hasLocale = regions.some(
    (region) => pathname === `/${region}` || pathname.startsWith(`/${region}/`)
  );
  if (hasLocale) {
    return NextResponse.next();
  }

  // If no locale, redirect only if not default
  const preferredLocale = getPreferredLocale(request);

  // Do NOT redirect if preferred is default
  if (preferredLocale === defaultLocale) {
    return NextResponse.next(); // Let /about stay /about
  }

  // Redirect to the localized path
  const newUrl = request.nextUrl.clone();
  newUrl.pathname = `/${preferredLocale}${pathname}`;
  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

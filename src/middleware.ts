import { i18nRouter } from 'next-i18n-router';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import i18nConfig from '../i18nConfig';

const PUBLIC_PATHS = ['/', '/login', '/signup', '/pricing'];

export function middleware(request: NextRequest) {
  // Check for public assets to avoid unnecessary processing
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.includes('/api/') ||
    request.nextUrl.pathname.endsWith('.ico') ||
    request.nextUrl.pathname.endsWith('.svg') ||
    request.nextUrl.pathname.endsWith('.png') ||
    request.nextUrl.pathname.endsWith('.jpg')
  ) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  
  // Check if it's a public path (ignoring locale prefix for the check)
  const isPublicPath = PUBLIC_PATHS.some(path => {
    // Check exact match
    if (pathname === path) return true;
    
    // Check with locale prefixes
    return i18nConfig.locales.some(locale => {
      return pathname === `/${locale}${path}` || (path === '/' && pathname === `/${locale}`);
    });
  });

  const isAuthenticated = request.cookies.has('auth_token');

  // If trying to access a private route without auth, redirect to login
  // We need to keep the locale if present, or default to defaultLocale
  if (!isPublicPath && !isAuthenticated) {
    const locale = request.nextUrl.pathname.split('/')[1];
    const validLocale = i18nConfig.locales.includes(locale) ? locale : i18nConfig.defaultLocale;
    return NextResponse.redirect(new URL(`/${validLocale}/login`, request.url));
  }

  // If authenticated and trying to access login/signup, redirect to dashboard
  if (isAuthenticated && (pathname.includes('/login') || pathname.includes('/signup'))) {
     const locale = request.nextUrl.pathname.split('/')[1];
     const validLocale = i18nConfig.locales.includes(locale) ? locale : i18nConfig.defaultLocale;
     return NextResponse.redirect(new URL(`/${validLocale}/dashboard`, request.url));
  }
  
  return i18nRouter(request, i18nConfig);
}

export const config = {
  matcher: '/((?!api|static|.*\\..*|_next).*)'
};

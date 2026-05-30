import { i18nRouter } from 'next-i18n-router';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { jwtVerify, importSPKI } from 'jose';
import i18nConfig from '../i18nConfig';

const PUBLIC_PATHS = ['/', '/login', '/signup', '/pricing', '/compliance', '/support', '/features', '/api-docs'];

const PUBLIC_KEY_PEM = process.env.JWT_PUBLIC_KEY || `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwIoHYbqhXApNeXUa30ob
yzdmf0ajn8MvJQ5XabruXt0e3Amd4GIjrYoFC0FU6rcCUhD7sU+VnHfjgfVacKCN
hfvsJdSSU6W7opyRCQ+UXWMASdZ8FfFMiwbamqkF2mvSbXZPCIP2SdM3p5jhMsHs
MeHYmSMz1ZWkOWLkw/+/YMADnfUK9PB/1gUKKKo7XsRz68In9x2hQOvBWMk+1U1r
x5aBRMA82Bj/OGdLcpmn3QdW+PLgaJ/qhd1W0dcDulaR2kan0X4PKBpiDbugr6FN
/dbYVbzj+JkXe6ISeZZN09ysyPWMdrKcW+vw9ubayKJ747ONh62n+TNcFJQpLrJi
ZwIDAQAB
-----END PUBLIC KEY-----`;

async function verifyAuth(token: string): Promise<boolean> {
  try {
    const publicKey = await importSPKI(PUBLIC_KEY_PEM, 'RS256');
    await jwtVerify(token, publicKey, { algorithms: ['RS256'] });
    return true;
  } catch (err) {
    return false;
  }
}

export async function middleware(request: NextRequest) {
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
    // Check exact match or if it's a subroute of /support
    if (pathname === path || pathname.startsWith('/support/')) return true;
    
    // Check with locale prefixes
    return i18nConfig.locales.some(locale => {
      return pathname === `/${locale}${path}` || pathname.startsWith(`/${locale}/support/`) || (path === '/' && pathname === `/${locale}`);
    });
  });

  const token = request.cookies.get('auth_token')?.value;
  const isAuthenticated = token ? await verifyAuth(token) : false;

  // If trying to access a private route without auth, redirect to login
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

import { i18nRouter } from 'next-i18n-router';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { jwtVerify, importSPKI } from 'jose';
import i18nConfig from '../i18nConfig';
import { landingPathForRole } from './utils/role-access';

const PUBLIC_PATHS = ['/', '/login', '/signup', '/pricing', '/compliance', '/support', '/features', '/api-docs'];

const PUBLIC_KEY_PEM = process.env.JWT_PUBLIC_KEY || `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAz7NA0ouS2klaSmczz9GB
hceUTKFrnTMclTfcPY2IgdCYfcQS2AepBpkmYp9u5h7xBJRtAl+L0thE+YtFjb/q
PIysu6/0cFP4RiyvIVjwi1SHAytzunZcUuzTe1b5lA4WxNDehgugKYffKqv5fC39
8NuIEAWAz32aeMvCSo9mu9yA8xJCaa1OQJYN/m0XuuBRxHXkLz+7MAjQbaw3ohnx
6Yz6+MOohp5Tluh3R7MoJ3S/RFY47Q1IY+tODJ8XIUwPQODou519ZEy3X9YXS7lZ
QJIxlv4bXBqDk1Lr8i2Qxnffa/UyVE52ycW/9BdmKvWAd7A4nZ6jr3h6dI5PUY/K
nwIDAQAB
-----END PUBLIC KEY-----`;

async function getAuthenticatedRole(token: string): Promise<string | null> {
  try {
    const publicKey = await importSPKI(PUBLIC_KEY_PEM, 'RS256');
    const { payload } = await jwtVerify(token, publicKey, { algorithms: ['RS256'] });
    return typeof payload.tipoUsuario === 'string' ? payload.tipoUsuario : null;
  } catch (err) {
    return null;
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
  const authenticatedRole = token ? await getAuthenticatedRole(token) : null;
  const isAuthenticated = authenticatedRole !== null;

  // If trying to access a private route without auth, redirect to login
  if (!isPublicPath && !isAuthenticated) {
    const locale = request.nextUrl.pathname.split('/')[1];
    const validLocale = i18nConfig.locales.includes(locale) ? locale : i18nConfig.defaultLocale;
    return NextResponse.redirect(new URL(`/${validLocale}/login`, request.url));
  }

  const normalizedPath = pathname.replace(/^\/(pt-BR|en|es)(?=\/|$)/, '') || '/';
  if (isAuthenticated && (normalizedPath === '/dashboard' || normalizedPath.startsWith('/dashboard/')) && authenticatedRole !== 'ADMIN_TOTAL') {
    const locale = request.nextUrl.pathname.split('/')[1];
    const validLocale = i18nConfig.locales.includes(locale) ? locale : i18nConfig.defaultLocale;
    const landingPath = landingPathForRole(authenticatedRole);
    return NextResponse.redirect(new URL(`/${validLocale}${landingPath || '/login'}`, request.url));
  }

  // If authenticated and trying to access login/signup, redirect to that role's landing page.
  if (isAuthenticated && (pathname.includes('/login') || pathname.includes('/signup'))) {
     const locale = request.nextUrl.pathname.split('/')[1];
     const validLocale = i18nConfig.locales.includes(locale) ? locale : i18nConfig.defaultLocale;
     const landingPath = landingPathForRole(authenticatedRole);
     if (landingPath) {
       return NextResponse.redirect(new URL(`/${validLocale}${landingPath}`, request.url));
     }
  }
  
  return i18nRouter(request, i18nConfig);
}

export const config = {
  matcher: '/((?!api|static|.*\\..*|_next).*)'
};

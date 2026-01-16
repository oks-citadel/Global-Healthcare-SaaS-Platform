import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Supported languages
const supportedLanguages = ['en', 'es', 'fr'] as const;
type SupportedLanguage = typeof supportedLanguages[number];
const defaultLanguage: SupportedLanguage = 'en';

// Define protected routes that require authentication
const protectedRoutes = [
  '/',
  '/appointments',
  '/profile',
  '/records',
  '/messages',
  '/prescriptions',
  '/lab-results',
  '/settings',
];

// Define public routes that don't require authentication
const publicRoutes = ['/login', '/register', '/forgot-password'];

/**
 * Detect language from Accept-Language header
 */
function detectLanguageFromHeader(acceptLanguage?: string): SupportedLanguage {
  if (!acceptLanguage) return defaultLanguage;

  const languages = acceptLanguage.split(',').map((lang) => {
    const [code, q = '1'] = lang.trim().split(';q=');
    return {
      code: code.split('-')[0].toLowerCase(),
      quality: parseFloat(q),
    };
  });

  // Sort by quality
  languages.sort((a, b) => b.quality - a.quality);

  // Find first supported language
  for (const { code } of languages) {
    if (supportedLanguages.includes(code as SupportedLanguage)) {
      return code as SupportedLanguage;
    }
  }

  return defaultLanguage;
}

/**
 * Get language from request (cookie > header > default)
 */
function getLanguage(request: NextRequest): SupportedLanguage {
  // 1. Check cookie
  const cookieLanguage = request.cookies.get('i18nextLng')?.value;
  if (cookieLanguage && supportedLanguages.includes(cookieLanguage as SupportedLanguage)) {
    return cookieLanguage as SupportedLanguage;
  }

  // 2. Check Accept-Language header
  const headerLanguage = detectLanguageFromHeader(request.headers.get('accept-language') || '');
  if (headerLanguage) {
    return headerLanguage;
  }

  // 3. Default
  return defaultLanguage;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the access token from cookies or local storage (via header)
  const accessToken = request.cookies.get('accessToken')?.value;

  // Detect and handle locale
  const language = getLanguage(request);

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Check if the current route is public
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // If trying to access a protected route without a token, redirect to login
  if (isProtectedRoute && !accessToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If trying to access public routes (login/register) while authenticated, redirect to dashboard
  if (isPublicRoute && accessToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Create response
  const response = NextResponse.next();

  // Set language cookie if not already set or different from detected language
  const currentCookieLanguage = request.cookies.get('i18nextLng')?.value;
  if (!currentCookieLanguage || currentCookieLanguage !== language) {
    response.cookies.set('i18nextLng', language, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
      sameSite: 'lax',
    });
  }

  // Add language header for server components
  response.headers.set('x-language', language);

  // Add Content-Language header for better SEO
  response.headers.set('Content-Language', language);

  return response;
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};

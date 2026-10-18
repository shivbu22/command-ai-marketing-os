import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('__session')?.value;
  const { pathname } = request.nextUrl;

  // Protect all routes except auth routes, api/auth, and internal next assets
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isApiAuthPath = pathname.startsWith('/api/auth');
  const isPublicFile = pathname.includes('.') || pathname.startsWith('/_next');

  if (!session && !isAuthPage && !isApiAuthPath && !isPublicFile) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If already logged in, don't show login/register
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes except /api/auth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

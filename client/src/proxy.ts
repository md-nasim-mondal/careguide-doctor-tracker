import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Exclude static assets and api endpoints from redirect loops
  if (pathname.startsWith('/_next') || pathname.startsWith('/api/') || pathname === '/favicon.ico') {
    return NextResponse.next();
  }

  // Paths that only unauthenticated users should see (redirect to dashboard if logged in)
  const isAuthOnlyPath =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password';

  // Public paths accessible without login
  const isPublicPath =
    pathname === '/' ||
    pathname === '/about' ||
    pathname === '/contact' ||
    isAuthOnlyPath;

  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && isAuthOnlyPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

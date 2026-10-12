import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export interface DecodedToken {
  userId?: string;
  userName?: string;
  email?: string;
  role?: 'SUPER_ADMIN' | 'ADMIN' | 'DOCTOR' | 'PATIENT' | string;
  exp?: number;
}

/**
 * Safely decodes base64url JWT payload in Edge runtime without external dependencies.
 */
export function parseJwtPayload(token: string): DecodedToken | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname, searchParams } = request.nextUrl;

  // 1. Exclude static assets and api endpoints from redirect loops
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname === '/favicon.ico' ||
    pathname === '/icon.svg'
  ) {
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
    pathname === '/features' ||
    pathname === '/about' ||
    pathname === '/contact' ||
    isAuthOnlyPath;

  // 2. Decode and validate JWT token
  const decoded = token ? parseJwtPayload(token) : null;
  const isTokenExpired = Boolean(
    decoded?.exp && decoded.exp * 1000 <= Date.now()
  );

  // If token is expired or invalid on a protected route, wipe cookie and send to login
  if (token && (isTokenExpired || !decoded)) {
    if (!isPublicPath) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set(
        'error',
        'Session expired. Please log in again.'
      );
      const response = NextResponse.redirect(redirectUrl);
      response.cookies.delete('token');
      return response;
    }
  }

  // 3. Unauthenticated access guard
  const isAuthenticated = Boolean(token && decoded && !isTokenExpired);

  if (!isAuthenticated && !isPublicPath) {
    const loginUrl = new URL('/login', request.url);
    if (pathname !== '/dashboard') {
      loginUrl.searchParams.set('redirect', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated user trying to access login/register -> redirect to dashboard
  if (isAuthenticated && isAuthOnlyPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 4. Role-based Route Protection Matrix
  if (isAuthenticated && decoded) {
    const role = (decoded.role || '').toUpperCase();
    const isSuperAdmin = role === 'SUPER_ADMIN';
    const isAdmin = role === 'ADMIN';
    const isAnyAdmin = isSuperAdmin || isAdmin;
    const isDoctor = role === 'DOCTOR';
    const isPatient = role === 'PATIENT';

    // A. STRICT ADMIN ROUTES: /dashboard/users and /admin/*
    // Only SUPER_ADMIN and ADMIN are allowed
    if (pathname === '/dashboard/users' || pathname.startsWith('/dashboard/users/')) {
      if (!isAnyAdmin) {
        const redirectUrl = new URL('/dashboard', request.url);
        redirectUrl.searchParams.set('unauthorized', 'admin_required');
        return NextResponse.redirect(redirectUrl);
      }
    }

    if (pathname === '/admin' || pathname.startsWith('/admin/')) {
      if (!isAnyAdmin) {
        const redirectUrl = new URL('/dashboard', request.url);
        redirectUrl.searchParams.set('unauthorized', 'admin_required');
        return NextResponse.redirect(redirectUrl);
      }
    }

    // B. DOCTOR & ADMIN ROUTES: /dashboard/patients and /doctor/*
    // Allowed: SUPER_ADMIN, ADMIN, DOCTOR. FORBIDDEN for PATIENT!
    if (pathname === '/dashboard/patients' || pathname.startsWith('/dashboard/patients/')) {
      if (isPatient) {
        const redirectUrl = new URL('/dashboard', request.url);
        redirectUrl.searchParams.set('unauthorized', 'patient_restricted');
        return NextResponse.redirect(redirectUrl);
      }
    }

    if (pathname === '/doctor' || pathname.startsWith('/doctor/')) {
      if (!isDoctor && !isAnyAdmin) {
        const redirectUrl = new URL('/dashboard', request.url);
        redirectUrl.searchParams.set('unauthorized', 'doctor_required');
        return NextResponse.redirect(redirectUrl);
      }
    }

    // C. DOCTOR DIRECTORY MUTATION GUARD: /dashboard/doctors?action=add|edit|add-patient
    // Doctors and Patients may view the directory, but only Admins may trigger mutation forms
    if (pathname === '/dashboard/doctors') {
      const actionParam = searchParams.get('action');
      if (actionParam && !isAnyAdmin) {
        const cleanUrl = new URL('/dashboard/doctors', request.url);
        searchParams.forEach((value, key) => {
          if (key !== 'action' && key !== 'doctorId' && key !== 'patientId') {
            cleanUrl.searchParams.set(key, value);
          }
        });
        cleanUrl.searchParams.set(
          'error',
          'Only clinic administrators are authorized to add or edit doctors'
        );
        return NextResponse.redirect(cleanUrl);
      }
    }

    // D. PATIENT DEDICATED ROUTES: /patient/*
    // Forbidden for DOCTOR (unless admin)
    if (pathname === '/patient' || pathname.startsWith('/patient/')) {
      if (isDoctor && !isAnyAdmin) {
        const redirectUrl = new URL('/dashboard', request.url);
        redirectUrl.searchParams.set('unauthorized', 'patient_portal_only');
        return NextResponse.redirect(redirectUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icon.svg).*)'],
};

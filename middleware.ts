import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseMiddlewareClient } from '@/lib/supabase/middleware';

const AUTH_PATH = '/login';
const PUBLIC_PATHS = ['/', '/login', '/signup'];
const PROTECTED_PREFIXES = ['/dashboard', '/report', '/profile'];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.includes(pathname);
}

function requiresAuth(pathname: string) {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { supabase, response } = createSupabaseMiddlewareClient(request);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session && requiresAuth(pathname)) {
    const redirectUrl = new URL(AUTH_PATH, request.url);
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (session && pathname === AUTH_PATH) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // refresh session cookies for authenticated requests
  if (session) {
    return response;
  }

  if (!isPublicPath(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
};

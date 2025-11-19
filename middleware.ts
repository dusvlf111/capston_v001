import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseMiddlewareClient } from '@/lib/supabase/middleware';

const AUTH_PATH = '/login';
const PROTECTED_PREFIXES = ['/dashboard', '/report', '/profile'];

function requiresAuth(pathname: string) {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();
  const { supabase, response: supabaseResponse } = createSupabaseMiddlewareClient(
    request,
    response,
  );

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

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
};
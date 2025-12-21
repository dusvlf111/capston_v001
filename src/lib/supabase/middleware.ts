import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

export const createSupabaseMiddlewareClient = (
  request: NextRequest,
  response: NextResponse,
) => {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // In Next.js 16, we need to set cookies on the request for middleware
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        },
        remove(name: string, options: CookieOptions) {
          // In Next.js 16, we need to delete cookies on the request for middleware
          request.cookies.delete(name);
          response.cookies.set(name, '', { ...options, maxAge: 0 });
        },
      },
    },
  );

  return { supabase, response };
};
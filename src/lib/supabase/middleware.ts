import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/database.types';

export function createSupabaseMiddlewareClient(request: NextRequest, response?: NextResponse) {
  const res = response ?? NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req: request, res });
  return { supabase, response: res };
}

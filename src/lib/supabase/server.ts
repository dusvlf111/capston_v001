import { cookies, headers } from 'next/headers';
import { createRouteHandlerClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/database.types';

export function createServerComponentSupabaseClient() {
  return createServerComponentClient<Database>({ cookies });
}

export function createRouteHandlerSupabaseClient() {
  return createRouteHandlerClient<Database>({ cookies, headers });
}

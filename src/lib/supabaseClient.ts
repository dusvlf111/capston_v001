'use client';

import { createBrowserSupabaseClient } from '@/lib/supabase/client';

type BrowserSupabaseClient = ReturnType<typeof createBrowserSupabaseClient>;

let browserClient: BrowserSupabaseClient | null = null;

function getBrowserClient(): BrowserSupabaseClient {
  if (!browserClient) {
    browserClient = createBrowserSupabaseClient();
  }

  return browserClient;
}

export const supabase = getBrowserClient();

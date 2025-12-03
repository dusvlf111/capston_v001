"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database.types";

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

interface UseAuthResult {
  user: User | null;
  profile: ProfileRow | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useAuth(): UseAuthResult {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const {
      data: { user: currentUser },
      error: userError
    } = await supabase.auth.getUser();

    if (userError) {
      setError(userError.message);
      setUser(null);
      setProfile(null);
      setIsLoading(false);
      return;
    }

    if (!currentUser) {
      setUser(null);
      setProfile(null);
      setIsLoading(false);
      return;
    }

    setUser(currentUser);

    const { data, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", currentUser.id)
      .maybeSingle<ProfileRow>();

    if (profileError) {
      setError(profileError.message);
      setProfile(null);
    } else {
      setProfile(data ?? null);
    }

    setIsLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = useCallback(async () => {
    await load();
  }, [load]);

  return { user, profile, isLoading, error, refresh };
}

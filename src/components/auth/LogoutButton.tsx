"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    const { error } = await supabase.auth.signOut();
    setIsSigningOut(false);

    if (error) {
      console.error("로그아웃 실패", error.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={handleSignOut}
      isLoading={isSigningOut}
      className="min-w-24"
    >
      로그아웃
    </Button>
  );
}

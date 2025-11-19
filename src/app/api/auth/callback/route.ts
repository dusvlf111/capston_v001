import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function buildRedirectUrl(requestUrl: string, redirectTo?: string) {
  const request = new URL(requestUrl);
  const targetPath = redirectTo && redirectTo.startsWith("/") ? redirectTo : "/dashboard";
  return new URL(targetPath, request.origin);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const redirectTo = url.searchParams.get("redirect_to") ?? undefined;
  const redirectUrl = buildRedirectUrl(request.url, redirectTo);

  if (!code) {
    redirectUrl.searchParams.set("error", "missing_code");
    return NextResponse.redirect(redirectUrl);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    redirectUrl.searchParams.set("error", error.message);
  }

  return NextResponse.redirect(redirectUrl);
}
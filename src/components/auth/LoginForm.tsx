"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

const schema = z.object({
  email: z.string().email("유효한 이메일을 입력하세요."),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
});

export type LoginFormValues = z.infer<typeof schema>;

function resolveRedirectPath(path?: string) {
  if (path && path.startsWith("/")) {
    return path;
  }
  return "/dashboard";
}

type LoginFormProps = {
  redirectTo?: string;
};

export default function LoginForm({ redirectTo }: LoginFormProps) {
  const router = useRouter();
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setServerError(error.message);
      return;
    }

    const destination = resolveRedirectPath(redirectTo);
    router.push(destination);
    router.refresh();
  });

  async function handleOAuth(provider: "google" | "kakao") {
    setServerError(null);
    const callbackUrl = new URL("/api/auth/callback", window.location.origin);
    const target = resolveRedirectPath(redirectTo);
    if (target) {
      callbackUrl.searchParams.set("redirect_to", target);
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: callbackUrl.toString(),
      },
    });

    if (error) {
      setServerError(error.message);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold text-slate-50">로그인</h2>
        <p className="text-sm text-slate-400">계정 정보를 입력하거나 소셜 로그인을 사용하세요.</p>
      </div>

      <Input label="이메일" type="email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />

      <Input label="비밀번호" type="password" placeholder="8자 이상" error={errors.password?.message} {...register("password")} />

      {serverError && <Alert variant="error" title="로그인 실패" description={serverError} />}

      <Button type="submit" isLoading={isSubmitting} className="w-full">
        이메일로 로그인
      </Button>

      <div className="flex items-center gap-3 text-sm text-slate-400">
        <span className="h-px flex-1 bg-slate-800" />
        또는 소셜 계정으로
        <span className="h-px flex-1 bg-slate-800" />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Button type="button" variant="secondary" onClick={() => handleOAuth("google")}>
          Google 로그인
        </Button>
        <Button type="button" variant="secondary" onClick={() => handleOAuth("kakao")}>
          Kakao 로그인
        </Button>
      </div>
    </form>
  );
}

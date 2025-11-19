import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";

interface LoginPageProps {
  searchParams: {
    redirectTo?: string;
    error?: string;
  };
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const redirectTo = searchParams?.redirectTo;
  const errorParam = searchParams?.error;

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-16 md:flex-row md:items-center">
      <div className="flex-1 space-y-4">
        <p className="text-sm uppercase tracking-[0.2em] text-sky-400">해양 레저 자율신고</p>
        <h1 className="text-4xl font-semibold text-slate-50 md:text-5xl">안전한 해양 활동을 위한 로그인</h1>
        <p className="text-base text-slate-300">
          이메일 또는 소셜 계정으로 로그인하고 자율신고 현황, 안전구역, 분석 리포트를 실시간으로 확인하세요.
        </p>
        <p className="text-sm text-slate-400">
          계정이 없다면? <Link href="/signup" className="font-semibold text-sky-400 hover:text-sky-300">지금 회원가입</Link>
        </p>
        {errorParam && (
          <p className="text-sm text-rose-400">로그인 도중 문제가 발생했습니다. 다시 시도해주세요.</p>
        )}
      </div>

      <div className="flex-1">
        <LoginForm redirectTo={redirectTo} />
      </div>
    </section>
  );
}

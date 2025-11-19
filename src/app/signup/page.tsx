import Link from 'next/link';
import SignupForm from '@/components/auth/SignupForm';

export default function SignupPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-160px)] w-full max-w-5xl flex-col items-center justify-center gap-8 px-4 py-10 sm:px-6">
      <div className="w-full max-w-xl space-y-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl shadow-slate-900/50">
        <SignupForm />
        <p className="text-center text-sm text-slate-400">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="font-semibold text-sky-300 hover:text-sky-200">
            로그인하기
          </Link>
        </p>
      </div>

      <div className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-400">
        <p className="font-semibold text-slate-200">OAuth가 필요하신가요?</p>
        <p className="mt-2">
          관리자 대시보드에서 Google 또는 Kakao OAuth 공급자를 활성화하면, 위 회원가입 폼 하단에 OAuth 버튼을 추가할 수 있습니다.
          현재는 이메일 기반 가입 플로우만 제공됩니다.
        </p>
      </div>
    </div>
  );
}

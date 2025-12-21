import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold text-slate-50">대시보드</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="mb-2 text-lg font-semibold text-slate-100">총 보고 건수</h3>
          <p className="text-3xl font-bold text-sky-400">0</p>
          <p className="mt-2 text-sm text-slate-400">등록된 안전 보고 수</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="mb-2 text-lg font-semibold text-slate-100">최근 활동</h3>
          <p className="text-3xl font-bold text-green-400">-</p>
          <p className="mt-2 text-sm text-slate-400">마지막 보고 일시</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="mb-2 text-lg font-semibold text-slate-100">안전 점수 평균</h3>
          <p className="text-3xl font-bold text-yellow-400">-</p>
          <p className="mt-2 text-sm text-slate-400">전체 보고 평균 점수</p>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="mb-4 text-xl font-semibold text-slate-100">최근 보고 내역</h2>
        <div className="text-center py-12 text-slate-400">
          <p>아직 등록된 보고가 없습니다.</p>
          <a href="/report" className="mt-4 inline-block text-sky-400 hover:text-sky-300">
            새 보고 작성하기 →
          </a>
        </div>
      </div>
    </div>
  );
}

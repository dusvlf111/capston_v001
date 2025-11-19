import { redirect } from "next/navigation";
import ReportForm from "@/components/forms/ReportForm";
import { createServerComponentSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ReportPage() {
  const supabase = createServerComponentSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login?redirectTo=/report");
  }

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-16">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-400">자율 신고</p>
        <h1 className="text-4xl font-semibold text-slate-50">해양레저 신고 접수</h1>
        <p className="text-slate-300">
          위치, 활동, 연락처 정보를 입력하고 신고를 제출하면 안전 분석 및 이력 관리가 진행됩니다.
        </p>
      </div>

      <ReportForm className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6" />
    </section>
  );
}

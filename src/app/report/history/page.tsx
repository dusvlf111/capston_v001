import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { mapReportRowToResponse } from "@/lib/utils/reportTransform";
import { formatDateTimeShort } from "@/lib/utils/dateFormat";

export const dynamic = "force-dynamic";

export default async function ReportHistoryPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/report/history");
  }

  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const reports = (data ?? []).map(mapReportRowToResponse);

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-16">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-400">신고 이력</p>
        <h1 className="text-4xl font-semibold text-slate-50">나의 신고 기록</h1>
        <p className="text-slate-300">제출한 신고를 확인하고 상세 정보를 이어서 확인할 수 있습니다.</p>
      </div>

      {error && (
        <div className="rounded-3xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-200">
          신고 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
        </div>
      )}

      {reports.length === 0 && !error ? (
        <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-950/40 p-8 text-center text-slate-400">
          아직 제출한 신고가 없습니다. <Link href="/report" className="text-sky-300">첫 신고 작성하기</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-950/60 p-6 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{report.reportId}</p>
                <h2 className="text-2xl font-semibold text-slate-50">{report.location.name}</h2>
                <p className="text-sm text-slate-400">{formatDateTimeShort(report.submittedAt)}</p>
              </div>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
                <div className="text-sm text-slate-400">
                  <p>상태</p>
                  <p className="text-lg font-semibold text-slate-50">{report.status}</p>
                </div>
                <div className="text-sm text-slate-400">
                  <p>안전도</p>
                  <p className="text-lg font-semibold text-slate-50">{report.safetyScore}</p>
                </div>
                <Link
                  href={`/report/${report.id}`}
                  className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-sky-400 hover:text-sky-200"
                >
                  상세 보기
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

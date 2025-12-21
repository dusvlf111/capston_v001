import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { mapReportRowToResponse } from "@/lib/utils/reportTransform";
import { formatDateTime } from "@/lib/utils/dateFormat";
import type { ReportStatus } from "@/types/api";

export const dynamic = "force-dynamic";

const getStatusConfig = (status: ReportStatus) => {
  const configs = {
    APPROVED: {
      label: "승인",
      badgeClass: "bg-green-500/20 text-green-400 border-green-500/30",
      textClass: "text-green-400"
    },
    CAUTION: {
      label: "주의",
      badgeClass: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      textClass: "text-yellow-400"
    },
    DENIED: {
      label: "거부",
      badgeClass: "bg-red-500/20 text-red-400 border-red-500/30",
      textClass: "text-red-400"
    }
  };
  return configs[status] || configs.DENIED;
};

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-400";
  if (score >= 60) return "text-yellow-400";
  return "text-red-400";
};

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

  // 통계 계산
  const totalReports = reports.length;
  const approvedCount = reports.filter(r => r.status === "APPROVED").length;
  const cautionCount = reports.filter(r => r.status === "CAUTION").length;
  const deniedCount = reports.filter(r => r.status === "DENIED").length;

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16">
      {/* 헤더 */}
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-400">신고 이력</p>
        <h1 className="text-4xl font-semibold text-slate-50">나의 신고 기록</h1>
        <p className="text-slate-300">제출한 신고를 확인하고 상세 정보를 이어서 확인할 수 있습니다.</p>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-200">
          신고 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
        </div>
      )}

      {/* 통계 요약 */}
      {totalReports > 0 && (
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-sm text-slate-400 mb-1">전체 신고</p>
            <p className="text-3xl font-bold text-slate-50">{totalReports}</p>
          </div>
          <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-5">
            <p className="text-sm text-green-400 mb-1">승인</p>
            <p className="text-3xl font-bold text-green-400">{approvedCount}</p>
          </div>
          <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5">
            <p className="text-sm text-yellow-400 mb-1">주의</p>
            <p className="text-3xl font-bold text-yellow-400">{cautionCount}</p>
          </div>
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
            <p className="text-sm text-red-400 mb-1">거부</p>
            <p className="text-3xl font-bold text-red-400">{deniedCount}</p>
          </div>
        </div>
      )}

      {/* 신고 목록 */}
      {reports.length === 0 && !error ? (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-lg text-slate-400 mb-4">아직 제출한 신고가 없습니다.</p>
          <Link
            href="/report"
            className="inline-block px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors"
          >
            첫 신고 작성하기 →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => {
            const statusConfig = getStatusConfig(report.status);
            return (
              <div
                key={report.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 hover:border-slate-700 transition-all group"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  {/* 왼쪽: 리포트 정보 */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="text-sm uppercase tracking-wider text-slate-500 font-mono">
                        {report.reportId}
                      </p>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.badgeClass}`}>
                        {statusConfig.label}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-slate-100 mb-1 group-hover:text-sky-400 transition-colors">
                      {report.location.name}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDateTime(report.submittedAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {report.activity.participants}명
                      </span>
                      <span className="text-slate-500">•</span>
                      <span>{report.activity.type}</span>
                    </div>
                  </div>

                  {/* 오른쪽: 점수 및 액션 */}
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm text-slate-400 mb-1">안전도</p>
                      <p className={`text-3xl font-bold ${getScoreColor(report.safetyScore)}`}>
                        {report.safetyScore}
                      </p>
                    </div>
                    <Link
                      href={`/report/${report.id}`}
                      className="px-6 py-2.5 rounded-xl border border-slate-700 bg-slate-800/50 text-sm font-semibold text-slate-100 hover:border-sky-400 hover:bg-sky-500/10 hover:text-sky-400 transition-all"
                    >
                      상세 보기
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 하단 네비게이션 */}
      {totalReports > 0 && (
        <div className="flex justify-center pt-4">
          <Link
            href="/dashboard"
            className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
          >
            ← 대시보드로 돌아가기
          </Link>
        </div>
      )}
    </section>
  );
}


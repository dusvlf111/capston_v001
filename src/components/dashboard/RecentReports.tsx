"use client";

import Link from "next/link";
import type { ReportResponse } from "@/types/api";
import { formatDateTime } from "@/lib/utils/dateFormat";

interface RecentReportsProps {
  reports: ReportResponse[];
}

export default function RecentReports({ reports }: RecentReportsProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      APPROVED: { label: "승인", color: "bg-green-500/20 text-green-400 border-green-500/30" },
      CAUTION: { label: "주의", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
      DENIED: { label: "거부", color: "bg-red-500/20 text-red-400 border-red-500/30" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: "대기",
      color: "bg-slate-500/20 text-slate-400 border-slate-500/30",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (reports.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8">
        <h2 className="mb-6 text-xl font-semibold text-slate-100">최근 보고 내역</h2>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-slate-400 mb-4">아직 등록된 보고가 없습니다.</p>
          <Link
            href="/report"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            새 보고 작성하기 →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-100">최근 보고 내역</h2>
        <Link
          href="/report"
          className="text-sm text-sky-400 hover:text-sky-300 transition-colors"
        >
          새 보고 작성 →
        </Link>
      </div>

      <div className="space-y-4">
        {reports.map((report) => (
          <Link
            key={report.id}
            href={`/report/${report.id}`}
            className="block p-5 rounded-lg border border-slate-800 bg-slate-800/30 hover:bg-slate-800/50 hover:border-slate-700 transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-slate-100 group-hover:text-sky-400 transition-colors">
                    보고서 #{report.reportId}
                  </h3>
                  {getStatusBadge(report.status)}
                </div>
                <p className="text-sm text-slate-400">
                  {report.location.name}
                </p>
              </div>
              {report.safetyScore !== null && (
                <div className="text-right ml-4">
                  <div className="text-2xl font-bold text-sky-400">
                    {Math.round(report.safetyScore)}
                  </div>
                  <div className="text-xs text-slate-500">안전점수</div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {formatDateTime(report.submittedAt)}
                </span>
                {report.location.coordinates.latitude && report.location.coordinates.longitude && (
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {report.location.coordinates.latitude.toFixed(4)}, {report.location.coordinates.longitude.toFixed(4)}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {reports.length >= 5 && (
        <div className="mt-6 text-center">
          <Link
            href="/report/history"
            className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
          >
            전체 보고 내역 보기 →
          </Link>
        </div>
      )}
    </div>
  );
}

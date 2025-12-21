"use client";

interface DashboardStatsProps {
  totalReports: number;
  lastActivityDate: string | null;
  averageScore: number | null;
}

export default function DashboardStats({
  totalReports,
  lastActivityDate,
  averageScore,
}: DashboardStatsProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "오늘";
    if (diffDays === 1) return "어제";
    if (diffDays < 7) return `${diffDays}일 전`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
    return date.toLocaleDateString("ko-KR");
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return "text-slate-400";
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreLabel = (score: number | null) => {
    if (score === null) return "-";
    if (score >= 80) return "안전";
    if (score >= 60) return "주의";
    return "위험";
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* 총 보고 건수 */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-slate-100">총 보고 건수</h3>
          <span className="text-2xl">📊</span>
        </div>
        <p className="text-4xl font-bold text-sky-400 mb-1">{totalReports}</p>
        <p className="text-sm text-slate-400">등록된 안전 보고 수</p>
      </div>

      {/* 최근 활동 */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-slate-100">최근 활동</h3>
          <span className="text-2xl">📅</span>
        </div>
        <p className="text-4xl font-bold text-green-400 mb-1">
          {formatActivityDate(lastActivityDate)}
        </p>
        <p className="text-sm text-slate-400">마지막 보고 일시</p>
      </div>

      {/* 안전 점수 평균 */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-slate-100">안전 점수 평균</h3>
          <span className="text-2xl">⭐</span>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <p className={`text-4xl font-bold ${getScoreColor(averageScore)}`}>
            {averageScore !== null ? Math.round(averageScore) : "-"}
          </p>
          {averageScore !== null && (
            <span className="text-sm text-slate-400">/ 100</span>
          )}
        </div>
        <p className="text-sm text-slate-400">
          {averageScore !== null ? getScoreLabel(averageScore) : "평가 대기 중"}
        </p>
      </div>
    </div>
  );
}

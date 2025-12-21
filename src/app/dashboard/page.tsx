import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentReports from "@/components/dashboard/RecentReports";
import QuickActions from "@/components/dashboard/QuickActions";
import type { Database } from "@/types/database.types";
import { mapReportRowToResponse } from "@/lib/utils/reportTransform";

type ReportRow = Database["public"]["Tables"]["reports"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 사용자 프로필 가져오기
  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const profile = profileData as ProfileRow | null;

  // 사용자의 모든 보고서 가져오기
  const { data: reports } = await supabase
    .from("reports")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // 타입 안전성을 위해 명시적으로 타입 지정
  const typedReports = (reports || []) as ReportRow[];
  
  // 변환된 리포트 데이터
  const transformedReports = typedReports.map(mapReportRowToResponse);

  // 통계 계산
  const totalReports = transformedReports.length;
  const lastActivityDate = transformedReports[0]?.submittedAt || null;

  // 안전점수가 있는 리포트만 필터링하여 평균 계산
  const reportsWithScore = transformedReports.filter(report => report.safetyScore !== null && report.safetyScore > 0);
  const averageScore = reportsWithScore.length > 0
    ? reportsWithScore.reduce((acc, report) => acc + report.safetyScore, 0) / reportsWithScore.length
    : null;

  // 최근 5개 보고서만 표시
  const recentReports = transformedReports.slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-50 mb-2">대시보드</h1>
          <p className="text-slate-400">
            안녕하세요, {profile?.full_name || user.email}님! 👋
          </p>
        </div>

        {/* 통계 카드 */}
        <div className="mb-8">
          <DashboardStats
            totalReports={totalReports}
            lastActivityDate={lastActivityDate}
            averageScore={averageScore}
          />
        </div>

        {/* 빠른 액션 */}
        <div className="mb-8">
          <QuickActions />
        </div>

        {/* 최근 보고 내역 */}
        <div>
          <RecentReports reports={recentReports} />
        </div>
      </div>
    </div>
  );
}

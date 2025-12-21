import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentReports from "@/components/dashboard/RecentReports";
import QuickActions from "@/components/dashboard/QuickActions";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 사용자 프로필 가져오기
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // 사용자의 모든 보고서 가져오기
  const { data: reports } = await supabase
    .from("reports")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // 통계 계산
  const totalReports = reports?.length || 0;
  const lastActivityDate = reports?.[0]?.created_at || null;

  const averageScore = reports && reports.length > 0
    ? reports.reduce((acc, report) => acc + (report.safety_score || 0), 0) / reports.length
    : null;

  // 최근 5개 보고서만 표시
  const recentReports = reports?.slice(0, 5) || [];

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

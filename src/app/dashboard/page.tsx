import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentReports from "@/components/dashboard/RecentReports";
import QuickActions from "@/components/dashboard/QuickActions";
import type { Database } from "@/types/database.types";

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

  // 통계 계산
  const totalReports = typedReports.length;
  const lastActivityDate = typedReports[0]?.created_at || null;

  const averageScore = typedReports.length > 0
    ? typedReports.reduce((acc, report) => acc + (report.safety_score || 0), 0) / typedReports.length
    : null;

  // 최근 5개 보고서만 표시
  const recentReports = typedReports.slice(0, 5);

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

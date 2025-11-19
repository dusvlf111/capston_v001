import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createServerComponentSupabaseClient } from "@/lib/supabase/server";
import { mapReportRowToResponse } from "@/lib/utils/reportTransform";
import {
  matchRegionByLocation,
  mockSafetyZones,
  mockWeatherByRegion,
  mockFisheryNotices,
  mockShippingAlerts
} from "@/lib/data/mockData";

export const dynamic = "force-dynamic";

type PageProps = {
  params: { id: string };
};

const statusTokens: Record<string, string> = {
  APPROVED: "text-emerald-400",
  CAUTION: "text-amber-400",
  DENIED: "text-rose-400"
};

const badgeTokens: Record<string, string> = {
  APPROVED: "bg-emerald-500/10 border-emerald-500/40",
  CAUTION: "bg-amber-500/10 border-amber-500/40",
  DENIED: "bg-rose-500/10 border-rose-500/40"
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function getSafetyInsight(locationName: string) {
  const region = matchRegionByLocation(locationName);
  return {
    region,
    weather: mockWeatherByRegion[region],
    fishery: mockFisheryNotices[region],
    shipping: mockShippingAlerts[region],
    zone: mockSafetyZones.find((item) => item.region === region)
  };
}

const emergencyContacts = [
  { label: "해양경찰 긴급신고", value: "122" },
  { label: "응급의료", value: "119" },
  { label: "지역 해양 관청", value: "051-741-0112" }
];

export default async function ReportDetailPage({ params }: PageProps) {
  const supabase = createServerComponentSupabaseClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(`/login?redirectTo=/report/${params.id}`);
  }

  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !data || data.user_id !== session.user.id) {
    notFound();
  }

  const report = mapReportRowToResponse(data);
  const safetyInsight = getSafetyInsight(report.location.name);

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400">자율 신고 결과</p>
          <h1 className="text-4xl font-semibold text-slate-50">접수 번호 {report.reportId}</h1>
          <p className="text-slate-400">제출 일시 {formatDate(report.submittedAt)}</p>
        </div>
        <Link
          href="/report/history"
          className="text-sm font-semibold text-sky-300 transition hover:text-sky-200"
        >
          전체 신고 이력 보기 →
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
          <p className="text-sm text-slate-400">현재 상태</p>
          <p className={`text-3xl font-semibold ${statusTokens[report.status]}`}>
            {report.status}
          </p>
          <p className="mt-4 text-sm text-slate-400">안전도 점수</p>
          <p className="text-4xl font-bold text-slate-50">{report.safetyScore}</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
          <p className="text-sm text-slate-400">활동 시간</p>
          <p className="font-semibold text-slate-50">
            {formatDate(report.activity.startTime)}
          </p>
          <p className="text-sm text-slate-500">~ {formatDate(report.activity.endTime)}</p>
          <p className="mt-4 text-sm text-slate-400">참가자 수</p>
          <p className="text-3xl font-semibold text-slate-50">{report.activity.participants}명</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
          <p className="text-sm text-slate-400">연락 담당자</p>
          <p className="text-2xl font-semibold text-slate-50">{report.contact.name}</p>
          <p className="text-sm text-slate-400">{report.contact.phone}</p>
          <p className="text-sm text-slate-500">응급 {report.contact.emergencyContact}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
          <p className="text-sm font-semibold text-slate-300">위치 정보</p>
          <h2 className="text-2xl font-bold text-slate-50">{report.location.name}</h2>
          <p className="text-sm text-slate-400">
            위도 {report.location.coordinates.latitude.toFixed(4)}, 경도 {report.location.coordinates.longitude.toFixed(4)}
          </p>
          <div className="mt-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-400">
            실제 지도 연동 전까지는 정적 미리보기 영역입니다.
          </div>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
          <p className="text-sm font-semibold text-slate-300">활동 정보</p>
          <div className={`mt-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm ${badgeTokens[report.status]}`}>
            {report.activity.type}
          </div>
          <dl className="mt-4 space-y-2 text-sm text-slate-300">
            <div className="flex justify-between">
              <dt>시작</dt>
              <dd>{formatDate(report.activity.startTime)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>종료</dt>
              <dd>{formatDate(report.activity.endTime)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>참가자</dt>
              <dd>{report.activity.participants}명</dd>
            </div>
          </dl>
        </div>
      </div>

      {report.notes && (
        <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
          <p className="text-sm font-semibold text-slate-300">비고</p>
          <p className="mt-2 text-slate-100">{report.notes}</p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
          <p className="text-sm font-semibold text-slate-300">기상 및 안전 정보 ({safetyInsight.region})</p>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            <li>기상 요약: {safetyInsight.weather.summary}</li>
            <li>풍속: {safetyInsight.weather.windSpeed}m/s · 파고 {safetyInsight.weather.waveHeight}m</li>
            <li>가시거리: {safetyInsight.weather.visibility}km</li>
            <li>어업권: {safetyInsight.fishery.message}</li>
            <li>항로 주의: {safetyInsight.shipping.caution}</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
          <p className="text-sm font-semibold text-slate-300">응급 연락망</p>
          <dl className="mt-4 space-y-3 text-sm text-slate-200">
            {emergencyContacts.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <dt className="text-slate-400">{item.label}</dt>
                <dd className="font-semibold">{item.value}</dd>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-slate-800 pt-3">
              <dt className="text-slate-400">신고 담당자</dt>
              <dd className="font-semibold">{report.contact.name}</dd>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <dt>긴급 연락처</dt>
              <dd className="font-semibold text-slate-200">{report.contact.emergencyContact}</dd>
            </div>
          </dl>
        </div>
      </div>

      {safetyInsight.zone && (
        <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
          <p className="text-sm font-semibold text-slate-300">권장 안전 구역</p>
          <h2 className="text-2xl font-bold text-slate-50">{safetyInsight.zone.name}</h2>
          <p className="text-sm text-slate-400">허용 활동: {safetyInsight.zone.allowedActivities.join(', ')}</p>
          <p className="text-sm text-slate-400">제한 사항: {safetyInsight.zone.restrictions.join(', ')}</p>
          <p className="mt-2 text-sm text-slate-300">{safetyInsight.zone.notes}</p>
        </div>
      )}
    </section>
  );
}

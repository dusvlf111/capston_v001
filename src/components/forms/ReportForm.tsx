"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import LocationSelector from "@/components/forms/LocationSelector";
import ActivitySelector from "@/components/forms/ActivitySelector";
import ContactForm from "@/components/forms/ContactForm";
import CompanionForm from "@/components/forms/CompanionForm";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import type { ReportResponse } from "@/types/api";
import { ACTIVITY_TYPES } from "@/types/api";
import type { ReportSchema } from "@/lib/utils/validators";
import { reportSchema } from "@/lib/utils/validators";
import { getDefaultActivityTimes } from "@/lib/utils/activityTime";
import { cn } from "@/lib/utils/cn";

const buildDefaultValues = (): ReportSchema => {
  const { startTime, endTime } = getDefaultActivityTimes();

  return {
  location: {
    name: "",
    coordinates: {
      latitude: undefined as unknown as number,
      longitude: undefined as unknown as number,
    },
  },
  activity: {
    type: ACTIVITY_TYPES[0],
    startTime,
    endTime,
    participants: 1,
  },
  contact: {
    name: "",
    phone: "",
    emergencyContact: "",
  },
  companions: [],
  notes: "",
  };
};

export default function ReportForm({ className }: { className?: string }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [lastReport, setLastReport] = useState<ReportResponse | null>(null);
  const defaultValues = useMemo(() => buildDefaultValues(), []);

  const methods = useForm<ReportSchema>({
    resolver: zodResolver(reportSchema),
    defaultValues,
    mode: "onBlur",
  });

  const {
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = methods;

  const locationCoordinates = watch("location.coordinates");
  const hasValidLocation = useMemo(() => {
    return (
      typeof locationCoordinates?.latitude === "number" &&
      typeof locationCoordinates?.longitude === "number"
    );
  }, [locationCoordinates]);

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    setLastReport(null);

    try {
      const response = await fetch("/api/report/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const payload = (await response.json().catch(() => null)) as ReportResponse | { message?: string } | null;
      console.log("Report submission response:", payload);

      if (!response.ok) {
        const message = payload && "message" in payload ? payload.message : undefined;
        throw new Error(message ?? "신고 제출에 실패했습니다. 다시 시도해주세요.");
      }

      if (payload && "id" in payload) {
        setLastReport(payload as ReportResponse);
        router.push(`/report/result/${payload.id}`);
      }

      reset(values);
    } catch (error) {
      console.error("Report submission error:", error);
      setServerError(error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.");
    }
  });

  const handleReset = () => {
    reset(buildDefaultValues());
    setServerError(null);
    setLastReport(null);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} className={cn("space-y-6", className)}>
        <LocationSelector control={methods.control} />
        <ActivitySelector control={methods.control} />
        <ContactForm control={methods.control} />
        <CompanionForm />

        <label className="flex flex-col gap-2 text-sm text-slate-200">
          <span className="font-semibold text-slate-50">비고 (선택)</span>
          <textarea
            className="min-h-[120px] rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-base text-slate-50 placeholder:text-slate-500 transition focus-visible:outline-2 focus-visible:outline-sky-400"
            placeholder="추가로 공유하고 싶은 안전 정보나 특이사항을 입력하세요."
            {...methods.register("notes")}
          />
          {errors.notes?.message && <span className="text-xs text-rose-400">{errors.notes.message}</span>}
        </label>

        {!hasValidLocation && (
          <Alert
            variant="warning"
            title="위치 정보 필요"
            description="신고를 제출하려면 위치 정보를 선택해주세요. '현재 위치 사용' 버튼을 클릭하거나 주소를 검색하세요."
          />
        )}
        {isSubmitting && (
          <div className="rounded-2xl border border-blue-800 bg-blue-950/20 p-4">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 shrink-0">
                <div className="absolute inset-0 border-3 border-blue-800 rounded-full"></div>
                <div className="absolute inset-0 border-3 border-t-blue-400 rounded-full animate-spin"></div>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-300">신고를 제출하는 중...</p>
                <p className="text-xs text-blue-400/70">안전 분석을 수행하고 있습니다. 잠시만 기다려주세요.</p>
              </div>
            </div>
          </div>
        )}
        {serverError && <Alert variant="error" title="제출에 실패했습니다" description={serverError} />}
        {lastReport && (
          <Alert
            variant="success"
            title="신고가 접수되었습니다"
            description={`접수 번호 ${lastReport.reportId} (상태: ${lastReport.status})`}
          />
        )}

        <div className="flex flex-wrap justify-end gap-3">
          <Button type="button" variant="secondary" onClick={handleReset} disabled={isSubmitting}>
            입력 초기화
          </Button>
          <Button type="submit" isLoading={isSubmitting} disabled={!hasValidLocation || isSubmitting}>
            신고 제출
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}

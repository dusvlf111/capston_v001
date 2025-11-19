"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import LocationSelector from "@/components/forms/LocationSelector";
import ActivitySelector from "@/components/forms/ActivitySelector";
import ContactForm from "@/components/forms/ContactForm";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import type { ReportResponse } from "@/types/api";
import { ACTIVITY_TYPES } from "@/types/api";
import type { ReportSchema } from "@/lib/utils/validators";
import { reportSchema } from "@/lib/utils/validators";
import { cn } from "@/lib/utils/cn";

const buildDefaultValues = (): ReportSchema => ({
  location: {
    name: "",
    coordinates: {
      latitude: undefined as unknown as number,
      longitude: undefined as unknown as number,
    },
  },
  activity: {
    type: ACTIVITY_TYPES[0],
    startTime: "",
    endTime: "",
    participants: 1,
  },
  contact: {
    name: "",
    phone: "",
    emergencyContact: "",
  },
  notes: "",
});

export default function ReportForm({ className }: { className?: string }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [lastReport, setLastReport] = useState<ReportResponse | null>(null);
  const defaultValues = useMemo(() => buildDefaultValues(), []);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReportSchema>({
    resolver: zodResolver(reportSchema),
    defaultValues,
    mode: "onBlur",
  });

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

      if (!response.ok) {
        const message = payload && "message" in payload ? payload.message : undefined;
        throw new Error(message ?? "신고 제출에 실패했습니다. 다시 시도해주세요.");
      }

      if (payload && "id" in payload) {
        setLastReport(payload as ReportResponse);
      }

      reset(values);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.");
    }
  });

  const handleReset = () => {
    reset(buildDefaultValues());
    setServerError(null);
    setLastReport(null);
  };

  return (
    <form onSubmit={onSubmit} className={cn("space-y-6", className)}>
      <LocationSelector control={control} />
      <ActivitySelector control={control} />
      <ContactForm control={control} />

      <label className="flex flex-col gap-2 text-sm text-slate-200">
        <span className="font-semibold text-slate-50">비고 (선택)</span>
        <textarea
          className="min-h-[120px] rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-base text-slate-50 placeholder:text-slate-500 transition focus-visible:outline-2 focus-visible:outline-sky-400"
          placeholder="추가로 공유하고 싶은 안전 정보나 특이사항을 입력하세요."
          {...register("notes")}
        />
        {errors.notes?.message && <span className="text-xs text-rose-400">{errors.notes.message}</span>}
      </label>

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
        <Button type="submit" isLoading={isSubmitting}>
          신고 제출
        </Button>
      </div>
    </form>
  );
}

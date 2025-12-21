"use client";

import { useEffect, useMemo, useState } from "react";
import type { Control } from "react-hook-form";
import { useController } from "react-hook-form";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { ACTIVITY_TYPES } from "@/types/api";
import type { ReportSchema } from "@/lib/utils/validators";
import { cn } from "@/lib/utils/cn";

interface ActivitySelectorProps {
  control: Control<ReportSchema>;
  className?: string;
}

const pad = (input: number) => input.toString().padStart(2, "0");

const formatDateTimeValue = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  // 로컬 시간대로 표시
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const toISOStringFromLocal = (value: string) => {
  if (!value) return undefined;
  // datetime-local 값은 "YYYY-MM-DDTHH:mm" 형식
  // 이를 로컬 시간으로 해석하고 ISO 문자열로 변환
  const normalized = value.length === 16 ? `${value}:00` : value;
  
  // 로컬 시간을 명시적으로 파싱
  const parts = normalized.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
  if (!parts) return undefined;
  
  const [, year, month, day, hours, minutes, seconds] = parts;
  const date = new Date(
    parseInt(year),
    parseInt(month) - 1, // 월은 0부터 시작
    parseInt(day),
    parseInt(hours),
    parseInt(minutes),
    parseInt(seconds)
  );
  
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }
  
  return date.toISOString();
};

export default function ActivitySelector({ control, className }: ActivitySelectorProps) {
  const [timeError, setTimeError] = useState<string | null>(null);
  const {
    field: typeField,
    fieldState: { error: typeError }
  } = useController({ name: "activity.type", control });

  const {
    field: startTimeField,
    fieldState: { error: startError }
  } = useController({ name: "activity.startTime", control });

  const {
    field: endTimeField,
    fieldState: { error: endError }
  } = useController({ name: "activity.endTime", control });

  const {
    field: participantsField,
    fieldState: { error: participantsError }
  } = useController({ name: "activity.participants", control });

  const [startInputValue, setStartInputValue] = useState(() => formatDateTimeValue(startTimeField.value));
  const [endInputValue, setEndInputValue] = useState(() => formatDateTimeValue(endTimeField.value));

  useEffect(() => {
    setStartInputValue(formatDateTimeValue(startTimeField.value));
  }, [startTimeField.value]);

  useEffect(() => {
    setEndInputValue(formatDateTimeValue(endTimeField.value));
  }, [endTimeField.value]);

  useEffect(() => {
    if (!startTimeField.value) {
      setTimeError(null);
      return;
    }

    // endTime이 비어있으면 검증하지 않음 (선택적 필드)
    if (!endTimeField.value || endTimeField.value === '') {
      setTimeError(null);
      return;
    }

    const start = new Date(startTimeField.value).getTime();
    const end = new Date(endTimeField.value).getTime();

    if (Number.isFinite(start) && Number.isFinite(end) && end <= start) {
      setTimeError("종료 시간은 시작 시간 이후여야 합니다.");
    } else {
      setTimeError(null);
    }
  }, [startTimeField.value, endTimeField.value]);

  const activityButtons = useMemo(() => ACTIVITY_TYPES, []);

  return (
    <section className={cn("space-y-5 rounded-2xl border border-slate-800 bg-slate-950/60 p-5", className)}>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-300">활동 정보</p>
        <p className="text-xs text-slate-500">활동 종류와 일정을 입력하세요.</p>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="활동 유형 선택">
        {activityButtons.map((activity) => (
          <Button
            key={activity}
            type="button"
            variant={typeField.value === activity ? "primary" : "secondary"}
            size="sm"
            onClick={() => typeField.onChange(activity)}
            className="rounded-xl"
            data-testid={`activity-${activity}`}
            aria-pressed={typeField.value === activity}
          >
            {activity}
          </Button>
        ))}
      </div>
      {typeError && <p className="text-xs text-rose-400" role="alert">{typeError.message}</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="시작 시간"
          type="datetime-local"
          error={startError?.message}
          value={startInputValue}
          onChange={(event) => {
            const nextValue = event.target.value;
            setStartInputValue(nextValue);

            if (!nextValue) {
              startTimeField.onChange(""); // Empty string to trigger 'required' validation
              return;
            }

            const iso = toISOStringFromLocal(nextValue);
            if (iso) {
              startTimeField.onChange(iso);
            }
          }}
          onBlur={startTimeField.onBlur}
          data-testid="activity-start"
        />
        <Input
          label="종료 시간"
          type="datetime-local"
          error={endError?.message ?? timeError ?? undefined}
          value={endInputValue}
          onChange={(event) => {
            const nextValue = event.target.value;
            setEndInputValue(nextValue);

            if (!nextValue) {
              endTimeField.onChange(""); // Empty string to trigger 'required' validation
              return;
            }

            const iso = toISOStringFromLocal(nextValue);
            if (iso) {
              endTimeField.onChange(iso);
            }
          }}
          onBlur={endTimeField.onBlur}
          data-testid="activity-end"
        />
      </div>
      {timeError && !endError && <p className="text-xs text-rose-400" role="alert">{timeError}</p>}

      <Input
        label="참가자 수"
        type="number"
        min={1}
        max={200}
        error={participantsError?.message}
        value={participantsField.value ?? ""}
        onChange={(event) => {
          const nextValue = event.target.value === "" ? undefined : Number(event.target.value);
          participantsField.onChange(nextValue);
        }}
        data-testid="activity-participants"
      />
    </section>
  );
}

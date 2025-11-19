"use client";

import { useCallback, useMemo, useState } from "react";
import type { Control } from "react-hook-form";
import { useController } from "react-hook-form";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import type { ReportSchema } from "@/lib/utils/validators";
import { cn } from "@/lib/utils/cn";

interface LocationSelectorProps {
  control: Control<ReportSchema>;
  className?: string;
}

const formatCoordinate = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? value.toFixed(6) : "";

export default function LocationSelector({ control, className }: LocationSelectorProps) {
  const [geoError, setGeoError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const {
    field: locationNameField,
    fieldState: { error: locationNameError }
  } = useController({ name: "location.name", control });

  const {
    field: latitudeField,
    fieldState: { error: latitudeError }
  } = useController({
    name: "location.coordinates.latitude",
    control,
    defaultValue: undefined as unknown as number
  });

  const {
    field: longitudeField,
    fieldState: { error: longitudeError }
  } = useController({
    name: "location.coordinates.longitude",
    control,
    defaultValue: undefined as unknown as number
  });

  const hasCoordinates = useMemo(() => {
    return typeof latitudeField.value === "number" && typeof longitudeField.value === "number";
  }, [latitudeField.value, longitudeField.value]);

  const handleUseCurrentLocation = useCallback(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setGeoError("현재 브라우저에서 위치 정보를 사용할 수 없습니다.");
      return;
    }

    setGeoError(null);
    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = Number(position.coords.latitude.toFixed(6));
        const lng = Number(position.coords.longitude.toFixed(6));
        latitudeField.onChange(lat);
        longitudeField.onChange(lng);
        setIsLocating(false);
      },
      (error) => {
        const message =
          error.code === error.PERMISSION_DENIED
            ? "위치 접근이 거부되었습니다."
            : "현재 위치를 가져올 수 없습니다.";
        setGeoError(message);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [latitudeField, longitudeField]);

  return (
    <section className={cn("space-y-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-5", className)}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-300">신고 위치 정보</p>
          <p className="text-xs text-slate-500">주소를 입력하거나 현재 위치를 불러오세요.</p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleUseCurrentLocation}
          isLoading={isLocating}
          data-testid="use-current-location"
        >
          현재 위치 사용
        </Button>
      </div>

      <Input
        label="활동 위치"
        placeholder="예: 부산 해운대 해수욕장"
        error={locationNameError?.message}
        {...locationNameField}
        value={locationNameField.value ?? ""}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="위도"
          readOnly
          error={latitudeError?.message}
          value={formatCoordinate(latitudeField.value)}
          placeholder="위도"
        />
        <Input
          label="경도"
          readOnly
          error={longitudeError?.message}
          value={formatCoordinate(longitudeField.value)}
          placeholder="경도"
        />
      </div>

      {geoError && <p className="text-sm text-rose-400" role="alert">{geoError}</p>}

      <div
        aria-label="지도 미리보기"
        data-testid="map-preview"
        className="flex h-40 flex-col justify-between rounded-2xl border border-slate-800 bg-linear-to-br from-slate-900 to-slate-950 p-4 text-slate-300"
      >
        {hasCoordinates ? (
          <>
            <p className="text-xl font-semibold text-slate-50">{formatCoordinate(latitudeField.value)}° N</p>
            <p className="text-xl font-semibold text-slate-50">{formatCoordinate(longitudeField.value)}° E</p>
            <p className="text-xs text-slate-400">정확한 지도는 추후 연동 예정입니다.</p>
          </>
        ) : (
          <p className="text-sm text-slate-500">현재 위치 정보를 입력하거나 가져오면 지도가 표시됩니다.</p>
        )}
      </div>
    </section>
  );
}

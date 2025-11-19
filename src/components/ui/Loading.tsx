"use client";

export default function Loading({
  size = 32,
  label = "로딩 중",
}: {
  size?: number;
  label?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 text-sm text-slate-200">
      <div
        className="animate-spin rounded-full border-4 border-slate-800 border-t-sky-400"
        style={{ width: size, height: size }}
      />
      <span className="tracking-wide">{label}</span>
    </div>
  );
}

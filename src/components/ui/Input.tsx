"use client";

import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export default function Input({
  label,
  helperText,
  error,
  className,
  type,
  ...props
}: InputProps) {
  const isDateTimeInput = type === "datetime-local" || type === "date" || type === "time";

  return (
    <label className="flex flex-col gap-2 text-sm text-slate-200">
      {label && <span className="font-semibold text-slate-50">{label}</span>}
      <input
        type={type}
        className={cn(
          "rounded-2xl border bg-slate-950/60 px-4 py-3 text-base text-slate-50 placeholder:text-slate-500 transition focus-visible:outline-2 focus-visible:outline-sky-400",
          error
            ? "border-rose-500 focus-visible:outline-rose-400"
            : "border-slate-800",
          isDateTimeInput && "cursor-pointer w-full",
          className
        )}
        style={isDateTimeInput ? {
          colorScheme: 'dark',
          minWidth: '100%',
        } : undefined}
        {...props}
      />
      {helperText && <span className="text-xs text-slate-400">{helperText}</span>}
      {error && <span className="text-xs text-rose-400">{error}</span>}
    </label>
  );
}

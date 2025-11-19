"use client";

import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export type AlertVariant = "success" | "warning" | "error" | "info";

const VARIANT_STYLES: Record<AlertVariant, string> = {
  success: "bg-emerald-900/70 border-emerald-500 text-emerald-100",
  warning: "bg-amber-900/70 border-amber-500 text-amber-100",
  error: "bg-rose-900/70 border-rose-500 text-rose-100",
  info: "bg-slate-900/70 border-slate-500 text-slate-100",
};

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  description?: string;
}

export default function Alert({
  variant = "info",
  title,
  description,
  className,
  ...props
}: AlertProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-5 py-4",
        VARIANT_STYLES[variant],
        className
      )}
      {...props}
    >
      {title && <p className="text-base font-semibold">{title}</p>}
      {description && <p className="mt-1 text-sm text-slate-100/80">{description}</p>}
    </div>
  );
}

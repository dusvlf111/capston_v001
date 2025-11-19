"use client";

import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: "bg-sky-500 text-slate-950 border-transparent hover:bg-sky-400",
  secondary: "bg-slate-800 text-slate-100 border border-slate-700 hover:border-slate-500",
  danger: "bg-rose-600 text-white hover:bg-rose-500",
  ghost: "bg-transparent text-slate-100 hover:text-slate-50 border border-transparent",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

export default function Button({
  variant = "primary",
  size = "md",
  isLoading,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-2xl font-semibold transition focus-visible:outline-2 focus-visible:outline-sky-300",
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        isLoading && "cursor-wait opacity-70",
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <span className="animate-pulse">처리중...</span> : children}
    </button>
  );
}

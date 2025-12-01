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
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import type { Control } from "react-hook-form";
import { useController } from "react-hook-form";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import type { ReportSchema } from "@/lib/utils/validators";
import { cn } from "@/lib/utils/cn";
import { formatPhoneNumber } from "@/lib/utils/formatters";
import { useAuth } from "@/hooks/useAuth";

interface ContactFormProps {
  control: Control<ReportSchema>;
  className?: string;
}

function getSafeValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

export default function ContactForm({ control, className }: ContactFormProps) {
  const { profile, isLoading: authLoading, error: authError } = useAuth();
  const [hasPrefilled, setHasPrefilled] = useState(false);

  const {
    field: nameField,
    fieldState: { error: nameError }
  } = useController({ name: "contact.name", control });

  const {
    field: phoneField,
    fieldState: { error: phoneError }
  } = useController({ name: "contact.phone", control });

  const {
    field: emergencyField,
    fieldState: { error: emergencyError }
  } = useController({ name: "contact.emergencyContact", control });

  const hasProfileData = useMemo(() => {
    return Boolean(
      profile?.full_name || profile?.phone || profile?.emergency_contact
    );
  }, [profile?.full_name, profile?.phone, profile?.emergency_contact]);

  useEffect(() => {
    if (!profile || hasPrefilled) return;

    let updated = false;

    if (!getSafeValue(nameField.value) && profile.full_name) {
      nameField.onChange(profile.full_name);
      updated = true;
    }

    if (!getSafeValue(phoneField.value) && profile.phone) {
      phoneField.onChange(profile.phone);
      updated = true;
    }

    if (!getSafeValue(emergencyField.value) && profile.emergency_contact) {
      emergencyField.onChange(profile.emergency_contact);
      updated = true;
    }

    if (updated) {
      setHasPrefilled(true);
    }
  }, [profile, hasPrefilled, nameField, phoneField, emergencyField]);

  const applyProfileValues = () => {
    if (!profile) return;

    if (profile.full_name) {
      nameField.onChange(profile.full_name);
    }

    if (profile.phone) {
      phoneField.onChange(profile.phone);
    }

    if (profile.emergency_contact) {
      emergencyField.onChange(profile.emergency_contact);
    }
  };

  return (
    <section className={cn("space-y-5 rounded-2xl border border-slate-800 bg-slate-950/60 p-5", className)}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-300">연락처 정보</p>
          <p className="text-xs text-slate-500">본인 및 비상 연락처를 정확히 입력하세요.</p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={applyProfileValues}
          disabled={!hasProfileData || authLoading}
          data-testid="apply-profile-contact"
        >
          프로필에서 불러오기
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="신고자 이름"
          placeholder="홍길동"
          error={nameError?.message}
          {...nameField}
          value={getSafeValue(nameField.value)}
        />
        <Input
          label="연락처"
          placeholder="010-0000-0000"
          error={phoneError?.message}
          {...phoneField}
          onChange={(e) => {
            phoneField.onChange(formatPhoneNumber(e.target.value));
          }}
          value={getSafeValue(phoneField.value)}
          data-testid="contact-phone"
        />
      </div>

      <Input
        label="비상 연락처"
        placeholder="010-0000-0000"
        error={emergencyError?.message}
        {...emergencyField}
        onChange={(e) => {
          emergencyField.onChange(formatPhoneNumber(e.target.value));
        }}
        value={getSafeValue(emergencyField.value)}
        data-testid="contact-emergency"
      />

      {authError && (
        <Alert variant="warning" title="프로필 정보를 불러오지 못했습니다." description={authError} />
      )}
    </section>
  );
}

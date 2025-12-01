"use client";

import { useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database.types";

import { phonePattern } from "@/lib/utils/validators";

const schema = z.object({
  fullName: z.string().min(1, "이름을 입력해주세요."),
  phone: z.string().regex(phonePattern, "연락처는 010-0000-0000 형식이어야 합니다."),
  emergencyContact: z.string().regex(phonePattern, "비상 연락처는 010-0000-0000 형식이어야 합니다."),
});

export type ProfileFormValues = z.infer<typeof schema>;

interface ProfileFormProps {
  profileId: string;
  userId: string;
  initialValues: ProfileFormValues;
}

export default function ProfileForm({ profileId, userId, initialValues }: ProfileFormProps) {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
    mode: "onBlur",
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    setSuccessMessage(null);

    const updateData = {
      full_name: values.fullName,
      phone: values.phone,
      emergency_contact: values.emergencyContact,
      updated_at: new Date().toISOString(),
    };

    const { error } = await (supabase
      .from("profiles") as any)
      .update(updateData)
      .eq("id", profileId)
      .eq("user_id", userId);

    if (error) {
      setServerError(error.message);
      return;
    }

    setSuccessMessage("프로필 정보를 업데이트했습니다.");
    reset(values);
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-50">프로필 정보</h2>
        <p className="text-sm text-slate-400">신고 및 연락을 위한 기본 정보를 최신 상태로 유지하세요.</p>
      </div>

      <Input label="이름" placeholder="홍길동" error={errors.fullName?.message} {...register("fullName")} />

      <Input label="연락처" placeholder="010-0000-0000" error={errors.phone?.message} {...register("phone")} />

      <Input
        label="비상 연락처"
        placeholder="010-0000-0000"
        error={errors.emergencyContact?.message}
        {...register("emergencyContact")}
      />

      {serverError && <Alert variant="error" title="저장 실패" description={serverError} />}
      {successMessage && <Alert variant="success" title="저장 완료" description={successMessage} />}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" isLoading={isSubmitting} disabled={!isDirty}>
          변경 내용 저장
        </Button>
        <Button type="button" variant="secondary" onClick={() => reset(initialValues)} disabled={isSubmitting || !isDirty}>
          되돌리기
        </Button>
      </div>
    </form>
  );
}

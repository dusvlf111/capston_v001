'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

const schema = z.object({
  email: z.string().email('유효한 이메일을 입력하세요.'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다.'),
  fullName: z.string().min(1, '이름을 입력해주세요.'),
  phone: z.string().min(8, '연락처를 입력해주세요.'),
  emergencyContact: z.string().min(8, '비상 연락처를 입력해주세요.'),
});

export type SignupFormValues = z.infer<typeof schema>;

export default function SignupForm() {
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
      phone: '',
      emergencyContact: '',
    },
  });

  const onSubmit = handleSubmit(async (values: SignupFormValues) => {
    setServerError(null);
    setSuccessMessage(null);

    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        data: {
          full_name: values.fullName,
          phone: values.phone,
          emergency_contact: values.emergencyContact,
        },
      },
    });

    if (error) {
      setServerError(error.message);
      return;
    }

    setSuccessMessage('가입 링크를 이메일로 전송했습니다. 메일함을 확인해주세요.');
    if (!data.session) {
      router.push('/login');
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold text-slate-50">회원가입</h2>
        <p className="text-sm text-slate-400">필수 정보를 입력하고 계정을 생성하세요.</p>
      </div>

      <Input label="이메일" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />

      <Input label="비밀번호" type="password" placeholder="8자 이상" error={errors.password?.message} {...register('password')} />

      <Input label="이름" placeholder="홍길동" error={errors.fullName?.message} {...register('fullName')} />

      <Input label="연락처" placeholder="010-0000-0000" error={errors.phone?.message} {...register('phone')} />

      <Input
        label="비상 연락처"
        placeholder="010-0000-0000"
        error={errors.emergencyContact?.message}
        {...register('emergencyContact')}
      />

      {serverError && <Alert variant="error" title="회원가입 실패" description={serverError} />}
      {successMessage && <Alert variant="success" title="메일 전송 완료" description={successMessage} />}

      <Button type="submit" isLoading={isSubmitting} className="w-full">
        계정 만들기
      </Button>
    </form>
  );
}

import { redirect } from "next/navigation";
import ProfileForm from "@/components/profile/ProfileForm";
import { createServerComponentSupabaseClient } from "@/lib/supabase/server";

type ProfileRecord = {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  emergency_contact: string | null;
};

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = createServerComponentSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login?redirectTo=/profile");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, user_id, full_name, phone, emergency_contact")
    .eq("user_id", session.user.id)
    .maybeSingle<ProfileRecord>();

  if (error) {
    throw new Error(error.message);
  }

  if (!profile) {
    return (
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-6 py-16">
        <h1 className="text-4xl font-semibold text-slate-50">프로필 정보 없음</h1>
        <p className="text-slate-300">
          아직 프로필 정보가 생성되지 않았습니다. 잠시 후 다시 시도하거나 지원팀에 문의해주세요.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-6 py-16">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-sky-400">해양 레저 자율신고</p>
        <h1 className="text-4xl font-semibold text-slate-50">프로필 관리</h1>
        <p className="text-slate-300">연락처 정보를 최신 상태로 관리하여 긴급 상황에 대비하세요.</p>
      </div>

      <ProfileForm
        profileId={profile.id}
        userId={profile.user_id}
        initialValues={{
          fullName: profile.full_name ?? "",
          phone: profile.phone ?? "",
          emergencyContact: profile.emergency_contact ?? "",
        }}
      />
    </section>
  );
}

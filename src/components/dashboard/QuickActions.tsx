"use client";

import Link from "next/link";

export default function QuickActions() {
  const actions = [
    {
      href: "/report",
      title: "새 안전 보고",
      description: "해양 활동 안전 분석 시작",
      icon: "📝",
      color: "bg-blue-600 hover:bg-blue-700 border-blue-500",
      primary: true,
    },
    {
      href: "/profile",
      title: "프로필 관리",
      description: "개인정보 및 설정 수정",
      icon: "👤",
      color: "bg-slate-800 hover:bg-slate-700 border-slate-700",
      primary: false,
    },
    {
      href: "/docs",
      title: "사용 가이드",
      description: "서비스 이용 방법 안내",
      icon: "📚",
      color: "bg-slate-800 hover:bg-slate-700 border-slate-700",
      primary: false,
    },
  ];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8">
      <h2 className="text-xl font-semibold text-slate-100 mb-6">빠른 액션</h2>

      <div className="grid gap-4 md:grid-cols-3">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`group p-6 rounded-xl border transition-all ${action.color} ${
              action.primary
                ? "shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30"
                : "hover:border-slate-600"
            }`}
          >
            <div className="text-4xl mb-4">{action.icon}</div>
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-sky-300 transition-colors">
              {action.title}
            </h3>
            <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
              {action.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

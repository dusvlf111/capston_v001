"use client";

import Link from "next/link";

const NAV_ITEMS = [
  { label: "홈", href: "/" },
  { label: "신고", href: "/report" },
  { label: "대시보드", href: "/dashboard" },
  { label: "문서", href: "/docs" },
];

export default function Header() {
  return (
    <header className="w-full border-b border-slate-800 bg-slate-900/60 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link className="text-lg font-semibold tracking-tight text-slate-50" href="/">
          해양자율신고
        </Link>

        <nav className="hidden gap-6 text-sm text-slate-300 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              className="transition hover:text-slate-100"
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            className="rounded-2xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-slate-500"
            href="/login"
          >
            로그인
          </Link>
          <Link
            className="rounded-2xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
            href="/signup"
          >
            회원가입
          </Link>
        </div>
      </div>
    </header>
  );
}
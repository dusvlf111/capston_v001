"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950/80 px-6 py-8 text-slate-300">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-100">해양자율신고</p>
          <p className="text-xs text-slate-400">© 2025 Marine Safe Network. All rights reserved.</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
          <Link href="/terms" className="hover:text-slate-100">
            이용약관
          </Link>
          <Link href="/privacy" className="hover:text-slate-100">
            개인정보처리방침
          </Link>
          <Link href="mailto:support@marine-safe.kr" className="hover:text-slate-100">
            문의하기
          </Link>
        </div>
      </div>
    </footer>
  );
}
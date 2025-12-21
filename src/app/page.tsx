"use client";

import ServiceIntro from "@/components/home/ServiceIntro";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <main className="flex-1">
        {/* Hero Section - 프로젝트 소개 */}
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-linear-to-br from-blue-950 via-slate-950 to-slate-900" />

          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 mb-8">
              <span className="text-2xl">🌊</span>
              <span className="text-sm font-medium text-blue-300">Marine Safety Platform</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              해양 활동,
              <br />
              <span className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                더 안전하게
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              AI 기반 해양 안전 분석으로 여러분의 수상 레저 활동을 보호합니다.
              실시간 기상 정보와 위험 요소 분석으로 안전한 바다를 경험하세요.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/report"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105"
              >
                안전 신고 시작하기
              </Link>
              <Link
                href="/docs"
                className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 transition-all hover:border-slate-600"
              >
                서비스 알아보기
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">🤖 AI</div>
                <div className="text-sm text-slate-400">실시간 안전 분석</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-2">🌤️</div>
                <div className="text-sm text-slate-400">실시간 기상 정보</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-sky-400 mb-2">🚨</div>
                <div className="text-sm text-slate-400">긴급 대응 지원</div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce text-white pointer-events-none z-10 flex flex-col items-center gap-2 drop-shadow-lg">
            <span className="text-base font-semibold tracking-widest uppercase text-sky-300">Scroll Down</span>
            <div className="h-10 w-6 rounded-full border-2 border-white/80 p-1 bg-black/20 backdrop-blur-sm">
              <div className="h-2 w-full rounded-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
            </div>
          </div>
        </section>

        <ServiceIntro />
      </main>
    </div>
  );
}

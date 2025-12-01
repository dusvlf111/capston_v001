"use client";

import WindyMap from "@/components/map/WindyMap";
import ServiceIntro from "@/components/home/ServiceIntro";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <main className="flex-1">
        <div className="relative h-screen w-full">
          <WindyMap />
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce text-white pointer-events-none z-10 flex flex-col items-center gap-2 drop-shadow-lg">
            <span className="text-base font-semibold tracking-widest uppercase text-sky-300">Scroll Down</span>
            <div className="h-10 w-6 rounded-full border-2 border-white/80 p-1 bg-black/20 backdrop-blur-sm">
              <div className="h-2 w-full rounded-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
            </div>
          </div>
        </div>
        <ServiceIntro />
      </main>
    </div>
  );
}

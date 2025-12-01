"use client";

import WindyMap from "@/components/map/WindyMap";
import ServiceIntro from "@/components/home/ServiceIntro";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <main className="flex-1">
        <div className="relative h-screen w-full">
          <WindyMap />
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/80 pointer-events-none z-10">
            <span className="text-sm">Scroll Down</span>
            <div className="mx-auto mt-1 h-6 w-4 rounded-full border-2 border-white/50 p-1">
              <div className="h-1.5 w-full rounded-full bg-white/80" />
            </div>
          </div>
        </div>
        <ServiceIntro />
      </main>
    </div>
  );
}

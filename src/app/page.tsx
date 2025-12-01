"use client";

import WindyMap from "@/components/map/WindyMap";
import ServiceIntro from "@/components/home/ServiceIntro";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <header className="absolute top-0 left-0 z-10 w-full p-4 bg-transparent pointer-events-none">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg pointer-events-auto inline-block bg-black/20 px-6 py-2 rounded-full backdrop-blur-sm border border-white/10">
            Marine Leisure Safety Map
          </h1>
        </div>
      </header>
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

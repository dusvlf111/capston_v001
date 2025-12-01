"use client";

import WindyMap from "@/components/map/WindyMap";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="absolute top-0 left-0 z-10 w-full p-4 bg-transparent pointer-events-none">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold text-white drop-shadow-md pointer-events-auto inline-block">
            Marine Leisure Safety Map
          </h1>
        </div>
      </header>
      <main className="flex-1 relative">
        <WindyMap />
      </main>
    </div>
  );
}

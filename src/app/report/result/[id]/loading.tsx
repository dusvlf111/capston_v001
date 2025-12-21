export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8 pb-20">
      {/* Header Skeleton */}
      <div className="text-center space-y-2 pt-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4 animate-pulse">
          <div className="w-8 h-8 bg-slate-700 rounded-full"></div>
        </div>
        <div className="h-8 w-48 bg-slate-800 rounded-lg mx-auto animate-pulse"></div>
        <div className="h-5 w-64 bg-slate-800 rounded mx-auto animate-pulse"></div>
      </div>

      {/* Activity Summary Skeleton */}
      <div className="bg-slate-900/60 p-6 rounded-2xl shadow-sm border border-slate-800 space-y-4">
        <div className="h-6 w-32 bg-slate-800 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-20 bg-slate-800 rounded animate-pulse"></div>
              <div className="h-5 w-32 bg-slate-700 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis Loading */}
      <div className="space-y-6">
        {/* Score Card Skeleton */}
        <div className="text-center p-6 bg-slate-900/60 rounded-xl shadow-sm border border-slate-800">
          <div className="h-5 w-32 bg-slate-800 rounded mx-auto mb-2 animate-pulse"></div>
          <div className="h-16 w-24 bg-slate-700 rounded-lg mx-auto mb-2 animate-pulse"></div>
          <div className="h-6 w-16 bg-slate-800 rounded-full mx-auto animate-pulse"></div>
        </div>

        {/* Weather Info Skeleton */}
        <div className="bg-slate-900/60 rounded-xl shadow-sm border border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-800 bg-blue-950/20">
            <div className="h-5 w-48 bg-slate-800 rounded animate-pulse"></div>
          </div>
          <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center p-3 bg-slate-800/50 rounded-lg">
                <div className="h-3 w-16 bg-slate-700 rounded mx-auto mb-2 animate-pulse"></div>
                <div className="h-6 w-20 bg-slate-600 rounded mx-auto animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Report Skeleton */}
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 bg-slate-700 rounded animate-pulse"></div>
            <div className="h-5 w-32 bg-slate-700 rounded animate-pulse"></div>
          </div>
          <div className="space-y-3">
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-700">
              <div className="h-4 w-24 bg-slate-700 rounded mb-2 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-3 w-full bg-slate-800 rounded animate-pulse"></div>
                <div className="h-3 w-5/6 bg-slate-800 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {[1, 2].map((i) => (
                <div key={i} className="bg-slate-900/60 p-3 rounded-lg border border-slate-700">
                  <div className="h-4 w-20 bg-slate-700 rounded mb-2 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-slate-800 rounded animate-pulse"></div>
                    <div className="h-3 w-4/5 bg-slate-800 rounded animate-pulse"></div>
                    <div className="h-3 w-3/4 bg-slate-800 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      <div className="flex items-center justify-center gap-3 p-6">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-sky-500 rounded-full animate-spin"></div>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-300">안전 분석 중...</p>
          <p className="text-xs text-slate-500">기상 정보와 위험 요소를 분석하고 있습니다.</p>
        </div>
      </div>

      {/* Buttons Skeleton */}
      <div className="flex justify-center gap-4 pt-4">
        <div className="h-10 w-24 bg-slate-800 rounded-lg animate-pulse"></div>
        <div className="h-10 w-24 bg-slate-700 rounded-lg animate-pulse"></div>
      </div>
    </div>
  );
}

import Link from "next/link";

export default function ReportNotFound() {
  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <div className="text-8xl">🔍</div>
      <h1 className="text-4xl font-bold text-slate-50">리포트를 찾을 수 없습니다</h1>
      <p className="text-lg text-slate-400">
        요청하신 리포트가 존재하지 않거나, 접근 권한이 없습니다.
      </p>
      <div className="flex gap-4 mt-4">
        <Link
          href="/report/history"
          className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors"
        >
          리포트 목록으로
        </Link>
        <Link
          href="/dashboard"
          className="px-6 py-3 border border-slate-700 hover:border-slate-600 text-slate-100 font-semibold rounded-lg transition-colors"
        >
          대시보드로
        </Link>
      </div>
      <div className="mt-8 p-4 rounded-lg border border-slate-800 bg-slate-900/60 text-left text-sm text-slate-400">
        <p className="font-semibold text-slate-300 mb-2">가능한 원인:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>리포트가 삭제되었습니다</li>
          <li>잘못된 링크를 사용하셨습니다</li>
          <li>다른 사용자의 리포트에 접근하려고 했습니다</li>
        </ul>
      </div>
    </section>
  );
}

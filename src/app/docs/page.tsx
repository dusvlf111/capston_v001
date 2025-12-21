export default function DocsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold text-slate-50">서비스 문서</h1>

      <div className="space-y-8 text-slate-300">
        <section>
          <h2 className="mb-4 text-2xl font-semibold text-slate-100">해양자율신고란?</h2>
          <p className="leading-relaxed">
            해양자율신고는 해양 활동 중 실시간으로 위치와 상황을 보고하고, AI 기반 안전 분석을 통해
            위험을 예측하고 대응할 수 있도록 돕는 안전 관리 플랫폼입니다.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-slate-100">주요 기능</h2>

          <div className="space-y-4">
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
              <h3 className="mb-2 font-semibold text-slate-100">1. 실시간 안전 보고</h3>
              <p className="text-sm leading-relaxed">
                현재 위치, 활동 내용, 동반자 정보를 실시간으로 보고하여 긴급 상황 시 신속한 대응이 가능합니다.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
              <h3 className="mb-2 font-semibold text-slate-100">2. AI 기반 위험도 분석</h3>
              <p className="text-sm leading-relaxed">
                기상 정보, 해양 상태, 활동 유형 등을 종합적으로 분석하여 현재 상황의 위험도를 평가하고
                맞춤형 안전 가이드를 제공합니다.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
              <h3 className="mb-2 font-semibold text-slate-100">3. 실시간 기상·해양 정보</h3>
              <p className="text-sm leading-relaxed">
                풍속, 파고, 너울 등 실시간 해양 기상 정보와 기상 특보를 확인할 수 있습니다.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
              <h3 className="mb-2 font-semibold text-slate-100">4. 긴급 연락망</h3>
              <p className="text-sm leading-relaxed">
                현재 위치 기준 가장 가까운 해양경찰서 연락처를 자동으로 표시하여
                긴급 상황 시 즉시 연락할 수 있습니다.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-slate-100">사용 방법</h2>

          <ol className="space-y-3 list-decimal list-inside">
            <li className="leading-relaxed">
              <span className="font-semibold">회원가입 및 로그인</span>
              <p className="ml-6 text-sm text-slate-400">이메일로 간편하게 가입하고 로그인합니다.</p>
            </li>
            <li className="leading-relaxed">
              <span className="font-semibold">신고 작성</span>
              <p className="ml-6 text-sm text-slate-400">
                위치, 활동 유형, 동반자 정보, 연락처 등을 입력합니다.
                GPS를 활성화하면 현재 위치가 자동으로 입력됩니다.
              </p>
            </li>
            <li className="leading-relaxed">
              <span className="font-semibold">안전 분석 확인</span>
              <p className="ml-6 text-sm text-slate-400">
                AI가 분석한 안전 점수와 위험 요소, 권장사항을 확인합니다.
              </p>
            </li>
            <li className="leading-relaxed">
              <span className="font-semibold">보고 내역 관리</span>
              <p className="ml-6 text-sm text-slate-400">
                대시보드에서 과거 보고 내역을 확인하고 관리할 수 있습니다.
              </p>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-slate-100">안전 수칙</h2>

          <div className="rounded-lg border border-yellow-800/50 bg-yellow-900/20 p-4">
            <ul className="space-y-2 list-disc list-inside text-sm">
              <li>활동 전 반드시 기상 예보를 확인하세요.</li>
              <li>구명조끼 등 안전장비를 착용하세요.</li>
              <li>단독 활동보다는 2인 이상 동반 활동을 권장합니다.</li>
              <li>휴대전화와 보조배터리를 준비하세요.</li>
              <li>긴급 상황 시 해양경찰(122) 또는 소방서(119)에 신고하세요.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-slate-100">문의하기</h2>
          <p className="leading-relaxed">
            서비스 이용 중 문의사항이 있으시면 언제든지 연락주세요.
          </p>
          <div className="mt-4 rounded-lg bg-slate-800 p-4">
            <p className="text-sm">
              이메일: <a href="mailto:support@marine-safe.kr" className="text-sky-400 hover:text-sky-300">support@marine-safe.kr</a>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

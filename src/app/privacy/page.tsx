export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold text-slate-50">개인정보처리방침</h1>

      <div className="space-y-6 text-slate-300">
        <section>
          <h2 className="mb-3 text-xl font-semibold text-slate-100">제1조 (개인정보의 처리 목적)</h2>
          <p className="leading-relaxed mb-3">
            해양자율신고(이하 "회사")는 다음의 목적을 위하여 개인정보를 처리합니다.
            처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며 이용 목적이 변경되는 경우에는
            「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
          </p>
          <ul className="list-disc list-inside space-y-2 leading-relaxed">
            <li>회원 가입 및 관리: 회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증</li>
            <li>서비스 제공: 해양 안전 보고, 위치 추적, 긴급 상황 알림 서비스 제공</li>
            <li>안전 분석: AI 기반 안전도 분석 및 위험 요소 평가</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-slate-100">제2조 (처리하는 개인정보의 항목)</h2>
          <ul className="list-disc list-inside space-y-2 leading-relaxed">
            <li>필수항목: 이메일, 비밀번호</li>
            <li>서비스 이용 시 수집되는 정보: 위치정보(GPS), 활동 정보, 동반자 정보, 연락처</li>
            <li>자동 수집 정보: IP주소, 쿠키, 접속 로그, 서비스 이용 기록</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-slate-100">제3조 (개인정보의 처리 및 보유 기간)</h2>
          <p className="leading-relaxed mb-3">
            회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
          </p>
          <ul className="list-disc list-inside space-y-2 leading-relaxed">
            <li>회원정보: 회원 탈퇴 시까지 (단, 관계 법령 위반에 따른 수사·조사 등이 진행중인 경우에는 해당 수사·조사 종료 시까지)</li>
            <li>보고 기록: 보고 생성 후 5년</li>
            <li>위치정보: 서비스 이용 종료 후 즉시 삭제 (단, 긴급 구조 목적의 경우 24시간)</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-slate-100">제4조 (개인정보의 제3자 제공)</h2>
          <p className="leading-relaxed">
            회사는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며,
            정보주체의 동의, 법률의 특별한 규정 등 「개인정보 보호법」 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
          </p>
          <p className="mt-3 leading-relaxed">
            단, 긴급 구조가 필요한 상황에서는 해양경찰청, 소방서 등 관련 기관에 위치정보 및 연락처를 제공할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-slate-100">제5조 (정보주체의 권리·의무 및 행사방법)</h2>
          <p className="leading-relaxed mb-3">
            정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
          </p>
          <ul className="list-disc list-inside space-y-2 leading-relaxed">
            <li>개인정보 열람요구</li>
            <li>오류 등이 있을 경우 정정 요구</li>
            <li>삭제요구</li>
            <li>처리정지 요구</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-slate-100">제6조 (개인정보의 파기)</h2>
          <p className="leading-relaxed">
            회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
            전자적 파일 형태의 정보는 복구 및 재생되지 않도록 안전하게 삭제하며,
            종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각하여 파기합니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-slate-100">제7조 (개인정보 보호책임자)</h2>
          <p className="leading-relaxed">
            회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여
            개인정보 보호책임자를 지정하고 있습니다.
          </p>
          <div className="mt-3 rounded-lg bg-slate-800 p-4">
            <p className="font-semibold">개인정보 보호책임자</p>
            <p className="text-sm">이메일: support@marine-safe.kr</p>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-slate-100">제8조 (개인정보 처리방침 변경)</h2>
          <p className="leading-relaxed">
            이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는
            변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
          </p>
        </section>

        <div className="mt-8 text-sm text-slate-400">
          <p>시행일자: 2025년 1월 1일</p>
        </div>
      </div>
    </div>
  );
}

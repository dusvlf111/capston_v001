export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold text-slate-50">이용약관</h1>

      <div className="space-y-6 text-slate-300">
        <section>
          <h2 className="mb-3 text-xl font-semibold text-slate-100">제1조 (목적)</h2>
          <p className="leading-relaxed">
            본 약관은 해양자율신고 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-slate-100">제2조 (정의)</h2>
          <ul className="list-disc list-inside space-y-2 leading-relaxed">
            <li>"서비스"란 해양 안전 보고 및 동반자 보호를 위한 웹 애플리케이션을 의미합니다.</li>
            <li>"이용자"란 본 약관에 따라 서비스를 이용하는 회원 및 비회원을 말합니다.</li>
            <li>"회원"이란 서비스에 개인정보를 제공하여 회원등록을 한 자로서, 서비스의 정보를 지속적으로 제공받으며 서비스를 계속적으로 이용할 수 있는 자를 말합니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-slate-100">제3조 (약관의 효력 및 변경)</h2>
          <p className="leading-relaxed">
            본 약관은 서비스를 이용하고자 하는 모든 이용자에 대하여 그 효력이 발생합니다.
            회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있으며,
            약관이 변경되는 경우 변경사항을 시행일자 7일 전부터 공지합니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-slate-100">제4조 (서비스의 제공)</h2>
          <ul className="list-disc list-inside space-y-2 leading-relaxed">
            <li>해양 활동 위치 및 상황 실시간 보고</li>
            <li>AI 기반 안전 분석 및 위험도 평가</li>
            <li>실시간 기상 및 해양 정보 제공</li>
            <li>긴급 상황 알림 및 구조 지원</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-slate-100">제5조 (이용자의 의무)</h2>
          <ul className="list-disc list-inside space-y-2 leading-relaxed">
            <li>이용자는 서비스 이용 시 정확한 정보를 제공해야 합니다.</li>
            <li>이용자는 타인의 개인정보를 도용하거나 부정한 목적으로 서비스를 이용해서는 안 됩니다.</li>
            <li>이용자는 서비스를 통해 얻은 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 등에 사용할 수 없습니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-slate-100">제6조 (서비스의 중단)</h2>
          <p className="leading-relaxed">
            회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-slate-100">제7조 (면책조항)</h2>
          <p className="leading-relaxed">
            회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.
            회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.
          </p>
        </section>
      </div>
    </div>
  );
}

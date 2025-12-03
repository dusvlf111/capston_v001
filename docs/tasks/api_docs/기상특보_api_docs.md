
기상특보목록 정보를 조회하기 위해 발표시각(From), 발표시각(To), 지점코드(stnId)의 조회 조건으로 제목, 순번, 지점코드, 발표번호(월별), 발표시각(년월일시분)의 정보를 조회하는 기능
활용승인 절차 개발단계 : 자동승인 / 운영단계 : 자동승인
신청가능 트래픽 개발계정 : 10,000 / 운영계정 : 활용사례 등록시 신청하면 트래픽 증가 가능
요청주소 http://apis.data.go.kr/1360000/WthrWrnInfoService/getWthrWrnList
서비스URL http://apis.data.go.kr/1360000/WthrWrnInfoService
 활용신청
요청변수(Request Parameter)

항목명(국문)	항목명(영문)	항목크기	항목구분	샘플데이터	항목설명
서비스키	ServiceKey	4	필수	-	공공데이터포털에서 받은 인증키
페이지 번호	pageNo	4	필수	1	페이지번호
한 페이지 결과 수	numOfRows	4	필수	10	한 페이지 결과 수
응답자료형식	dataType	4	옵션	XML	요청자료형식(XML/JSON)Default: XML
지점코드	stnId	5	옵션	184	지점코드 *하단 지점코드 자료 참조
발표시각(From)	fromTmFc	8	옵션	20170601	시간(년월일)(데이터 생성주기 : 시간단위로 생성)
발표시각(To)	toTmFc	8	옵션	20170607	시간(년월일) (데이터 생성주기 : 시간단위로 생성)
출력결과(Response Element)

항목명(국문)	항목명(영문)	항목크기	항목구분	샘플데이터	항목설명
결과코드	resultCode	2	필수	00	결과코드
결과메시지	resultMsg	50	필수	OK	결과메시지
한 페이지 결과 수	numOfRows	4	필수	10	한 페이지 결과 수
페이지 번호	pageNo	4	필수	1	페이지번호
전체 결과 수	totalCount	4	필수	3	전체 결과 수
데이터 타입	dataType	4	필수	XML	응답자료형식 (XML/JSON)
제목	title	200	필수	예제 참조	제목
지점코드	stnId	5	옵션	108	지점코드
발표번호(월별)	tmSeq	4	옵션	28	발표번호(월별)
발표시각(년월일시분)	tmFc	25	필수	201706070730	발표시각(년월일시분)


/* NodeJs 12 샘플 코드 */


var request = require('request');

var url = 'http://apis.data.go.kr/1360000/WthrWrnInfoService/getWthrWrnList';
var queryParams = '?' + encodeURIComponent('serviceKey') + '=서비스키'; /* Service Key*/
queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /* */
queryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('XML'); /* */
queryParams += '&' + encodeURIComponent('stnId') + '=' + encodeURIComponent('184'); /* */
queryParams += '&' + encodeURIComponent('fromTmFc') + '=' + encodeURIComponent('20170601'); /* */
queryParams += '&' + encodeURIComponent('toTmFc') + '=' + encodeURIComponent('20170607'); /* */

request({
    url: url + queryParams,
    method: 'GET'
}, function (error, response, body) {
    //console.log('Status', response.statusCode);
    //console.log('Headers', JSON.stringify(response.headers));
    //console.log('Reponse received', body);
});

/* Javascript 샘플 코드 */


var xhr = new XMLHttpRequest();
var url = 'http://apis.data.go.kr/1360000/WthrWrnInfoService/getWthrWrnList'; /*URL*/
var queryParams = '?' + encodeURIComponent('serviceKey') + '='+'서비스키'; /*Service Key*/
queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /**/
queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /**/
queryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('XML'); /**/
queryParams += '&' + encodeURIComponent('stnId') + '=' + encodeURIComponent('184'); /**/
queryParams += '&' + encodeURIComponent('fromTmFc') + '=' + encodeURIComponent('20170601'); /**/
queryParams += '&' + encodeURIComponent('toTmFc') + '=' + encodeURIComponent('20170607'); /**/
xhr.open('GET', url + queryParams);
xhr.onreadystatechange = function () {
    if (this.readyState == 4) {
        alert('Status: '+this.status+'nHeaders: '+JSON.stringify(this.getAllResponseHeaders())+'nBody: '+this.responseText);
    }
};

xhr.send('');


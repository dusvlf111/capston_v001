파출소 이름, 위치를 조회합니다.
활용승인 절차 개발단계 : 자동승인 / 운영단계 : 심의승인
신청가능 트래픽 개발계정 : 1,000 / 운영계정 : 활용사례 등록시 신청하면 트래픽 증가 가능
요청주소 http://apis.data.go.kr/1532000/KCG_Station_Position/list_view
서비스URL http://apis.data.go.kr/1532000/KCG_Station_Position
 활용신청
요청변수(Request Parameter)

항목명(국문)	항목명(영문)	항목크기	항목구분	샘플데이터	항목설명
서비스키	serviceKey	100	필	인증키	공공데이터포털에서 받은 인증키
한 페이지 결과수	rowsCount	10	옵	10	한 페이지 결과 수, default 10
페이지 번호	startPage	10	옵	1	페이지 번호, default 1
출력결과(Response Element)

항목명(국문)	항목명(영문)	항목크기	항목구분	샘플데이터	항목설명
결과코드	resultCode	2	필	40	결과코드
결과메시지	resultMsg	50	필	NON_ERROR	결과메시지
페이지 row수	rowsCount	10	필	10	한 페이지 최대 row수(숫자형, int)
페이지 번호	startPage	10	필	1	현재 페이지 index (숫자형, int)
조회된 row수	contentLength	10	옵	3	현재 페이지에 조회된 row수(숫자형, int)
데이터 총 갯수	totalCount	10	옵	97	데이터 총 갯수(숫자형, int)
파출소명칭	c_MyeongChing	100	옵	감천파출소	파출소명칭(문자열형, String)
경도	c_KyeongDo	100	옵	129.0005581	경도(문자열형, String)
위도	c_WiDo	100	옵	35.08440914	위도(문자열형, String)


/* NodeJs 12 샘플 코드 */


var request = require('request');

var url = 'http://apis.data.go.kr/1532000/KCG_Station_Position/list_view';
var queryParams = '?' + encodeURIComponent('serviceKey') + '=서비스키'; /* Service Key*/
queryParams += '&' + encodeURIComponent('rowsCount') + '=' + encodeURIComponent('10'); /* */
queryParams += '&' + encodeURIComponent('startPage') + '=' + encodeURIComponent('1'); /* */

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
var url = 'http://apis.data.go.kr/1532000/KCG_Station_Position/list_view'; /*URL*/
var queryParams = '?' + encodeURIComponent('serviceKey') + '='+'서비스키'; /*Service Key*/
queryParams += '&' + encodeURIComponent('rowsCount') + '=' + encodeURIComponent('10'); /**/
queryParams += '&' + encodeURIComponent('startPage') + '=' + encodeURIComponent('1'); /**/
xhr.open('GET', url + queryParams);
xhr.onreadystatechange = function () {
    if (this.readyState == 4) {
        alert('Status: '+this.status+'nHeaders: '+JSON.stringify(this.getAllResponseHeaders())+'nBody: '+this.responseText);
    }
};

xhr.send('');
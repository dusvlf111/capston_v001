/**
 * 서버와 클라이언트에서 일관된 날짜 포맷팅을 제공하는 유틸리티
 * Hydration 오류를 방지하기 위해 Date 메서드를 직접 사용
 * 모든 날짜는 로컬 시간대(KST)로 표시됨
 */

/**
 * 날짜를 "2025년 12월 22일 오전 10:30" 형식으로 포맷팅
 */
export function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    // 오전/오후 표시
    const period = hours < 12 ? '오전' : '오후';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const hoursStr = String(displayHours).padStart(2, '0');

    return `${year}년 ${month}월 ${day}일 ${period} ${hoursStr}:${minutes}`;
  } catch {
    return dateString;
  }
}

/**
 * 날짜를 "2025년 12월 22일" 형식으로 포맷팅
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}년 ${month}월 ${day}일`;
  } catch {
    return dateString;
  }
}

/**
 * 날짜를 "2025. 12. 22. 10:30" 형식으로 포맷팅
 */
export function formatDateTimeShort(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}. ${month}. ${day}. ${hours}:${minutes}`;
  } catch {
    return dateString;
  }
}

/**
 * 날짜를 "2025-12-22 10:30:14" 형식으로 포맷팅 (ISO 스타일)
 */
export function formatDateTimeISO(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } catch {
    return dateString;
  }
}

/**
 * 시간만 "오전 10:30" 형식으로 포맷팅
 */
export function formatTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }

    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    // 오전/오후 표시
    const period = hours < 12 ? '오전' : '오후';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

    return `${period} ${displayHours}:${minutes}`;
  } catch {
    return dateString;
  }
}

// 화면 언어: <html lang="en"> 페이지(/en/)면 영어, 아니면 한국어.
// tr('한국어', 'English') 처럼 두 문구를 나란히 적어 둡니다. 테스트(Node)에서는 한국어.
export const EN = typeof document !== 'undefined' && document.documentElement.lang.startsWith('en');
export const tr = (ko: string, en: string) => (EN ? en : ko);
/** 언어에 맞는 날짜 표기 */
export const LOCALE = EN ? 'en-US' : 'ko-KR';

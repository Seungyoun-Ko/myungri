// 출생 지역과 경도. 오프셋(분) = (경도 − 135) × 4, 반올림. 예: 서울 126.978 → −32분

export interface City {
  id: string;
  name: string;
  region: string;
  longitude: number;
}

export const CITIES: City[] = [
  { id: 'seoul', name: '서울특별시', region: '서울', longitude: 126.978 },
  { id: 'busan', name: '부산광역시', region: '부산', longitude: 129.075 },
  { id: 'daegu', name: '대구광역시', region: '대구', longitude: 128.601 },
  { id: 'incheon', name: '인천광역시', region: '인천', longitude: 126.705 },
  { id: 'gwangju', name: '광주광역시', region: '광주', longitude: 126.851 },
  { id: 'daejeon', name: '대전광역시', region: '대전', longitude: 127.385 },
  { id: 'ulsan', name: '울산광역시', region: '울산', longitude: 129.311 },
  { id: 'sejong', name: '세종특별자치시', region: '세종', longitude: 127.289 },
  { id: 'suwon', name: '수원시', region: '경기', longitude: 127.029 },
  { id: 'seongnam', name: '성남시', region: '경기', longitude: 127.137 },
  { id: 'goyang', name: '고양시', region: '경기', longitude: 126.832 },
  { id: 'yongin', name: '용인시', region: '경기', longitude: 127.178 },
  { id: 'uijeongbu', name: '의정부시', region: '경기', longitude: 127.034 },
  { id: 'chuncheon', name: '춘천시', region: '강원', longitude: 127.73 },
  { id: 'wonju', name: '원주시', region: '강원', longitude: 127.92 },
  { id: 'gangneung', name: '강릉시', region: '강원', longitude: 128.876 },
  { id: 'sokcho', name: '속초시', region: '강원', longitude: 128.592 },
  { id: 'cheongju', name: '청주시', region: '충북', longitude: 127.489 },
  { id: 'chungju', name: '충주시', region: '충북', longitude: 127.926 },
  { id: 'cheonan', name: '천안시', region: '충남', longitude: 127.114 },
  { id: 'gongju', name: '공주시', region: '충남', longitude: 127.119 },
  { id: 'jeonju', name: '전주시', region: '전북', longitude: 127.148 },
  { id: 'gunsan', name: '군산시', region: '전북', longitude: 126.737 },
  { id: 'mokpo', name: '목포시', region: '전남', longitude: 126.392 },
  { id: 'yeosu', name: '여수시', region: '전남', longitude: 127.662 },
  { id: 'suncheon', name: '순천시', region: '전남', longitude: 127.487 },
  { id: 'pohang', name: '포항시', region: '경북', longitude: 129.343 },
  { id: 'gyeongju', name: '경주시', region: '경북', longitude: 129.225 },
  { id: 'andong', name: '안동시', region: '경북', longitude: 128.729 },
  { id: 'gumi', name: '구미시', region: '경북', longitude: 128.344 },
  { id: 'changwon', name: '창원시', region: '경남', longitude: 128.682 },
  { id: 'jinju', name: '진주시', region: '경남', longitude: 128.108 },
  { id: 'tongyeong', name: '통영시', region: '경남', longitude: 128.433 },
  { id: 'jeju', name: '제주시', region: '제주', longitude: 126.531 },
  { id: 'seogwipo', name: '서귀포시', region: '제주', longitude: 126.56 },
];

export const DEFAULT_CITY_ID = 'seoul';

export const cityById = (id: string) => CITIES.find((c) => c.id === id) ?? CITIES[0];

export const cityOffsetMinutes = (city: City) => Math.round((city.longitude - 135) * 4);

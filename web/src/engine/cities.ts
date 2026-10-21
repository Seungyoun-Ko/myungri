// 출생 지역과 경도.
// 한국 도시: 한국 시각 규칙(표준자오선 변경·서머타임 역사)으로 계산합니다. 오프셋(분) = (경도 − 135) × 4, 예: 서울 126.978 → −32분
// 해외 도시(tz 있음): 브라우저의 시간대 자료(IANA)로 그 시각의 UTC 오프셋·서머타임을 구합니다.

export interface City {
  id: string;
  /** 한국어 이름 */
  name: string;
  /** 영어 이름 */
  en: string;
  /** 한국어 지역 묶음 */
  region: string;
  /** 영어 지역 묶음 (한국 도시는 South Korea) */
  regionEn?: string;
  longitude: number;
  /** 해외 도시의 IANA 시간대. 없으면 한국 */
  tz?: string;
  /** 남반구 도시: 절기의 계절(봄·여름…)이 실제 계절과 반대 */
  south?: boolean;
}

const KOREA: City[] = [
  { id: 'seoul', name: '서울특별시', en: 'Seoul', region: '서울', longitude: 126.978 },
  { id: 'busan', name: '부산광역시', en: 'Busan', region: '부산', longitude: 129.075 },
  { id: 'daegu', name: '대구광역시', en: 'Daegu', region: '대구', longitude: 128.601 },
  { id: 'incheon', name: '인천광역시', en: 'Incheon', region: '인천', longitude: 126.705 },
  { id: 'gwangju', name: '광주광역시', en: 'Gwangju', region: '광주', longitude: 126.851 },
  { id: 'daejeon', name: '대전광역시', en: 'Daejeon', region: '대전', longitude: 127.385 },
  { id: 'ulsan', name: '울산광역시', en: 'Ulsan', region: '울산', longitude: 129.311 },
  { id: 'sejong', name: '세종특별자치시', en: 'Sejong', region: '세종', longitude: 127.289 },
  { id: 'suwon', name: '수원시', en: 'Suwon', region: '경기', longitude: 127.029 },
  { id: 'seongnam', name: '성남시', en: 'Seongnam', region: '경기', longitude: 127.137 },
  { id: 'goyang', name: '고양시', en: 'Goyang', region: '경기', longitude: 126.832 },
  { id: 'yongin', name: '용인시', en: 'Yongin', region: '경기', longitude: 127.178 },
  { id: 'uijeongbu', name: '의정부시', en: 'Uijeongbu', region: '경기', longitude: 127.034 },
  { id: 'chuncheon', name: '춘천시', en: 'Chuncheon', region: '강원', longitude: 127.73 },
  { id: 'wonju', name: '원주시', en: 'Wonju', region: '강원', longitude: 127.92 },
  { id: 'gangneung', name: '강릉시', en: 'Gangneung', region: '강원', longitude: 128.876 },
  { id: 'sokcho', name: '속초시', en: 'Sokcho', region: '강원', longitude: 128.592 },
  { id: 'cheongju', name: '청주시', en: 'Cheongju', region: '충북', longitude: 127.489 },
  { id: 'chungju', name: '충주시', en: 'Chungju', region: '충북', longitude: 127.926 },
  { id: 'cheonan', name: '천안시', en: 'Cheonan', region: '충남', longitude: 127.114 },
  { id: 'gongju', name: '공주시', en: 'Gongju', region: '충남', longitude: 127.119 },
  { id: 'jeonju', name: '전주시', en: 'Jeonju', region: '전북', longitude: 127.148 },
  { id: 'gunsan', name: '군산시', en: 'Gunsan', region: '전북', longitude: 126.737 },
  { id: 'mokpo', name: '목포시', en: 'Mokpo', region: '전남', longitude: 126.392 },
  { id: 'yeosu', name: '여수시', en: 'Yeosu', region: '전남', longitude: 127.662 },
  { id: 'suncheon', name: '순천시', en: 'Suncheon', region: '전남', longitude: 127.487 },
  { id: 'pohang', name: '포항시', en: 'Pohang', region: '경북', longitude: 129.343 },
  { id: 'gyeongju', name: '경주시', en: 'Gyeongju', region: '경북', longitude: 129.225 },
  { id: 'andong', name: '안동시', en: 'Andong', region: '경북', longitude: 128.729 },
  { id: 'gumi', name: '구미시', en: 'Gumi', region: '경북', longitude: 128.344 },
  { id: 'changwon', name: '창원시', en: 'Changwon', region: '경남', longitude: 128.682 },
  { id: 'jinju', name: '진주시', en: 'Jinju', region: '경남', longitude: 128.108 },
  { id: 'tongyeong', name: '통영시', en: 'Tongyeong', region: '경남', longitude: 128.433 },
  { id: 'jeju', name: '제주시', en: 'Jeju', region: '제주', longitude: 126.531 },
  { id: 'seogwipo', name: '서귀포시', en: 'Seogwipo', region: '제주', longitude: 126.56 },
];

const WORLD: City[] = [
  { id: 'us-new-york', name: '뉴욕', en: 'New York', region: '북미', regionEn: 'North America', longitude: -74.006, tz: 'America/New_York' },
  { id: 'us-washington', name: '워싱턴 D.C.', en: 'Washington, D.C.', region: '북미', regionEn: 'North America', longitude: -77.037, tz: 'America/New_York' },
  { id: 'us-boston', name: '보스턴', en: 'Boston', region: '북미', regionEn: 'North America', longitude: -71.059, tz: 'America/New_York' },
  { id: 'us-philadelphia', name: '필라델피아', en: 'Philadelphia', region: '북미', regionEn: 'North America', longitude: -75.165, tz: 'America/New_York' },
  { id: 'us-atlanta', name: '애틀랜타', en: 'Atlanta', region: '북미', regionEn: 'North America', longitude: -84.388, tz: 'America/New_York' },
  { id: 'us-miami', name: '마이애미', en: 'Miami', region: '북미', regionEn: 'North America', longitude: -80.192, tz: 'America/New_York' },
  { id: 'us-detroit', name: '디트로이트', en: 'Detroit', region: '북미', regionEn: 'North America', longitude: -83.046, tz: 'America/Detroit' },
  { id: 'us-chicago', name: '시카고', en: 'Chicago', region: '북미', regionEn: 'North America', longitude: -87.63, tz: 'America/Chicago' },
  { id: 'us-houston', name: '휴스턴', en: 'Houston', region: '북미', regionEn: 'North America', longitude: -95.37, tz: 'America/Chicago' },
  { id: 'us-dallas', name: '댈러스', en: 'Dallas', region: '북미', regionEn: 'North America', longitude: -96.797, tz: 'America/Chicago' },
  { id: 'us-minneapolis', name: '미니애폴리스', en: 'Minneapolis', region: '북미', regionEn: 'North America', longitude: -93.265, tz: 'America/Chicago' },
  { id: 'us-denver', name: '덴버', en: 'Denver', region: '북미', regionEn: 'North America', longitude: -104.99, tz: 'America/Denver' },
  { id: 'us-phoenix', name: '피닉스', en: 'Phoenix', region: '북미', regionEn: 'North America', longitude: -112.074, tz: 'America/Phoenix' },
  { id: 'us-las-vegas', name: '라스베이거스', en: 'Las Vegas', region: '북미', regionEn: 'North America', longitude: -115.14, tz: 'America/Los_Angeles' },
  { id: 'us-los-angeles', name: '로스앤젤레스', en: 'Los Angeles', region: '북미', regionEn: 'North America', longitude: -118.244, tz: 'America/Los_Angeles' },
  { id: 'us-san-diego', name: '샌디에이고', en: 'San Diego', region: '북미', regionEn: 'North America', longitude: -117.161, tz: 'America/Los_Angeles' },
  { id: 'us-san-francisco', name: '샌프란시스코', en: 'San Francisco', region: '북미', regionEn: 'North America', longitude: -122.419, tz: 'America/Los_Angeles' },
  { id: 'us-seattle', name: '시애틀', en: 'Seattle', region: '북미', regionEn: 'North America', longitude: -122.332, tz: 'America/Los_Angeles' },
  { id: 'us-anchorage', name: '앵커리지', en: 'Anchorage', region: '북미', regionEn: 'North America', longitude: -149.9, tz: 'America/Anchorage' },
  { id: 'us-honolulu', name: '호놀룰루', en: 'Honolulu', region: '북미', regionEn: 'North America', longitude: -157.858, tz: 'Pacific/Honolulu' },
  { id: 'ca-toronto', name: '토론토', en: 'Toronto', region: '북미', regionEn: 'North America', longitude: -79.383, tz: 'America/Toronto' },
  { id: 'ca-montreal', name: '몬트리올', en: 'Montreal', region: '북미', regionEn: 'North America', longitude: -73.568, tz: 'America/Toronto' },
  { id: 'ca-ottawa', name: '오타와', en: 'Ottawa', region: '북미', regionEn: 'North America', longitude: -75.697, tz: 'America/Toronto' },
  { id: 'ca-calgary', name: '캘거리', en: 'Calgary', region: '북미', regionEn: 'North America', longitude: -114.071, tz: 'America/Edmonton' },
  { id: 'ca-vancouver', name: '밴쿠버', en: 'Vancouver', region: '북미', regionEn: 'North America', longitude: -123.121, tz: 'America/Vancouver' },
  { id: 'mx-mexico-city', name: '멕시코시티', en: 'Mexico City', region: '중남미', regionEn: 'Latin America', longitude: -99.133, tz: 'America/Mexico_City' },
  { id: 'br-sao-paulo', name: '상파울루', en: 'São Paulo', region: '중남미', regionEn: 'Latin America', longitude: -46.633, tz: 'America/Sao_Paulo' },
  { id: 'ar-buenos-aires', name: '부에노스아이레스', en: 'Buenos Aires', region: '중남미', regionEn: 'Latin America', longitude: -58.382, tz: 'America/Argentina/Buenos_Aires' },
  { id: 'cl-santiago', name: '산티아고', en: 'Santiago', region: '중남미', regionEn: 'Latin America', longitude: -70.669, tz: 'America/Santiago' },
  { id: 'pe-lima', name: '리마', en: 'Lima', region: '중남미', regionEn: 'Latin America', longitude: -77.043, tz: 'America/Lima' },
  { id: 'co-bogota', name: '보고타', en: 'Bogotá', region: '중남미', regionEn: 'Latin America', longitude: -74.072, tz: 'America/Bogota' },
  { id: 'gb-london', name: '런던', en: 'London', region: '유럽', regionEn: 'Europe', longitude: -0.128, tz: 'Europe/London' },
  { id: 'ie-dublin', name: '더블린', en: 'Dublin', region: '유럽', regionEn: 'Europe', longitude: -6.26, tz: 'Europe/Dublin' },
  { id: 'fr-paris', name: '파리', en: 'Paris', region: '유럽', regionEn: 'Europe', longitude: 2.352, tz: 'Europe/Paris' },
  { id: 'de-berlin', name: '베를린', en: 'Berlin', region: '유럽', regionEn: 'Europe', longitude: 13.405, tz: 'Europe/Berlin' },
  { id: 'de-frankfurt', name: '프랑크푸르트', en: 'Frankfurt', region: '유럽', regionEn: 'Europe', longitude: 8.682, tz: 'Europe/Berlin' },
  { id: 'nl-amsterdam', name: '암스테르담', en: 'Amsterdam', region: '유럽', regionEn: 'Europe', longitude: 4.904, tz: 'Europe/Amsterdam' },
  { id: 'be-brussels', name: '브뤼셀', en: 'Brussels', region: '유럽', regionEn: 'Europe', longitude: 4.352, tz: 'Europe/Brussels' },
  { id: 'ch-zurich', name: '취리히', en: 'Zurich', region: '유럽', regionEn: 'Europe', longitude: 8.541, tz: 'Europe/Zurich' },
  { id: 'at-vienna', name: '빈', en: 'Vienna', region: '유럽', regionEn: 'Europe', longitude: 16.373, tz: 'Europe/Vienna' },
  { id: 'it-rome', name: '로마', en: 'Rome', region: '유럽', regionEn: 'Europe', longitude: 12.496, tz: 'Europe/Rome' },
  { id: 'it-milan', name: '밀라노', en: 'Milan', region: '유럽', regionEn: 'Europe', longitude: 9.19, tz: 'Europe/Rome' },
  { id: 'es-madrid', name: '마드리드', en: 'Madrid', region: '유럽', regionEn: 'Europe', longitude: -3.704, tz: 'Europe/Madrid' },
  { id: 'es-barcelona', name: '바르셀로나', en: 'Barcelona', region: '유럽', regionEn: 'Europe', longitude: 2.173, tz: 'Europe/Madrid' },
  { id: 'pt-lisbon', name: '리스본', en: 'Lisbon', region: '유럽', regionEn: 'Europe', longitude: -9.139, tz: 'Europe/Lisbon' },
  { id: 'se-stockholm', name: '스톡홀름', en: 'Stockholm', region: '유럽', regionEn: 'Europe', longitude: 18.069, tz: 'Europe/Stockholm' },
  { id: 'no-oslo', name: '오슬로', en: 'Oslo', region: '유럽', regionEn: 'Europe', longitude: 10.752, tz: 'Europe/Oslo' },
  { id: 'dk-copenhagen', name: '코펜하겐', en: 'Copenhagen', region: '유럽', regionEn: 'Europe', longitude: 12.568, tz: 'Europe/Copenhagen' },
  { id: 'fi-helsinki', name: '헬싱키', en: 'Helsinki', region: '유럽', regionEn: 'Europe', longitude: 24.938, tz: 'Europe/Helsinki' },
  { id: 'pl-warsaw', name: '바르샤바', en: 'Warsaw', region: '유럽', regionEn: 'Europe', longitude: 21.012, tz: 'Europe/Warsaw' },
  { id: 'cz-prague', name: '프라하', en: 'Prague', region: '유럽', regionEn: 'Europe', longitude: 14.438, tz: 'Europe/Prague' },
  { id: 'hu-budapest', name: '부다페스트', en: 'Budapest', region: '유럽', regionEn: 'Europe', longitude: 19.04, tz: 'Europe/Budapest' },
  { id: 'gr-athens', name: '아테네', en: 'Athens', region: '유럽', regionEn: 'Europe', longitude: 23.728, tz: 'Europe/Athens' },
  { id: 'tr-istanbul', name: '이스탄불', en: 'Istanbul', region: '유럽', regionEn: 'Europe', longitude: 28.978, tz: 'Europe/Istanbul' },
  { id: 'ua-kyiv', name: '키이우', en: 'Kyiv', region: '유럽', regionEn: 'Europe', longitude: 30.523, tz: 'Europe/Kyiv' },
  { id: 'ru-moscow', name: '모스크바', en: 'Moscow', region: '유럽', regionEn: 'Europe', longitude: 37.618, tz: 'Europe/Moscow' },
  { id: 'ae-dubai', name: '두바이', en: 'Dubai', region: '중동·아프리카', regionEn: 'Middle East & Africa', longitude: 55.271, tz: 'Asia/Dubai' },
  { id: 'sa-riyadh', name: '리야드', en: 'Riyadh', region: '중동·아프리카', regionEn: 'Middle East & Africa', longitude: 46.675, tz: 'Asia/Riyadh' },
  { id: 'il-tel-aviv', name: '텔아비브', en: 'Tel Aviv', region: '중동·아프리카', regionEn: 'Middle East & Africa', longitude: 34.781, tz: 'Asia/Jerusalem' },
  { id: 'ir-tehran', name: '테헤란', en: 'Tehran', region: '중동·아프리카', regionEn: 'Middle East & Africa', longitude: 51.389, tz: 'Asia/Tehran' },
  { id: 'eg-cairo', name: '카이로', en: 'Cairo', region: '중동·아프리카', regionEn: 'Middle East & Africa', longitude: 31.236, tz: 'Africa/Cairo' },
  { id: 'ma-casablanca', name: '카사블랑카', en: 'Casablanca', region: '중동·아프리카', regionEn: 'Middle East & Africa', longitude: -7.59, tz: 'Africa/Casablanca' },
  { id: 'ng-lagos', name: '라고스', en: 'Lagos', region: '중동·아프리카', regionEn: 'Middle East & Africa', longitude: 3.379, tz: 'Africa/Lagos' },
  { id: 'ke-nairobi', name: '나이로비', en: 'Nairobi', region: '중동·아프리카', regionEn: 'Middle East & Africa', longitude: 36.822, tz: 'Africa/Nairobi' },
  { id: 'za-johannesburg', name: '요하네스버그', en: 'Johannesburg', region: '중동·아프리카', regionEn: 'Middle East & Africa', longitude: 28.047, tz: 'Africa/Johannesburg' },
  { id: 'jp-tokyo', name: '도쿄', en: 'Tokyo', region: '아시아', regionEn: 'Asia', longitude: 139.692, tz: 'Asia/Tokyo' },
  { id: 'jp-osaka', name: '오사카', en: 'Osaka', region: '아시아', regionEn: 'Asia', longitude: 135.502, tz: 'Asia/Tokyo' },
  { id: 'jp-fukuoka', name: '후쿠오카', en: 'Fukuoka', region: '아시아', regionEn: 'Asia', longitude: 130.402, tz: 'Asia/Tokyo' },
  { id: 'jp-sapporo', name: '삿포로', en: 'Sapporo', region: '아시아', regionEn: 'Asia', longitude: 141.354, tz: 'Asia/Tokyo' },
  { id: 'kp-pyongyang', name: '평양', en: 'Pyongyang', region: '아시아', regionEn: 'Asia', longitude: 125.762, tz: 'Asia/Pyongyang' },
  { id: 'cn-beijing', name: '베이징', en: 'Beijing', region: '아시아', regionEn: 'Asia', longitude: 116.407, tz: 'Asia/Shanghai' },
  { id: 'cn-shanghai', name: '상하이', en: 'Shanghai', region: '아시아', regionEn: 'Asia', longitude: 121.474, tz: 'Asia/Shanghai' },
  { id: 'cn-guangzhou', name: '광저우', en: 'Guangzhou', region: '아시아', regionEn: 'Asia', longitude: 113.264, tz: 'Asia/Shanghai' },
  { id: 'cn-shenzhen', name: '선전', en: 'Shenzhen', region: '아시아', regionEn: 'Asia', longitude: 114.058, tz: 'Asia/Shanghai' },
  { id: 'cn-chengdu', name: '청두', en: 'Chengdu', region: '아시아', regionEn: 'Asia', longitude: 104.066, tz: 'Asia/Shanghai' },
  { id: 'cn-shenyang', name: '선양', en: 'Shenyang', region: '아시아', regionEn: 'Asia', longitude: 123.432, tz: 'Asia/Shanghai' },
  { id: 'cn-yanji', name: '옌지', en: 'Yanji', region: '아시아', regionEn: 'Asia', longitude: 129.509, tz: 'Asia/Shanghai' },
  { id: 'hk-hong-kong', name: '홍콩', en: 'Hong Kong', region: '아시아', regionEn: 'Asia', longitude: 114.169, tz: 'Asia/Hong_Kong' },
  { id: 'mo-macau', name: '마카오', en: 'Macau', region: '아시아', regionEn: 'Asia', longitude: 113.544, tz: 'Asia/Macau' },
  { id: 'tw-taipei', name: '타이베이', en: 'Taipei', region: '아시아', regionEn: 'Asia', longitude: 121.565, tz: 'Asia/Taipei' },
  { id: 'tw-kaohsiung', name: '가오슝', en: 'Kaohsiung', region: '아시아', regionEn: 'Asia', longitude: 120.301, tz: 'Asia/Taipei' },
  { id: 'mn-ulaanbaatar', name: '울란바토르', en: 'Ulaanbaatar', region: '아시아', regionEn: 'Asia', longitude: 106.906, tz: 'Asia/Ulaanbaatar' },
  { id: 'ph-manila', name: '마닐라', en: 'Manila', region: '아시아', regionEn: 'Asia', longitude: 120.984, tz: 'Asia/Manila' },
  { id: 'vn-hanoi', name: '하노이', en: 'Hanoi', region: '아시아', regionEn: 'Asia', longitude: 105.834, tz: 'Asia/Ho_Chi_Minh' },
  { id: 'vn-ho-chi-minh', name: '호찌민', en: 'Ho Chi Minh City', region: '아시아', regionEn: 'Asia', longitude: 106.66, tz: 'Asia/Ho_Chi_Minh' },
  { id: 'th-bangkok', name: '방콕', en: 'Bangkok', region: '아시아', regionEn: 'Asia', longitude: 100.502, tz: 'Asia/Bangkok' },
  { id: 'my-kuala-lumpur', name: '쿠알라룸푸르', en: 'Kuala Lumpur', region: '아시아', regionEn: 'Asia', longitude: 101.687, tz: 'Asia/Kuala_Lumpur' },
  { id: 'sg-singapore', name: '싱가포르', en: 'Singapore', region: '아시아', regionEn: 'Asia', longitude: 103.82, tz: 'Asia/Singapore' },
  { id: 'id-jakarta', name: '자카르타', en: 'Jakarta', region: '아시아', regionEn: 'Asia', longitude: 106.846, tz: 'Asia/Jakarta' },
  { id: 'id-bali', name: '발리', en: 'Bali (Denpasar)', region: '아시아', regionEn: 'Asia', longitude: 115.216, tz: 'Asia/Makassar' },
  { id: 'in-delhi', name: '델리', en: 'Delhi', region: '아시아', regionEn: 'Asia', longitude: 77.209, tz: 'Asia/Kolkata' },
  { id: 'in-mumbai', name: '뭄바이', en: 'Mumbai', region: '아시아', regionEn: 'Asia', longitude: 72.878, tz: 'Asia/Kolkata' },
  { id: 'in-bengaluru', name: '벵갈루루', en: 'Bengaluru', region: '아시아', regionEn: 'Asia', longitude: 77.595, tz: 'Asia/Kolkata' },
  { id: 'in-kolkata', name: '콜카타', en: 'Kolkata', region: '아시아', regionEn: 'Asia', longitude: 88.364, tz: 'Asia/Kolkata' },
  { id: 'pk-karachi', name: '카라치', en: 'Karachi', region: '아시아', regionEn: 'Asia', longitude: 67.01, tz: 'Asia/Karachi' },
  { id: 'bd-dhaka', name: '다카', en: 'Dhaka', region: '아시아', regionEn: 'Asia', longitude: 90.413, tz: 'Asia/Dhaka' },
  { id: 'np-kathmandu', name: '카트만두', en: 'Kathmandu', region: '아시아', regionEn: 'Asia', longitude: 85.324, tz: 'Asia/Kathmandu' },
  { id: 'kz-almaty', name: '알마티', en: 'Almaty', region: '아시아', regionEn: 'Asia', longitude: 76.886, tz: 'Asia/Almaty' },
  { id: 'uz-tashkent', name: '타슈켄트', en: 'Tashkent', region: '아시아', regionEn: 'Asia', longitude: 69.24, tz: 'Asia/Tashkent' },
  { id: 'ru-vladivostok', name: '블라디보스토크', en: 'Vladivostok', region: '아시아', regionEn: 'Asia', longitude: 131.886, tz: 'Asia/Vladivostok' },
  { id: 'au-sydney', name: '시드니', en: 'Sydney', region: '오세아니아', regionEn: 'Oceania', longitude: 151.209, tz: 'Australia/Sydney' },
  { id: 'au-melbourne', name: '멜버른', en: 'Melbourne', region: '오세아니아', regionEn: 'Oceania', longitude: 144.963, tz: 'Australia/Melbourne' },
  { id: 'au-brisbane', name: '브리즈번', en: 'Brisbane', region: '오세아니아', regionEn: 'Oceania', longitude: 153.026, tz: 'Australia/Brisbane' },
  { id: 'au-perth', name: '퍼스', en: 'Perth', region: '오세아니아', regionEn: 'Oceania', longitude: 115.861, tz: 'Australia/Perth' },
  { id: 'au-adelaide', name: '애들레이드', en: 'Adelaide', region: '오세아니아', regionEn: 'Oceania', longitude: 138.601, tz: 'Australia/Adelaide' },
  { id: 'nz-auckland', name: '오클랜드', en: 'Auckland', region: '오세아니아', regionEn: 'Oceania', longitude: 174.763, tz: 'Pacific/Auckland' },
  { id: 'gu-guam', name: '괌', en: 'Guam', region: '오세아니아', regionEn: 'Oceania', longitude: 144.794, tz: 'Pacific/Guam' },
];

const SOUTH = new Set(['au-sydney', 'au-melbourne', 'au-brisbane', 'au-perth', 'au-adelaide', 'nz-auckland', 'br-sao-paulo', 'ar-buenos-aires', 'cl-santiago', 'pe-lima', 'za-johannesburg', 'id-jakarta', 'id-bali', 'ke-nairobi']);
for (const c of WORLD) if (SOUTH.has(c.id)) c.south = true;

export const CITIES: City[] = [...KOREA, ...WORLD];

export const DEFAULT_CITY_ID = 'seoul';

export const cityById = (id: string) => CITIES.find((c) => c.id === id) ?? CITIES[0];

export const cityOffsetMinutes = (city: City) => Math.round((city.longitude - 135) * 4);

/** 해외 도시인지 (한국 시각 규칙을 쓰지 않음) */
export const isOverseas = (city: City) => !!city.tz;

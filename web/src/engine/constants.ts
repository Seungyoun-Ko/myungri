// 공통 상수: 천간·지지·오행·지장간
// 인덱스 규칙 — 천간: 갑0 … 계9, 지지: 자0 축1 인2 … 해11, 오행: 목0 화1 토2 금3 수4

export const STEMS_HANJA = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;
export const STEMS_KO = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'] as const;
export const BRANCHES_HANJA = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;
export const BRANCHES_KO = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'] as const;
export const ZODIAC_KO = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'] as const;

export type Element = 0 | 1 | 2 | 3 | 4;
export const ELEMENTS_KO = ['목', '화', '토', '금', '수'] as const;
export const ELEMENTS_HANJA = ['木', '火', '土', '金', '水'] as const;

export const STEM_ELEMENT: Element[] = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4];
export const BRANCH_ELEMENT: Element[] = [4, 2, 0, 0, 2, 1, 1, 2, 3, 3, 2, 4];

/** 0 = 양, 1 = 음 */
export const stemYinYang = (s: number) => s % 2;
export const branchYinYang = (b: number) => b % 2;

/** 지장간 (여기 → 중기 → 본기). 마지막 원소가 본기. */
export const HIDDEN_STEMS: number[][] = [
  [8, 9], // 子 壬癸
  [9, 7, 5], // 丑 癸辛己
  [4, 2, 0], // 寅 戊丙甲
  [0, 1], // 卯 甲乙
  [1, 9, 4], // 辰 乙癸戊
  [4, 6, 2], // 巳 戊庚丙
  [2, 5, 3], // 午 丙己丁
  [3, 1, 5], // 未 丁乙己
  [4, 8, 6], // 申 戊壬庚
  [6, 7], // 酉 庚辛
  [7, 3, 4], // 戌 辛丁戊
  [4, 0, 8], // 亥 戊甲壬
];

export const mainHiddenStem = (branch: number) => HIDDEN_STEMS[branch][HIDDEN_STEMS[branch].length - 1];

export const stemIndex = (hanja: string) => STEMS_HANJA.indexOf(hanja as (typeof STEMS_HANJA)[number]);
export const branchIndex = (hanja: string) => BRANCHES_HANJA.indexOf(hanja as (typeof BRANCHES_HANJA)[number]);

/** 60갑자 인덱스 → [천간, 지지] */
export const ganzhiOf = (i: number): [number, number] => [((i % 60) + 60) % 60 % 10, ((i % 60) + 60) % 60 % 12];
/** [천간, 지지] → 60갑자 인덱스 */
export const ganzhiIndex = (stem: number, branch: number) => {
  for (let i = 0; i < 60; i++) if (i % 10 === stem && i % 12 === branch) return i;
  return -1;
};

export const mod = (n: number, m: number) => ((n % m) + m) % m;

/** 생: a가 b를 생하면 true */
export const generates = (a: number, b: number) => mod(a + 1, 5) === b;
/** 극: a가 b를 극하면 true */
export const controls = (a: number, b: number) => mod(a + 2, 5) === b;
export const generatorOf = (e: number) => mod(e - 1, 5) as Element;
export const controllerOf = (e: number) => mod(e - 2, 5) as Element;

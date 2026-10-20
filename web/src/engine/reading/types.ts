// 새 풀이(쉬운 말 · 풍성한 풀이)의 문장 데이터 모양.
// 본문 문장에는 전문 용어와 한자를 쓰지 않습니다. 용어는 풀이 끝의 '명리 근거'에만 나옵니다.
// 말투는 앱 전체와 같은 해요체입니다.

/** 일간(태어난 날의 천간) 10가지마다 하나 */
export interface DayMasterReading {
  /** 한 줄 요약. 비유로 그 사람을 그려 줌 (25~45자) */
  title: string;
  /** 키워드 3개 (#는 빼고, 2~6자) */
  keywords: [string, string, string];
  /** 성격 문단 2개: [강점이 드러나는 장면, 그늘이 드러나는 장면] (각 150~230자) */
  core: [string, string];
  /** 힘들 때의 모습과 회복하는 법 (120~180자) */
  stress: string;
  /** 이럴 때 힘이 나요 (3개, 각 10~30자) */
  energize: [string, string, string];
  /** 이럴 때 지쳐요 (3개, 각 10~30자) */
  drain: [string, string, string];
  /** 일하는 방식 (150~220자) */
  work: string;
  /** 잘 어울리는 일 (6~8개, 각 2~10자) */
  jobs: string[];
  /** 연애할 때의 모습 (150~220자) */
  love: string;
  /** 돈을 벌고 쓰고 모으는 습관 (130~200자) */
  money: string;
  /** 사람을 대하는 방식 (130~200자) */
  relations: string;
  /** 컨디션과 생활 습관 (110~170자). 질병을 단정하지 않음 */
  health: string;
  /** 실천 팁 3개 (각 30~70자) */
  tips: [string, string, string];
}

/** 사주의 힘 세기: 강한 편 / 균형 / 약한 편 */
export type StrengthKey = 'strong' | 'mid' | 'weak';
export interface StrengthReading {
  personality: string; // 90~150자
  work: string; // 90~150자
  love: string; // 90~150자
  money: string; // 90~150자
  relations: string; // 90~150자
  health: string; // 80~130자
  tip: string; // 30~70자
}

/** 십신 무리: 비겁(내 편과 경쟁), 식상(표현과 재능), 재성(재물), 관성(일과 책임), 인성(배움과 도움) */
export type GroupKey = '비겁' | '식상' | '재성' | '관성' | '인성';

/** 그 무리가 사주에서 가장 많을 때 */
export interface GroupManyReading {
  keyword: string; // 키워드 1개 (2~6자)
  personality: string; // 120~180자
  work: string; // 120~180자
  jobs: string[]; // 4~6개
  love: string; // 110~170자
  money: string; // 110~170자
  relations: string; // 110~170자
  energize: string; // 10~30자
  drain: string; // 10~30자
}

/** 그 무리가 사주에 거의 없을 때 (단정하지 않고, 채우는 방법을 함께) */
export interface GroupNoneReading {
  personality: string; // 90~140자
  work: string; // 80~130자
  love: string; // 80~130자
  money: string; // 80~130자
  relations: string; // 80~130자
  tip: string; // 30~70자
}

/** 오행: 0 나무, 1 불, 2 흙, 3 쇠, 4 물 */
export interface ElementBalanceReading {
  personality: string; // 80~130자
  health: string; // 80~130자. 질병 단정 없이, 생활 관리 중심
  tip: string; // 30~70자
}

/** 나에게 가장 필요한 기운(용신)을 채우는 생활 */
export interface LuckyReading {
  /** 필요한 기운을 쉬운 말로 소개 (90~140자) */
  intro: string;
  colors: string[]; // 2~3개
  numbers: [number, number];
  direction: string; // 동쪽 등
  season: string; // 봄 등
  activities: [string, string, string]; // 각 10~30자
  places: [string, string]; // 각 5~20자
}

/** 격국(태어난 달이 정한 사회적 무기) */
export interface GeukReading {
  /** 타고난 무기를 한 문장으로 (40~80자) */
  weapon: string;
  /** 일에서 그 무기가 쓰이는 방식 (130~200자) */
  work: string;
}

/** 배우자 자리(일지)에 놓인 십신 */
export interface SpousePalaceReading {
  love: string; // 140~200자
  attract: string; // 끌리는 사람 (60~110자)
  caution: string; // 관계에서 조심할 점 (60~110자)
}

/** 연인을 뜻하는 별의 양 */
export type AmountKey = 'many' | 'normal' | 'few';

/** 올해(세운) 또는 그 달에 들어온 십신 */
export interface YearReading {
  /** 한 줄 요약 (20~40자) */
  title: string;
  /** 그 해 전체 흐름 (200~280자) */
  overview: string;
  /** 생활의 바탕에 깔릴 때(지지로 들어올 때) 한두 문장 (70~120자) */
  base: string;
  work: string; // 90~150자
  money: string; // 90~150자
  love: string; // 90~150자
  health: string; // 80~130자
  relations: string; // 80~130자
  tips: [string, string]; // 각 30~70자
}

/** 달마다 한 줄 */
export interface MonthReading {
  /** 그 달 기운이 나에게 잘 맞을 때 (35~70자) */
  good: string;
  /** 보통일 때 (35~70자) */
  normal: string;
  /** 부담이 될 때 (35~70자) */
  caution: string;
}

export type FavorKey = 'good' | 'normal' | 'caution';

/** 십신 10가지 (데이터의 키로만 쓰고, 본문에는 쓰지 않음) */
export type TenGodName = '비견' | '겁재' | '식신' | '상관' | '편재' | '정재' | '편관' | '정관' | '편인' | '정인';

/** 태어난 날 아래 글자가 옆 기둥과 끌어당기거나(hap) 부딪칠 때(chung) */
export interface DayComboReading {
  love: string; // 80~140자
  relations: string; // 80~140자
}

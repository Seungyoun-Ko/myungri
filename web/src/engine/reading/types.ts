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

/** 10년 운(대운)에 들어온 십신. YearReading과 같은 모양이지만 10년이라는 긴 흐름으로 씁니다. */
export type BigReading = YearReading;

/** 그 달 운의 자세한 풀이 */
export interface MonthDetail {
  overview: string; // 120~180자
  work: string; // 60~100자
  money: string; // 60~100자
  love: string; // 60~100자
  health: string; // 60~100자
}

/** 자미두수 주성 14개 (본문에는 별 이름 대신 nick을 씀) */
export interface StarReading {
  /** 쉬운 별명 (예: '왕의 별', 3~8자) */
  nick: string;
  /** 이 별이 나 자신의 자리에 있을 때 한 줄 요약 (25~45자) */
  title: string;
  keywords: [string, string, string];
  /** 별의 기본 성질 (130~200자) */
  nature: string;
  /** 나 자신의 자리에 있을 때 성격 (150~220자) */
  self: string;
  /** 일·직업 자리 (120~180자) */
  work: string;
  /** 돈·재물 자리, 집·부동산 자리 (120~180자) */
  money: string;
  /** 배우자·연애 자리 (120~180자) */
  love: string;
  /** 건강 자리 (80~140자). 질병 단정 금지 */
  health: string;
  /** 형제·친구·부모·자녀처럼 사람 자리 (110~170자) */
  relations: string;
  /** 바깥 활동·이동 자리, 마음·취미 자리 (100~160자) */
  life: string;
  /** 10년·1년 흐름의 중심 자리에 이 별이 올 때 (100~160자) */
  flow: string;
}

/** 자미두수 12자리 */
export interface PalaceReading {
  /** 이 자리가 삶에서 보여 주는 것 (90~140자) */
  intro: string;
  /** 이 자리에 중심 별이 없어 맞은편 별을 빌려 볼 때 (70~120자) */
  empty: string;
}

/** 자미두수 기타: 밝기, 네 가지 변화(사화), 돕는 별·부딪치는 별 */
export interface JamiExtraReading {
  bright: [string, string]; // 별빛이 밝을 때, 2가지 표현 (50~100자)
  dim: [string, string]; // 별빛이 약할 때 (50~100자)
  /** 사화: 록 좋은 기운·복, 권 힘과 주도권, 과 좋은 평판, 기 마음 쓸 일 */
  sihwa: Record<'록' | '권' | '과' | '기', { natal: string; period: string }>; // 각 70~120자
  /** 돕는 별 8개 (좌보 우필 문창 문곡 천괴 천월 녹존 천마) 한 문장씩 (40~90자) */
  aux: Record<string, string>;
  /** 부딪치는 별 6개 (경양 타라 화성 영성 지공 지겁) 한 문장씩 (40~90자) */
  sal: Record<string, string>;
  /** 나이 들수록 마음이 가는 자리(신궁)가 따로 있을 때, {field} 자리에 분야가 들어감 (70~120자) */
  shen: string;
  /** 신궁이 나 자신의 자리와 같을 때 (60~100자) */
  shenSame: string;
}

// ---------------------------------------------------------------- v1.1 추가

/** 두 사람의 일간 궁합 (키: 작은 일간 번호-큰 일간 번호, 예: '0-6' = 갑-경). 연인·친구·동료 어느 관계에도 읽히게 씁니다. */
export interface MatchPairReading {
  /** 두 기운을 그린 비유 제목 (15~35자) */
  title: string;
  /** 두 사람이 만났을 때의 전체 그림 (160~230자) */
  summary: string;
  /** 잘 맞는 점, 서로에게 주는 것 (130~200자) */
  together: string;
  /** 부딪치기 쉬운 점과 그 장면 (130~200자) */
  friction: string;
  /** 둘이 함께 해 보면 좋은 것 2개 (각 30~70자) */
  tips: [string, string];
}

/** 자미두수 육친·생활 자리에서 그 주성이 그리는 모습. 육친 자리는 '그 상대'를, 생활 자리는 '그 분야'를 그립니다. */
export type PalaceFieldKey = 'parents' | 'siblings' | 'children' | 'friends' | 'property' | 'travel' | 'inner';
export type PalaceStarReading = Record<PalaceFieldKey, string>; // 각 110~190자

/** 자미두수 보강 문장 */
export interface JamiExtra2Reading {
  /** 건강 자리 전용: 보좌성 8개 (키: 좌보·우필·문창·문곡·천괴·천월·녹존·천마), 각 50~100자 */
  healthAux: Record<string, string>;
  /** 건강 자리 전용: 살성 6개 (키: 경양·타라·화성·영성·지공·지겁), 각 50~100자 */
  healthSal: Record<string, string>;
  /** 건강 자리 전용 사화 (키: 록·권·과·기), natal = 타고난 것, period = 대한·유년 */
  healthSihwa: Record<string, { natal: string; period: string }>;
  /** 주성 14개의 밝기별 보정 한두 문장 (키: 주성 이름), 각 50~100자. strong = 묘·왕, mid = 득·리·평, weak = 불·함 */
  bright: Record<string, { strong: string; mid: string; weak: string }>;
  /** 주성이 없어 맞은편 별을 빌려 볼 때 앞에 붙이는 완충 문장 2개 (각 50~90자) */
  borrowed: [string, string];
  /** 같은 자리에 사화가 겹칠 때 (각 70~130자) */
  combos: {
    /** 화록 + 화기: 얻고 잃음이 함께 */
    luJi: string;
    /** 화과 + 화기: 평판은 나되 실속 관리 */
    keJi: string;
    /** 화권 + 화기: 힘이 실리지만 무리 조심 */
    quanJi: string;
    /** 타고난 화기 + 시기의 화기가 같은 자리 (쌍기) */
    doubleJi: string;
    /** 타고난 화록 + 시기의 화록 (쌍록) */
    doubleLu: string;
  };
}

/** 띠별 신년운세 (키: 지지 번호 0=쥐 … 11=돼지) */
export interface NewYearZodiacReading {
  /** 한 줄 제목 (15~35자) */
  title: string;
  /** 그 해 전체 흐름 (220~320자) */
  overview: string;
  work: string; // 90~150자
  money: string; // 90~150자
  love: string; // 90~150자
  health: string; // 80~130자
  /** 실천 팁 (30~70자) */
  tip: string;
}
export interface NewYearIntro {
  /** 그 해를 소개하는 제목 (15~35자) */
  title: string;
  /** 그 해 기운 소개 (250~350자) */
  intro: string;
  /** 모두에게 주는 조언 3개 (각 30~70자) */
  tips: [string, string, string];
}

// 자미두수 명반 엔진 (기획서 5장)
// 지지 인덱스: 자0 축1 인2 묘3 진4 사5 오6 미7 신8 유9 술10 해11
import { BRANCHES_HANJA, BRANCHES_KO, STEMS_HANJA, STEMS_KO, mod } from './constants';
import type { NormalizedBirth } from './birth';

export type StarKind = 'main' | 'aux' | 'sal' | 'minor';
export type Sihwa = '록' | '권' | '과' | '기';
export const SIHWA_ORDER: Sihwa[] = ['록', '권', '과', '기'];

export interface StarDef {
  key: string;
  name: string;
  hanja: string;
  kind: StarKind;
}

export const MAIN_STARS: StarDef[] = [
  ['ziwei', '자미', '紫微'],
  ['tianji', '천기', '天機'],
  ['taiyang', '태양', '太陽'],
  ['wuqu', '무곡', '武曲'],
  ['tiantong', '천동', '天同'],
  ['lianzhen', '염정', '廉貞'],
  ['tianfu', '천부', '天府'],
  ['taiyin', '태음', '太陰'],
  ['tanlang', '탐랑', '貪狼'],
  ['jumen', '거문', '巨門'],
  ['tianxiang', '천상', '天相'],
  ['tianliang', '천량', '天梁'],
  ['qisha', '칠살', '七殺'],
  ['pojun', '파군', '破軍'],
].map(([key, name, hanja]) => ({ key, name, hanja, kind: 'main' as const }));

const AUX: [string, string, string, StarKind][] = [
  ['zuofu', '좌보', '左輔', 'aux'],
  ['youbi', '우필', '右弼', 'aux'],
  ['wenchang', '문창', '文昌', 'aux'],
  ['wenqu', '문곡', '文曲', 'aux'],
  ['tiankui', '천괴', '天魁', 'aux'],
  ['tianyue', '천월', '天鉞', 'aux'],
  ['lucun', '녹존', '祿存', 'aux'],
  ['tianma', '천마', '天馬', 'aux'],
  ['qingyang', '경양', '擎羊', 'sal'],
  ['tuoluo', '타라', '陀羅', 'sal'],
  ['huoxing', '화성', '火星', 'sal'],
  ['lingxing', '영성', '鈴星', 'sal'],
  ['dikong', '지공', '地空', 'sal'],
  ['dijie', '지겁', '地劫', 'sal'],
];
export const AUX_STARS: StarDef[] = AUX.map(([key, name, hanja, kind]) => ({ key, name, hanja, kind }));

const MINOR: [string, string, string][] = [
  ['tianxing', '천형', '天刑'], ['tianyao', '천요', '天姚'], ['yinsha', '음살', '陰煞'], ['tianwu', '천무', '天巫'],
  ['tiankong', '천공', '天空'], ['xunkong', '순공', '旬空'], ['jiekong', '절공', '截空'], ['santai', '삼태', '三台'],
  ['bazuo', '팔좌', '八座'], ['enguang', '은광', '恩光'], ['tiangui', '천귀', '天貴'], ['taifu', '태보', '台輔'],
  ['fenggao', '봉고', '封誥'], ['hongluan', '홍란', '紅鸞'], ['tianxi', '천희', '天喜'], ['huagai', '화개', '華蓋'],
  ['xianchi', '함지', '咸池'], ['guchen', '고진', '孤辰'], ['guasu', '과숙', '寡宿'], ['tiancai', '천재', '天才'],
  ['tianshou', '천수', '天壽'], ['tianchu', '천주', '天廚'], ['posui', '파쇄', '破碎'], ['feilian', '비렴', '蜚廉'],
  ['longchi', '용지', '龍池'], ['fengge', '봉각', '鳳閣'], ['tianku', '천곡', '天哭'], ['tianxu', '천허', '天虛'],
  ['tianguan', '천관', '天官'], ['tianfuMinor', '천복', '天福'], ['tiande', '천덕', '天德'], ['yuede', '월덕', '月德'],
  ['jieshen', '해신', '解神'], ['tianshang', '천상', '天傷'], ['tianshi', '천사', '天使'],
];
export const MINOR_STARS: StarDef[] = MINOR.map(([key, name, hanja]) => ({ key, name, hanja, kind: 'minor' as const }));

// 이름이 겹치는 별(天相 주성 / 天傷 잡성)이 있어 이름 검색은 주성·보좌성을 우선합니다.
const STAR_BY_NAME = new Map([...MINOR_STARS, ...AUX_STARS, ...MAIN_STARS].map((s) => [s.name, s]));
const STAR_BY_KEY = new Map([...MAIN_STARS, ...AUX_STARS, ...MINOR_STARS].map((s) => [s.key, s]));

// ---------------------------------------------------------------- 12궁 · 12신 이름
export const PALACE_NAMES = ['명궁', '형제궁', '부처궁', '자녀궁', '재백궁', '질액궁', '천이궁', '노복궁', '관록궁', '전택궁', '복덕궁', '부모궁'] as const;
export type PalaceName = (typeof PALACE_NAMES)[number];

const CHANGSHENG = ['장생', '목욕', '관대', '임관', '제왕', '쇠', '병', '사', '묘', '절', '태', '양'];
const BOSHI = ['박사', '역사', '청룡', '소모', '장군', '주서', '비렴', '희신', '병부', '대모', '복병', '관부'];
const SUIQIAN = ['세건', '회기', '상문', '관색', '관부', '소모', '대모', '용덕', '백호', '천덕', '조객', '병부'];
const JIANGQIAN = ['장성', '반안', '세역', '식신', '화개', '겁살', '재살', '천살', '지배', '함지', '월살', '망신'];
/** 같은 순서의 한자 (영어 화면에서 씁니다) */
export const SPIRIT_HANJA = {
  changsheng: ['長生', '沐浴', '冠帶', '臨官', '帝旺', '衰', '病', '死', '墓', '絕', '胎', '養'],
  boshi: ['博士', '力士', '青龍', '小耗', '將軍', '奏書', '飛廉', '喜神', '病符', '大耗', '伏兵', '官府'],
  suiqian: ['歲建', '晦氣', '喪門', '貫索', '官符', '小耗', '大耗', '龍德', '白虎', '天德', '弔客', '病符'],
  jiangqian: ['將星', '攀鞍', '歲驛', '息神', '華蓋', '劫煞', '災煞', '天煞', '指背', '咸池', '月煞', '亡神'],
};
export const SPIRIT_NAMES = { changsheng: CHANGSHENG, boshi: BOSHI, suiqian: SUIQIAN, jiangqian: JIANGQIAN };

// ---------------------------------------------------------------- 오행국
const NAYIN = '金火木土金火水土金木水土火木水金火木土金火水土金木水土火木水';
const GUK: Record<string, { name: string; number: number }> = {
  水: { name: '수2국', number: 2 },
  木: { name: '목3국', number: 3 },
  金: { name: '금4국', number: 4 },
  土: { name: '토5국', number: 5 },
  火: { name: '화6국', number: 6 },
};
const ganzhiIdx = (stem: number, branch: number) => {
  for (let i = 0; i < 60; i++) if (i % 10 === stem && i % 12 === branch) return i;
  return 0;
};
export const nayinElement = (stem: number, branch: number) => NAYIN[Math.floor(ganzhiIdx(stem, branch) / 2)];

// ---------------------------------------------------------------- 사화
const SIHWA_TABLE: string[][] = [
  ['염정', '파군', '무곡', '태양'], // 갑
  ['천기', '천량', '자미', '태음'], // 을
  ['천동', '천기', '문창', '염정'], // 병
  ['태음', '천동', '천기', '거문'], // 정
  ['탐랑', '태음', '우필', '천기'], // 무
  ['무곡', '탐랑', '천량', '문곡'], // 기
  ['태양', '무곡', '태음', '천동'], // 경
  ['거문', '태양', '문곡', '문창'], // 신
  ['천량', '자미', '좌보', '무곡'], // 임
  ['파군', '거문', '태음', '탐랑'], // 계
];
export const sihwaOf = (stem: number) => SIHWA_TABLE[stem].map((star, i) => ({ star, sihwa: SIHWA_ORDER[i] }));

// ---------------------------------------------------------------- 묘왕리함
// 지지 순서(자→해). iztro(MIT)의 표를 바탕으로 하고, 앱 기준 사례(태양 유궁 = 함)에 맞춰 고쳤습니다.
// TODO: Android 앱의 "앱 기준 묘왕리함표"와 한 칸씩 대조 필요.
const B = { miao: '묘', wang: '왕', de: '득', li: '리', ping: '평', bu: '불', xian: '함', '': '' } as const;
type BKey = keyof typeof B;
const fromYin = (arr: BKey[]) => {
  // iztro 표는 인(寅)부터 시작하므로 자(子)부터로 돌립니다.
  const byBranch: string[] = new Array(12);
  arr.forEach((v, i) => (byBranch[mod(i + 2, 12)] = B[v]));
  return byBranch;
};
const BRIGHTNESS: Record<string, string[]> = {
  자미: fromYin(['wang', 'wang', 'de', 'wang', 'miao', 'miao', 'wang', 'wang', 'de', 'wang', 'ping', 'miao']),
  천기: fromYin(['de', 'wang', 'li', 'ping', 'miao', 'xian', 'de', 'wang', 'li', 'ping', 'miao', 'xian']),
  태양: fromYin(['wang', 'miao', 'wang', 'wang', 'wang', 'de', 'de', 'xian', 'bu', 'xian', 'xian', 'bu']),
  무곡: fromYin(['de', 'li', 'miao', 'ping', 'wang', 'miao', 'de', 'li', 'miao', 'ping', 'wang', 'miao']),
  천동: fromYin(['li', 'ping', 'ping', 'miao', 'xian', 'bu', 'wang', 'ping', 'ping', 'miao', 'wang', 'bu']),
  염정: fromYin(['miao', 'ping', 'li', 'xian', 'ping', 'li', 'miao', 'ping', 'li', 'xian', 'ping', 'li']),
  천부: fromYin(['miao', 'de', 'miao', 'de', 'wang', 'miao', 'de', 'wang', 'miao', 'de', 'miao', 'miao']),
  태음: fromYin(['wang', 'xian', 'xian', 'xian', 'bu', 'bu', 'li', 'wang', 'wang', 'miao', 'miao', 'miao']),
  탐랑: fromYin(['ping', 'li', 'miao', 'xian', 'wang', 'miao', 'ping', 'li', 'miao', 'xian', 'wang', 'miao']),
  거문: fromYin(['miao', 'miao', 'xian', 'wang', 'wang', 'bu', 'miao', 'miao', 'xian', 'wang', 'wang', 'bu']),
  천상: fromYin(['miao', 'xian', 'de', 'de', 'miao', 'de', 'miao', 'xian', 'de', 'de', 'miao', 'miao']),
  천량: fromYin(['miao', 'miao', 'miao', 'xian', 'miao', 'wang', 'xian', 'de', 'miao', 'xian', 'miao', 'wang']),
  칠살: fromYin(['miao', 'wang', 'miao', 'ping', 'wang', 'miao', 'miao', 'wang', 'miao', 'ping', 'wang', 'miao']),
  파군: fromYin(['de', 'xian', 'wang', 'ping', 'miao', 'wang', 'de', 'xian', 'wang', 'ping', 'miao', 'wang']),
  문창: fromYin(['xian', 'li', 'de', 'miao', 'xian', 'li', 'de', 'miao', 'xian', 'li', 'de', 'miao']),
  문곡: fromYin(['ping', 'wang', 'de', 'miao', 'xian', 'wang', 'de', 'miao', 'xian', 'wang', 'de', 'miao']),
  화성: fromYin(['miao', 'li', 'xian', 'de', 'miao', 'li', 'xian', 'de', 'miao', 'li', 'xian', 'de']),
  영성: fromYin(['miao', 'li', 'xian', 'de', 'miao', 'li', 'xian', 'de', 'miao', 'li', 'xian', 'de']),
  경양: fromYin(['', 'xian', 'miao', '', 'xian', 'miao', '', 'xian', 'miao', '', 'xian', 'miao']),
  타라: fromYin(['xian', '', 'miao', 'xian', '', 'miao', 'xian', '', 'miao', 'xian', '', 'miao']),
};
export const brightnessOf = (star: string, branch: number) => BRIGHTNESS[star]?.[branch] ?? '';

// ---------------------------------------------------------------- 결과 타입
export interface PlacedStar extends StarDef {
  brightness: string;
  /** 생년 사화 */
  sihwa: Sihwa | null;
}

export interface Palace {
  branch: number;
  branchHanja: string;
  branchKo: string;
  stem: number;
  ganzhi: string;
  ganzhiKo: string;
  name: PalaceName;
  isMing: boolean;
  isShen: boolean;
  daehan: { start: number; end: number };
  stars: PlacedStar[];
  changsheng: string;
  boshi: string;
  suiqian: string;
  jiangqian: string;
}

export interface JamidusuChart {
  lunar: { year: number; month: number; day: number; leap: boolean };
  yearStem: number;
  yearBranch: number;
  yearGanzhi: string;
  hourBranch: number;
  mingBranch: number;
  shenBranch: number;
  shenPalaceName: PalaceName;
  guk: { name: string; number: number };
  forward: boolean;
  gender: 'M' | 'F';
  /** 지지 인덱스로 찾는 12궁 */
  palaces: Palace[];
  sihwa: { star: string; sihwa: Sihwa; branch: number; palace: PalaceName }[];
}

// ---------------------------------------------------------------- 배치 계산
const triadGroup = (b: number) => b % 4; // 신자진=0, 사유축=1, 인오술=2, 해묘미=3
const TRIAD_HORSE = [2, 11, 8, 5]; // 신자진→인, 사유축→해, 인오술→신, 해묘미→사
const TRIAD_KING = [0, 9, 6, 3]; // 왕지: 신자진→자, 사유축→유, 인오술→오, 해묘미→묘
const TRIAD_FIRE = [2, 3, 1, 9]; // 화성 기준점
const TRIAD_BELL = [10, 10, 3, 10]; // 영성 기준점
const TRIAD_HUAGAI = [4, 1, 10, 7];
const TRIAD_XIANCHI = [9, 6, 3, 0];
const KUI_YUE: [number, number][] = [
  [1, 7], [0, 8], [11, 9], [11, 9], [1, 7], [0, 8], [1, 7], [6, 2], [3, 5], [3, 5],
];
const LUCUN = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0];
const TIANGUAN = [7, 4, 5, 2, 3, 9, 11, 9, 10, 6];
const TIANFU_MINOR = [9, 8, 0, 11, 3, 2, 6, 5, 6, 5];
const TIANCHU = [5, 6, 0, 5, 6, 8, 2, 6, 9, 11];
const FEILIAN = [8, 9, 10, 5, 6, 7, 2, 3, 4, 11, 0, 1];
const JIEKONG = [[8, 9], [6, 7], [4, 5], [2, 3], [0, 1]];
const CHANGSHENG_START: Record<number, number> = { 2: 8, 3: 11, 4: 5, 5: 8, 6: 2 };

function seasonGroup(b: number) {
  // 해자축=0, 인묘진=1, 사오미=2, 신유술=3
  return Math.floor(mod(b + 1, 12) / 3);
}

/** 자미 위치(지지) */
export function ziweiBranch(lunarDay: number, guk: number) {
  let x = 0;
  while ((lunarDay + x) % guk !== 0) x++;
  const q = (lunarDay + x) / guk;
  const pos = q - 1 + (x % 2 === 0 ? x : -x);
  return mod(2 + pos, 12);
}

export class JamidusuUnavailableError extends Error {}

export function computeJamidusu(birth: NormalizedBirth): JamidusuChart {
  if (birth.timeUnknown || !birth.corrected) {
    throw new JamidusuUnavailableError('출생시간을 입력해야 명반을 완성 시킬 수 있습니다.');
  }
  const lunar = birth.lunar;
  const month = lunar.month;
  const day = lunar.day;
  const yearIdx = mod(lunar.year - 4, 60);
  const yearStem = yearIdx % 10;
  const yearBranch = yearIdx % 12;
  const hourBranch = Math.floor((birth.corrected.hour + 1) / 2) % 12;

  const monthBase = mod(2 + month - 1, 12);
  const ming = mod(monthBase - hourBranch, 12);
  const shen = mod(monthBase + hourBranch, 12);

  const yinStem = ((yearStem % 5) * 2 + 2) % 10;
  const palaceStem = (b: number) => (yinStem + mod(b - 2, 12)) % 10;
  const guk = GUK[nayinElement(palaceStem(ming), ming)];

  const male = birth.input.gender === 'M';
  const forward = (yearStem % 2 === 0) === male; // 양남·음녀 순행
  const dir = forward ? 1 : -1;

  // 별 배치
  const placed = new Map<number, StarDef[]>();
  const putDef = (def: StarDef, b: number) => {
    const k = mod(b, 12);
    if (!placed.has(k)) placed.set(k, []);
    placed.get(k)!.push(def);
  };
  const put = (name: string, b: number) => putDef(STAR_BY_NAME.get(name)!, b);

  const zw = ziweiBranch(day, guk.number);
  [['자미', 0], ['천기', -1], ['태양', -3], ['무곡', -4], ['천동', -5], ['염정', -8]].forEach(([n, o]) => put(n as string, zw + (o as number)));
  const tf = mod(2 + mod(12 - mod(zw - 2, 12), 12), 12);
  [['천부', 0], ['태음', 1], ['탐랑', 2], ['거문', 3], ['천상', 4], ['천량', 5], ['칠살', 6], ['파군', 10]].forEach(([n, o]) => put(n as string, tf + (o as number)));

  const zuofu = mod(4 + month - 1, 12);
  const youbi = mod(10 - (month - 1), 12);
  const wenchang = mod(10 - hourBranch, 12);
  const wenqu = mod(4 + hourBranch, 12);
  const lucun = LUCUN[yearStem];
  const tg = triadGroup(yearBranch);
  put('좌보', zuofu);
  put('우필', youbi);
  put('문창', wenchang);
  put('문곡', wenqu);
  put('천괴', KUI_YUE[yearStem][0]);
  put('천월', KUI_YUE[yearStem][1]);
  put('녹존', lucun);
  put('천마', TRIAD_HORSE[tg]);
  put('경양', lucun + 1);
  put('타라', lucun - 1);
  put('화성', TRIAD_FIRE[tg] + hourBranch);
  put('영성', TRIAD_BELL[tg] + hourBranch);
  put('지공', 11 - hourBranch);
  put('지겁', 11 + hourBranch);

  // 잡성
  put('천형', 9 + month - 1);
  put('천요', 1 + month - 1);
  put('음살', 2 - 2 * (month - 1));
  put('천무', [5, 8, 2, 11][(month - 1) % 4]);
  put('해신', 8 + 2 * Math.floor((month - 1) / 2));
  put('삼태', zuofu + day - 1);
  put('팔좌', youbi - (day - 1));
  put('은광', wenchang + day - 2);
  put('천귀', wenqu + day - 2);
  put('태보', wenqu + 2);
  put('봉고', wenqu - 2);
  put('홍란', 3 - yearBranch);
  put('천희', 9 - yearBranch);
  put('화개', TRIAD_HUAGAI[tg]);
  put('함지', TRIAD_XIANCHI[tg]);
  put('고진', [2, 5, 8, 11][seasonGroup(yearBranch)]);
  put('과숙', [10, 1, 4, 7][seasonGroup(yearBranch)]);
  put('천곡', 6 - yearBranch);
  put('천허', 6 + yearBranch);
  put('용지', 4 + yearBranch);
  put('봉각', 10 - yearBranch);
  put('천재', ming + yearBranch);
  put('천수', shen + yearBranch);
  put('파쇄', [5, 1, 9][yearBranch % 3]);
  put('비렴', FEILIAN[yearBranch]);
  put('천덕', 9 + yearBranch);
  put('월덕', 5 + yearBranch);
  put('천공', yearBranch + 1);
  put('천관', TIANGUAN[yearStem]);
  put('천복', TIANFU_MINOR[yearStem]);
  put('천주', TIANCHU[yearStem]);
  const xunBase = mod(yearBranch - yearStem, 12);
  put('순공', xunBase + 10);
  put('순공', xunBase + 11);
  JIEKONG[yearStem % 5].forEach((b) => put('절공', b));
  putDef(STAR_BY_KEY.get('tianshang')!, ming - 7); // 천상(天傷): 노복궁
  put('천사', ming - 5); // 질액궁

  // 사화
  const birthSihwa = new Map(sihwaOf(yearStem).map((s) => [s.star, s.sihwa]));

  const changshengStart = CHANGSHENG_START[guk.number];
  const palaces: Palace[] = Array.from({ length: 12 }, (_, b) => {
    const stem = palaceStem(b);
    const nameIdx = mod(ming - b, 12);
    const step = mod((b - ming) * dir, 12);
    const start = guk.number + 10 * step;
    const stars: PlacedStar[] = (placed.get(b) ?? []).map((def) => ({ ...def, brightness: def.kind === 'minor' ? '' : brightnessOf(def.name, b), sihwa: def.kind === 'minor' ? null : (birthSihwa.get(def.name) ?? null) }));
    stars.sort((a, c) => kindOrder(a.kind) - kindOrder(c.kind));
    return {
      branch: b,
      branchHanja: BRANCHES_HANJA[b],
      branchKo: BRANCHES_KO[b],
      stem,
      ganzhi: STEMS_HANJA[stem] + BRANCHES_HANJA[b],
      ganzhiKo: STEMS_KO[stem] + BRANCHES_KO[b],
      name: PALACE_NAMES[nameIdx],
      isMing: b === ming,
      isShen: b === shen,
      daehan: { start, end: start + 9 },
      stars,
      changsheng: CHANGSHENG[mod((b - changshengStart) * dir, 12)],
      boshi: BOSHI[mod((b - lucun) * dir, 12)],
      suiqian: SUIQIAN[mod(b - yearBranch, 12)],
      jiangqian: JIANGQIAN[mod(b - TRIAD_KING[tg], 12)],
    };
  });

  const sihwa = sihwaOf(yearStem).map(({ star, sihwa }) => {
    const p = palaces.find((pl) => pl.stars.some((s) => s.name === star && s.kind !== 'minor'))!;
    return { star, sihwa, branch: p.branch, palace: p.name };
  });

  return {
    lunar,
    yearStem,
    yearBranch,
    yearGanzhi: STEMS_HANJA[yearStem] + BRANCHES_HANJA[yearBranch],
    hourBranch,
    mingBranch: ming,
    shenBranch: shen,
    shenPalaceName: palaces[shen].name,
    guk,
    forward,
    gender: birth.input.gender,
    palaces,
    sihwa,
  };
}

const kindOrder = (k: StarKind) => ({ main: 0, aux: 1, sal: 2, minor: 3 })[k];

// ---------------------------------------------------------------- 대한 · 유년 명반
export interface OverlayChart {
  kind: 'daehan' | 'yunyeon';
  label: string;
  mingBranch: number;
  /** 지지 인덱스별 궁 이름 */
  names: PalaceName[];
  sihwa: { star: string; sihwa: Sihwa; label: string; branch: number }[];
  range?: { start: number; end: number };
  year?: number;
}

function overlay(chart: JamidusuChart, mingBranch: number, stem: number, prefix: string) {
  const names = Array.from({ length: 12 }, (_, b) => PALACE_NAMES[mod(mingBranch - b, 12)]);
  const sihwa = sihwaOf(stem).map(({ star, sihwa }) => {
    const p = chart.palaces.find((pl) => pl.stars.some((s) => s.name === star && s.kind !== 'minor'))!;
    return { star, sihwa, label: prefix + sihwa, branch: p.branch };
  });
  return { names, sihwa };
}

/** 선택한 나이의 대한 명반 */
export function daehanChart(chart: JamidusuChart, age: number): OverlayChart {
  const sorted = [...chart.palaces].sort((a, b) => a.daehan.start - b.daehan.start);
  const p = [...sorted].reverse().find((pl) => pl.daehan.start <= age) ?? sorted[0];
  const o = overlay(chart, p.branch, p.stem, '대');
  return { kind: 'daehan', label: `${p.daehan.start}-${p.daehan.end}세 대한`, mingBranch: p.branch, ...o, range: p.daehan };
}

/** 해당 연도의 유년 명반 */
export function yunyeonChart(chart: JamidusuChart, year: number): OverlayChart {
  const idx = mod(year - 4, 60);
  const branch = idx % 12;
  const o = overlay(chart, branch, idx % 10, '년');
  return { kind: 'yunyeon', label: `${year}년 유년`, mingBranch: branch, ...o, year };
}

/** 화면 낭독기용 한 문장 요약 */
export function spokenSummary(chart: JamidusuChart, branch: number, names?: PalaceName[]) {
  const p = chart.palaces[branch];
  const name = names ? names[branch] : p.name;
  const main = p.stars.filter((s) => s.kind === 'main').map((s) => `${s.name}${s.brightness ? ' ' + s.brightness : ''}`);
  const parts = [`${name.replace('궁', '')}궁 ${p.ganzhiKo}`, `대한 ${p.daehan.start}-${p.daehan.end}세`, ...(main.length ? main : ['주성 없음'])];
  return `${parts.join(', ')}, 두 번 탭하면 상세 보기`;
}

export { STAR_BY_KEY, STAR_BY_NAME };

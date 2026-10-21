// 사주팔자 엔진 (기획서 4장). lunar-javascript로 기둥과 대운을 구하고, 파생 값은 여기서 계산합니다.
import { Solar } from 'lunar-javascript';
import {
  BRANCHES_HANJA,
  BRANCHES_KO,
  BRANCH_ELEMENT,
  ELEMENTS_KO,
  type Element,
  HIDDEN_STEMS,
  STEMS_HANJA,
  STEMS_KO,
  STEM_ELEMENT,
  branchIndex,
  controllerOf,
  generatorOf,
  mainHiddenStem,
  mod,
  stemIndex,
  stemYinYang,
} from './constants';
import {
  type DateTime,
  type NormalizedBirth,
  civilFromTermClockAt,
  clockStateFor,
  fromMinutes,
  meridianCorrection,
  dstCorrection,
  termClockFor,
  toMinutes,
} from './birth';
import { type City, cityById } from './cities';

export const CALCULATION_BASIS = 'KR-2026.10-6';

// ---------------------------------------------------------------- 십신 · 12운성
export const TEN_GODS = ['비견', '겁재', '식신', '상관', '편재', '정재', '편관', '정관', '편인', '정인'] as const;
export type TenGod = (typeof TEN_GODS)[number];
export const TEN_GOD_GROUPS = ['비겁', '식상', '재성', '관성', '인성'] as const;
export type TenGodGroup = (typeof TEN_GOD_GROUPS)[number];

/** 일간과 대상 천간의 십신 */
export function calcTenGod(dayStem: number, target: number): TenGod {
  const rel = mod(STEM_ELEMENT[target] - STEM_ELEMENT[dayStem], 5);
  return TEN_GODS[rel * 2 + (stemYinYang(dayStem) === stemYinYang(target) ? 0 : 1)];
}
/** 오행만 바뀐 경우(합화)의 십신: 원래 음양을 유지 */
function tenGodByElement(dayStem: number, element: number, yinYang: number): TenGod {
  const rel = mod(element - STEM_ELEMENT[dayStem], 5);
  return TEN_GODS[rel * 2 + (stemYinYang(dayStem) === yinYang ? 0 : 1)];
}
export const tenGodGroup = (t: TenGod): TenGodGroup => TEN_GOD_GROUPS[Math.floor(TEN_GODS.indexOf(t) / 2)];

export const GROWTH_PHASES = ['장생', '목욕', '관대', '건록', '제왕', '쇠', '병', '사', '묘', '절', '태', '양'] as const;
/** 천간별 장생 지지 */
const START_JI = [11, 6, 2, 9, 2, 9, 5, 0, 8, 3];
export function get12Woonseong(stem: number, branch: number) {
  const s = START_JI[stem];
  return GROWTH_PHASES[stemYinYang(stem) === 0 ? mod(branch - s, 12) : mod(s - branch, 12)];
}

// ---------------------------------------------------------------- 결과 타입
export interface CharInfo {
  index: number;
  hanja: string;
  korean: string;
  element: Element;
}
const stemInfo = (i: number): CharInfo => ({ index: i, hanja: STEMS_HANJA[i], korean: STEMS_KO[i], element: STEM_ELEMENT[i] });
const branchInfo = (i: number): CharInfo => ({ index: i, hanja: BRANCHES_HANJA[i], korean: BRANCHES_KO[i], element: BRANCH_ELEMENT[i] });

export type PillarKey = 'hour' | 'day' | 'month' | 'year';
export const PILLAR_TITLES: Record<PillarKey, string> = { hour: '시주', day: '일주', month: '월주', year: '년주' };

export interface Pillar {
  key: PillarKey;
  title: string;
  stem: CharInfo;
  stemTenGod: TenGod | '일간';
  branch: CharInfo;
  branchTenGod: TenGod;
  hiddenStems: (CharInfo & { tenGod: TenGod })[];
  growthPhase: string;
}

export interface Fortune {
  ganzhi: string;
  stem: CharInfo;
  branch: CharInfo;
  stemTenGod: TenGod;
  branchTenGod: TenGod;
  growthPhase: string;
}
export interface BigFortune extends Fortune {
  index: number;
  startAge: number;
  startYear: number;
  endYear: number;
}
export interface YearFortune extends Fortune {
  year: number;
  age: number;
}
export interface MonthFortune extends Fortune {
  month: number;
}

export interface Combination {
  kind: '천간합' | '지지육합' | '지지육충';
  positions: [PillarKey, PillarKey];
  chars: string;
  element?: Element;
  text: string;
}

export interface Ratios {
  element: number[];
  tenGod: Record<TenGod, number>;
}

export type StrengthLabel = '극강' | '신강' | '중화' | '신약' | '극약';

export interface PillarSet {
  year: string;
  month: string;
}

export interface BoundaryTerm {
  name: string;
  clock: { hour: number; minute: number };
  before: PillarSet;
  after: PillarSet;
}

export interface SajuResult {
  basis: string;
  incompleteBirthTime: boolean;
  /** 시·일·월·년 순 (시간 모름이면 일·월·년) */
  pillars: Pillar[];
  uncertainPillars: PillarKey[];
  boundaryTerm: BoundaryTerm | null;
  dayMaster: CharInfo;
  // 아래는 출생시간을 알 때만 채워집니다.
  elementRatios: number[] | null;
  tenGodRatios: Record<TenGod, number> | null;
  transformedRatios: Ratios | null;
  strengthScore: number | null;
  strengthText: StrengthLabel | null;
  /** help·burden: 강약 방향으로 나눈 도움 쪽·부담 쪽 기운 (v1.1부터) */
  yongsin: { yong: Element; hee: Element; gi: Element; gu: Element; help?: Element[]; burden?: Element[] } | null;
  geukgukLabel: string | null;
  combinations: Combination[];
  bigFortunes: BigFortune[];
  bigFortuneForward: boolean | null;
  currentBigFortuneIndex: number;
  yearFortunes: YearFortune[];
  monthFortunes: MonthFortune[];
  daewunYearFortunes: YearFortune[][];
}

// ---------------------------------------------------------------- lunar-javascript 도우미
const solarOf = (t: DateTime) => Solar.fromYmdHms(t.year, t.month, t.day, t.hour, t.minute, 0);
function eightCharOf(t: DateTime) {
  const ec = solarOf(t).getLunar().getEightChar();
  ec.setSect(2);
  return ec;
}
const parseGz = (gz: string): [number, number] => [stemIndex(gz[0]), branchIndex(gz[1])];
const yearMonthOf = (t: DateTime): PillarSet => {
  const ec = eightCharOf(t);
  return { year: ec.getYear(), month: ec.getMonth() };
};

// ---------------------------------------------------------------- 기둥
function makePillar(key: PillarKey, gz: string, dayStem: number): Pillar {
  const [s, b] = parseGz(gz);
  return {
    key,
    title: PILLAR_TITLES[key],
    stem: stemInfo(s),
    stemTenGod: key === 'day' ? '일간' : calcTenGod(dayStem, s),
    branch: branchInfo(b),
    branchTenGod: calcTenGod(dayStem, mainHiddenStem(b)),
    hiddenStems: HIDDEN_STEMS[b].map((h) => ({ ...stemInfo(h), tenGod: calcTenGod(dayStem, h) })),
    growthPhase: get12Woonseong(dayStem, b),
  };
}

function makeFortune(gz: string, dayStem: number): Fortune {
  const [s, b] = parseGz(gz);
  return {
    ganzhi: gz,
    stem: stemInfo(s),
    branch: branchInfo(b),
    stemTenGod: calcTenGod(dayStem, s),
    branchTenGod: calcTenGod(dayStem, mainHiddenStem(b)),
    growthPhase: get12Woonseong(dayStem, b),
  };
}

// ---------------------------------------------------------------- 비율 · 합충
/** 오행 가중치: 년간 10, 년지 10, 월간 10, 월지 30, 일간 10, 일지 20, 시간 10, 시지 10 */
export const STEM_WEIGHT: Record<PillarKey, number> = { hour: 10, day: 10, month: 10, year: 10 };
export const BRANCH_WEIGHT: Record<PillarKey, number> = { hour: 10, day: 20, month: 30, year: 10 };

interface Slot {
  pillar: PillarKey;
  part: 'stem' | 'branch';
  element: number;
  yinYang: number;
  weight: number;
  isDayMaster: boolean;
}

/** 지지 지장간의 몫: 셋이면 여기 10 · 중기 30 · 본기 60, 둘이면 여기 30 · 본기 70 (%) */
const HIDDEN_SHARE: Record<number, number[]> = { 1: [1], 2: [0.3, 0.7], 3: [0.1, 0.3, 0.6] };

function slotsOf(pillars: Pillar[]): Slot[] {
  const out: Slot[] = [];
  for (const p of pillars) {
    out.push({ pillar: p.key, part: 'stem', element: p.stem.element, yinYang: stemYinYang(p.stem.index), weight: STEM_WEIGHT[p.key], isDayMaster: p.key === 'day' });
    // 지지는 지장간 비율대로 나눠 셉니다(통근 반영). 예: 未의 丁·乙·己
    const hidden = HIDDEN_STEMS[p.branch.index];
    const share = HIDDEN_SHARE[hidden.length];
    hidden.forEach((h, i) =>
      out.push({ pillar: p.key, part: 'branch', element: STEM_ELEMENT[h], yinYang: stemYinYang(h), weight: BRANCH_WEIGHT[p.key] * share[i], isDayMaster: false }),
    );
  }
  return out;
}

export const STEM_HAP: Record<string, Element> = { '0-5': 2, '1-6': 3, '2-7': 4, '3-8': 0, '4-9': 1 };
export const BRANCH_HAP: Record<string, Element> = { '0-1': 2, '2-11': 0, '3-10': 1, '4-9': 3, '5-8': 4, '6-7': 1 };
export const BRANCH_CHUNG = new Set(['0-6', '1-7', '2-8', '3-9', '4-10', '5-11']);
export const pairKey = (a: number, b: number) => (a < b ? `${a}-${b}` : `${b}-${a}`);

/** 인접한 기둥끼리만: 시-일, 일-월, 월-년 */
export function findCombinations(pillars: Pillar[]): Combination[] {
  const byKey = Object.fromEntries(pillars.map((p) => [p.key, p])) as Record<PillarKey, Pillar>;
  const pairs: [PillarKey, PillarKey][] = [
    ['hour', 'day'],
    ['day', 'month'],
    ['month', 'year'],
  ];
  const out: Combination[] = [];
  for (const [a, b] of pairs) {
    const pa = byKey[a];
    const pb = byKey[b];
    if (!pa || !pb) continue;
    const label = `${PILLAR_TITLES[a][0]}·${PILLAR_TITLES[b][0]}`;
    const sh = STEM_HAP[pairKey(pa.stem.index, pb.stem.index)];
    if (sh !== undefined) {
      const chars = pa.stem.hanja + pb.stem.hanja;
      out.push({ kind: '천간합', positions: [a, b], chars, element: sh, text: `${label} 천간합 ${chars} → ${ELEMENTS_KO[sh]}` });
    }
    const bh = BRANCH_HAP[pairKey(pa.branch.index, pb.branch.index)];
    if (bh !== undefined) {
      const chars = pa.branch.hanja + pb.branch.hanja;
      out.push({ kind: '지지육합', positions: [a, b], chars, element: bh, text: `${label} 지지육합 ${chars} → ${ELEMENTS_KO[bh]}` });
    }
    if (BRANCH_CHUNG.has(pairKey(pa.branch.index, pb.branch.index))) {
      const chars = pa.branch.hanja + pb.branch.hanja;
      out.push({ kind: '지지육충', positions: [a, b], chars, text: `${label} 지지충 ${chars}` });
    }
  }
  return out;
}

/**
 * 합충 반영: 합이 된 두 글자는 합화 오행으로 바꾸고(일간은 바꾸지 않음),
 * 충을 맞은 두 지지는 힘을 절반으로 봅니다.
 */
function applyTransform(slots: Slot[], combos: Combination[]): Slot[] {
  const next = slots.map((s) => ({ ...s }));
  const find = (pillar: PillarKey, part: 'stem' | 'branch') => next.filter((s) => s.pillar === pillar && s.part === part);
  for (const c of combos) {
    const part = c.kind === '천간합' ? 'stem' : 'branch';
    const both = [...find(c.positions[0], part), ...find(c.positions[1], part)];
    for (const x of both) {
      if (c.kind === '지지육충') x.weight /= 2;
      else if (c.element !== undefined && !x.isDayMaster) x.element = c.element;
    }
  }
  return next;
}

const round1 = (n: number) => Math.round(n * 10) / 10;

function ratiosOf(slots: Slot[], dayStem: number): Ratios {
  const el = [0, 0, 0, 0, 0];
  let elTotal = 0;
  for (const s of slots) {
    el[s.element] += s.weight;
    elTotal += s.weight;
  }
  const tg = Object.fromEntries(TEN_GODS.map((t) => [t, 0])) as Record<TenGod, number>;
  let tgTotal = 0;
  for (const s of slots) {
    if (s.isDayMaster) continue; // 일간은 '나' 자신이므로 십신 비율에서 뺍니다.
    tg[tenGodByElement(dayStem, s.element, s.yinYang)] += s.weight;
    tgTotal += s.weight;
  }
  return {
    element: el.map((v) => round1((v / elTotal) * 100)),
    tenGod: Object.fromEntries(TEN_GODS.map((t) => [t, round1((tg[t] / tgTotal) * 100)])) as Record<TenGod, number>,
  };
}

// ---------------------------------------------------------------- 강약 · 용신 · 격국
/**
 * 강약 단계. 지장간을 나눠 세면서 점수 폭이 넓어져(무작위 4,000명: 5% −78, 중앙 −20, 95% +34)
 * 극강·극약이 드문 경우(각 약 5% 안팎)만 가리키도록 경계를 정했습니다.
 */
export function strengthLabelOf(score: number): StrengthLabel {
  if (score >= 40) return '극강';
  if (score >= 12) return '신강';
  if (score > -22) return '중화';
  if (score > -80) return '신약';
  return '극약';
}

/** 강약 점수 = (비겁 + 인성 비율) − (식상 + 재성 + 관성 비율). 일간 제외, −100 ~ 100 */
function strengthScoreOf(tg: Record<TenGod, number>) {
  const support = tg['비견'] + tg['겁재'] + tg['편인'] + tg['정인'];
  const drain = 100 - support;
  return round1(support - drain);
}

/**
 * 용신·희신·기신·구신 (억부).
 * 먼저 강약 방향으로 다섯 기운을 '도움 쪽'과 '부담 쪽'으로 나누고, 그 안에서 고릅니다.
 * - 강하면 도움 쪽 = 식상·재성·관성, 부담 쪽 = 비겁·인성
 * - 약하면 도움 쪽 = 비겁·인성,     부담 쪽 = 식상·재성·관성
 * 용신: 도움 쪽에서 가장 적은 기운. 희신: 도움 쪽에서 용신을 생하는 기운(없으면 용신이 생하는 기운, 그것도 없으면 남은 도움 기운).
 * 기신: 부담 쪽에서 용신을 극하는 기운(없으면 부담 쪽에서 가장 많은 기운). 구신: 부담 쪽에서 기신을 생하는 기운(없으면 남은 부담 기운).
 */
export function yongsinOf(dayStem: number, score: number, elementRatios: number[]) {
  const me = STEM_ELEMENT[dayStem];
  const output = mod(me + 1, 5);
  const wealth = mod(me + 2, 5);
  const officer = mod(me + 3, 5);
  const resource = mod(me + 4, 5);
  const help = score >= 0 ? [output, wealth, officer] : [me, resource];
  const burden = score >= 0 ? [me, resource] : [output, wealth, officer];
  let yong = help[0];
  for (const c of help) if (elementRatios[c] < elementRatios[yong]) yong = c;
  const hee =
    [generatorOf(yong), mod(yong + 1, 5)].find((e) => e !== yong && help.includes(e)) ?? help.find((e) => e !== yong) ?? generatorOf(yong);
  let gi = burden.includes(controllerOf(yong)) ? controllerOf(yong) : burden.reduce((a, b) => (elementRatios[b] > elementRatios[a] ? b : a));
  const gu = burden.includes(generatorOf(gi)) && generatorOf(gi) !== gi ? generatorOf(gi) : (burden.find((e) => e !== gi) ?? controllerOf(hee));
  return { yong: yong as Element, hee: hee as Element, gi: gi as Element, gu: gu as Element, help: help as Element[], burden: burden as Element[] };
}

const GEUKGUK: Record<TenGod, string> = {
  비견: '건록격',
  겁재: '양인격',
  식신: '식신격',
  상관: '상관격',
  편재: '편재격',
  정재: '정재격',
  편관: '칠살격',
  정관: '정관격',
  편인: '편인격',
  정인: '정인격',
};

/** 월지 십신으로 정한 격국 이름. 겁재 월지는 양간이면 양인격, 음간이면 월겁격입니다. */
export function geukName(monthTenGod: TenGod, dayStem: number) {
  if (monthTenGod === '겁재' && dayStem % 2 === 1) return '월겁격';
  return GEUKGUK[monthTenGod];
}

// ---------------------------------------------------------------- 운
const yearGanzhi = (year: number) => STEMS_HANJA[mod(year - 4, 10)] + BRANCHES_HANJA[mod(year - 4, 12)];

/** 그해 절기월 1~12월(인월부터)의 간지 */
function monthGanzhis(year: number) {
  const ys = mod(year - 4, 10);
  const first = ((ys % 5) * 2 + 2) % 10;
  return Array.from({ length: 12 }, (_, i) => STEMS_HANJA[(first + i) % 10] + BRANCHES_HANJA[(2 + i) % 12]);
}

/** 그 해의 월운 12개 (인월=1 … 축월=12, 절기 기준). 올해가 아닌 해의 월별 운세에 씁니다. */
export function monthFortunesOf(year: number, dayStem: number): MonthFortune[] {
  return monthGanzhis(year).map((gz, i) => ({ ...makeFortune(gz, dayStem), month: i + 1 }));
}

function fortunesOf(ec: any, genderCode: number, birthYear: number, dayStem: number, now: Date) {
  const yun = ec.getYun(genderCode, 2);
  const startAge = Math.round(yun.getStartYear() + yun.getStartMonth() / 12 + yun.getStartDay() / 365);
  const daYun = yun.getDaYun(9).slice(1, 9);
  // 대운수(반올림한 시작 나이)와 시작 해를 맞춥니다: 시작 해 = 출생 해 + 대운수 (연 나이 기준).
  const big: BigFortune[] = daYun.map((d: any, i: number) => ({
    ...makeFortune(d.getGanZhi(), dayStem),
    index: i,
    startAge: startAge + i * 10,
    startYear: birthYear + startAge + i * 10,
    endYear: birthYear + startAge + i * 10 + 9,
  }));
  const perBig: YearFortune[][] = big.map((b) =>
    Array.from({ length: 10 }, (_, k) => {
      const year = b.startYear + k;
      return { ...makeFortune(yearGanzhi(year), dayStem), year, age: year - birthYear };
    }),
  );
  const thisYear = now.getFullYear();
  const current = big.findIndex((b) => thisYear >= b.startYear && thisYear <= b.endYear);
  return { big, perBig, forward: yun.isForward() as boolean, current, thisYear };
}

// ---------------------------------------------------------------- 절입일 (출생시간 모름)
export const JIE_KO: Record<string, string> = {
  立春: '입춘', 惊蛰: '경칩', 清明: '청명', 立夏: '입하', 芒种: '망종', 小暑: '소서',
  立秋: '입추', 白露: '백로', 寒露: '한로', 立冬: '입동', 大雪: '대설', 小寒: '소한',
};

/** UTC+8 절입 순간 → 한국 시계 시각. termClock = clock + 자오선 + 서머타임 − 30 을 거꾸로 풉니다. */
export function civilFromTermClock(t8: DateTime): DateTime {
  let guess = fromMinutes(toMinutes(t8) + 60);
  for (let i = 0; i < 3; i++) {
    guess = fromMinutes(toMinutes(t8) - meridianCorrection(guess) - dstCorrection(guess, 'first') + 30);
  }
  return guess;
}

function boundaryTermOn(date: { year: number; month: number; day: number }, city: City): BoundaryTerm | null {
  const lunar = Solar.fromYmdHms(date.year, date.month, date.day, 0, 0, 0).getLunar();
  for (const jq of [lunar.getPrevJie(), lunar.getNextJie()]) {
    const s = jq.getSolar();
    const t8: DateTime = { year: s.getYear(), month: s.getMonth(), day: s.getDay(), hour: s.getHour(), minute: s.getMinute() };
    const civil = city.tz ? civilFromTermClockAt(city, t8) : civilFromTermClock(t8);
    if (civil.year !== date.year || civil.month !== date.month || civil.day !== date.day) continue;
    const m = toMinutes(t8);
    return {
      name: JIE_KO[jq.getName()] ?? jq.getName(),
      clock: { hour: civil.hour, minute: civil.minute },
      before: yearMonthOf(fromMinutes(m - 60)),
      after: yearMonthOf(fromMinutes(m + 60)),
    };
  }
  return null;
}

/** 그날 하루를 30분 간격으로 훑은 절기 비교 시각들 (출생시간 모를 때 년·월주가 바뀌는지 보려고) */
function sampleTermClocks(date: { year: number; month: number; day: number }, city: City): DateTime[] {
  const out: DateTime[] = [];
  const minutes = [...Array.from({ length: 48 }, (_, i) => i * 30), 23 * 60 + 59];
  for (const mm of minutes) {
    const clock = { ...date, hour: Math.floor(mm / 60), minute: mm % 60 };
    const state = clockStateFor(city, clock);
    if (state === 'gap') continue;
    out.push(termClockFor(city, clock, 'first')!);
    if (state === 'fold') out.push(termClockFor(city, clock, 'second')!);
  }
  return out;
}

// ---------------------------------------------------------------- 진입점
export interface SajuOptions {
  now?: Date;
}

export function computeSaju(birth: NormalizedBirth, options: SajuOptions = {}): SajuResult {
  const now = options.now ?? new Date();
  const genderCode = birth.input.gender === 'M' ? 1 : 0;
  const empty = {
    elementRatios: null,
    tenGodRatios: null,
    transformedRatios: null,
    strengthScore: null,
    strengthText: null,
    yongsin: null,
    geukgukLabel: null,
    bigFortunes: [],
    bigFortuneForward: null,
    currentBigFortuneIndex: -1,
    yearFortunes: [],
    monthFortunes: [],
    daewunYearFortunes: [],
  };

  if (birth.timeUnknown) {
    const noon = { ...birth.solar, hour: 12, minute: 0 };
    const dayGz = eightCharOf(noon).getDay();
    const dayStem = stemIndex(dayGz[0]);
    const city = cityById(birth.input.cityId ?? 'seoul');
    const sets = sampleTermClocks(birth.solar, city).map((t) => yearMonthOf(t));
    const sameYear = sets.every((s) => s.year === sets[0].year);
    const sameMonth = sets.every((s) => s.month === sets[0].month);
    const uncertain: PillarKey[] = ['hour'];
    if (!sameMonth) uncertain.push('month');
    if (!sameYear) uncertain.push('year');
    const boundary = sameYear && sameMonth ? null : boundaryTermOn(birth.solar, city);
    const ref = boundary ? boundary.after : sets[0];
    const pillars = [makePillar('day', dayGz, dayStem), makePillar('month', ref.month, dayStem), makePillar('year', ref.year, dayStem)];
    return {
      basis: CALCULATION_BASIS,
      incompleteBirthTime: true,
      pillars,
      uncertainPillars: uncertain,
      boundaryTerm: boundary,
      dayMaster: stemInfo(dayStem),
      combinations: findCombinations(pillars),
      ...empty,
    };
  }

  // 보정 시각이 23시대면 다음 날 0시로 넘겨 일주를 바꿉니다(자시 일자 전환).
  let pillarClock = birth.corrected!;
  // 야자시(same)를 고르면 23시대도 당일 일주로 둡니다.
  if (pillarClock.hour === 23 && birth.input.jasi !== 'same') pillarClock = fromMinutes(toMinutes({ ...pillarClock, minute: 0 }) + 60 + pillarClock.minute);

  const ec = eightCharOf(pillarClock);
  const termEc = eightCharOf(birth.termClock!);
  const useTerm = termEc.getYear() !== ec.getYear() || termEc.getMonth() !== ec.getMonth();
  // 대운 시작 나이는 출생 순간과 절입 순간(UTC+8)의 간격으로 셉니다. 해외 출생은 현지 태양시와 UTC+8이
  // 반나절 넘게 어긋날 수 있어 언제나 UTC+8 실제 순간(termClock)을 씁니다. 한국 도시는 예전 그대로입니다.
  const yunSource = useTerm || birth.utcOffset !== undefined ? termEc : ec;

  const dayStem = stemIndex(ec.getDay()[0]);
  const pillars: Pillar[] = [
    makePillar('hour', ec.getTime(), dayStem),
    makePillar('day', ec.getDay(), dayStem),
    makePillar('month', (useTerm ? termEc : ec).getMonth(), dayStem),
    makePillar('year', (useTerm ? termEc : ec).getYear(), dayStem),
  ];

  const slots = slotsOf(pillars);
  const base = ratiosOf(slots, dayStem);
  const combinations = findCombinations(pillars);
  const transformed = ratiosOf(applyTransform(slots, combinations), dayStem);
  const score = strengthScoreOf(base.tenGod);
  const strength = strengthLabelOf(score);
  const monthTenGod = pillars[2].branchTenGod;

  const f = fortunesOf(yunSource, genderCode, birth.solar.year, dayStem, now);
  const currentYears = f.current >= 0 ? f.perBig[f.current] : f.perBig[0];

  return {
    basis: CALCULATION_BASIS,
    incompleteBirthTime: false,
    pillars,
    uncertainPillars: [],
    boundaryTerm: null,
    dayMaster: stemInfo(dayStem),
    elementRatios: base.element,
    tenGodRatios: base.tenGod,
    transformedRatios: transformed,
    strengthScore: score,
    strengthText: strength,
    yongsin: yongsinOf(dayStem, score, base.element),
    geukgukLabel: strength === '극강' ? `${geukName(monthTenGod, dayStem)} (전왕격 후보)` : strength === '극약' ? `${geukName(monthTenGod, dayStem)} (종격 후보)` : geukName(monthTenGod, dayStem),
    combinations,
    bigFortunes: f.big,
    bigFortuneForward: f.forward,
    currentBigFortuneIndex: f.current,
    yearFortunes: currentYears,
    monthFortunes: monthGanzhis(f.thisYear).map((gz, i) => ({ ...makeFortune(gz, dayStem), month: i + 1 })),
    daewunYearFortunes: f.perBig,
  };
}

export { yearGanzhi };

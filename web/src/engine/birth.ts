// 출생 입력 → 양력 날짜 + 보정 시각 + 절기 비교 시각 (기획서 4.1, KoreanTimeRules)
import KoreanLunarCalendar from 'korean-lunar-calendar';
import { type City, cityById, cityOffsetMinutes } from './cities';

export type CalendarType = 'solar' | 'lunar' | 'lunarLeap';
export type FoldChoice = 'first' | 'second';

export interface BirthInput {
  name?: string;
  gender: 'M' | 'F';
  calendar: CalendarType;
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
  timeUnknown?: boolean;
  cityId?: string;
  /** 지역 경도 보정 사용 여부 */
  useLongitude?: boolean;
  /** 서머타임이 끝나며 같은 시각이 두 번 있을 때: first = 서머타임 시각, second = 표준시 시각 */
  fold?: FoldChoice;
  /** 해외 도시: 현지 태양시(경도 기준)로 볼지. 기본 true, false면 현지 표준시 */
  solarTime?: boolean;
  /** 23시대(자시) 처리: next = 다음 날로 봄(기본, 사주·명반 공통), same = 당일로 봄(야자시) */
  jasi?: 'next' | 'same';
  /** 자미두수 윤달 처리: mid = 15일까지 이번 달·16일부터 다음 달(기본), same = 같은 달, next = 다음 달 */
  leapMode?: 'same' | 'mid' | 'next';
}

export interface DateTime {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

export interface NormalizedBirth {
  input: BirthInput;
  solar: { year: number; month: number; day: number };
  lunar: { year: number; month: number; day: number; leap: boolean };
  timeUnknown: boolean;
  /** 입력한 한국 시계 시각 */
  clock: DateTime | null;
  /** 사주 시주·일주 계산용 보정 시각 */
  corrected: DateTime | null;
  /** 년·월주 절입 비교용 시각(UTC+8 실제 순간) */
  termClock: DateTime | null;
  corrections: { meridian: number; dst: number; longitude: number };
  /** 입력 시각이 서머타임 겹침 구간인지 */
  inFold: boolean;
  /** 해외 도시: 출생 순간의 UTC 오프셋(분, 서머타임 포함) */
  utcOffset?: number;
}

export type BirthErrorCode = 'noDate' | 'noLunar' | 'noLeap' | 'range' | 'dstGap' | 'skipped1961' | 'tzGap';
export class BirthInputError extends Error {
  constructor(message: string, readonly code: BirthErrorCode = 'noDate') {
    super(message);
  }
}

// ---- 시각 계산 도우미 (시간대 없는 '벽시계' 분 단위) ----
export const toMinutes = (t: DateTime) => Date.UTC(t.year, t.month - 1, t.day, t.hour, t.minute) / 60000;
export const fromMinutes = (m: number): DateTime => {
  const d = new Date(m * 60000);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
    hour: d.getUTCHours(),
    minute: d.getUTCMinutes(),
  };
};
const at = (y: number, mo: number, d: number, h = 0, mi = 0) => toMinutes({ year: y, month: mo, day: d, hour: h, minute: mi });

// ---- 서머타임 (시작 포함 ~ 끝 제외, 한국 시계 기준) ----
interface DstPeriod {
  start: number;
  end: number;
}
const DST_PERIODS: DstPeriod[] = [
  { start: at(1948, 6, 1), end: at(1948, 9, 13) },
  { start: at(1949, 4, 3), end: at(1949, 9, 11) },
  { start: at(1950, 4, 1), end: at(1950, 9, 10) },
  { start: at(1951, 5, 6), end: at(1951, 9, 9) },
  { start: at(1955, 5, 5), end: at(1955, 9, 9) },
  { start: at(1956, 5, 20), end: at(1956, 9, 30) },
  { start: at(1957, 5, 5), end: at(1957, 9, 22) },
  { start: at(1958, 5, 4), end: at(1958, 9, 21) },
  { start: at(1959, 5, 3), end: at(1959, 9, 20) },
  { start: at(1960, 5, 1), end: at(1960, 9, 18) },
  { start: at(1987, 5, 10, 2), end: at(1987, 10, 11, 3) },
  { start: at(1988, 5, 8, 2), end: at(1988, 10, 9, 3) },
];

export type DstState = 'none' | 'dst' | 'gap' | 'fold';

export function dstState(clock: DateTime): DstState {
  const m = toMinutes(clock);
  for (const p of DST_PERIODS) {
    if (m < p.start || m >= p.end) continue;
    if (m < p.start + 60) return 'gap';
    if (m >= p.end - 60) return 'fold';
    return 'dst';
  }
  return 'none';
}

// ---- 표준 자오선: 1954-03-21 ~ 1961-08-09는 동경 127.5도 ----
const MERIDIAN_1275 = { start: at(1954, 3, 21), end: at(1961, 8, 10) };
const SKIPPED_1961 = { start: at(1961, 8, 10), end: at(1961, 8, 10, 0, 30) };

export function meridianCorrection(clock: DateTime) {
  const m = toMinutes(clock);
  return m >= MERIDIAN_1275.start && m < MERIDIAN_1275.end ? 0 : -30;
}

export function dstCorrection(clock: DateTime, fold: FoldChoice = 'first') {
  const s = dstState(clock);
  if (s === 'dst') return -60;
  if (s === 'fold') return fold === 'first' ? -60 : 0;
  return 0;
}

/** 입력 시각을 쓸 수 있는지. 없는 시각이면 이유 문구 */
export function invalidClockReason(clock: DateTime): string | null {
  return invalidClockCode(clock) === 'dstGap'
    ? '서머타임 시작으로 시계를 한 시간 앞당겨 존재하지 않는 시각이에요.'
    : invalidClockCode(clock) === 'skipped1961'
      ? '1961년 8월 10일 표준시 변경으로 존재하지 않는 시각이에요.'
      : null;
}
function invalidClockCode(clock: DateTime): BirthErrorCode | null {
  if (dstState(clock) === 'gap') return 'dstGap';
  const m = toMinutes(clock);
  if (m >= SKIPPED_1961.start && m < SKIPPED_1961.end) return 'skipped1961';
  return null;
}

// ---- 해외 시간대 (브라우저의 IANA 시간대 자료) ----
const dtfCache = new Map<string, Intl.DateTimeFormat>();
/** 그 UTC 순간(분)에 그 시간대의 UTC 오프셋(분) */
export function tzOffsetAt(tz: string, utcMin: number): number {
  let f = dtfCache.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });
    dtfCache.set(tz, f);
  }
  const v: Record<string, number> = {};
  for (const part of f.formatToParts(new Date(utcMin * 60000))) if (part.type !== 'literal') v[part.type] = Number(part.value);
  const local = Date.UTC(v.year, v.month - 1, v.day, v.hour % 24, v.minute, v.second) / 60000;
  return Math.round(local - utcMin);
}
/** 그 해의 표준시 오프셋(서머타임 뺀 값) */
export function standardOffset(tz: string, year: number): number {
  return Math.min(tzOffsetAt(tz, at(year, 1, 15)), tzOffsetAt(tz, at(year, 7, 15)));
}
/** 해외 벽시계 시각 → 그 시각이 가리킬 수 있는 UTC 순간들(분). 0개면 없는 시각, 2개면 겹치는 시각(이른 순) */
export function utcCandidates(tz: string, clock: DateTime): number[] {
  const local = toMinutes(clock);
  const offsets = new Set([tzOffsetAt(tz, local - 1440), tzOffsetAt(tz, local), tzOffsetAt(tz, local + 1440)]);
  return [...new Set([...offsets].map((o) => local - o).filter((u) => tzOffsetAt(tz, u) === local - u))].sort((a, b) => a - b);
}

/** 출생 도시 기준으로 그 시각이 정상인지, 없는 시각인지, 두 번 있는 시각인지 */
export function clockStateFor(city: City, clock: DateTime): 'ok' | 'gap' | 'fold' {
  if (!city.tz) return invalidClockCode(clock) ? 'gap' : dstState(clock) === 'fold' ? 'fold' : 'ok';
  const c = utcCandidates(city.tz, clock);
  return c.length === 0 ? 'gap' : c.length > 1 ? 'fold' : 'ok';
}

/** 출생 도시 기준 절기 비교 시각(UTC+8). 없는 시각이면 null */
export function termClockFor(city: City, clock: DateTime, fold: FoldChoice = 'first'): DateTime | null {
  if (!city.tz) return invalidClockCode(clock) ? null : termClockOf(clock, fold);
  const c = utcCandidates(city.tz, clock);
  if (!c.length) return null;
  return fromMinutes((fold === 'second' ? c[c.length - 1] : c[0]) + 480);
}

/** UTC+8 절기 순간 → 출생 도시의 벽시계 시각 (해외 도시만) */
export function civilFromTermClockAt(city: City, t8: DateTime): DateTime {
  const utc = toMinutes(t8) - 480;
  return fromMinutes(utc + tzOffsetAt(city.tz!, utc));
}

/** 절기 비교 시각 = 출생 시각 + 표준자오선 보정 + 서머타임 보정 − 30분 */
export function termClockOf(clock: DateTime, fold: FoldChoice = 'first'): DateTime {
  return fromMinutes(toMinutes(clock) + meridianCorrection(clock) + dstCorrection(clock, fold) - 30);
}

const MIN_SOLAR = at(1900, 1, 1);
const MAX_SOLAR = at(2050, 12, 31);

export function toSolarDate(input: BirthInput) {
  const cal = new KoreanLunarCalendar();
  if (input.calendar === 'solar') {
    if (!cal.setSolarDate(input.year, input.month, input.day)) throw new BirthInputError('없는 날짜예요.', 'noDate');
    const l = cal.getLunarCalendar();
    return {
      solar: { year: input.year, month: input.month, day: input.day },
      lunar: { year: l.year, month: l.month, day: l.day, leap: !!l.intercalation },
    };
  }
  const leap = input.calendar === 'lunarLeap';
  if (!cal.setLunarDate(input.year, input.month, input.day, leap)) {
    throw new BirthInputError(leap ? '그해에는 해당 윤달이 없거나 없는 날짜예요.' : '없는 음력 날짜예요.', leap ? 'noLeap' : 'noLunar');
  }
  const s = cal.getSolarCalendar();
  return {
    solar: { year: s.year, month: s.month, day: s.day },
    lunar: { year: input.year, month: input.month, day: input.day, leap },
  };
}

export function normalizeBirth(input: BirthInput): NormalizedBirth {
  const { solar, lunar } = toSolarDate(input);
  const dayMin = at(solar.year, solar.month, solar.day);
  if (dayMin < MIN_SOLAR || dayMin > MAX_SOLAR) throw new BirthInputError('1900년 1월 1일부터 2050년 12월 31일까지 입력할 수 있어요.', 'range');

  const base = { input, solar, lunar, corrections: { meridian: 0, dst: 0, longitude: 0 } };
  if (input.timeUnknown || input.hour === undefined) {
    return { ...base, timeUnknown: true, clock: null, corrected: null, termClock: null, inFold: false };
  }

  const clock: DateTime = { ...solar, hour: input.hour, minute: input.minute ?? 0 };
  const fold = input.fold ?? 'first';
  const city = cityById(input.cityId ?? 'seoul');

  // 해외 도시: 그 시각의 UTC 순간을 구해 절기는 UTC+8로, 시주·일주는 현지 태양시(또는 표준시)로 봅니다.
  if (city.tz) {
    const cands = utcCandidates(city.tz, clock);
    if (!cands.length) throw new BirthInputError('서머타임 시작으로 시계를 앞당겨 그 지역에는 없는 시각이에요.', 'tzGap');
    const utc = fold === 'second' ? cands[cands.length - 1] : cands[0];
    const offset = toMinutes(clock) - utc;
    const std = standardOffset(city.tz, clock.year);
    const longitude = input.solarTime === false ? 0 : Math.round(city.longitude * 4) - std;
    return {
      ...base,
      timeUnknown: false,
      clock,
      corrected: fromMinutes(utc + std + longitude),
      termClock: fromMinutes(utc + 480),
      corrections: { meridian: 0, dst: std - offset, longitude },
      inFold: cands.length > 1,
      utcOffset: offset,
    };
  }

  const code = invalidClockCode(clock);
  if (code) throw new BirthInputError(invalidClockReason(clock)!, code);

  const meridian = meridianCorrection(clock);
  const dst = dstCorrection(clock, fold);
  const longitude = input.useLongitude ? cityOffsetMinutes(cityById(input.cityId ?? 'seoul')) + 30 : 0;
  const corrected = fromMinutes(toMinutes(clock) + meridian + dst + longitude);

  return {
    ...base,
    timeUnknown: false,
    clock,
    corrected,
    termClock: termClockOf(clock, fold),
    corrections: { meridian, dst, longitude },
    inFold: dstState(clock) === 'fold',
  };
}

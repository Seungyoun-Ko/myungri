// 출생 입력 → 양력 날짜 + 보정 시각 + 절기 비교 시각 (기획서 4.1, KoreanTimeRules)
import KoreanLunarCalendar from 'korean-lunar-calendar';
import { cityById, cityOffsetMinutes } from './cities';

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
}

export class BirthInputError extends Error {}

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
  if (dstState(clock) === 'gap') return '서머타임 시작으로 시계를 한 시간 앞당겨 존재하지 않는 시각이에요.';
  const m = toMinutes(clock);
  if (m >= SKIPPED_1961.start && m < SKIPPED_1961.end) return '1961년 8월 10일 표준시 변경으로 존재하지 않는 시각이에요.';
  return null;
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
    if (!cal.setSolarDate(input.year, input.month, input.day)) throw new BirthInputError('없는 날짜예요.');
    const l = cal.getLunarCalendar();
    return {
      solar: { year: input.year, month: input.month, day: input.day },
      lunar: { year: l.year, month: l.month, day: l.day, leap: !!l.intercalation },
    };
  }
  const leap = input.calendar === 'lunarLeap';
  if (!cal.setLunarDate(input.year, input.month, input.day, leap)) {
    throw new BirthInputError(leap ? '그해에는 해당 윤달이 없거나 없는 날짜예요.' : '없는 음력 날짜예요.');
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
  if (dayMin < MIN_SOLAR || dayMin > MAX_SOLAR) throw new BirthInputError('1900년 1월 1일부터 2050년 12월 31일까지 입력할 수 있어요.');

  const base = { input, solar, lunar, corrections: { meridian: 0, dst: 0, longitude: 0 } };
  if (input.timeUnknown || input.hour === undefined) {
    return { ...base, timeUnknown: true, clock: null, corrected: null, termClock: null, inFold: false };
  }

  const clock: DateTime = { ...solar, hour: input.hour, minute: input.minute ?? 0 };
  const reason = invalidClockReason(clock);
  if (reason) throw new BirthInputError(reason);

  const fold = input.fold ?? 'first';
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

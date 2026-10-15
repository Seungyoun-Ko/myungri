// 만세력 달력 데이터 (기획서 2.6): 일진, 한국 음력, 절기와 절입 시각(한국 시각)
import { Solar } from 'lunar-javascript';
import KoreanLunarCalendar from 'korean-lunar-calendar';
import type { DateTime } from './birth';
import { termClockOf } from './birth';
import { civilFromTermClock } from './saju';

const TERM_KO: Record<string, string> = {
  小寒: '소한', 大寒: '대한', 立春: '입춘', 雨水: '우수', 惊蛰: '경칩', 春分: '춘분',
  清明: '청명', 谷雨: '곡우', 立夏: '입하', 小满: '소만', 芒种: '망종', 夏至: '하지',
  小暑: '소서', 大暑: '대서', 立秋: '입추', 处暑: '처서', 白露: '백로', 秋分: '추분',
  寒露: '한로', 霜降: '상강', 立冬: '입동', 小雪: '소설', 大雪: '대설', 冬至: '동지',
  DONG_ZHI: '동지', XIAO_HAN: '소한', DA_HAN: '대한', LI_CHUN: '입춘', YU_SHUI: '우수', JING_ZHE: '경칩', DA_XUE: '대설',
};

export interface TermMark {
  name: string;
  hour: number;
  minute: number;
}

export interface CalendarDay {
  year: number;
  month: number;
  day: number;
  dow: number;
  dayGanzhi: string;
  lunar: { month: number; day: number; leap: boolean };
  terms: TermMark[];
}

/** 그달의 절기(한국 시각) */
export function termsOfMonth(year: number, month: number): (TermMark & { day: number })[] {
  const seen = new Map<string, TermMark & { day: number }>();
  for (const d of [1, 15, 28]) {
    const table = Solar.fromYmdHms(year, month, d, 12, 0, 0).getLunar().getJieQiTable();
    for (const [key, s] of Object.entries<any>(table)) {
      const t8: DateTime = { year: s.getYear(), month: s.getMonth(), day: s.getDay(), hour: s.getHour(), minute: s.getMinute() };
      const civil = civilFromTermClock(t8);
      if (civil.year !== year || civil.month !== month) continue;
      const name = TERM_KO[key] ?? key;
      seen.set(`${name}-${civil.day}`, { name, day: civil.day, hour: civil.hour, minute: civil.minute });
    }
  }
  return [...seen.values()].sort((a, b) => a.day - b.day);
}

export function monthDays(year: number, month: number): CalendarDay[] {
  const terms = termsOfMonth(year, month);
  const last = new Date(year, month, 0).getDate();
  const cal = new KoreanLunarCalendar();
  return Array.from({ length: last }, (_, i) => {
    const day = i + 1;
    cal.setSolarDate(year, month, day);
    const l = cal.getLunarCalendar();
    return {
      year,
      month,
      day,
      dow: new Date(year, month - 1, day).getDay(),
      dayGanzhi: Solar.fromYmdHms(year, month, day, 12, 0, 0).getLunar().getDayInGanZhi(),
      lunar: { month: l.month, day: l.day, leap: !!l.intercalation },
      terms: terms.filter((t) => t.day === day).map(({ name, hour, minute }) => ({ name, hour, minute })),
    };
  });
}

/** 그날 한국 시각 기준 년·월 간지 (시각을 주면 그 시각, 없으면 정오) */
export function dayPillars(year: number, month: number, day: number, hour = 12, minute = 0) {
  const tc = termClockOf({ year, month, day, hour, minute });
  const ec = Solar.fromYmdHms(tc.year, tc.month, tc.day, tc.hour, tc.minute, 0).getLunar().getEightChar();
  return { year: ec.getYear() as string, month: ec.getMonth() as string, day: Solar.fromYmdHms(year, month, day, 12, 0, 0).getLunar().getDayInGanZhi() as string };
}

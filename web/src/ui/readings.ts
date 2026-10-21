// 풀이 함수 묶음. 언어에 맞는 묶음 하나만 내려받도록 heavy.ts가 시작할 때 채웁니다.
import type { SajuResult } from '../engine/saju';
import type { JamidusuChart, OverlayChart } from '../engine/jamidusu';
import type { ReadingSection, YearReadingView } from '../engine/reading';
import type { LifePoint, PeriodReadingView } from '../engine/reading/flow';

export interface ReadingFns {
  saju: (r: SajuResult, gender: 'M' | 'F') => ReadingSection[];
  year: (r: SajuResult, year: number) => YearReadingView | null;
  big: (r: SajuResult, index: number) => PeriodReadingView | null;
  month: (r: SajuResult, month: number) => PeriodReadingView | null;
  life: (r: SajuResult) => LifePoint[];
  jami: (chart: JamidusuChart, overlay?: OverlayChart) => ReadingSection[];
  combined: (r: SajuResult, chart: JamidusuChart, now?: Date) => ReadingSection[];
  disclaimer: string;
}

export let R: ReadingFns;
export const setReadings = (fns: ReadingFns) => (R = fns);

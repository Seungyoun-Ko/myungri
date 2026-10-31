// 풀이 함수 묶음. 언어에 맞는 묶음 하나만 내려받도록 heavy.ts가 시작할 때 채웁니다.
import type { SajuResult } from '../engine/saju';
import type { JamidusuChart, OverlayChart } from '../engine/jamidusu';
import type { ReadingSection, YearReadingView } from '../engine/reading';
import type { LifePoint, PeriodReadingView } from '../engine/reading/flow';
import type { MatchPairReading } from '../engine/reading/types';

export interface ReadingFns {
  saju: (r: SajuResult, gender: 'M' | 'F', opts?: { southern?: boolean }) => ReadingSection[];
  year: (r: SajuResult, year: number) => YearReadingView | null;
  big: (r: SajuResult, index: number) => PeriodReadingView | null;
  month: (r: SajuResult, month: number) => PeriodReadingView | null;
  life: (r: SajuResult) => LifePoint[];
  jami: (chart: JamidusuChart, overlay?: OverlayChart) => ReadingSection[];
  combined: (r: SajuResult, chart: JamidusuChart, now?: Date) => ReadingSection[];
  disclaimer: string;
  /** 오늘의 나 한 줄 */
  today: (r: SajuResult, date?: Date) => { ganzhi: string; favor: 'good' | 'normal' | 'caution'; text: string } | null;
  /** 궁합: 일간 쌍 풀이와 일지 관계 문장 */
  match: { pairs: Record<string, MatchPairReading>; branch: { hap: string; chung: string; same: string } };
}

export let R: ReadingFns;
export const setReadings = (fns: ReadingFns) => (R = fns);

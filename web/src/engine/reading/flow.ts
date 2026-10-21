// 운의 흐름: 10년 운(대운) 풀이, 이번 달 풀이, 인생 흐름 그래프.
// 본문은 쉬운 말, 용어는 basis에만.
import { BRANCHES_HANJA, STEMS_HANJA } from '../constants';
import type { Element } from '../constants';
import type { Fortune, SajuResult } from '../saju';
import type { FavorKey, TenGodName } from './types';
import { BIG, BIG_FAVOR } from './big';
import { MONTH_DETAIL } from './month-detail';
import { MONTH } from './fortune';

const EL_TERM = ['목', '화', '토', '금', '수'];

import { favorOfScore, fortuneScore } from './shared';
export { favorOfScore, fortuneScore };

const gzKo = (f: Fortune) => `${f.stem.korean}${f.branch.korean}`;
const gzHanja = (f: Fortune) => `${STEMS_HANJA[f.stem.index]}${BRANCHES_HANJA[f.branch.index]}`;
const yongBasis = (r: SajuResult, favor: FavorKey) =>
  `용신 ${EL_TERM[r.yongsin!.yong]} · 희신 ${EL_TERM[r.yongsin!.hee]} · 기신 ${EL_TERM[r.yongsin!.gi]} → ${favor === 'good' ? '도움' : favor === 'caution' ? '부담' : '보통'}`;

export interface PeriodReadingView {
  /** 맨 위 작은 머리말 (예: 33~42세 · 2022~2031년) */
  label: string;
  favor: FavorKey;
  title: string;
  intro: string;
  overview: string[];
  fields: { label: string; text: string }[];
  tips: string[];
  basis: string[];
}

/** 10년 운 풀이 */
export function bigReading(r: SajuResult, index: number): PeriodReadingView | null {
  const b = r.bigFortunes[index];
  if (!b || !r.yongsin) return null;
  const favor = favorOfScore(fortuneScore(r, b));
  const stemTg = b.stemTenGod as TenGodName;
  const branchTg = b.branchTenGod as TenGodName;
  const main = BIG[stemTg];
  return {
    label: `${b.startAge}~${b.startAge + 9}세 · ${b.startYear}~${b.endYear}년 · ${gzKo(b)}`,
    favor,
    title: main.title,
    intro: BIG_FAVOR[favor][index % 2],
    overview: [main.overview, ...(branchTg !== stemTg ? [BIG[branchTg].base] : [])],
    fields: [
      { label: '일·직장', text: main.work },
      { label: '돈', text: main.money },
      { label: '연애·관계', text: main.love },
      { label: '건강', text: main.health },
      { label: '사람', text: main.relations },
    ],
    tips: [...main.tips],
    basis: [`대운 ${b.startAge}세: ${gzKo(b)}(${gzHanja(b)})`, `천간 ${stemTg} · 지지 ${branchTg} · 12운성 ${b.growthPhase}`, yongBasis(r, favor)],
  };
}

/** 이번 해의 그 달 풀이 (month: 인월=1 … 축월=12) */
export function monthReading(r: SajuResult, month: number): PeriodReadingView | null {
  const m = r.monthFortunes[month - 1];
  if (!m || !r.yongsin) return null;
  const favor = favorOfScore(fortuneScore(r, m));
  const tg = m.stemTenGod as TenGodName;
  const d = MONTH_DETAIL[tg];
  const solar = month === 12 ? '1월' : `${month + 1}월`;
  return {
    label: `양력 ${solar} 무렵 · ${gzKo(m)}월`,
    favor,
    title: MONTH[tg][favor],
    intro: '',
    overview: [d.overview],
    fields: [
      { label: '일', text: d.work },
      { label: '돈', text: d.money },
      { label: '관계', text: d.love },
      { label: '건강', text: d.health },
    ],
    tips: [],
    basis: [`월운: ${gzKo(m)}(${gzHanja(m)}) · 절기 기준 ${month}번째 달`, `천간 ${tg} · 지지 ${m.branchTenGod}`, yongBasis(r, favor)],
  };
}

export interface LifePoint {
  index: number;
  startAge: number;
  startYear: number;
  ganzhi: string;
  score: number;
  favor: FavorKey;
  current: boolean;
  /** 그래프 아래 짧은 설명 */
  title: string;
}

/** 인생 흐름 그래프: 10년 운마다 나에게 맞는 정도 */
export function lifeGraph(r: SajuResult): LifePoint[] {
  if (!r.yongsin) return [];
  return r.bigFortunes.map((b, i) => {
    const score = fortuneScore(r, b);
    return { index: i, startAge: b.startAge, startYear: b.startYear, ganzhi: gzKo(b), score, favor: favorOfScore(score), current: i === r.currentBigFortuneIndex, title: BIG[b.stemTenGod as TenGodName].title };
  });
}

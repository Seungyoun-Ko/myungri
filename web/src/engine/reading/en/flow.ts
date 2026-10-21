// English 10-year cycle, monthly reading and life graph (logic shared with ../flow.ts).
import type { Fortune, SajuResult } from '../../saju';
import type { FavorKey, TenGodName } from '../types';
import type { LifePoint, PeriodReadingView } from '../flow';
import { favorOfScore, fortuneScore } from '../shared';
import { ELEMENT_EN, GROWTH_EN, TEN_GOD_EN, ganzhiFull } from '../../en-labels';
import { BIG, BIG_FAVOR } from './big';
import { MONTH_DETAIL } from './month-detail';
import { MONTH } from './fortune';

const gz = (f: Fortune) => ganzhiFull(f.stem.index, f.branch.index);
const yongBasis = (r: SajuResult, favor: FavorKey) =>
  `Useful ${ELEMENT_EN[r.yongsin!.yong]} · Favorable ${ELEMENT_EN[r.yongsin!.hee]} · Unfavorable ${ELEMENT_EN[r.yongsin!.gi]} → ${favor === 'good' ? 'helps' : favor === 'caution' ? 'weighs on you' : 'neutral'}`;
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function bigReadingEn(r: SajuResult, index: number): PeriodReadingView | null {
  const b = r.bigFortunes[index];
  if (!b || !r.yongsin) return null;
  const favor = favorOfScore(fortuneScore(r, b));
  const stemTg = b.stemTenGod as TenGodName;
  const branchTg = b.branchTenGod as TenGodName;
  const main = BIG[stemTg];
  return {
    label: `Ages ${b.startAge}–${b.startAge + 9} · ${b.startYear}–${b.endYear} · ${gz(b)}`,
    favor,
    title: main.title,
    intro: BIG_FAVOR[favor][index % 2],
    overview: [main.overview, ...(branchTg !== stemTg ? [BIG[branchTg].base] : [])],
    fields: [
      { label: 'Work', text: main.work },
      { label: 'Money', text: main.money },
      { label: 'Love', text: main.love },
      { label: 'Health', text: main.health },
      { label: 'People', text: main.relations },
    ],
    tips: [...main.tips],
    basis: [`Luck pillar from age ${b.startAge}: ${gz(b)}`, `Stem ${TEN_GOD_EN[stemTg]} · Branch ${TEN_GOD_EN[branchTg]} · Life stage ${GROWTH_EN[b.growthPhase] ?? b.growthPhase}`, yongBasis(r, favor)],
  };
}

/** month: 1 = Tiger month (around Feb) … 12 = Ox month (around Jan) */
export function monthReadingEn(r: SajuResult, month: number): PeriodReadingView | null {
  const m = r.monthFortunes[month - 1];
  if (!m || !r.yongsin) return null;
  const favor = favorOfScore(fortuneScore(r, m));
  const tg = m.stemTenGod as TenGodName;
  const d = MONTH_DETAIL[tg];
  return {
    label: `Around ${MONTH_NAMES[month % 12]} · ${gz(m)} month`,
    favor,
    title: MONTH[tg][favor],
    intro: '',
    overview: [d.overview],
    fields: [
      { label: 'Work', text: d.work },
      { label: 'Money', text: d.money },
      { label: 'Relationships', text: d.love },
      { label: 'Health', text: d.health },
    ],
    tips: [],
    basis: [`Monthly pillar: ${gz(m)} · solar-term month ${month}`, `Stem ${TEN_GOD_EN[tg]} · Branch ${TEN_GOD_EN[m.branchTenGod]}`, yongBasis(r, favor)],
  };
}

export function lifeGraphEn(r: SajuResult): LifePoint[] {
  if (!r.yongsin) return [];
  return r.bigFortunes.map((b, i) => {
    const score = fortuneScore(r, b);
    return { index: i, startAge: b.startAge, startYear: b.startYear, ganzhi: gz(b).split(' ')[1], score, favor: favorOfScore(score), current: i === r.currentBigFortuneIndex, title: BIG[b.stemTenGod as TenGodName].title };
  });
}

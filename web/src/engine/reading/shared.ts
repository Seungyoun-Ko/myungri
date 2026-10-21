// 풀이 조립에 쓰는 계산 도우미 (문장 데이터 없음). 한국어·영어 풀이가 함께 씁니다.
import type { Element } from '../constants';
import type { SajuResult, TenGod, TenGodGroup } from '../saju';
import { TEN_GOD_GROUPS, TEN_GODS, tenGodGroup } from '../saju';
import type { FavorKey, StrengthKey } from './types';

export const uniq = <T>(xs: (T | null | undefined | false)[]) => [...new Set(xs.filter(Boolean) as T[])];
export function groupRatios(r: SajuResult): Record<TenGodGroup, number> {
  const out = Object.fromEntries(TEN_GOD_GROUPS.map((g) => [g, 0])) as Record<TenGodGroup, number>;
  if (r.tenGodRatios) for (const t of TEN_GODS) out[tenGodGroup(t)] += r.tenGodRatios[t];
  return out;
}

/** 십신 무리를 많은 순으로. 비슷하면 태어난 달의 무리를 앞에 둡니다. */
export function rankedGroups(r: SajuResult): TenGodGroup[] {
  const g = groupRatios(r);
  const month = r.pillars.find((p) => p.key === 'month');
  const monthGroup = month ? tenGodGroup(month.branchTenGod as TenGod) : null;
  return [...TEN_GOD_GROUPS].sort((a, b) => {
    const diff = g[b] - g[a];
    if (Math.abs(diff) > 0.05) return diff;
    return (b === monthGroup ? 1 : 0) - (a === monthGroup ? 1 : 0);
  });
}

export const strengthKey = (r: SajuResult): StrengthKey =>
  r.strengthText === '극강' || r.strengthText === '신강' ? 'strong' : r.strengthText === '중화' ? 'mid' : 'weak';

/** 지금 10년 운부터 앞으로, 그 무리가 들어오는 10년 운의 시작 나이 (최대 3개) */
export function upcomingAges(r: SajuResult, g: TenGodGroup): number[] {
  const from = Math.max(0, r.currentBigFortuneIndex);
  return r.bigFortunes
    .slice(from)
    .filter((b) => tenGodGroup(b.stemTenGod) === g || tenGodGroup(b.branchTenGod) === g)
    .slice(0, 3)
    .map((b) => b.startAge);
}

/**
 * 그 기운이 나에게 얼마나 맞는지.
 * 용신·희신 +1, 기신·구신 −1, 나머지 도움 쪽 기운 +0.5, 나머지 부담 쪽 기운 −0.5.
 * (v1.0의 예전 결과처럼 help·burden이 없으면 나머지는 0)
 */
export function elementFavor(r: SajuResult, e: Element): number {
  const y = r.yongsin;
  if (!y) return 0;
  if (e === y.yong || e === y.hee) return 1;
  if (e === y.gi || e === y.gu) return -1;
  if (y.help?.includes(e)) return 0.5;
  if (y.burden?.includes(e)) return -0.5;
  return 0;
}
export const favorOf = (score: number): FavorKey => (score >= 1 ? 'good' : score <= -1 ? 'caution' : 'normal');

/** 해와 달의 기운이 나에게 맞는 정도 (천간 + 지지) */
export function fortuneFavor(r: SajuResult, f: { stem: { element: number }; branch: { element: number } }): FavorKey {
  return favorOf(elementFavor(r, f.stem.element as Element) + elementFavor(r, f.branch.element as Element));
}


/** 그 운의 천간·지지 오행이 나에게 맞는 정도: -2 ~ +2 */
export function fortuneScore(r: SajuResult, f: { stem: { element: number }; branch: { element: number } }): number {
  return elementFavor(r, f.stem.element as Element) + elementFavor(r, f.branch.element as Element);
}
export const favorOfScore = (n: number): FavorKey => (n >= 1 ? 'good' : n <= -1 ? 'caution' : 'normal');


/**
 * 한 해 12달 문장 고르기: 천간 십신 → 지지 십신 → 같은 무리의 짝 십신 순으로,
 * 그 해에 아직 쓰지 않은 문장을 고릅니다(같은 문장이 두 달에 나오지 않게).
 */
export function pickMonthText<T extends string>(
  table: Record<T, Record<FavorKey, string>>,
  stemTg: T,
  branchTg: T,
  favor: FavorKey,
  used: Set<string>,
  /** 모두 쓰였을 때 쓸 같은 기운의 다른 문장들 (예: 그 달 자세히 풀이의 첫 문장) */
  fallbacks: string[] = [],
): string {
  const sibling = (t: T) => TEN_GODS[TEN_GODS.indexOf(t as unknown as TenGod) ^ 1] as unknown as T;
  const candidates = [...[stemTg, branchTg, sibling(stemTg), sibling(branchTg)].map((t) => table[t][favor]), ...fallbacks];
  const text = candidates.find((x) => !used.has(x)) ?? table[stemTg][favor];
  used.add(text);
  return text;
}

/** 문단의 첫 문장 */
export const firstSentence = (t: string) => (t.match(/^[^.!?]+[.!?]+["']?/) ?? [t])[0].trim();

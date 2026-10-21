// 자미두수 풀이 조립 도우미 (문장 데이터 없음). 한국어·영어 조립이 함께 씁니다.
import type { PalaceName, Sihwa } from '../jamidusu';
import type { JamiExtra2Reading, JamiExtraReading, PalaceFieldKey } from './types';

/** 육친·생활 자리: 그 자리 전용 별 문장을 씁니다 */
export const PALACE_FIELD_OF: Partial<Record<PalaceName, PalaceFieldKey>> = {
  부모궁: 'parents',
  형제궁: 'siblings',
  자녀궁: 'children',
  노복궁: 'friends',
  전택궁: 'property',
  천이궁: 'travel',
  복덕궁: 'inner',
};

/** 묘·왕 = strong, 득·리·평 = mid, 불·함 = weak */
export const brightClass = (b: string): 'strong' | 'mid' | 'weak' | null =>
  b === '묘' || b === '왕' ? 'strong' : b === '득' || b === '리' || b === '평' ? 'mid' : b === '불' || b === '함' ? 'weak' : null;

/**
 * 한 자리의 사화 문장. 같은 자리에 겹치면 묶어 한 문장으로 씁니다.
 * natal: 타고난 사화, period: 대한·유년 사화. health면 건강 전용 문장.
 */
export function sihwaLines(natal: Sihwa[], period: Sihwa[], health: boolean, X: JamiExtraReading, X2: JamiExtra2Reading): string[] {
  const out: string[] = [];
  const n = new Set(natal);
  const p = new Set(period);
  const take = (k: Sihwa) => {
    n.delete(k);
    p.delete(k);
  };
  if (n.has('기') && p.has('기')) {
    out.push(X2.combos.doubleJi);
    take('기');
  }
  if (n.has('록') && p.has('록')) {
    out.push(X2.combos.doubleLu);
    take('록');
  }
  const all = new Set([...n, ...p]);
  if (all.has('기')) {
    const pair = ([['록', 'luJi'], ['과', 'keJi'], ['권', 'quanJi']] as const).find(([k]) => all.has(k));
    if (pair) {
      out.push(X2.combos[pair[1]]);
      take(pair[0]);
      take('기');
    }
  }
  for (const k of n) out.push(health ? X2.healthSihwa[k].natal : X.sihwa[k].natal);
  for (const k of p) out.push(health ? X2.healthSihwa[k].period : X.sihwa[k].period);
  return out;
}

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

// ---------------------------------------------------------------- 쌍성·격국 (v1.2)
import type { JamidusuChart } from '../jamidusu';
import type { JamiPatternKey } from './types';

const MAIN_ORDER = ['자미', '천기', '태양', '무곡', '천동', '염정', '천부', '태음', '탐랑', '거문', '천상', '천량', '칠살', '파군'];
/** 한 자리 두 주성의 조합 키 (예: '자미+천부') */
export const pairKey = (names: string[]) =>
  names.length === 2 ? [...names].sort((a, b) => MAIN_ORDER.indexOf(a) - MAIN_ORDER.indexOf(b)).join('+') : null;

const BRIGHT = new Set(['묘', '왕', '득']);
const DIM = new Set(['불', '함']);

/** 명반 격국 감지 (명궁의 삼방사정 기준), 중요한 순서로 */
export function detectJamiPatterns(chart: JamidusuChart, max = 2): JamiPatternKey[] {
  const m = chart.mingBranch;
  const at = (b: number) => chart.palaces[((b % 12) + 12) % 12];
  const triad = [m, m + 4, m + 8, m + 6].map(at);
  const starsIn = (ps: typeof triad) => ps.flatMap((p) => p.stars);
  const has = (ps: typeof triad, name: string) => starsIn(ps).some((s) => s.name === name && s.kind !== 'minor');
  const mains = (p: (typeof triad)[number]) => p.stars.filter((s) => s.kind === 'main');
  const star = (name: string) => starsIn(triad).find((s) => s.name === name && s.kind === 'main');
  const ming = at(m);
  const sides = [at(m - 1), at(m + 1)];
  const flank = (a: string, b: string) => (sides[0].stars.some((s) => s.name === a) && sides[1].stars.some((s) => s.name === b)) || (sides[0].stars.some((s) => s.name === b) && sides[1].stars.some((s) => s.name === a));
  const luStar = (ps: typeof triad) => starsIn(ps).some((s) => s.sihwa === '록' && s.kind !== 'minor');
  const out: JamiPatternKey[] = [];
  const add = (cond: boolean, k: JamiPatternKey) => cond && out.push(k);
  add(has(triad, '칠살') && has(triad, '파군') && has(triad, '탐랑'), 'salPaRang');
  add(['천기', '태음', '천동', '천량'].every((n) => has(triad, n)), 'giWolDongRyang');
  add(['자미', '천부', '염정', '무곡', '천상'].filter((n) => has(triad, n)).length >= 4, 'jaBuYeomMuSang');
  add(m === 11 && mains(ming).some((s) => s.name === '태음'), 'myeongjuChulhae');
  add(m === 1 || m === 7 ? mains(ming).some((s) => s.name === '무곡') && mains(ming).some((s) => s.name === '탐랑') : false, 'muguiGyeok');
  add(m === 0 || m === 6 ? mains(ming).some((s) => s.name === '거문' && (s.sihwa === '록' || s.sihwa === '권' || s.sihwa === '과')) : false, 'seokjungEunok');
  const sun = star('태양');
  const moon = star('태음');
  add(!!sun && !!moon && BRIGHT.has(sun.brightness) && BRIGHT.has(moon.brightness), 'ilwolByeongmyeong');
  add(!!sun && !!moon && DIM.has(sun.brightness) && DIM.has(moon.brightness), 'ilwolBanbae');
  add(flank('좌보', '우필'), 'jwauHyeopmyeong');
  add(flank('문창', '문곡'), 'changgokHyeopmyeong');
  add(ming.stars.some((s) => s.sihwa === '기' && s.kind !== 'minor') && flank('경양', '타라'), 'yangtaHyeopgi');
  add(triad.some((p) => p.stars.some((s) => s.name === '천마') && (p.stars.some((s) => s.name === '녹존') || p.stars.some((s) => s.sihwa === '록' && s.kind !== 'minor'))), 'nokmaGyochi');
  add(triad.some((p) => p.stars.some((s) => s.name === '탐랑') && p.stars.some((s) => s.name === '화성' || s.name === '영성')), 'hwatam');
  add(has(triad, '녹존') && luStar(triad), 'ssangnok');
  return out.slice(0, max);
}

export const JAMI_PATTERN_NAME_KO: Record<JamiPatternKey, string> = {
  salPaRang: '살파랑', giWolDongRyang: '기월동량', jaBuYeomMuSang: '자부염무상', myeongjuChulhae: '명주출해', ilwolByeongmyeong: '일월병명',
  seokjungEunok: '석중은옥', jwauHyeopmyeong: '좌우협명', changgokHyeopmyeong: '창곡협명', yangtaHyeopgi: '양타협기', nokmaGyochi: '녹마교치',
  hwatam: '화탐·영탐', ssangnok: '쌍록', ilwolBanbae: '일월반배', muguiGyeok: '무탐격',
};
export const JAMI_PATTERN_NAME_EN: Record<JamiPatternKey, string> = {
  salPaRang: 'Sha Po Lang', giWolDongRyang: 'Ji Yue Tong Liang', jaBuYeomMuSang: 'Zi Fu Lian Wu Xiang', myeongjuChulhae: 'Moon in the Heavenly Gate', ilwolByeongmyeong: 'Sun and Moon Shining Together',
  seokjungEunok: 'Jade Hidden in Stone', jwauHyeopmyeong: 'Flanked by Zuo Fu and You Bi', changgokHyeopmyeong: 'Flanked by Wen Chang and Wen Qu', yangtaHyeopgi: 'Ji Flanked by Qing Yang and Tuo Luo', nokmaGyochi: 'Lu and Ma Meet',
  hwatam: 'Fire or Bell with Greed', ssangnok: 'Double Lu', ilwolBanbae: 'Sun and Moon Turned Away', muguiGyeok: 'Wu Qu and Tan Lang',
};

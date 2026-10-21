// 신살과 지지 관계 (v1.2). 원국 네 기둥(시간 모름이면 세 기둥) 전체를 봅니다.
// 기준: 공망은 일주 순중, 역마·도화·화개는 년지·일지의 삼합 기준, 귀인·양인은 일간 기준.
import type { Pillar, PillarKey } from './saju';
import type { ShinsalKey } from './reading/types';

export interface ShinsalHit {
  key: ShinsalKey | 'dohwa';
  /** 표시 이름 (한국어 · 한자) */
  name: string;
  hanja: string;
  /** 걸린 기둥 */
  where: PillarKey[];
}

export interface BranchRelation {
  kind: '삼합' | '반합' | '방합' | '형' | '파' | '해' | '원진';
  branches: number[];
  where: PillarKey[];
}

const TRIAD = [
  [8, 0, 4], // 申子辰 → 수
  [2, 6, 10], // 寅午戌 → 화
  [5, 9, 1], // 巳酉丑 → 금
  [11, 3, 7], // 亥卯未 → 목
];
const TRIAD_ELEMENT = [4, 1, 3, 0];
const triadOf = (b: number) => TRIAD.findIndex((t) => t.includes(b));
const HORSE = [2, 8, 11, 5]; // 역마: 申子辰→寅, 寅午戌→申, 巳酉丑→亥, 亥卯未→巳
const PEACH = [9, 3, 6, 0]; // 도화: 申子辰→酉, 寅午戌→卯, 巳酉丑→午, 亥卯未→子
const CANOPY = [4, 10, 1, 7]; // 화개: 申子辰→辰, 寅午戌→戌, 巳酉丑→丑, 亥卯未→未
const NOBLE: number[][] = [[1, 7], [0, 8], [11, 9], [11, 9], [1, 7], [0, 8], [1, 7], [2, 6], [5, 3], [5, 3]]; // 천을귀인 (일간 甲~癸)
const LITERARY = [5, 6, 8, 9, 8, 9, 11, 0, 2, 3]; // 문창귀인
const BLADE: Record<number, number> = { 0: 3, 2: 6, 4: 6, 6: 9, 8: 0 }; // 양인 (양간)
const WHITE_TIGER = new Set(['0-4', '1-7', '2-10', '3-1', '4-4', '8-10', '9-1']); // 백호: 甲辰 乙未 丙戌 丁丑 戊辰 壬戌 癸丑
const KUIGANG = new Set(['6-4', '6-10', '8-4', '8-10', '4-10']); // 괴강: 庚辰 庚戌 壬辰 壬戌 戊戌
const WONJIN = new Set(['0-7', '1-6', '2-9', '3-8', '4-11', '5-10']);
const PA = new Set(['0-9', '1-4', '2-11', '3-6', '5-8', '7-10']);
const HAE = new Set(['0-7', '1-6', '2-5', '3-4', '8-11', '9-10']);
const HYEONG = new Set(['2-5', '5-8', '2-8', '1-10', '7-10', '1-7', '0-3']); // 寅巳申·丑戌未 삼형, 子卯 상형
const SELF_HYEONG = new Set([4, 6, 9, 11]); // 辰午酉亥 자형
const SEASON = [[2, 3, 4], [5, 6, 7], [8, 9, 10], [11, 0, 1]];
const key = (a: number, b: number) => (a < b ? `${a}-${b}` : `${b}-${a}`);

export function findShinsal(pillars: Pillar[]): ShinsalHit[] {
  const day = pillars.find((p) => p.key === 'day')!;
  const year = pillars.find((p) => p.key === 'year');
  const out: ShinsalHit[] = [];
  const add = (k: ShinsalHit['key'], name: string, hanja: string, where: PillarKey[]) => {
    if (where.length) out.push({ key: k, name, hanja, where: [...new Set(where)] });
  };
  // 년지·일지를 기준으로, 기준 기둥 자신을 뺀 다른 기둥에서 찾습니다.
  const bases = [day, ...(year ? [year] : [])];
  const byTriad = (table: number[]) =>
    bases.flatMap((base) => pillars.filter((p) => p.key !== base.key && p.branch.index === table[triadOf(base.branch.index)]).map((p) => p.key));
  add('yeokma', '역마', '驛馬', byTriad(HORSE));
  add('dohwa', '도화', '桃花', byTriad(PEACH));
  add('hwagae', '화개', '華蓋', byTriad(CANOPY));
  const ds = day.stem.index;
  add('cheoneul', '천을귀인', '天乙貴人', pillars.filter((p) => NOBLE[ds].includes(p.branch.index)).map((p) => p.key));
  add('munchang', '문창귀인', '文昌貴人', pillars.filter((p) => p.branch.index === LITERARY[ds]).map((p) => p.key));
  if (BLADE[ds] !== undefined) add('yangin', '양인', '羊刃', pillars.filter((p) => p.branch.index === BLADE[ds]).map((p) => p.key));
  add('baekho', '백호', '白虎', pillars.filter((p) => WHITE_TIGER.has(`${p.stem.index}-${p.branch.index}`)).map((p) => p.key));
  if (KUIGANG.has(`${ds}-${day.branch.index}`)) add('goegang', '괴강', '魁罡', ['day']);
  // 공망: 일주의 순중에서 빠진 두 지지
  const xun = (((day.branch.index - ds) % 12) + 12) % 12;
  const empty = [(xun + 10) % 12, (xun + 11) % 12];
  add('gongmang', '공망', '空亡', pillars.filter((p) => p.key !== 'day' && empty.includes(p.branch.index)).map((p) => p.key));
  return out;
}

export function findBranchRelations(pillars: Pillar[]): BranchRelation[] {
  const out: BranchRelation[] = [];
  const bs = pillars.map((p) => ({ b: p.branch.index, k: p.key }));
  // 삼합·방합 (세 글자 모두), 반합 (왕지 포함 두 글자)
  TRIAD.forEach((t) => {
    const hit = bs.filter((x) => t.includes(x.b));
    const kinds = new Set(hit.map((x) => x.b));
    if (kinds.size === 3) out.push({ kind: '삼합', branches: t, where: hit.map((x) => x.k) });
    else if (kinds.size === 2 && kinds.has(t[1])) out.push({ kind: '반합', branches: [...kinds], where: hit.map((x) => x.k) });
  });
  SEASON.forEach((t) => {
    const hit = bs.filter((x) => t.includes(x.b));
    if (new Set(hit.map((x) => x.b)).size === 3) out.push({ kind: '방합', branches: t, where: hit.map((x) => x.k) });
  });
  for (let i = 0; i < bs.length; i++)
    for (let j = i + 1; j < bs.length; j++) {
      const a = bs[i];
      const c = bs[j];
      const k = key(a.b, c.b);
      const pair = { branches: [a.b, c.b], where: [a.k, c.k] as PillarKey[] };
      if (HYEONG.has(k) || (a.b === c.b && SELF_HYEONG.has(a.b))) out.push({ kind: '형', ...pair });
      if (PA.has(k)) out.push({ kind: '파', ...pair });
      if (HAE.has(k)) out.push({ kind: '해', ...pair });
      if (WONJIN.has(k)) out.push({ kind: '원진', ...pair });
    }
  return out;
}

/** 운(대운·세운)의 지지가 원국 지지 둘과 삼합을 이루는지: 이루면 그 오행 */
export function triadWithChart(chartBranches: number[], b: number): number | null {
  const t = TRIAD[triadOf(b)];
  const have = new Set(chartBranches.filter((x) => t.includes(x) && x !== b));
  return have.size >= 2 ? TRIAD_ELEMENT[triadOf(b)] : null;
}

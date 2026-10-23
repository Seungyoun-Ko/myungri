// 한 사람의 풀이 안에서 서로 모순되는 문장 거르기.
// 문장 조각에 붙인 성향 태그(tags.ts)를 보고, 이미 나온 성향과 반대인 조각은 뺍니다.
// 일간(나는 어떤 사람의 바탕) 문장은 가장 먼저 자리를 잡고 빠지지 않습니다.
import { OPPOSITE, TAGS } from './tags';

/** 문장 → 태그 키를 찾는 표 (언어별 데이터로 만듦) */
export type TagIndex = Map<string, string>;

interface TagSources {
  DAY_MASTER: { core: string[]; stress: string; work: string; love: string; money: string; relations: string; health: string }[];
  STRENGTH: Record<string, object>;
  GROUP_MANY: Record<string, object>;
  GROUP_NONE: Record<string, object>;
  ELEMENT_EXCESS: { personality: string }[];
  ELEMENT_LACK: { personality: string }[];
  GEUK: Record<string, { weapon: string; work: string }>;
  LUCKY: { intro: string }[];
  SPOUSE_PALACE: Record<string, { love: string }>;
  SPOUSE_AMOUNT: Record<string, string>;
  DAY_PHASE: Record<string, string>;
  DAY_COMBO: Record<string, object>;
  CHARM: string;
  WEALTH_AMOUNT: Record<string, string>;
}

const cache = new WeakMap<object, TagIndex>();

export function tagIndex(d: TagSources): TagIndex {
  const hit = cache.get(d.DAY_MASTER);
  if (hit) return hit;
  const m: TagIndex = new Map();
  const put = (text: unknown, key: string) => typeof text === 'string' && m.set(text, key);
  d.DAY_MASTER.forEach((x, i) => {
    put(x.core[0], `dm.${i}.core0`);
    put(x.core[1], `dm.${i}.core1`);
    for (const f of ['stress', 'work', 'love', 'money', 'relations', 'health'] as const) put(x[f], `dm.${i}.${f}`);
  });
  for (const [k, v] of Object.entries(d.STRENGTH)) for (const [f, t] of Object.entries(v)) put(t, `strength.${k}.${f}`);
  for (const [k, v] of Object.entries(d.GROUP_MANY)) for (const [f, t] of Object.entries(v)) put(t, `many.${k}.${f}`);
  for (const [k, v] of Object.entries(d.GROUP_NONE)) for (const [f, t] of Object.entries(v)) put(t, `none.${k}.${f}`);
  d.ELEMENT_EXCESS.forEach((x, i) => put(x.personality, `excess.${i}`));
  d.ELEMENT_LACK.forEach((x, i) => put(x.personality, `lack.${i}`));
  for (const [k, v] of Object.entries(d.GEUK)) {
    put(v.weapon, `geuk.${k}.weapon`);
    put(v.work, `geuk.${k}.work`);
  }
  d.LUCKY.forEach((x, i) => put(x.intro, `lucky.${i}`));
  for (const [k, v] of Object.entries(d.SPOUSE_PALACE)) put(v.love, `spouse.${k}`);
  for (const [k, v] of Object.entries(d.SPOUSE_AMOUNT)) put(v, `spouseAmount.${k}`);
  for (const [k, v] of Object.entries(d.DAY_PHASE)) put(v, `phase.${k}`);
  for (const [k, v] of Object.entries(d.DAY_COMBO)) for (const [f, t] of Object.entries(v)) put(t, `combo.${k}.${f}`);
  put(d.CHARM, 'charm');
  for (const [k, v] of Object.entries(d.WEALTH_AMOUNT)) put(v, `wealthAmount.${k}`);
  cache.set(d.DAY_MASTER, m);
  return m;
}

/** 반대 성향을 이어 줄 때 앞에 붙이는 말 (첫 충돌 한 번만, 축별) */
export interface Bridges {
  social: string;
  other: string;
  /** 앞말 뒤에 붙일 때 문장 첫 글자를 소문자로 (영어) */
  lowerFirst?: boolean;
}

/**
 * 한 사람 풀이 전체에 쓰는 거르개. anchors(일간 문장)의 성향을 먼저 자리 잡게 하고,
 * pick([...])은 순서를 지키며 같은 문장을 한 번만 두고, 이미 나온 성향과 반대인 조각은
 * 항목마다 첫 한 개만 이어 주는 말(bridges)을 붙여 남기고 나머지는 뺍니다.
 * alias(바꾼 문장, 원래 문장)는 '또 한편으로는…'처럼 앞말을 붙인 문장을 원래 조각으로 알아보게 합니다.
 */
export function conflictPicker(index: TagIndex, anchors: string[], bridges?: Bridges) {
  const local = new Map(index);
  const original = new Map<string, string>();
  const seen = new Set<string>();
  const anchorSet = new Set(anchors);
  const tagsOf = (t: string) => TAGS[local.get(t) ?? ''] ?? [];
  for (const a of anchors) for (const tag of tagsOf(a)) seen.add(tag);
  const lower = (t: string) => t.replace(/^(\W*)(\w)/, (_, p: string, c: string) => p + c.toLowerCase());
  return {
    alias(wrapped: string, orig: string) {
      const k = local.get(orig);
      if (k) local.set(wrapped, k);
      original.set(wrapped, orig);
      return wrapped;
    },
    pick(items: (string | null | undefined | false)[]): string[] {
      const out: string[] = [];
      let bridged = false;
      for (const t of items) {
        if (!t || out.includes(t)) continue;
        const tags = tagsOf(t);
        const clash = !anchorSet.has(t) ? tags.find((tag) => seen.has(OPPOSITE[tag])) : undefined;
        if (clash) {
          if (!bridges || bridged) continue;
          bridged = true;
          const base = original.get(t) ?? t;
          out.push(`${clash.startsWith('social:') ? bridges.social : bridges.other}${bridges.lowerFirst ? lower(base) : base}`);
          continue;
        }
        tags.forEach((tag) => seen.add(tag));
        out.push(t);
      }
      return out;
    },
  };
}

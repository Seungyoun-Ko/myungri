// v1.1 검사: 용신 분류, 지장간 통근, 모순 거르기, 궁합·자미두수·신년 문장 데이터, 결과 링크
import { describe, expect, it } from 'vitest';
import { normalizeBirth } from '../src/engine/birth';
import { computeSaju, yongsinOf } from '../src/engine/saju';
import { STEM_ELEMENT } from '../src/engine/constants';
import { sajuReading } from '../src/engine/reading';
import { sajuReadingEn } from '../src/engine/reading/en';
import { conflictPicker, tagIndex } from '../src/engine/reading/conflict';
import { OPPOSITE, TAGS } from '../src/engine/reading/tags';
import { MATCH_A } from '../src/engine/reading/match-a';
import { MATCH_B } from '../src/engine/reading/match-b';
import { MATCH_A as MATCH_A_EN } from '../src/engine/reading/en/match-a';
import { MATCH_B as MATCH_B_EN } from '../src/engine/reading/en/match-b';
import { PALACE_STARS } from '../src/engine/reading/jami-palace-stars';
import { NEW_YEAR_2027 } from '../src/engine/reading/newyear-2027';
import { computeJamidusu } from '../src/engine/jamidusu';
import { jamiReading } from '../src/engine/reading/jami';
import { STARS } from '../src/engine/reading/jami';
import { decodeInput, encodeInput } from '../src/ui/share-link';
import * as KO from '../src/engine/reading';
import { STRENGTH, GROUP_MANY, GROUP_NONE } from '../src/engine/reading/groups';
import { ELEMENT_EXCESS, ELEMENT_LACK, GEUK, LUCKY } from '../src/engine/reading/elements';
import { CHARM, DAY_COMBO, DAY_PHASE, SPOUSE_AMOUNT, SPOUSE_PALACE, WEALTH_AMOUNT } from '../src/engine/reading/love';

function charts(n: number) {
  let seed = 17;
  const rnd = (k: number) => ((seed = (seed * 1103515245 + 12345) % 2147483648), seed % k);
  return Array.from({ length: n }, () => {
    const input = { gender: rnd(2) ? 'M' : 'F', calendar: 'solar', year: 1940 + rnd(80), month: 1 + rnd(12), day: 1 + rnd(28), hour: rnd(24), minute: rnd(60) } as const;
    let b;
    try {
      b = normalizeBirth(input);
    } catch {
      b = normalizeBirth({ ...input, hour: 12 });
    }
    return { input, b, s: computeSaju(b, { now: new Date('2026-10-21') }) };
  });
}

describe('용신·희신·기신·구신 (강약 방향 분류)', () => {
  it('강하면 용신·희신은 식상·재성·관성에서, 기신·구신은 비겁·인성에서 고름', () => {
    for (let stem = 0; stem < 10; stem++) {
      const me = STEM_ELEMENT[stem];
      const help = [(me + 1) % 5, (me + 2) % 5, (me + 3) % 5];
      const y = yongsinOf(stem, 30, [20, 20, 20, 20, 20]);
      expect(help).toContain(y.yong);
      expect(help).toContain(y.hee);
      expect(help).not.toContain(y.gi);
      expect(help).not.toContain(y.gu);
    }
  });
  it('약하면 용신·희신은 비겁·인성에서, 기신·구신은 식상·재성·관성에서 고름', () => {
    for (let stem = 0; stem < 10; stem++) {
      const me = STEM_ELEMENT[stem];
      const help = [me, (me + 4) % 5];
      const y = yongsinOf(stem, -40, [20, 20, 20, 20, 20]);
      expect(help).toContain(y.yong);
      expect(help).toContain(y.hee);
      expect(help).not.toContain(y.gi);
      expect(help).not.toContain(y.gu);
    }
  });
  it('네 기운이 모두 다름', () => {
    for (const { s } of charts(300)) {
      if (!s.yongsin) continue;
      const { yong, hee, gi, gu } = s.yongsin;
      expect(new Set([yong, hee, gi, gu]).size).toBe(4);
    }
  });
  it('지장간 통근: 丁 일간이 未·戌에 뿌리가 있으면 극약이 아님 (뉴욕 1985 사례)', () => {
    const s = computeSaju(normalizeBirth({ gender: 'M', calendar: 'solar', year: 1985, month: 11, day: 3, hour: 23, minute: 40, cityId: 'us-new-york' }), { now: new Date('2026-10-21') });
    expect(s.strengthText).not.toBe('극약');
  });
});

describe('모순 거르기', () => {
  it('태그 표가 대칭이고 알려진 축만 씀', () => {
    for (const [a, b] of Object.entries(OPPOSITE)) expect(OPPOSITE[b]).toBe(a);
    for (const tags of Object.values(TAGS)) for (const t of tags) expect(OPPOSITE[t]).toBeTruthy();
  });
  it('300명 풀이 안에 서로 반대인 성향 조각이 함께 나오지 않음 (일간 문장끼리는 예외)', () => {
    const idx = tagIndex({ DAY_MASTER: KO.DAY_MASTER, STRENGTH, GROUP_MANY, GROUP_NONE, ELEMENT_EXCESS, ELEMENT_LACK, GEUK, LUCKY, SPOUSE_PALACE, SPOUSE_AMOUNT, DAY_PHASE, DAY_COMBO, CHARM, WEALTH_AMOUNT });
    let bad = 0;
    for (const { input, s } of charts(300)) {
      const texts = sajuReading(s, input.gender).flatMap((x) => x.paragraphs.map((p) => p.replace(/^또 한편으로는 /, '')));
      const tags = texts.filter((t) => !(idx.get(t) ?? '').startsWith('dm.')).flatMap((t) => TAGS[idx.get(t) ?? ''] ?? []);
      const dmTags = texts.filter((t) => (idx.get(t) ?? '').startsWith('dm.')).flatMap((t) => TAGS[idx.get(t) ?? ''] ?? []);
      const all = new Set([...tags, ...dmTags]);
      if (tags.some((t) => all.has(OPPOSITE[t]))) bad++;
    }
    expect(bad).toBe(0);
  });
  it('거르개는 순서를 지키고 같은 문장을 한 번만 둠', () => {
    const f = conflictPicker(new Map(), []);
    expect(f.pick(['a', 'b', 'a', null, 'c'])).toEqual(['a', 'b', 'c']);
  });
});

describe('새 문장 데이터', () => {
  const keys: string[] = [];
  for (let a = 0; a < 10; a++) for (let b = a; b < 10; b++) keys.push(`${a}-${b}`);
  it('궁합 55쌍이 한국어·영어 모두 있음', () => {
    const ko = { ...MATCH_A, ...MATCH_B };
    const en = { ...MATCH_A_EN, ...MATCH_B_EN };
    expect(Object.keys(ko).sort()).toEqual([...keys].sort());
    expect(Object.keys(en).sort()).toEqual([...keys].sort());
  });
  it('자미두수 육친·생활 자리 문장: 14주성 × 7분야', () => {
    expect(Object.keys(PALACE_STARS).sort()).toEqual(Object.keys(STARS).sort());
    for (const v of Object.values(PALACE_STARS)) expect(Object.keys(v).sort()).toEqual(['children', 'friends', 'inner', 'parents', 'property', 'siblings', 'travel']);
  });
  it('부모 자리에는 그 자리 전용 문장이 쓰임', () => {
    const chart = computeJamidusu(normalizeBirth({ gender: 'F', calendar: 'solar', year: 1990, month: 5, day: 15, hour: 8, minute: 30 }));
    const people = jamiReading(chart).find((x) => x.key === 'people')!;
    const parents = people.blocks![0].paragraphs.join(' ');
    const fieldTexts = Object.values(PALACE_STARS).map((v) => v.parents);
    expect(fieldTexts.some((t) => parents.includes(t))).toBe(true);
  });
  it('2027 띠별 운세 12개', () => {
    expect(Object.keys(NEW_YEAR_2027)).toHaveLength(12);
  });
});

it('결과 링크: 입력값을 담았다 풀면 같고, 이름은 빠짐', () => {
  const input = { name: '홍길동', gender: 'F', calendar: 'solar', year: 1990, month: 5, day: 15, hour: 8, minute: 30, cityId: 'us-new-york', jasi: 'same', leapMode: 'mid' } as const;
  const back = decodeInput(encodeInput(input))!;
  expect(back.name).toBe('');
  expect({ ...back, name: input.name }).toEqual(input);
  expect(decodeInput('not-valid')).toBeNull();
});

it('영어 풀이에도 같은 거르개가 적용됨 (섹션 수 유지)', () => {
  for (const { input, s } of charts(20)) expect(sajuReadingEn(s, input.gender)).toHaveLength(7);
});

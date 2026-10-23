// v1.2 검사: 신살·지지 관계, 운 점수, 구조 감지, 오늘의 나, 자미두수 격국
import { describe, expect, it } from 'vitest';
import { findBranchRelations, findShinsal } from '../src/engine/shinsal';
import type { Pillar } from '../src/engine/saju';
import { computeSaju } from '../src/engine/saju';
import { normalizeBirth } from '../src/engine/birth';
import { fortuneScore } from '../src/engine/reading/shared';
import { detectStructures } from '../src/engine/reading/structure-detect';
import { sajuReading, todayReading } from '../src/engine/reading';
import { todayReadingEn } from '../src/engine/reading/en';
import { computeJamidusu } from '../src/engine/jamidusu';
import { detectJamiPatterns, pairKey } from '../src/engine/reading/jami-build';

const P = (key: string, stem: number, branch: number) => ({ key, stem: { index: stem }, branch: { index: branch } }) as unknown as Pillar;

describe('신살·지지 관계', () => {
  // 시 丙寅 · 일 甲子 · 월 癸酉 · 년 戊辰
  const pillars = [P('hour', 2, 2), P('day', 0, 0), P('month', 9, 9), P('year', 4, 4)];
  it('일지 子 기준: 역마 寅(시), 도화 酉(월), 화개 辰(년)', () => {
    const hits = findShinsal(pillars);
    const where = (k: string) => hits.find((h) => h.key === k)?.where;
    expect(where('yeokma')).toEqual(['hour']);
    expect(where('dohwa')).toEqual(['month']);
    expect(where('hwagae')).toContain('year');
    expect(hits.some((h) => h.key === 'baekho')).toBe(true); // 戊辰
  });
  it('반합·파·원진을 떨어진 기둥까지 찾음', () => {
    const kinds = findBranchRelations(pillars).map((r) => r.kind);
    expect(kinds).toContain('반합'); // 子辰
    expect(kinds).toContain('파'); // 子酉
    expect(kinds).toContain('원진'); // 寅酉
  });
});

function charts(n: number) {
  let seed = 23;
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

it('운 점수는 −2 ~ 2 범위, 대운은 지지 비중이 큼', () => {
  for (const { s } of charts(200)) for (const big of s.bigFortunes) {
    const v = fortuneScore(s, big, 0.6);
    expect(v).toBeGreaterThanOrEqual(-2);
    expect(v).toBeLessThanOrEqual(2);
  }
});

it('구조 감지: 최대 2개, 풀이 첫 항목에 블록으로 나옴', () => {
  let found = 0;
  for (const { input, s } of charts(200)) {
    const k = detectStructures(s);
    expect(k.length).toBeLessThanOrEqual(2);
    if (k.length) {
      found++;
      expect(sajuReading(s, input.gender)[0].blocks?.length).toBe(k.length);
    }
  }
  expect(found).toBeGreaterThan(20);
});

it('오늘의 나: 시간을 알면 한 줄이 나옴 (한국어·영어)', () => {
  for (const { s } of charts(30)) {
    if (!s.yongsin) continue;
    expect(todayReading(s, new Date('2026-10-21'))?.text).toBeTruthy();
    expect(todayReadingEn(s, new Date('2026-10-21'))?.text).toBeTruthy();
  }
});

it('자미두수: 쌍성 키와 격국 감지', () => {
  expect(pairKey(['천부', '자미'])).toBe('자미+천부');
  expect(pairKey(['자미'])).toBeNull();
  let any = 0;
  for (const { b } of charts(200)) {
    const p = detectJamiPatterns(computeJamidusu(b));
    expect(p.length).toBeLessThanOrEqual(2);
    if (p.length) any++;
  }
  expect(any).toBeGreaterThan(20);
});

// 'MBTI로 치면' 재미 비교: 올바른 네 글자, 축마다 한쪽으로 쏠리지 않음, 시간 모름이면 없음
import { expect, it } from 'vitest';
import { normalizeBirth } from '../src/engine/birth';
import { computeSaju } from '../src/engine/saju';
import { mbtiLike } from '../src/engine/mbti-like';

it('네 글자가 올바르고, 축마다 35~65% 사이로 고르게 나뉨', () => {
  let seed = 101;
  const rnd = (k: number) => ((seed = (seed * 1103515245 + 12345) % 2147483648), seed % k);
  const count: Record<string, number> = {};
  const types = new Set<string>();
  let n = 0;
  for (let i = 0; i < 800; i++) {
    const m = mbtiLike(computeSaju(normalizeBirth({ gender: rnd(2) ? 'M' : 'F', calendar: 'solar', year: 1940 + rnd(80), month: 1 + rnd(12), day: 1 + rnd(28), hour: rnd(24), minute: 0 })));
    if (!m) continue;
    expect(m.code).toMatch(/^[EI][SN][TF][JP]$/);
    expect(m.reasons).toHaveLength(4);
    n++;
    types.add(m.code);
    for (const c of m.code) count[c] = (count[c] ?? 0) + 1;
  }
  for (const c of ['E', 'S', 'T', 'J']) {
    const share = (count[c] ?? 0) / n;
    expect(share).toBeGreaterThan(0.35);
    expect(share).toBeLessThan(0.65);
  }
  expect(types.size).toBe(16);
});

it('출생시간을 모르면 만들지 않음', () => {
  expect(mbtiLike(computeSaju(normalizeBirth({ gender: 'F', calendar: 'solar', year: 1990, month: 5, day: 15, timeUnknown: true })))).toBeNull();
});

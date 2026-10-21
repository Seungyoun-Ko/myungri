// v1.0.1 수정 사항 검사
import { expect, it } from 'vitest';
import { normalizeBirth } from '../src/engine/birth';
import { computeSaju, geukName } from '../src/engine/saju';
import { sajuReading, yearReading } from '../src/engine/reading';
import { sajuReadingEn, yearReadingEn } from '../src/engine/reading/en';

function charts(n: number, cityId = 'seoul') {
  let seed = 3;
  const rnd = (k: number) => ((seed = (seed * 1103515245 + 12345) % 2147483648), seed % k);
  return Array.from({ length: n }, () => {
    const input = { gender: rnd(2) ? 'M' : 'F', calendar: 'solar', year: 1950 + rnd(60), month: 1 + rnd(12), day: 1 + rnd(28), hour: rnd(24), minute: rnd(60), cityId } as const;
    let b;
    try {
      b = normalizeBirth(input);
    } catch {
      b = normalizeBirth({ ...input, hour: 12 });
    }
    return { input, b, s: computeSaju(b, { now: new Date('2026-10-21') }) };
  });
}

it('격국: 겁재 월지는 양간이면 양인격, 음간이면 월겁격', () => {
  expect(geukName('겁재', 0)).toBe('양인격'); // 甲
  expect(geukName('겁재', 1)).toBe('월겁격'); // 乙
  expect(geukName('겁재', 9)).toBe('월겁격'); // 癸
  expect(geukName('정관', 1)).toBe('정관격');
});

it('대운: 시작 해 = 출생 해 + 시작 나이, 그 10년의 해 목록과 나이가 맞음', () => {
  for (const { b, s } of charts(200)) {
    for (const [i, big] of s.bigFortunes.entries()) {
      expect(big.startYear).toBe(b.solar.year + big.startAge);
      expect(big.endYear).toBe(big.startYear + 9);
      const years = s.daewunYearFortunes[i];
      expect(years[0].year).toBe(big.startYear);
      expect(years[0].age).toBe(big.startAge);
      expect(years).toHaveLength(10);
    }
  }
});

it('한 해 12달 문장이 서로 겹치지 않음 (한국어·영어)', () => {
  let dup = 0;
  for (const { s } of charts(300)) {
    for (const v of [yearReading(s, 2027), yearReadingEn(s, 2027)]) {
      if (!v) continue;
      if (new Set(v.months.map((m) => m.text)).size !== 12) dup++;
    }
  }
  expect(dup).toBe(0);
});

it('남반구 출생은 절기 계절 문장을 넣지 않음', () => {
  for (const { input, s } of charts(30, 'au-sydney')) {
    const ko = sajuReading(s, input.gender, { southern: true }).find((x) => x.key === 'health')!;
    const en = sajuReadingEn(s, input.gender, { southern: true }).find((x) => x.key === 'health')!;
    expect(ko.paragraphs.some((p) => /태어나/.test(p) && /(봄|여름|가을|겨울)에 태어나/.test(p))).toBe(false);
    expect(en.paragraphs.some((p) => p.includes('East Asian solar calendar'))).toBe(false);
  }
});

it('출생시간 모름 안내는 첫 항목에만', () => {
  const s = computeSaju(normalizeBirth({ gender: 'F', calendar: 'solar', year: 1990, month: 5, day: 15, timeUnknown: true }));
  for (const sections of [sajuReading(s, 'F'), sajuReadingEn(s, 'F')]) {
    expect(sections[0].note).toBeTruthy();
    expect(sections.slice(1).every((x) => !x.note || x.key === 'health')).toBe(true);
  }
});

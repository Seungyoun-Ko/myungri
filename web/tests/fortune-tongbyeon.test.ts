import { expect, it } from 'vitest';
import { normalizeBirth } from '../src/engine/birth';
import { computeSaju } from '../src/engine/saju';
import { bigFortuneReading, monthFortuneReading, yearFortuneReading } from '../src/engine/fortune-tongbyeon';

const s = computeSaju(normalizeBirth({ gender: 'M', calendar: 'solar', year: 1986, month: 11, day: 20, hour: 5, minute: 10 }), { now: new Date(2026, 9, 17) });
const i = s.currentBigFortuneIndex;

it('대운 癸卯: 정재·정관, 기신·희신, 戊癸합', () => {
  const t = bigFortuneReading(s, i)!.paragraphs.join(' ');
  expect(t).toContain('천간에 정재, 지지에 정관');
  expect(t).toContain('癸(수)는 기신, 지지 卯(목)은 희신');
  expect(t).toContain('癸가 일간 戊와 합');
});

it('2026 丙午 세운: 용신이 위아래로', () => {
  expect(yearFortuneReading(s, i, 2026)!.paragraphs.join(' ')).toContain('위아래로 들어와');
});

it('같은 글자와의 충은 한 문장으로 묶음 (2028 戊申 ↔ 시주·년주 寅)', () => {
  const t = yearFortuneReading(s, i, 2028)!.paragraphs.filter((p) => p.includes('충을'));
  expect(t).toHaveLength(1);
  expect(t[0]).toContain('시주·년주의 寅과 충');
});

it('월운 9월 戊戌: 일지 辰과 충', () => {
  expect(monthFortuneReading(s, 9)!.paragraphs.join(' ')).toContain('일주의 辰과 충');
});

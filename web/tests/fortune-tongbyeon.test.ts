import { expect, it } from 'vitest';
import { normalizeBirth } from '../src/engine/birth';
import { computeSaju } from '../src/engine/saju';
import { bigFortuneReading, monthFortuneReading, yearFortuneReading } from '../src/engine/fortune-tongbyeon';
import { renderTerms, type TermMode } from '../src/engine/terms';

const s = computeSaju(normalizeBirth({ gender: 'M', calendar: 'solar', year: 1986, month: 11, day: 20, hour: 5, minute: 10 }), { now: new Date(2026, 9, 17) });
const i = s.currentBigFortuneIndex;
const join = (ps: string[], mode: TermMode) => ps.map((p) => renderTerms(p, mode)).join(' ');

it('대운 癸卯: 정재·정관, 기신·희신, 戊癸합', () => {
  const p = bigFortuneReading(s, i)!.paragraphs;
  expect(join(p, 'term')).toContain('천간에 정재, 지지에 정관');
  expect(join(p, 'term')).toContain('천간 계수(癸)는 기신, 지지 묘목(卯)은 희신');
  expect(join(p, 'term')).toContain('천간 계수(癸)가 일간 무토(戊)와 합을 이뤄');
  expect(join(p, 'plain')).toContain('겉으로는 성실하게 모으는 돈(정재), 바탕에는 직장과 질서(정관)');
  expect(join(p, 'plain')).toContain('계수는 부담되는 기운(기신)');
});

it('2026 丙午 세운: 필요한 기운이 위아래로', () => {
  expect(join(yearFortuneReading(s, i, 2026)!.paragraphs, 'plain')).toContain('위아래로 들어와');
});

it('같은 글자와의 충은 한 문장으로 묶음 (2028 戊申 ↔ 시주·년주 寅)', () => {
  const t = yearFortuneReading(s, i, 2028)!.paragraphs.map((p) => renderTerms(p, 'term')).filter((p) => p.includes('충을'));
  expect(t).toHaveLength(1);
  expect(t[0]).toContain('시주·년주의 인목(寅)과 충');
});

it('월운 9월 戊戌: 일지 辰과 충', () => {
  expect(join(monthFortuneReading(s, 9)!.paragraphs, 'term')).toContain('일주의 진토(辰)와 충');
});

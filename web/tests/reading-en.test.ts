// English readings: body text has no Korean, no Chinese characters, no jargon, no "undefined", and enough length.
// The "chart basis" (basis) is where terms belong, so it is only checked for Korean leftovers.
import { expect, it } from 'vitest';
import { normalizeBirth } from '../src/engine/birth';
import { computeSaju } from '../src/engine/saju';
import type { ReadingSection } from '../src/engine/reading';
import { sajuReadingEn, yearReadingEn } from '../src/engine/reading/en';
import { bigReadingEn, lifeGraphEn, monthReadingEn } from '../src/engine/reading/en/flow';
import { combinedReadingEn, jamiReadingEn } from '../src/engine/reading/en/jami';
import { computeJamidusu, daehanChart, yunyeonChart } from '../src/engine/jamidusu';

const JARGON = ['day master', 'ten god', 'useful god', 'bazi', 'pillar', 'heavenly stem', 'earthly branch', 'palace', 'zi wei', 'eating god', 'hurting officer', 'seven killings', 'rob wealth', 'peach blossom', 'hua lu', 'hua ji', 'tian ji', 'tai yang', 'tan lang', 'po jun'];
function problemsOf(text: string): string[] {
  const out: string[] = [];
  const low = text.toLowerCase();
  for (const w of JARGON) if (new RegExp(`\\b${w}`).test(low)) out.push(`jargon ${w}`);
  if (/[가-힣]/.test(text)) out.push('Korean');
  if (/[一-鿿]/.test(text)) out.push('Chinese characters');
  if (/undefined|null|NaN|\{field\}/.test(text)) out.push('broken template');
  return out;
}
const bodyTexts = (s: ReadingSection) => [
  s.title, s.headline?.text ?? '', s.headline?.label ?? '', ...s.keywords, ...s.paragraphs, ...(s.energize ?? []), ...(s.drain ?? []),
  ...(s.chips?.items ?? []), s.chips?.label ?? '', ...(s.facts ?? []).flatMap((f) => [f.label, f.value]), ...(s.timing?.items ?? []), s.caution ?? '', ...(s.tips ?? []),
  ...(s.blocks ?? []).flatMap((b) => [b.title, ...b.paragraphs]), s.note ?? '',
];
const len = (xs: string[]) => xs.join(' ').length;

function randomCharts(n: number) {
  let seed = 11;
  const rnd = (k: number) => ((seed = (seed * 1103515245 + 12345) % 2147483648), seed % k);
  const cities = ['seoul', 'us-new-york', 'gb-london', 'au-sydney', 'tw-taipei', 'us-los-angeles'];
  return Array.from({ length: n }, () => {
    const input = { gender: rnd(2) ? 'M' : 'F', calendar: 'solar', year: 1940 + rnd(80), month: 1 + rnd(12), day: 1 + rnd(28), hour: rnd(24), minute: rnd(60), cityId: cities[rnd(cities.length)] } as const;
    let birth;
    try {
      birth = normalizeBirth(input);
    } catch {
      birth = normalizeBirth({ ...input, hour: 12 });
    }
    return { input, saju: computeSaju(birth, { now: new Date('2026-10-20') }), chart: computeJamidusu(birth) };
  });
}

it('English saju reading: 300 charts, clean body text and enough length', () => {
  const problems = new Map<string, string>();
  const short = new Map<string, number>();
  // v1.1: the conflict filter drops contradicting fragments, so the floor is lower (medians unchanged).
  const MIN: Record<string, number> = { general: 800, personality: 1100, aptitude: 1000, love: 850, wealth: 700, health: 600, relations: 500 };
  for (const { input, saju } of randomCharts(300)) {
    for (const s of sajuReadingEn(saju, input.gender)) {
      for (const t of bodyTexts(s)) {
        const p = problemsOf(t);
        if (p.length && problems.size < 20) problems.set(`${s.key}: ${t.slice(0, 50)}`, p.join(', '));
      }
      for (const t of s.basis) if (/[가-힣]/.test(t) && problems.size < 20) problems.set(`basis ${s.key}: ${t}`, 'Korean in basis');
      const n = len(bodyTexts(s));
      if (n < MIN[s.key]) short.set(s.key, Math.min(short.get(s.key) ?? 1e9, n));
    }
  }
  expect([...problems.entries()].map(([k, v]) => `${k} — ${v}`)).toEqual([]);
  expect(Object.fromEntries(short)).toEqual({});
}, 60_000);

it('English year, 10-year, month readings and life graph are clean', () => {
  const problems: string[] = [];
  for (const { saju } of randomCharts(200)) {
    const views = [yearReadingEn(saju, 2027), ...saju.bigFortunes.map((_, i) => bigReadingEn(saju, i)), ...Array.from({ length: 12 }, (_, i) => monthReadingEn(saju, i + 1))];
    for (const v of views) {
      if (!v) continue;
      const texts = [v.title, v.intro, ...v.overview, ...v.fields.flatMap((f) => [f.label, f.text]), ...v.tips, ...('months' in v ? v.months.flatMap((m) => [m.label, m.text]) : [])];
      for (const t of texts) {
        const p = problemsOf(t);
        if (p.length && problems.length < 20) problems.push(`${t.slice(0, 50)} — ${p.join(', ')}`);
      }
      for (const t of v.basis) if (/[가-힣]/.test(t) && problems.length < 20) problems.push(`basis: ${t}`);
    }
    for (const pt of lifeGraphEn(saju)) if (problemsOf(pt.title).length) problems.push(pt.title);
  }
  expect(problems).toEqual([]);
}, 60_000);

it('English Zi Wei and combined readings: clean text and all 12 areas covered', () => {
  const problems = new Map<string, string>();
  for (const { saju, chart } of randomCharts(200)) {
    for (const ov of [undefined, daehanChart(chart, 40), yunyeonChart(chart, 2027)]) {
      const sections = jamiReadingEn(chart, ov);
      expect(sections.filter((x) => x.key !== 'now').reduce((n, x) => n + (x.key === 'general' ? 1 : (x.blocks?.length ?? 1)), 0)).toBe(12);
      for (const s of sections) {
        for (const t of bodyTexts(s)) {
          const p = problemsOf(t);
          if (p.length && problems.size < 20) problems.set(`jami ${s.key}: ${t.slice(0, 50)}`, p.join(', '));
        }
        for (const t of s.basis) if (/[가-힣]/.test(t) && problems.size < 20) problems.set(`jami basis ${s.key}: ${t}`, 'Korean in basis');
      }
    }
    if (!saju.incompleteBirthTime)
      for (const s of combinedReadingEn(saju, chart, new Date('2026-10-20'))) {
        for (const t of bodyTexts(s)) {
          const p = problemsOf(t);
          if (p.length && problems.size < 20) problems.set(`combined ${s.key}: ${t.slice(0, 50)}`, p.join(', '));
        }
        for (const t of s.basis) if (/[가-힣]/.test(t) && problems.size < 20) problems.set(`combined basis ${s.key}: ${t}`, 'Korean in basis');
      }
  }
  expect([...problems.entries()].map(([k, v]) => `${k} — ${v}`)).toEqual([]);
}, 90_000);

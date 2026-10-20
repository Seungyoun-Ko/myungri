// 새 사주 풀이 검사: 본문은 전문 용어·한자·괄호 없이, 분량은 충분하게.
// '명리 근거'(basis)는 용어를 쓰는 곳이라 검사하지 않습니다.
import { expect, it } from 'vitest';
import { normalizeBirth } from '../src/engine/birth';
import { computeSaju } from '../src/engine/saju';
import { sajuReading, yearReading, type ReadingSection } from '../src/engine/reading';
import { bigReading, lifeGraph, monthReading } from '../src/engine/reading/flow';
import { combinedReading, jamiReading } from '../src/engine/reading/jami';
import { computeJamidusu, daehanChart, yunyeonChart } from '../src/engine/jamidusu';

const FORBIDDEN = [
  '용신', '희신', '기신', '구신', '한신',
  '비견', '겁재', '식신', '상관', '편재', '정재', '편관', '정관', '편인', '정인',
  '비겁', '식상', '재성', '관성', '인성', '십신',
  '격국', '건록', '양인', '칠살', '제왕', '장생', '12운성',
  '천간', '지지', '일간', '일지', '월지', '지장간', '월령',
  '신강', '신약', '중화', '육합', '육충', '삼합', '천간합', '원진', '공망',
  '도화', '역마', '화개', '괴강', '백호', '신살',
  '대운', '세운', '월운', '오행', '상생', '상극', '조후',
  '명궁', '주성', '사화', '신궁', '대한', '유년', '화록', '화권', '화과', '화기',
  '형제궁', '부처궁', '자녀궁', '재백궁', '질액궁', '천이궁', '노복궁', '관록궁', '전택궁', '복덕궁', '부모궁',
  '자미', '천기', '무곡', '천동', '염정', '천부', '태음', '탐랑', '거문', '천상', '천량', '파군',
  '좌보', '우필', '문창', '문곡', '천괴', '천월', '녹존', '천마', '경양', '타라', '영성', '지공', '지겁',
];
// 일상어로 쓰이는 경우는 허용 (관대한, 지지해, 상관없이 등)
const ALLOWED = ['관대한', '관대하', '지지해', '지지하', '상관없', '상관이 없'];

function problemsOf(text: string): string[] {
  let t = text;
  for (const a of ALLOWED) t = t.split(a).join('');
  const out = FORBIDDEN.filter((w) => new RegExp(`(?<![가-힣])${w}`).test(t)).map((w) => `용어 ${w}`);
  if (/[一-鿿]/.test(t)) out.push('한자');
  if (/[()]/.test(t)) out.push('괄호');
  return out;
}

const bodyTexts = (s: ReadingSection) => [
  s.headline?.text ?? '',
  s.headline?.label ?? '',
  ...s.keywords,
  ...s.paragraphs,
  ...(s.energize ?? []),
  ...(s.drain ?? []),
  ...(s.chips?.items ?? []),
  ...(s.facts ?? []).flatMap((f) => [f.label, f.value]),
  ...(s.timing?.items ?? []),
  s.caution ?? '',
  ...(s.tips ?? []),
  ...(s.blocks ?? []).flatMap((b) => [b.title, ...b.paragraphs]),
];
const len = (xs: string[]) => xs.join('').replace(/\s/g, '').length;

function randomCharts(n: number) {
  let seed = 7;
  const rnd = (k: number) => ((seed = (seed * 1103515245 + 12345) % 2147483648), seed % k);
  return Array.from({ length: n }, () => {
    const input = { gender: rnd(2) ? 'M' : 'F', calendar: 'solar', year: 1940 + rnd(80), month: 1 + rnd(12), day: 1 + rnd(28), hour: rnd(24), minute: rnd(60) } as const;
    const birth = normalizeBirth(input);
    return { input, saju: computeSaju(birth), chart: computeJamidusu(birth) };
  });
}

it('사주 풀이: 300명 본문에 전문 용어·한자·괄호가 없고, 항목마다 분량이 충분함', () => {
  const problems = new Map<string, string>();
  const short = new Map<string, number>();
  for (const { input, saju } of randomCharts(300)) {
    for (const s of sajuReading(saju, input.gender)) {
      for (const t of bodyTexts(s)) {
        const p = problemsOf(t);
        if (p.length && problems.size < 20) problems.set(`${s.key}: ${t.slice(0, 40)}`, p.join(', '));
      }
      const n = len(bodyTexts(s));
      // 항목별 최소 분량 (공백 제외, 예전 풀이는 항목당 230~370자)
      const MIN: Record<string, number> = { general: 480, personality: 650, aptitude: 620, love: 540, wealth: 420, health: 360, relations: 360 };
      const min = MIN[s.key];
      if (n < min) short.set(s.key, Math.min(short.get(s.key) ?? 9999, n));
    }
  }
  expect([...problems.entries()].map(([k, v]) => `${k} — ${v}`)).toEqual([]);
  expect(Object.fromEntries(short)).toEqual({});
}, 60_000);

it('한 해 운세: 300명 × 2026년 본문에 전문 용어가 없고, 12달이 모두 나옴', () => {
  const problems: string[] = [];
  for (const { saju } of randomCharts(300)) {
    const v = yearReading(saju, 2026);
    if (!v) continue;
    expect(v.months).toHaveLength(12);
    const texts = [v.title, v.intro, ...v.overview, ...v.fields.map((f) => f.text), ...v.months.map((m) => m.text), ...v.tips];
    for (const t of texts) {
      const p = problemsOf(t);
      if (p.length && problems.length < 20) problems.push(`${t.slice(0, 40)} — ${p.join(', ')}`);
    }
  }
  expect(problems).toEqual([]);
}, 60_000);

it('출생시간을 모르면 일간 중심 풀이와 안내가 나옴', () => {
  const saju = computeSaju(normalizeBirth({ gender: 'F', calendar: 'solar', year: 1990, month: 5, day: 15, timeUnknown: true }));
  const sections = sajuReading(saju, 'F');
  expect(sections).toHaveLength(7);
  expect(sections[0].note).toContain('출생시간');
  expect(yearReading(saju, 2026)).toBeNull();
});

it('10년 운·이번 달·인생 그래프: 300명 본문에 전문 용어가 없음', () => {
  const problems: string[] = [];
  for (const { saju } of randomCharts(300)) {
    expect(lifeGraph(saju)).toHaveLength(saju.bigFortunes.length);
    const views = [...saju.bigFortunes.map((_, i) => bigReading(saju, i)), ...Array.from({ length: 12 }, (_, i) => monthReading(saju, i + 1))];
    for (const v of views) {
      if (!v) continue;
      for (const t of [v.title, v.intro, ...v.overview, ...v.fields.map((f) => f.text), ...v.tips]) {
        const p = problemsOf(t);
        if (p.length && problems.length < 20) problems.push(`${t.slice(0, 40)} — ${p.join(', ')}`);
      }
    }
  }
  expect(problems).toEqual([]);
}, 60_000);

it('자미두수·종합 풀이: 300명 × 선천·대한·유년 본문에 전문 용어·별 이름이 없고, 12자리를 모두 다룸', () => {
  const problems = new Map<string, string>();
  for (const { saju, chart } of randomCharts(300)) {
    const overlays = [undefined, daehanChart(chart, 40), yunyeonChart(chart, 2026)];
    for (const ov of overlays) {
      const sections = jamiReading(chart, ov);
      const covered = sections.filter((x) => x.key !== 'now').reduce((n, x) => n + (x.blocks?.length ?? 1), 0);
      expect(covered).toBe(12);
      for (const s of sections) for (const t of bodyTexts(s)) {
        const p = problemsOf(t);
        if (p.length && problems.size < 20) problems.set(`jami ${s.key}: ${t.slice(0, 40)}`, p.join(', '));
      }
    }
    if (!saju.incompleteBirthTime) for (const s of combinedReading(saju, chart, new Date('2026-10-20'))) for (const t of bodyTexts(s)) {
      const p = problemsOf(t);
      if (p.length && problems.size < 20) problems.set(`combined ${s.key}: ${t.slice(0, 40)}`, p.join(', '));
    }
  }
  expect([...problems.entries()].map(([k, v]) => `${k} — ${v}`)).toEqual([]);
}, 90_000);

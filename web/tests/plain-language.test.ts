// 쉬운 말 검사: 쉬운 말 모드의 통변에는 전문 용어가 괄호 밖에 나오지 않고, 한자가 없어야 합니다.
// 새 문장을 넣다가 이 검사가 깨지면, 용어를 terms.ts의 T()/term/palace() 등으로 감싸 주세요.
import { expect, it } from 'vitest';
import { normalizeBirth } from '../src/engine/birth';
import { computeSaju } from '../src/engine/saju';
import { computeJamidusu, daehanChart, yunyeonChart } from '../src/engine/jamidusu';
import { combinedTongbyeon, jamidusuTongbyeon, sajuTongbyeon } from '../src/engine/tongbyeon';
import { bigFortuneReading, monthFortuneReading, yearFortuneReading } from '../src/engine/fortune-tongbyeon';
import { renderTerms } from '../src/engine/terms';

const TERMS = [
  '용신', '희신', '기신', '구신', '한신',
  '비견', '겁재', '식신', '상관', '편재', '정재', '편관', '정관', '편인', '정인',
  '비겁', '식상', '재성', '관성', '인성',
  '건록격', '양인격', '식신격', '상관격', '편재격', '정재격', '칠살격', '정관격', '편인격', '정인격',
  '장생', '목욕', '관대', '건록', '제왕', '12운성',
  '천간', '지지', '일간', '일지', '월지', '시주', '일주', '월주', '년주',
  '육합', '육충', '천간합',
  '화록', '화권', '화과', '화기', '대록', '대권', '대과', '대기', '년록', '년권', '년과', '년기',
  '주성', '신궁', '명궁', '형제궁', '부처궁', '자녀궁', '재백궁', '질액궁', '천이궁', '노복궁', '관록궁', '전택궁', '복덕궁', '부모궁',
  '대운', '세운', '월운', '대한', '유년',
];

/** 괄호 밖에 나온 용어 찾기 */
function bareTerms(p: string): string[] {
  const outside: string[] = [];
  let depth = 0;
  let buf = '';
  for (const ch of p) {
    if (ch === '(') {
      if (depth === 0) outside.push(buf), (buf = '');
      depth++;
    } else if (ch === ')') depth = Math.max(0, depth - 1);
    else if (depth === 0) buf += ch;
  }
  outside.push(buf);
  const text = outside.join(' ');
  // 낱말 안에 우연히 들어 있는 경우(소화기, 기대기, 길어지지)는 빼고, 낱말 첫머리에 나온 용어만 봅니다.
  return TERMS.filter((t) => new RegExp(`(?<![가-힣])${t}`).test(text));
}

it('쉬운 말 모드: 300명 통변에 괄호 밖 전문 용어·한자·표시 조각이 없음', () => {
  let seed = 11;
  const rnd = (n: number) => ((seed = (seed * 1103515245 + 12345) % 2147483648), seed % n);
  const problems = new Map<string, string>();
  for (let i = 0; i < 300; i++) {
    const b = normalizeBirth({ gender: rnd(2) ? 'M' : 'F', calendar: 'solar', year: 1940 + rnd(80), month: 1 + rnd(12), day: 1 + rnd(28), hour: rnd(24), minute: rnd(60) });
    const s = computeSaju(b, { now: new Date(2026, 9, 17) });
    const c = computeJamidusu(b);
    const ci = Math.max(0, s.currentBigFortuneIndex);
    const raw = [
      ...[...sajuTongbyeon(s, b.input.gender), ...jamidusuTongbyeon(c), ...jamidusuTongbyeon(c, daehanChart(c, 30 + rnd(40))), ...jamidusuTongbyeon(c, yunyeonChart(c, 2026)), ...combinedTongbyeon(s, c, new Date(2026, 9, 17))].flatMap((x) => x.paragraphs),
      ...[bigFortuneReading(s, ci), yearFortuneReading(s, ci, s.daewunYearFortunes[ci]?.[3]?.year ?? 0), monthFortuneReading(s, 1 + rnd(12))].flatMap((x) => (x ? [x.title, ...x.paragraphs] : [])),
    ];
    for (const p of raw) {
      const plain = renderTerms(p, 'plain');
      const termView = renderTerms(p, 'term');
      if (/[\u0001-\u0006]/.test(plain + termView)) problems.set('표시 조각이 남음', plain);
      if (/[一-鿿]/.test(plain)) problems.set('한자', plain);
      for (const t of bareTerms(plain)) problems.set(`괄호 밖 용어: ${t}`, plain);
    }
  }
  expect([...problems.entries()].map(([k, v]) => `${k} — ${v}`)).toEqual([]);
});

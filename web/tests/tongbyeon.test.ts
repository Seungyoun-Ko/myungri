import { expect, it } from 'vitest';
import { normalizeBirth } from '../src/engine/birth';
import { computeSaju } from '../src/engine/saju';
import { computeJamidusu, daehanChart } from '../src/engine/jamidusu';
import { combinedTongbyeon, jamidusuTongbyeon, sajuTongbyeon } from '../src/engine/tongbyeon';

const birth = normalizeBirth({ gender: 'M', calendar: 'solar', year: 1986, month: 11, day: 20, hour: 5, minute: 10, cityId: 'seoul' });
const saju = computeSaju(birth, { now: new Date(2026, 9, 16) });
const chart = computeJamidusu(birth);

it('46세 대한 통변 총론은 "46-55세 대한 동안은 \'일·직업\' 분야가"로 시작', () => {
  const t = jamidusuTongbyeon(chart, daehanChart(chart, 46));
  expect(t[0].paragraphs[0].startsWith("46-55세 대한 동안은 '일·직업' 분야가")).toBe(true);
});

it('관록궁은 비어 맞은편 천동·거문을 빌림', () => {
  const t = jamidusuTongbyeon(chart);
  expect(t.find((s) => s.key === 'aptitude')!.paragraphs[0]).toContain('맞은편 궁의 천동·거문 기운을 빌려 봐요');
});

it('사주·종합 통변이 6개·4개 탭으로 만들어짐', () => {
  expect(sajuTongbyeon(saju, 'M').map((s) => s.title)).toEqual(['총론', '성격', '적성', '연애', '재물', '건강']);
  const c = combinedTongbyeon(saju, chart);
  expect(c.map((s) => s.title)).toEqual(['본모습', '힘이 나는 곳', '지금 시기', '재물', '채우면 좋은 점']);
  expect(c[0].paragraphs[0]).toContain('자미두수 명궁의 태양·천량은');
});

it('십신 무리가 동률이면 월지 격국 무리를 우선 (기준 사례: 비겁·재성·관성 각 30 → 편재격이라 재성)', () => {
  const t = sajuTongbyeon(saju, 'M');
  expect(t.find((x) => x.key === 'aptitude')!.paragraphs[0]).toContain('사람과 돈의 흐름');
});

it('사주 총론에 격국·용신·합충 풀이가 들어감', () => {
  const g = sajuTongbyeon(saju, 'M')[0].paragraphs.join(' ');
  expect(g).toContain('편재격');
  expect(g).toContain('용신)은 화');
  expect(g).toContain('亥寅 → 목: 일터와 집안·윗세대가');
});

it('같은 일간이라도 일지가 다르면 성격 풀이가 다름', () => {
  const a = sajuTongbyeon(saju, 'M')[1].paragraphs.join(' ');
  const other = computeSaju(normalizeBirth({ gender: 'M', calendar: 'solar', year: 1986, month: 12, day: 20, hour: 5, minute: 10 }));
  expect(other.dayMaster.hanja).toBe('戊');
  expect(sajuTongbyeon(other, 'M')[1].paragraphs.join(' ')).not.toBe(a);
});

it('출생시간 모름이면 기존처럼 간단한 안내', () => {
  const s = computeSaju(normalizeBirth({ gender: 'M', calendar: 'solar', year: 1986, month: 11, day: 20, timeUnknown: true }));
  expect(sajuTongbyeon(s, 'M')[2].paragraphs[0]).toContain('출생시간을 입력하면');
});

it('자미두수: 두 주성 조합, 밝기, 보좌·살성, 사화 전부, 그 밖의 궁', () => {
  const t = jamidusuTongbyeon(chart);
  const all = t.flatMap((s) => s.paragraphs).join(' ');
  expect(t.map((s) => s.title)).toContain('그 밖의 궁');
  expect(all).toContain('베푸는 마음과 어른스러움이 함께'); // 태양·천량 조합
  expect(all).toContain('태양(함)은 빛이 약한 자리');
  expect(all).toContain('돕는 별 좌보(곁에서 돕는 사람), 우필(뜻밖의 도움)이');
  expect(all).toContain('힘과 주도권(화권)');
  expect(t.find((s) => s.key === 'others')!.paragraphs).toHaveLength(7);
});

it('종합 통변: 지금 시기(대운+대한), 본모습 비교, 용신 기반 채우기', () => {
  const c = combinedTongbyeon(computeSaju(birth, { now: new Date(2026, 9, 17) }), chart, new Date(2026, 9, 17));
  expect(c.map((s) => s.title)).toEqual(['본모습', '힘이 나는 곳', '지금 시기', '재물', '채우면 좋은 점']);
  const now = c.find((s) => s.key === 'now')!.paragraphs.join(' ');
  expect(now).toContain('36세 癸卯 대운과 36-45세 대한');
  expect(now).toContain('천간에 정재가 들어온');
  expect(c.find((s) => s.key === 'fill')!.paragraphs[0]).toContain('가장 필요한 기운은 화예요');
});

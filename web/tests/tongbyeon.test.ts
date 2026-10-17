import { describe, expect, it } from 'vitest';
import { normalizeBirth } from '../src/engine/birth';
import { computeSaju } from '../src/engine/saju';
import { computeJamidusu, daehanChart } from '../src/engine/jamidusu';
import { combinedTongbyeon, jamidusuTongbyeon, sajuTongbyeon, type TongbyeonSection } from '../src/engine/tongbyeon';
import { renderTerms, type TermMode } from '../src/engine/terms';

const now = new Date(2026, 9, 17);
const birth = normalizeBirth({ gender: 'M', calendar: 'solar', year: 1986, month: 11, day: 20, hour: 5, minute: 10, cityId: 'seoul' });
const saju = computeSaju(birth, { now });
const chart = computeJamidusu(birth);
const text = (secs: TongbyeonSection[], mode: TermMode = 'plain') => secs.map((s) => ({ ...s, paragraphs: s.paragraphs.map((p) => renderTerms(p, mode)) }));
const all = (secs: TongbyeonSection[], mode: TermMode = 'plain') => text(secs, mode).flatMap((s) => s.paragraphs).join(' ');

describe('기획서 기준 문장 (용어로 보기)', () => {
  it('46세 대한 통변 총론은 "46-55세 대한 동안은 \'일·직업\' 분야가"로 시작', () => {
    const t = text(jamidusuTongbyeon(chart, daehanChart(chart, 46)), 'term');
    expect(t[0].paragraphs[0].startsWith("46-55세 대한 동안은 '일·직업' 분야가")).toBe(true);
  });
  it('관록궁은 비어 맞은편 천동·거문을 빌림', () => {
    const t = text(jamidusuTongbyeon(chart), 'term');
    expect(t.find((s) => s.key === 'aptitude')!.paragraphs[0]).toBe('관록궁은 주성이 비어 있어 맞은편 자리의 천동·거문 기운을 빌려 봐요.');
  });
});

describe('쉬운 말', () => {
  it('관록궁 설명이 쉬운 말 먼저, 용어는 괄호', () => {
    const t = text(jamidusuTongbyeon(chart));
    expect(t.find((s) => s.key === 'aptitude')!.paragraphs[0]).toBe('일·직업을 보는 자리(관록궁)는 중심 별(주성)이 비어 있어 맞은편 자리의 천동·거문 기운을 빌려 봐요.');
  });
  it('조사는 괄호 앞 낱말에 맞춤 (돈(정재)이 / 정재가)', () => {
    const p = combinedTongbyeon(saju, chart, now).find((s) => s.key === 'now')!.paragraphs[1];
    expect(renderTerms(p, 'plain')).toContain('성실하게 모으는 돈(정재)이 들어온');
    expect(renderTerms(p, 'term')).toContain('천간에 정재가 들어온');
  });
});

it('사주·종합 통변 탭 구성', () => {
  expect(sajuTongbyeon(saju, 'M').map((s) => s.title)).toEqual(['총론', '성격', '적성', '연애', '재물', '건강']);
  expect(combinedTongbyeon(saju, chart, now).map((s) => s.title)).toEqual(['본모습', '힘이 나는 곳', '지금 시기', '재물', '채우면 좋은 점']);
});

it('십신 무리가 동률이면 월지 격국 무리를 우선 (기준 사례: 편재격이라 재성)', () => {
  expect(text(sajuTongbyeon(saju, 'M')).find((x) => x.key === 'aptitude')!.paragraphs[0]).toContain('사람과 돈의 흐름');
});

it('사주 총론에 격국·용신·합충 풀이', () => {
  const g = text(sajuTongbyeon(saju, 'M'))[0].paragraphs.join(' ');
  expect(g).toContain('사주(편재격)예요');
  expect(g).toContain('가장 필요한 기운(용신)은 불 기운(화)이고');
  expect(g).toContain('해수와 인목이 서로 끌어당겨(합) 나무 기운(목)이 더해져요');
});

it('같은 일간이라도 일지가 다르면 성격 풀이가 다름', () => {
  const a = all([sajuTongbyeon(saju, 'M')[1]]);
  const other = computeSaju(normalizeBirth({ gender: 'M', calendar: 'solar', year: 1986, month: 12, day: 20, hour: 5, minute: 10 }));
  expect(other.dayMaster.hanja).toBe('戊');
  expect(all([sajuTongbyeon(other, 'M')[1]])).not.toBe(a);
});

it('출생시간 모름이면 간단한 안내', () => {
  const s = computeSaju(normalizeBirth({ gender: 'M', calendar: 'solar', year: 1986, month: 11, day: 20, timeUnknown: true }));
  expect(text(sajuTongbyeon(s, 'M'))[2].paragraphs[0]).toContain('출생시간을 입력하면');
});

it('자미두수: 두 주성 조합, 밝기, 보좌·살성, 사화, 그 밖의 궁', () => {
  const t = jamidusuTongbyeon(chart);
  const s = all(t);
  expect(t.map((x) => x.title)).toContain('그 밖의 궁');
  expect(s).toContain('베푸는 마음과 어른스러움이 함께');
  expect(s).toContain('태양(빛이 약함)은 별빛이 약한 자리');
  expect(s).toContain('돕는 별 좌보(곁에서 돕는 사람), 우필(뜻밖의 도움)이');
  expect(s).toContain('돕는 별 천월(숨은 조력자)이');
  expect(s).toContain('힘과 주도권(화권)은');
  expect(t.find((x) => x.key === 'others')!.paragraphs).toHaveLength(7);
});

it('종합 통변: 지금 시기, 용신 기반 채우기', () => {
  const c = text(combinedTongbyeon(saju, chart, now));
  const n = c.find((s) => s.key === 'now')!.paragraphs.join(' ');
  expect(n).toContain('36세 계묘 10년 운(대운)과 36-45세 10년 흐름(대한)이 겹치는');
  expect(c.find((s) => s.key === 'fill')!.paragraphs[0]).toContain('가장 필요한 기운(용신)은 불 기운(화)이에요');
});

// 기획서 7장 기준 사례 (자미두수)
import { describe, expect, it } from 'vitest';
import { normalizeBirth } from '../src/engine/birth';
import { computeJamidusu, daehanChart, spokenSummary, yunyeonChart, JamidusuUnavailableError } from '../src/engine/jamidusu';

const chart = computeJamidusu(
  normalizeBirth({ gender: 'M', calendar: 'solar', year: 1986, month: 11, day: 20, hour: 5, minute: 10, cityId: 'seoul' }),
);
const at = (branchHanja: string) => chart.palaces.find((p) => p.branchHanja === branchHanja)!;
const mains = (branchHanja: string) => at(branchHanja).stars.filter((s) => s.kind === 'main').map((s) => s.name);

describe('기준 사례 — 1986-11-20 05:10 남 서울', () => {
  it('명궁 유궁(정유), 태양·천량', () => {
    expect(at('酉').isMing).toBe(true);
    expect(at('酉').ganzhi).toBe('丁酉');
    expect(mains('酉')).toEqual(['태양', '천량']);
  });
  it('밝기: 태양 함, 천량 득', () => {
    const s = Object.fromEntries(at('酉').stars.map((x) => [x.name, x.brightness]));
    expect(s['태양']).toBe('함');
    expect(s['천량']).toBe('득');
  });
  it('신궁 축궁(관록궁), 화6국', () => {
    expect(at('丑').isShen).toBe(true);
    expect(at('丑').name).toBe('관록궁');
    expect(chart.guk.name).toBe('화6국');
  });
  it('병인년 사화: 천동 화록(부처궁), 염정 화기(질액궁)', () => {
    const lu = chart.sihwa.find((s) => s.sihwa === '록')!;
    const ji = chart.sihwa.find((s) => s.sihwa === '기')!;
    expect([lu.star, lu.palace]).toEqual(['천동', '부처궁']);
    expect([ji.star, ji.palace]).toEqual(['염정', '질액궁']);
  });
  it('관록궁은 비어 있고 맞은편은 천동·거문', () => {
    expect(mains('丑')).toEqual([]);
    expect(mains('未').sort()).toEqual(['거문', '천동']);
  });
  it('대한: 명궁 6-15세, 46세는 관록궁', () => {
    expect(at('酉').daehan).toEqual({ start: 6, end: 15 });
    const d = daehanChart(chart, 46);
    expect(d.label).toBe('46-55세 대한');
    expect(chart.palaces[d.mingBranch].name).toBe('관록궁');
  });
  it('유년 명궁은 그해 지지', () => {
    expect(yunyeonChart(chart, 2026).mingBranch).toBe(6); // 午
  });
  it('낭독 요약', () => {
    expect(spokenSummary(chart, 9)).toBe('명궁 정유, 대한 6-15세, 태양 함, 천량 득, 두 번 탭하면 상세 보기');
  });
  it('14주성이 모두 한 번씩 배치됨', () => {
    const all = chart.palaces.flatMap((p) => p.stars.filter((s) => s.kind === 'main').map((s) => s.name));
    expect(all).toHaveLength(14);
    expect(new Set(all).size).toBe(14);
  });
});

it('출생시간 모름이면 명반을 만들지 않음', () => {
  const n = normalizeBirth({ gender: 'F', calendar: 'solar', year: 1986, month: 11, day: 20, timeUnknown: true });
  expect(() => computeJamidusu(n)).toThrow(JamidusuUnavailableError);
});

it('윤달 처리: same = 같은 달, mid(기본) = 16일부터 다음 달, next = 다음 달 (1987-08-12 = 윤6월 18일)', () => {
  const same = computeJamidusu(normalizeBirth({ gender: 'M', calendar: 'solar', year: 1987, month: 8, day: 12, hour: 10, leapMode: 'same' }));
  const sameLunarInput = computeJamidusu(normalizeBirth({ gender: 'M', calendar: 'lunarLeap', year: 1987, month: 6, day: 18, hour: 10, leapMode: 'same' }));
  expect(sameLunarInput.palaces).toEqual(same.palaces);
  expect(same.lunar.month).toBe(6);
  const mid = computeJamidusu(normalizeBirth({ gender: 'M', calendar: 'solar', year: 1987, month: 8, day: 12, hour: 10 }));
  const july = computeJamidusu(normalizeBirth({ gender: 'M', calendar: 'lunar', year: 1987, month: 7, day: 18, hour: 10 }));
  // 18일이라 다음 달(7월)로 배치: 명궁·신궁 위치가 음력 7월 18일생과 같음
  expect(mid.mingBranch).toBe(july.mingBranch);
  expect(mid.shenBranch).toBe(july.shenBranch);
  expect(mid.mingBranch).not.toBe(same.mingBranch);
  const early = computeJamidusu(normalizeBirth({ gender: 'M', calendar: 'lunarLeap', year: 1987, month: 6, day: 10, hour: 10 }));
  const earlySame = computeJamidusu(normalizeBirth({ gender: 'M', calendar: 'lunarLeap', year: 1987, month: 6, day: 10, hour: 10, leapMode: 'same' }));
  expect(early.mingBranch).toBe(earlySame.mingBranch); // 15일까지는 이번 달
});

it('23시대 자시: 기본은 다음 날 음력, 야자시(same)는 당일 음력', () => {
  const next = computeJamidusu(normalizeBirth({ gender: 'F', calendar: 'solar', year: 1995, month: 3, day: 15, hour: 23, minute: 50 }));
  const same = computeJamidusu(normalizeBirth({ gender: 'F', calendar: 'solar', year: 1995, month: 3, day: 15, hour: 23, minute: 50, jasi: 'same' }));
  expect(next.lunar.day).toBe(same.lunar.day + 1);
  expect(next.hourBranch).toBe(0);
  expect(same.hourBranch).toBe(0);
});

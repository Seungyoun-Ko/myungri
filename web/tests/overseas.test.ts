// 해외 출생지: 현지 시간대(서머타임 포함)와 현지 태양시 계산
import { describe, expect, it } from 'vitest';
import { BirthInputError, normalizeBirth } from '../src/engine/birth';
import { computeSaju } from '../src/engine/saju';
import { computeJamidusu } from '../src/engine/jamidusu';

const base = { gender: 'F', calendar: 'solar' } as const;

describe('해외 출생지', () => {
  it('뉴욕 서머타임: UTC−4로 보고, 현지 태양시는 경도 기준으로 보정', () => {
    const b = normalizeBirth({ ...base, year: 1990, month: 5, day: 15, hour: 8, minute: 30, cityId: 'us-new-york' });
    expect(b.utcOffset).toBe(-240);
    // 12:30 UTC → UTC+8 20:30
    expect(b.termClock).toEqual({ year: 1990, month: 5, day: 15, hour: 20, minute: 30 });
    // 현지 태양시 = UTC + 경도×4분 (−74.006° → −296분) = 07:34
    expect(b.corrected).toEqual({ year: 1990, month: 5, day: 15, hour: 7, minute: 34 });
    expect(b.corrections).toEqual({ meridian: 0, dst: -60, longitude: 4 });
  });

  it('현지 표준시를 고르면 서머타임만 뺌', () => {
    const b = normalizeBirth({ ...base, year: 1990, month: 5, day: 15, hour: 8, minute: 30, cityId: 'us-new-york', solarTime: false });
    expect(b.corrected).toEqual({ year: 1990, month: 5, day: 15, hour: 7, minute: 30 });
  });

  it('서머타임 시작으로 없는 시각은 오류', () => {
    expect(() => normalizeBirth({ ...base, year: 2021, month: 3, day: 14, hour: 2, minute: 30, cityId: 'us-new-york' })).toThrow(BirthInputError);
  });

  it('서머타임이 끝나 두 번 있는 시각은 앞/뒤를 고를 수 있음', () => {
    const first = normalizeBirth({ ...base, year: 2021, month: 11, day: 7, hour: 1, minute: 30, cityId: 'us-new-york', fold: 'first' });
    const second = normalizeBirth({ ...base, year: 2021, month: 11, day: 7, hour: 1, minute: 30, cityId: 'us-new-york', fold: 'second' });
    expect(first.inFold).toBe(true);
    expect(first.utcOffset).toBe(-240);
    expect(second.utcOffset).toBe(-300);
    expect(second.termClock!.hour - first.termClock!.hour).toBe(1);
  });

  it('남반구(시드니) 서머타임도 반영', () => {
    const b = normalizeBirth({ ...base, year: 2000, month: 1, day: 10, hour: 12, minute: 0, cityId: 'au-sydney' });
    expect(b.utcOffset).toBe(660);
  });

  it('출생시간을 모르면 그 지역 기준으로 절입 시각을 알려 줌 (런던 2024 입춘)', () => {
    const b = normalizeBirth({ ...base, year: 2024, month: 2, day: 4, timeUnknown: true, cityId: 'gb-london' });
    const s = computeSaju(b, { now: new Date('2026-10-20') });
    expect(s.boundaryTerm?.name).toBe('입춘');
    expect(s.boundaryTerm?.clock.hour).toBe(8);
  });

  it('해외 출생도 사주·자미두수 계산이 끝까지 됨', () => {
    for (const cityId of ['us-los-angeles', 'gb-london', 'tw-taipei', 'in-delhi', 'br-sao-paulo']) {
      const b = normalizeBirth({ ...base, year: 1985, month: 8, day: 20, hour: 23, minute: 40, cityId });
      const s = computeSaju(b, { now: new Date('2026-10-20') });
      expect(s.pillars).toHaveLength(4);
      expect(computeJamidusu(b).palaces).toHaveLength(12);
    }
  });

  it('자미두수: 보정 시각이 자정을 넘어 자시 밖(해시)에 떨어지면 보정된 날짜의 음력을 씀', () => {
    // 마드리드 서머타임 00:30 → 현지 태양시 전날 22:15(해시). 시계 날짜 7/10 = 음력 6/13, 전날 7/9 = 음력 6/12
    const b = normalizeBirth({ ...base, year: 1995, month: 7, day: 10, hour: 0, minute: 30, cityId: 'es-madrid' });
    expect(b.corrected).toEqual({ year: 1995, month: 7, day: 9, hour: 22, minute: 15 });
    const j = computeJamidusu(b);
    expect(j.hourBranch).toBe(11);
    expect(j.lunar).toEqual({ year: 1995, month: 6, day: 12, leap: false });
    // 보정 후에도 자시(23~1시)에 머물면 한국 도시처럼 시계 날짜를 그대로 씀
    const z = normalizeBirth({ ...base, year: 1995, month: 7, day: 10, hour: 1, minute: 30, cityId: 'es-madrid' });
    expect(z.corrected!.day).toBe(9);
    expect(computeJamidusu(z).lunar).toEqual({ year: 1995, month: 6, day: 13, leap: false });
    // 한국 도시: 00:10 → 전날 23:40이어도 시계 날짜
    expect(computeJamidusu(normalizeBirth({ ...base, year: 1995, month: 7, day: 10, hour: 0, minute: 10, cityId: 'seoul' })).lunar.day).toBe(13);
  });

  it('한국 도시는 예전과 같은 규칙', () => {
    const b = normalizeBirth({ ...base, year: 1988, month: 7, day: 1, hour: 10, minute: 0, cityId: 'seoul' });
    expect(b.corrections).toEqual({ meridian: -30, dst: -60, longitude: 0 });
    expect(b.utcOffset).toBeUndefined();
  });
});

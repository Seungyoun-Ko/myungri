// 기획서 7장 기준 사례 (사주)
import { describe, expect, it } from 'vitest';
import { normalizeBirth, type BirthInput } from '../src/engine/birth';
import { computeSaju } from '../src/engine/saju';

const base: BirthInput = { gender: 'M', calendar: 'solar', year: 2000, month: 1, day: 1, cityId: 'seoul' };
const run = (p: Partial<BirthInput>) => computeSaju(normalizeBirth({ ...base, ...p }), { now: new Date(2026, 9, 16) });
const gz = (r: ReturnType<typeof run>, key: string) => {
  const p = r.pillars.find((x) => x.key === key)!;
  return p.stem.hanja + p.branch.hanja;
};

describe('기준 사례 — 사주', () => {
  it('1986-11-20 05:10 남 서울 → 戊辰일주', () => {
    const r = run({ year: 1986, month: 11, day: 20, hour: 5, minute: 10 });
    expect(gz(r, 'day')).toBe('戊辰');
  });

  it('2026-10-08 15:05 (한로 15:29 전) → 월주 丁酉, 시지 未', () => {
    const r = run({ year: 2026, month: 10, day: 8, hour: 15, minute: 5 });
    expect(gz(r, 'month')).toBe('丁酉');
    expect(r.pillars[0].branch.hanja).toBe('未');
  });

  it('2026-10-08 15:28 / 15:30 → 丁酉 / 戊戌', () => {
    expect(gz(run({ year: 2026, month: 10, day: 8, hour: 15, minute: 28 }), 'month')).toBe('丁酉');
    expect(gz(run({ year: 2026, month: 10, day: 8, hour: 15, minute: 30 }), 'month')).toBe('戊戌');
  });

  it('2026-02-04 04:50 남 (입춘 05:02 전) → 乙巳년 己丑월, 첫 대운 戊子(역행)', () => {
    const r = run({ year: 2026, month: 2, day: 4, hour: 4, minute: 50 });
    expect(gz(r, 'year')).toBe('乙巳');
    expect(gz(r, 'month')).toBe('己丑');
    expect(r.bigFortunes[0].ganzhi).toBe('戊子');
    expect(r.bigFortuneForward).toBe(false);
    expect(r.bigFortunes).toHaveLength(8);
  });

  it('2026-02-04 05:10 → 丙午년 庚寅월', () => {
    const r = run({ year: 2026, month: 2, day: 4, hour: 5, minute: 10 });
    expect(gz(r, 'year')).toBe('丙午');
    expect(gz(r, 'month')).toBe('庚寅');
  });

  it('1986-11-20 출생시간 모름 → 일·월·년만, 불확실 기둥은 시뿐', () => {
    const r = run({ year: 1986, month: 11, day: 20, timeUnknown: true });
    expect(r.pillars.map((p) => p.key)).toEqual(['day', 'month', 'year']);
    expect(r.uncertainPillars).toEqual(['hour']);
    expect(r.boundaryTerm).toBeNull();
    expect(r.strengthText).toBeNull();
  });

  it('2026-02-04 출생시간 모름 → 불확실 시·월·년, 입춘 05:02 전후', () => {
    const r = run({ year: 2026, month: 2, day: 4, timeUnknown: true });
    expect(new Set(r.uncertainPillars)).toEqual(new Set(['hour', 'month', 'year']));
    expect(r.boundaryTerm).toMatchObject({
      name: '입춘',
      clock: { hour: 5, minute: 2 },
      before: { year: '乙巳', month: '己丑' },
      after: { year: '丙午', month: '庚寅' },
    });
  });

  it('2026-10-08 출생시간 모름 → 한로 절입일, 전 丁酉 / 후 戊戌', () => {
    const r = run({ year: 2026, month: 10, day: 8, timeUnknown: true });
    expect(r.boundaryTerm?.name).toBe('한로');
    expect(r.boundaryTerm?.before.month).toBe('丁酉');
    expect(r.boundaryTerm?.after.month).toBe('戊戌');
  });

  it('1987-08-12 양력 = 음력 윤6월 18일 → 결과 같음', () => {
    const a = run({ year: 1987, month: 8, day: 12, hour: 10, minute: 0 });
    const b = run({ calendar: 'lunarLeap', year: 1987, month: 6, day: 18, hour: 10, minute: 0 });
    expect(b.pillars).toEqual(a.pillars);
  });
});

describe('시간 보정', () => {
  it('서울 경도 보정은 −2분, 기본 보정은 −30분', () => {
    const n = normalizeBirth({ ...base, hour: 12, minute: 0, useLongitude: true });
    expect(n.corrections).toEqual({ meridian: -30, dst: 0, longitude: -2 });
  });
  it('1955년 서머타임 + 127.5도 시기', () => {
    const n = normalizeBirth({ ...base, year: 1955, month: 7, day: 1, hour: 12, minute: 0 });
    expect(n.corrections).toEqual({ meridian: 0, dst: -60, longitude: 0 });
  });
  it('서머타임 시작 직후 없는 시각은 막음', () => {
    expect(() => normalizeBirth({ ...base, year: 1987, month: 5, day: 10, hour: 2, minute: 30 })).toThrow();
    expect(() => normalizeBirth({ ...base, year: 1961, month: 8, day: 10, hour: 0, minute: 10 })).toThrow();
  });
  it('겹치는 시각은 앞/뒤 선택', () => {
    const first = normalizeBirth({ ...base, year: 1987, month: 10, day: 11, hour: 2, minute: 30, fold: 'first' });
    const second = normalizeBirth({ ...base, year: 1987, month: 10, day: 11, hour: 2, minute: 30, fold: 'second' });
    expect(first.inFold).toBe(true);
    expect(first.corrections.dst).toBe(-60);
    expect(second.corrections.dst).toBe(0);
  });
});

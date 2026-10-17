import { expect, it } from 'vitest';
import { dayPillars, monthDays } from '../src/engine/calendar';

it('달력 2026년 2월: 입춘 2/4 05:02, 그날 년 乙巳→丙午', () => {
  const feb = monthDays(2026, 2);
  expect(feb[3].terms).toEqual([{ name: '입춘', hour: 5, minute: 2 }]);
  expect(dayPillars(2026, 2, 4, 5, 0).year).toBe('乙巳');
  expect(dayPillars(2026, 2, 4, 5, 10).year).toBe('丙午');
});

it('1987년 8월 12일은 음력 윤6월 18일', () => {
  const d = monthDays(1987, 8)[11];
  expect(d.lunar).toEqual({ month: 6, day: 18, leap: true });
});

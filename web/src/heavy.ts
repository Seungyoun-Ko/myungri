// 계산과 결과 화면처럼 무거운 코드(lunar-javascript 포함)를 한데 모은 묶음.
// 첫 화면을 빨리 띄우려고 main.ts에서 나중에 불러옵니다.
import { normalizeBirth, type BirthInput } from './engine/birth';
import { computeSaju } from './engine/saju';
import { computeJamidusu } from './engine/jamidusu';
import type { Snapshot } from './archive';

export function calculate(input: BirthInput): Snapshot {
  const birth = normalizeBirth(input);
  const saju = computeSaju(birth);
  const chart = birth.timeUnknown ? null : computeJamidusu(birth);
  return { birth, saju, chart };
}

export { initialResultState, renderResult } from './ui/result';
export { renderCalendar } from './ui/calendar-view';

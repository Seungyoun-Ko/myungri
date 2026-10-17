// 통변 보기 방식: 쉬운 말(기본) / 용어로 보기. 이 브라우저에만 기억합니다.
import type { TermMode } from '../engine/terms';

const KEY = 'inseol.termMode';
let mode: TermMode = 'plain';
try {
  if (localStorage.getItem(KEY) === 'term') mode = 'term';
} catch {
  /* 저장소를 못 쓰면 기본값 */
}

export const getTermMode = () => mode;

export function toggleTermMode(): TermMode {
  mode = mode === 'plain' ? 'term' : 'plain';
  try {
    localStorage.setItem(KEY, mode);
  } catch {
    /* 무시 */
  }
  return mode;
}

/** 통변 카드 머리의 전환 버튼 */
export const termToggleButton = () =>
  `<button type="button" class="term-toggle" data-term-toggle aria-pressed="${mode === 'term'}" title="전문 용어로 보기를 켜고 끕니다">${mode === 'term' ? '용어로 보는 중' : '용어로 보기'}</button>`;

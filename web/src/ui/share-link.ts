// 결과 링크: 입력값(이름 제외)을 주소의 # 뒤에 담습니다. # 뒤는 서버로 전송되지 않습니다.
import type { BirthInput } from '../engine/birth';
import { toast } from './dom';
import { tr } from '../i18n';

const KEYS = ['gender', 'calendar', 'year', 'month', 'day', 'hour', 'minute', 'timeUnknown', 'cityId', 'useLongitude', 'fold', 'solarTime', 'jasi', 'leapMode'] as const;

export function encodeInput(input: BirthInput): string {
  const o: Record<string, unknown> = {};
  for (const k of KEYS) if (input[k] !== undefined && input[k] !== false) o[k] = input[k];
  const json = JSON.stringify(o);
  return btoa(String.fromCharCode(...new TextEncoder().encode(json))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeInput(code: string): BirthInput | null {
  try {
    const b64 = code.replace(/-/g, '+').replace(/_/g, '/');
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const o = JSON.parse(new TextDecoder().decode(bytes));
    if (!o || typeof o.year !== 'number' || (o.gender !== 'M' && o.gender !== 'F')) return null;
    const out: Record<string, unknown> = { name: '' };
    for (const k of KEYS) if (o[k] !== undefined) out[k] = o[k];
    return out as unknown as BirthInput;
  } catch {
    return null;
  }
}

export const resultLink = (input: BirthInput) => `${location.origin}${location.pathname}#/r/${encodeInput(input)}`;

/** 결과 링크를 공유(휴대폰)하거나 복사합니다. 링크에 생년월일시가 들어 있음을 알려 줍니다. */
export async function shareResultLink(input: BirthInput) {
  const url = resultLink(input);
  const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
  if (nav.share && window.matchMedia('(pointer: coarse)').matches) {
    try {
      await nav.share({ url, title: tr('인설명리 · 내 사주 풀이', 'Inseol Saju · my reading') });
      return;
    } catch (e) {
      if ((e as DOMException).name === 'AbortError') return;
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    toast(tr('결과 링크를 복사했어요. 링크에는 생년월일시가 들어 있어요(이름은 빠져요).', 'Link copied. It contains the birth date and time, but not the name.'));
  } catch {
    window.prompt(tr('이 링크를 복사하세요', 'Copy this link'), url);
  }
}

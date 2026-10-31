// 사주로 본 'MBTI로 치면' 유형 (재미로 보는 비교). 공식 MBTI 검사가 아니며, 사주 계산값으로 가까운 쪽을 고릅니다.
// E/I: 드러내는 기운(식상·재성) vs 안으로 모으는 기운(인성·비겁), 양간·음간, 사람을 끄는 기운(도화·역마)
// S/N: 현실 감각(흙·쇠, 재성) vs 직관·상상(나무·물, 인성·상관)
// T/F: 판단·원칙(쇠, 관성, 편재) vs 감정·공감(불, 식신, 정인)
// J/P: 계획·질서(정관·정재·정인·식신) vs 즉흥·변화(편관·편재·편인·상관)
import type { SajuResult } from './saju';

export interface MbtiLike {
  code: string;
  /** 글자마다 왜 그쪽인지 (명리 근거 한 줄) */
  reasons: { letter: string; why: string; whyEn: string }[];
}

/** 축마다 가운데 값 (무작위 3,000명 기준으로 맞춘 보정값) */
export const MBTI_OFFSET = { E: 0, S: 2.3, T: 17.8, J: -9 };

export function mbtiLike(r: SajuResult): MbtiLike | null {
  const tg = r.tenGodRatios;
  const el = r.elementRatios;
  if (!tg || !el) return null;
  const pct = (n: number) => Math.round(n);
  const output = tg['식신'] + tg['상관'];
  const wealth = tg['편재'] + tg['정재'];
  const resource = tg['편인'] + tg['정인'];
  const peers = tg['비견'] + tg['겁재'];
  const officer = tg['편관'] + tg['정관'];
  const yang = r.dayMaster.index % 2 === 0;
  const day = r.pillars.find((p) => p.key === 'day')!.branch.index;
  const year = r.pillars.find((p) => p.key === 'year')?.branch.index;
  // 도화(子午卯酉)·역마(寅申巳亥) 글자가 년·일지에 있으면 사람을 끄는 쪽으로 조금 더함
  const social = [day, year].filter((b) => b !== undefined && [0, 3, 6, 9, 2, 5, 8, 11].includes(b)).length;

  const eScore = output + wealth - (resource + peers) + (yang ? 10 : -10) + social * 4;
  const sScore = el[2] + el[3] + wealth / 2 - (el[0] + el[4] + resource / 2 + tg['상관'] / 2);
  const tScore = el[3] + officer + tg['편재'] / 2 - (el[1] + tg['식신'] + tg['정인']);
  const jScore = tg['정관'] + tg['정재'] + tg['정인'] + tg['식신'] - (tg['편관'] + tg['편재'] + tg['편인'] + tg['상관']);

  const E = eScore >= MBTI_OFFSET.E;
  const S = sScore >= MBTI_OFFSET.S;
  const T = tScore >= MBTI_OFFSET.T;
  const J = jScore >= MBTI_OFFSET.J;
  return {
    code: `${E ? 'E' : 'I'}${S ? 'S' : 'N'}${T ? 'T' : 'F'}${J ? 'J' : 'P'}`,
    reasons: [
      {
        letter: E ? 'E' : 'I',
        why: E ? '드러내는 기운(표현·재물)이 안으로 모으는 기운(배움·내 편)보다 강한 편이에요' : '안으로 모으는 기운(배움·내 편)이 드러내는 기운(표현·재물)보다 강한 편이에요',
        whyEn: E ? 'Outward energies (expression, wealth) outweigh inward ones (learning, allies)' : 'Inward energies (learning, allies) outweigh outward ones (expression, wealth)',
      },
      {
        letter: S ? 'S' : 'N',
        why: S ? '현실 감각의 흙·쇠 기운이 다른 사람들보다 강한 편이에요' : '직관과 상상의 나무·물 기운이 다른 사람들보다 강한 편이에요',
        whyEn: S ? 'Grounded Earth and Metal run stronger than in most charts' : 'Intuitive Wood and Water run stronger than in most charts',
      },
      {
        letter: T ? 'T' : 'F',
        why: T ? '판단과 원칙의 기운(쇠·책임)이 다른 사람들보다 강한 편이에요' : '공감과 다정함의 기운(불·보살핌)이 다른 사람들보다 강한 편이에요',
        whyEn: T ? 'Judgment and principle (Metal, responsibility) run stronger than in most charts' : 'Warmth and empathy (Fire, nurturing) run stronger than in most charts',
      },
      {
        letter: J ? 'J' : 'P',
        why: J ? '차곡차곡 쌓는 바른 기운이 다른 사람들보다 강한 편이에요' : '즉흥과 변화를 즐기는 기운이 다른 사람들보다 강한 편이에요',
        whyEn: J ? 'Steady, orderly energies run stronger than in most charts' : 'Spontaneous, changeable energies run stronger than in most charts',
      },
    ],
  };
}

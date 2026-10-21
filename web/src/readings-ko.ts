import { sajuReading, yearReading } from './engine/reading';
import { bigReading, lifeGraph, monthReading } from './engine/reading/flow';
import { combinedReading, jamiReading } from './engine/reading/jami';
import { MATCH_A } from './engine/reading/match-a';
import { MATCH_B } from './engine/reading/match-b';
import { DISCLAIMER } from './engine/tongbyeon-data';
import type { ReadingFns } from './ui/readings';

const MATCH_BRANCH = {
  hap: '두 사람의 생활 리듬과 바탕 기운이 서로 끌어당기는 사이예요. 함께 있으면 편안함을 느끼기 쉽고, 말하지 않아도 마음이 통하는 순간이 자주 찾아와요.',
  chung: '생활의 바탕 기운이 서로 부딪치는 사이예요. 처음엔 새롭고 자극이 되지만 생활 습관이나 속도 차이로 다투기 쉬워요. 서로의 방식을 틀림이 아니라 다름으로 받아들이기로 정해 두면, 부딪침이 오히려 활력이 돼요.',
  same: '생활의 바탕 기운이 같은 사이예요. 닮은 점이 많아 금세 편해지지만 같은 약점도 함께 가지기 쉬워요. 둘 다 부족한 부분은 다른 사람의 조언이나 습관으로 채워 두면 좋아요.',
};

export const fns: ReadingFns = {
  saju: sajuReading,
  year: yearReading,
  big: bigReading,
  month: monthReading,
  life: lifeGraph,
  jami: jamiReading,
  combined: combinedReading,
  disclaimer: DISCLAIMER,
  match: { pairs: { ...MATCH_A, ...MATCH_B }, branch: MATCH_BRANCH },
};

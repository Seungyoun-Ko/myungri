import { DISCLAIMER, sajuReadingEn, yearReadingEn } from './engine/reading/en';
import { bigReadingEn, lifeGraphEn, monthReadingEn } from './engine/reading/en/flow';
import { combinedReadingEn, jamiReadingEn } from './engine/reading/en/jami';
import { MATCH_A } from './engine/reading/en/match-a';
import { MATCH_B } from './engine/reading/en/match-b';
import type { ReadingFns } from './ui/readings';

const MATCH_BRANCH = {
  hap: "Your everyday rhythms pull toward each other. Being together tends to feel easy, and there are plenty of moments when you understand each other without a word.",
  chung: "Your everyday rhythms push against each other. At first that feels fresh and exciting, but different habits and speeds can spark arguments. Agree early that different isn't wrong, and the friction turns into energy.",
  same: "You share the same everyday rhythm. So much feels familiar that you get comfortable fast, but you can also share the same blind spots. Fill those gaps with outside advice or good habits.",
};

export const fns: ReadingFns = {
  saju: sajuReadingEn,
  year: yearReadingEn,
  big: bigReadingEn,
  month: monthReadingEn,
  life: lifeGraphEn,
  jami: jamiReadingEn,
  combined: combinedReadingEn,
  disclaimer: DISCLAIMER,
  match: { pairs: { ...MATCH_A, ...MATCH_B }, branch: MATCH_BRANCH },
};

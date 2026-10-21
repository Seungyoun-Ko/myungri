import { DISCLAIMER, sajuReadingEn, yearReadingEn } from './engine/reading/en';
import { bigReadingEn, lifeGraphEn, monthReadingEn } from './engine/reading/en/flow';
import { combinedReadingEn, jamiReadingEn } from './engine/reading/en/jami';
import type { ReadingFns } from './ui/readings';

export const fns: ReadingFns = { saju: sajuReadingEn, year: yearReadingEn, big: bigReadingEn, month: monthReadingEn, life: lifeGraphEn, jami: jamiReadingEn, combined: combinedReadingEn, disclaimer: DISCLAIMER };

import { sajuReading, yearReading } from './engine/reading';
import { bigReading, lifeGraph, monthReading } from './engine/reading/flow';
import { combinedReading, jamiReading } from './engine/reading/jami';
import { DISCLAIMER } from './engine/tongbyeon-data';
import type { ReadingFns } from './ui/readings';

export const fns: ReadingFns = { saju: sajuReading, year: yearReading, big: bigReading, month: monthReading, life: lifeGraph, jami: jamiReading, combined: combinedReading, disclaimer: DISCLAIMER };

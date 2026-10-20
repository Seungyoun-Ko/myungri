// English Zi Wei Dou Shu reading and combined (saju + Zi Wei) reading. Logic mirrors ../jami.ts.
import type { JamidusuChart, OverlayChart, PalaceName, Sihwa } from '../../jamidusu';
import { daehanChart } from '../../jamidusu';
import type { SajuResult, TenGodGroup } from '../../saju';
import { TEN_GOD_GROUPS } from '../../saju';
import type { ReadingSection } from '../index';
import { groupRatios } from '../shared';
import type { StarReading, TenGodName } from '../types';
import { favorOfScore, fortuneScore } from '../shared';
import {
  BRANCH_EN, BRIGHTNESS_EN, ELEMENT_EN, GROUP_EN, PALACE_EN, PALACE_FIELD_EN, SIHWA_EN, STRENGTH_EN, TEN_GOD_EN,
  geukEn, gukEn, starEn, stemLabelEn,
} from '../../en-labels';
import { STARS_A } from './jami-stars-a';
import { STARS_B } from './jami-stars-b';
import { JAMI_EXTRA, PALACES } from './jami-palaces';
import { ELEMENT_LACK, GEUK, LUCKY } from './elements';
import { GROUP_MANY } from './groups';
import { WEALTH_AMOUNT } from './love';
import { BIG, BIG_FAVOR } from './big';
import { DAY_MASTER, HEALTH_DISCLAIMER } from './index';

export const STARS: Record<string, StarReading> = { ...STARS_A, ...STARS_B };

type Field = 'self' | 'work' | 'money' | 'love' | 'health' | 'relations' | 'life';
const FIELD_OF: Record<PalaceName, Field> = {
  명궁: 'self', 형제궁: 'relations', 부처궁: 'love', 자녀궁: 'relations', 재백궁: 'money', 질액궁: 'health',
  천이궁: 'life', 노복궁: 'relations', 관록궁: 'work', 전택궁: 'money', 복덕궁: 'life', 부모궁: 'relations',
};
const STRONG = new Set(['묘', '왕']);
const WEAK = new Set(['불', '함']);
const SIHWA_PLAIN: Record<Sihwa, string> = { 록: 'Where good fortune gathers', 권: 'Where your influence grows', 과: 'Where reputation follows', 기: 'Where to take extra care' };

const field = (n: PalaceName) => PALACE_FIELD_EN[n];
const area = (n: PalaceName) => (n === '명궁' ? 'your self area' : `the ${field(n)} area`);
const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
const firstSentences = (t: string, k: number) => (t.match(/[^.!?]+[.!?]+["']?/g) ?? [t]).slice(0, k).map((x) => x.trim()).join(' ');
const palaceTerm = (n: PalaceName) => `${PALACE_EN[n]} palace`;
const sihwaTerm = (k: Sihwa) => `Hua ${SIHWA_EN[k]}`;

interface PalaceView {
  name: PalaceName;
  names: string[];
  borrowed: boolean;
  paragraphs: string[];
  basis: string;
}

function palaceView(chart: JamidusuChart, branch: number, name: PalaceName, overlay?: OverlayChart, withBrightness = true): PalaceView {
  const p = chart.palaces[branch];
  const ownMains = p.stars.filter((s) => s.kind === 'main');
  const borrowed = ownMains.length === 0;
  const opposite = chart.palaces[(branch + 6) % 12];
  const mains = borrowed ? opposite.stars.filter((s) => s.kind === 'main') : ownMains;
  const f = FIELD_OF[name];
  const paras: string[] = [];
  if (borrowed) paras.push(PALACES[name].empty);
  for (const m of mains) if (STARS[m.name]) paras.push(STARS[m.name][f]);
  if (!borrowed && withBrightness) {
    if (ownMains.some((s) => STRONG.has(s.brightness))) paras.push(JAMI_EXTRA.bright[branch % 2]);
    else if (ownMains.some((s) => WEAK.has(s.brightness))) paras.push(JAMI_EXTRA.dim[branch % 2]);
  }
  for (const s of p.stars) {
    if (s.kind === 'aux' && JAMI_EXTRA.aux[s.name]) paras.push(JAMI_EXTRA.aux[s.name]);
    if (s.kind === 'sal' && JAMI_EXTRA.sal[s.name]) paras.push(JAMI_EXTRA.sal[s.name]);
  }
  for (const s of p.stars) if (s.sihwa && s.kind !== 'minor') paras.push(JAMI_EXTRA.sihwa[s.sihwa].natal);
  for (const h of overlay?.sihwa.filter((x) => x.branch === branch) ?? []) paras.push(JAMI_EXTRA.sihwa[h.sihwa].period);
  const starBasis = p.stars
    .filter((s) => s.kind !== 'minor')
    .map((s) => `${starEn(s)}${s.kind === 'main' && s.brightness ? ` (${BRIGHTNESS_EN[s.brightness] ?? s.brightness})` : ''}${s.sihwa ? ` · ${sihwaTerm(s.sihwa)}` : ''}`)
    .join(', ');
  return {
    name,
    names: mains.map((m) => m.name),
    borrowed,
    paragraphs: [...new Set(paras)],
    basis: `${palaceTerm(name)} (${BRANCH_EN[branch]}): ${starBasis || 'no main star'}${borrowed ? ` → borrows the main stars of the opposite ${palaceTerm(opposite.name)}` : ''}`,
  };
}

const nicks = (names: string[]) =>
  names
    .filter((n) => STARS[n])
    .map((n) => `the '${STARS[n].nick}'`)
    .join(' and ');
const headlineOf = (v: PalaceView) =>
  v.borrowed ? `${cap(area(v.name))} is empty, so it borrows ${nicks(v.names)} from across the chart` : `${cap(area(v.name))} holds ${nicks(v.names)}`;

export function jamiReadingEn(chart: JamidusuChart, overlay?: OverlayChart): ReadingSection[] {
  const names: PalaceName[] = overlay ? overlay.names : chart.palaces.map((p) => p.name);
  const branchOf = (n: PalaceName) => names.indexOf(n);
  const view = (n: PalaceName) => palaceView(chart, branchOf(n), n, overlay);
  const sihwaList = overlay ? overlay.sihwa.map((s) => ({ kind: s.sihwa, branch: s.branch, star: s.star })) : chart.sihwa.map((s) => ({ kind: s.sihwa, branch: s.branch, star: s.star }));
  const sihwaFacts = sihwaList.map((s) => ({ label: SIHWA_PLAIN[s.kind], value: cap(field(names[s.branch])) }));
  const sihwaBasis = sihwaList.map((s) => `${sihwaTerm(s.kind)} ${starEn({ name: s.star })}: ${palaceTerm(names[s.branch])}`).join(' · ');

  const sections: ReadingSection[] = [];

  if (overlay) {
    const center = chart.palaces[overlay.mingBranch];
    const centerMains = (center.stars.some((s) => s.kind === 'main') ? center : chart.palaces[(overlay.mingBranch + 6) % 12]).stars.filter((s) => s.kind === 'main');
    const when = overlay.kind === 'daehan' ? `Ages ${overlay.range!.start}–${overlay.range!.end}` : `The year ${overlay.year}`;
    sections.push({
      key: 'now',
      title: 'This period',
      headline: { label: when, text: `During this period, ${field(center.name)} tends to become the central theme of your life` },
      keywords: centerMains.filter((s) => STARS[s.name]).map((s) => STARS[s.name].keywords[0]),
      paragraphs: [...centerMains.filter((s) => STARS[s.name]).map((s) => STARS[s.name].flow), ...overlay.sihwa.map((s) => `${cap(area(names[s.branch]))}: ${JAMI_EXTRA.sihwa[s.sihwa].period}`)],
      facts: sihwaFacts,
      basis: [`${overlay.kind === 'daehan' ? `Decade chart ${overlay.range!.start}–${overlay.range!.end}` : `Annual chart ${overlay.year}`}: Life palace at ${BRANCH_EN[center.branch]} (natal ${palaceTerm(center.name)})`, sihwaBasis],
    });
  }

  const self = palaceView(chart, chart.mingBranch, '명궁');
  const mingStars = self.names.filter((n) => STARS[n]);
  const shen = chart.palaces[chart.shenBranch];
  sections.push({
    key: 'general',
    title: 'Yourself',
    headline: mingStars.length ? { label: headlineOf(self), text: STARS[mingStars[0]].title } : undefined,
    keywords: [...new Set(mingStars.flatMap((n) => STARS[n].keywords))].slice(0, 4),
    paragraphs: [...mingStars.map((n) => STARS[n].nature), ...self.paragraphs, shen.isMing ? JAMI_EXTRA.shenSame : JAMI_EXTRA.shen.replace('{field}', field(shen.name))],
    facts: overlay ? undefined : sihwaFacts,
    basis: [
      self.basis,
      `Body palace: ${palaceTerm(shen.name)} (${BRANCH_EN[shen.branch]})`,
      `Element bureau: ${gukEn(chart.guk.name)}`,
      `Birth-year transformations: ${chart.sihwa.map((s) => `${sihwaTerm(s.sihwa)} ${starEn({ name: s.star })} (${palaceTerm(s.palace)})`).join(' · ')}`,
    ],
  });

  const mingStar = mingStars[0];
  const connected = (n: PalaceName) => {
    const b = branchOf(n);
    const all = [b, (b + 6) % 12, (b + 4) % 12, (b + 8) % 12].map((x) => chart.palaces[x]);
    const good = all.flatMap((p) => p.stars.filter((x) => (x.kind === 'aux' && JAMI_EXTRA.aux[x.name]) || (x.sihwa && x.sihwa !== '기' && x.kind !== 'minor'))).length;
    const bad = all.flatMap((p) => p.stars.filter((x) => x.kind === 'sal' || (x.sihwa === '기' && x.kind !== 'minor'))).length;
    if (good >= bad + 2) return 'The areas linked to this one carry plenty of supportive energy too. Rather than pushing on alone, lean on the help around you and you can grow this part of life much further.';
    if (bad >= good + 2) return 'The areas linked to this one carry a fair amount of friction. Instead of toughing it out alone, share the load with people you trust, and that friction can turn into drive.';
    return 'The areas linked to this one hold an even mix of support and friction. Build on it steadily and this part of life grows without much strain.';
  };
  const single = (key: string, title: string, n: PalaceName, selfField: Field): ReadingSection => {
    const v = view(n);
    const lens = mingStar && !v.names.includes(mingStar) ? `The '${STARS[mingStar].nick}' in your self area also colors this part of life. ${firstSentences(STARS[mingStar][selfField], 2)}` : null;
    return {
      key,
      title,
      headline: { label: cap(n === '명궁' ? 'self' : field(n)) + ' area', text: headlineOf(v) },
      keywords: [...new Set(v.names.filter((x) => STARS[x]).map((x) => STARS[x].keywords[0]))],
      paragraphs: [PALACES[n].intro, ...v.paragraphs, ...(lens ? [lens] : []), connected(n)],
      basis: [v.basis, `Three directions and opposite: ${[0, 6, 4, 8].map((d) => PALACE_EN[chart.palaces[(branchOf(n) + d) % 12].name]).join(' · ')}`],
      note: n === '질액궁' ? HEALTH_DISCLAIMER : undefined,
    };
  };
  const group = (key: string, title: string, list: PalaceName[]): ReadingSection => {
    const views = list.map((n) => palaceView(chart, branchOf(n), n, overlay, false));
    return {
      key,
      title,
      keywords: [],
      paragraphs: [],
      blocks: views.map((v) => ({ title: headlineOf(v), paragraphs: [PALACES[v.name].intro, ...v.paragraphs] })),
      basis: views.map((v) => v.basis),
    };
  };

  sections.push(
    single('work', 'Work & career', '관록궁', 'work'),
    single('wealth', 'Money', '재백궁', 'money'),
    single('love', 'Partner & love', '부처궁', 'love'),
    single('health', 'Health', '질액궁', 'health'),
    group('people', 'People in your life', ['부모궁', '형제궁', '노복궁', '자녀궁']),
    group('life', 'Daily life', ['천이궁', '전택궁', '복덕궁']),
  );
  return sections;
}

// ---------------------------------------------------------------- Combined
const GROUP_TO_FIELDS: Record<TenGodGroup, PalaceName[]> = {
  비겁: ['명궁', '형제궁', '노복궁'],
  식상: ['자녀궁', '복덕궁', '천이궁'],
  재성: ['재백궁', '전택궁'],
  관성: ['관록궁', '부모궁'],
  인성: ['부모궁', '복덕궁', '전택궁'],
};
const GROUP_PLAIN: Record<TenGodGroup, string> = { 비겁: 'your own strength & peers', 식상: 'expression & talent', 재성: 'money & practical sense', 관성: 'work & responsibility', 인성: 'learning & support' };
const SELF_SYNTH: Record<string, string> = {
  'strong/bright': 'Your chart carries strong energy and the star lighting up your self area shines brightly too. You have a clear color of your own, and your presence shows naturally wherever you go.',
  'strong/dim': 'Your chart carries strong energy, while the star lighting you is soft. Rather than showing it off, you hold firm on the inside. The better people know you, the more they trust you.',
  'strong/mid': 'Your chart gives you the strength to push forward on your own, and the star in your self area backs that strength steadily. You are someone who makes your own path.',
  'weak/bright': 'Your chart energy is on the gentle side, but the star lighting you is bright. Your strengths come alive around other people, and you grow by giving and receiving support.',
  'weak/dim': 'Both your chart energy and your starlight are soft. The more patiently you stack up experience, the stronger you get. You bloom late and last long.',
  'weak/mid': 'Your chart energy is gentle, so good people around you lift you up, and the star in your self area supports that flow steadily.',
  'mid/bright': 'Your chart energy is balanced and the star lighting you is bright. Your strengths stand out clearly within that steady balance.',
  'mid/dim': 'Your chart energy is balanced and your starlight is soft. You quietly do your part without fuss, and people feel at ease around you.',
  'mid/mid': 'Both your chart energy and your starlight are evenly mixed. You have a knack for finding balance, so you fit in comfortably almost anywhere.',
};

export function combinedReadingEn(r: SajuResult, chart: JamidusuChart, now = new Date()): ReadingSection[] {
  const dm = DAY_MASTER[r.dayMaster.index];
  const self = palaceView(chart, chart.mingBranch, '명궁');
  const mingStar = self.names.find((n) => STARS[n]);
  const mainsHere = chart.palaces[chart.mingBranch].stars.filter((s) => s.kind === 'main');
  const bright = mainsHere.some((s) => STRONG.has(s.brightness)) ? 'bright' : mainsHere.some((s) => WEAK.has(s.brightness)) ? 'dim' : 'mid';
  const sk = r.strengthText === '극강' || r.strengthText === '신강' ? 'strong' : r.strengthText === '중화' ? 'mid' : 'weak';
  const g = groupRatios(r);
  const top = [...TEN_GOD_GROUPS].sort((a, b) => g[b] - g[a])[0];
  const geuk = GEUK[(r.geukgukLabel ?? '').split(' ')[0]];

  const out: ReadingSection[] = [];

  out.push({
    key: 'self',
    title: 'Your true self',
    headline: { label: 'What your saju chart and star chart draw together', text: dm.title },
    keywords: [...new Set([dm.keywords[0], dm.keywords[1], ...(mingStar ? [STARS[mingStar].keywords[0]] : [])])],
    paragraphs: [
      firstSentences(dm.core[0], 2),
      ...(mingStar ? [`In your star chart, the star lighting you up is the '${STARS[mingStar].nick}'. ${firstSentences(STARS[mingStar].self, 2)}`] : []),
      SELF_SYNTH[`${r.yongsin ? sk : 'mid'}/${bright}`],
    ],
    basis: [`Day Master ${stemLabelEn(r.dayMaster)} · Strength ${r.strengthText ? STRENGTH_EN[r.strengthText] : '-'}`, self.basis],
  });

  const lu = chart.sihwa.find((s) => s.sihwa === '록')!;
  const quan = chart.sihwa.find((s) => s.sihwa === '권')!;
  const shared = [lu.palace, quan.palace].find((p) => GROUP_TO_FIELDS[top].includes(p));
  const workBranch = chart.palaces.find((p) => p.name === '관록궁')!.branch;
  const work = palaceView(chart, workBranch, '관록궁');
  const workStar = work.names.find((n) => STARS[n]);
  out.push({
    key: 'power',
    title: 'Where your strength lies',
    headline: geuk ? { label: 'Your natural edge', text: geuk.weapon } : undefined,
    keywords: [GROUP_MANY[top].keyword],
    paragraphs: [
      shared
        ? `The '${GROUP_PLAIN[top]}' energy in your saju chart and the good fortune in your star chart both point to ${field(shared)}. Where the two readings overlap, focused effort tends to pay off big.`
        : `Your saju chart draws strength from ${GROUP_PLAIN[top]}, while your star chart puts good fortune in ${field(lu.palace)} and extra influence in ${field(quan.palace)}. Make the most of both.`,
      firstSentences(GROUP_MANY[top].work, 2),
      ...(workStar ? [`The work & career area of your star chart holds the '${STARS[workStar].nick}'. ${firstSentences(STARS[workStar].work, 2)}`] : []),
    ],
    chips: { label: 'Work that suits you', items: [...new Set([...dm.jobs.slice(0, 4), ...GROUP_MANY[top].jobs.slice(0, 4)])] },
    basis: [`Dominant Ten God group: ${GROUP_EN[top]}`, `Structure: ${geukEn(r.geukgukLabel)}`, `Hua Lu ${starEn({ name: lu.star })} (${palaceTerm(lu.palace)}) · Hua Quan ${starEn({ name: quan.star })} (${palaceTerm(quan.palace)})`, work.basis],
  });

  const big = r.bigFortunes[r.currentBigFortuneIndex];
  const eastAsianAge = now.getFullYear() - chart.lunar.year + 1;
  const dh = daehanChart(chart, eastAsianAge);
  const dhCenter = chart.palaces[dh.mingBranch];
  const dhMains = (dhCenter.stars.some((s) => s.kind === 'main') ? dhCenter : chart.palaces[(dh.mingBranch + 6) % 12]).stars.filter((s) => s.kind === 'main' && STARS[s.name]);
  const nowParas: string[] = [];
  if (big && r.yongsin) {
    const favor = favorOfScore(fortuneScore(r, big));
    nowParas.push(`You are now in the 10-year cycle that began at age ${big.startAge}. ${BIG_FAVOR[favor][0]}`, firstSentences(BIG[big.stemTenGod as TenGodName].overview, 3));
  }
  nowParas.push(`In your star chart, ${field(dhCenter.name)} tends to become the central theme of life between ages ${dh.range!.start} and ${dh.range!.end}.`, ...dhMains.map((s) => STARS[s.name].flow));
  out.push({
    key: 'now',
    title: 'Where you are now',
    headline: big ? { label: `Your decade from age ${big.startAge} to ${big.startAge + 9}`, text: BIG[big.stemTenGod as TenGodName].title } : undefined,
    keywords: [],
    paragraphs: nowParas,
    basis: [
      ...(big ? [`Luck pillar from age ${big.startAge}: ${TEN_GOD_EN[big.stemTenGod]} on the stem`] : []),
      `Decade chart ${dh.range!.start}–${dh.range!.end} (East Asian age): Life palace at ${BRANCH_EN[dhCenter.branch]} (natal ${palaceTerm(dhCenter.name)})`,
    ],
  });

  const moneyBranch = chart.palaces.find((p) => p.name === '재백궁')!.branch;
  const money = palaceView(chart, moneyBranch, '재백궁');
  const moneyStar = money.names.find((n) => STARS[n]);
  out.push({
    key: 'wealth',
    title: 'Money',
    keywords: [],
    paragraphs: [
      r.yongsin ? WEALTH_AMOUNT[g['재성'] >= 25 ? 'many' : g['재성'] < 10 ? 'few' : 'normal'] : firstSentences(dm.money, 2),
      firstSentences(dm.money, 2),
      ...(moneyStar ? [`The money area of your star chart holds the '${STARS[moneyStar].nick}'. ${firstSentences(STARS[moneyStar].money, 2)}`] : []),
    ],
    basis: [`Wealth group ${Math.round(g['재성'])}%`, money.basis],
  });

  const ji = chart.sihwa.find((s) => s.sihwa === '기')!;
  const fill: ReadingSection = {
    key: 'fill',
    title: 'What to build up',
    keywords: [],
    paragraphs: [`In your star chart, ${field(ji.palace)} is the area that asks for extra care. ${JAMI_EXTRA.sihwa['기'].natal}`],
    basis: [`Hua Ji ${starEn({ name: ji.star })}: ${palaceTerm(ji.palace)}`],
  };
  if (r.yongsin && r.elementRatios) {
    const y = r.yongsin;
    const least = r.elementRatios.indexOf(Math.min(...r.elementRatios));
    fill.paragraphs.unshift(LUCKY[y.yong].intro, ...(r.elementRatios[least] < 12 ? [ELEMENT_LACK[least].personality] : []));
    fill.tips = [...LUCKY[y.yong].activities];
    fill.facts = [
      { label: 'Colors that help', value: LUCKY[y.yong].colors.join(', ') },
      { label: 'Lucky numbers', value: LUCKY[y.yong].numbers.join(', ') },
      { label: 'Good direction', value: LUCKY[y.yong].direction },
      { label: 'Your season', value: LUCKY[y.yong].season },
    ];
    fill.basis.unshift(`Useful element ${ELEMENT_EN[y.yong]}`);
  }
  out.push(fill);
  return out;
}

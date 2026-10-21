// English saju reading. Same logic as the Korean composer (../index.ts); English text and English chart-basis terms.
import type { SajuResult, TenGodGroup, YearFortune } from '../../saju';
import { BRANCHES_HANJA } from '../../constants';
import { BRANCH_CHUNG, BRANCH_HAP, TEN_GOD_GROUPS, monthFortunesOf, pairKey, tenGodGroup } from '../../saju';
import type { AmountKey, DayMasterReading, FavorKey, TenGodName } from '../types';
import type { MonthLine, ReadingSection, YearReadingView } from '../index';
import { fortuneFavor, groupRatios, rankedGroups, strengthKey, uniq, upcomingAges, pickMonthText, firstSentence } from '../shared';
import { BRANCH_EN, ELEMENT_EN, GROUP_EN, GROWTH_EN, STRENGTH_EN, TEN_GOD_EN, branchLabelEn, combinationEn, ganzhiFull, geukEn, stemLabelEn } from '../../en-labels';
import { conflictPicker, tagIndex } from '../conflict';
import { SHINSAL } from './shinsal';
import { findBranchRelations, findShinsal } from '../../shinsal';
import { SHINSAL_EN, BRANCH_REL_EN } from '../../en-labels';
import { STRUCTURES } from './structures';
import { detectStructures, STRUCTURE_NAME_EN } from '../structure-detect';
import { BRANCH_ELEMENT as BRANCH_EL, BRANCHES_HANJA as BRANCHES_HANJA_LIST, STEM_ELEMENT as STEM_EL, STEMS_HANJA as STEMS_HANJA_LIST } from '../../constants';
import { DAY_LINE } from './day-line';
import { dayPillars } from '../../calendar';
import { calcTenGod } from '../../saju';
import { DAY_MASTER_A } from './day-master-a';
import { DAY_MASTER_B } from './day-master-b';
import { GROUP_MANY, GROUP_NONE, STRENGTH } from './groups';
import { ELEMENT_EXCESS, ELEMENT_LACK, GEUK, LUCKY } from './elements';
import { CHARM, DAY_COMBO, DAY_PHASE, SPOUSE_AMOUNT, SPOUSE_PALACE, WEALTH_AMOUNT } from './love';
import { MONTH, YEAR, YEAR_DAY, YEAR_FAVOR } from './fortune';
import { MONTH_DETAIL } from './month-detail';

export const DAY_MASTER: DayMasterReading[] = [...DAY_MASTER_A, ...DAY_MASTER_B];

export const DISCLAIMER = 'This reading describes natural tendencies for reflection. It does not predict or guarantee specific events.';
export const HEALTH_DISCLAIMER = 'This is not medical advice. If you feel unwell, please see a health professional.';

/** Fields that suit the energy you need most */
export const ELEMENT_JOBS = [
  'fields that grow and nurture things, such as education, publishing, design, fashion, plants and the environment',
  'fields that put things in the spotlight, such as media, tech, marketing, beauty and cooking',
  'fields that build foundations and connect people, such as real estate, construction, brokering, counseling and farming',
  'fields that call for precision, such as finance, law, engineering, medicine and quality control',
  'fields where things flow and move, such as trade, logistics, research, travel and hospitality',
];

const SEASON_HEALTH = {
  spring: "By the East Asian solar calendar you were born in spring, so your energy tends to rise upward. Taking time to steady your mind helps keep sudden flashes of anger from boiling over.",
  summer: "By the East Asian solar calendar you were born in summer, so you tend to run warm. Drink water often and don't let the heat wear you down.",
  autumn: 'By the East Asian solar calendar you were born in autumn, so your body tends to dry out easily. Keep your skin and airways well moisturized.',
  winter: 'By the East Asian solar calendar you were born in winter, so you tend to feel the cold easily. Keeping your stomach, hands and feet warm helps a lot.',
};

const EL = ELEMENT_EN;
const GROUP_PLAIN: Record<TenGodGroup, string> = { 비겁: 'Allies & rivals', 식상: 'Expression & talent', 재성: 'Money', 관성: 'Work & responsibility', 인성: 'Learning & support' };

/** Lowercase the first letter so a fragment can follow "At the same time, " */
const lowerFirst = (t: string) => t.replace(/^(\W*)(\w)/, (_, p, c) => p + c.toLowerCase());
const favorWord = (f: FavorKey) => (f === 'good' ? 'helps' : f === 'caution' ? 'weighs on you' : 'neutral');

/** opts.southern: 남반구 출생이면 절기 계절 문장을 넣지 않습니다(실제 계절과 반대라서). */
export function sajuReadingEn(r: SajuResult, gender: 'M' | 'F', opts: { southern?: boolean } = {}): ReadingSection[] {
  const dm = DAY_MASTER[r.dayMaster.index];
  const dmBasis = `Day Master: ${stemLabelEn(r.dayMaster)}`;

  if (r.incompleteBirthTime || !r.elementRatios || !r.yongsin) {
    const note = 'Add your birth time to get a much fuller reading: how strong your energy is, which energy dominates, and which energy you need most.';
    const base = { keywords: [...dm.keywords], basis: [dmBasis, 'Birth time unknown: reading centered on the Day Master'] };
    return [
      { key: 'general', title: 'Who you are', headline: { text: dm.title }, paragraphs: [dm.core[0]], ...base, note },
      { key: 'personality', title: 'Personality', paragraphs: [dm.core[1], dm.stress], energize: [...dm.energize], drain: [...dm.drain], tips: [...dm.tips], ...base },
      { key: 'aptitude', title: 'Work & talents', paragraphs: [dm.work], chips: { label: 'Work that suits you', items: dm.jobs }, ...base },
      { key: 'love', title: 'Love & partnership', paragraphs: [dm.love], ...base },
      { key: 'wealth', title: 'Money', paragraphs: [dm.money], ...base },
      { key: 'health', title: 'Health', paragraphs: [dm.health, HEALTH_DISCLAIMER], ...base },
      { key: 'relations', title: 'Relationships', paragraphs: [dm.relations], ...base },
    ];
  }

  const g = groupRatios(r);
  const ranked = rankedGroups(r);
  const top = ranked[0];
  const second = g[ranked[1]] >= 18 ? ranked[1] : null;
  // 모순 거르개: 일간 문장을 바탕으로, 서로 반대되는 성향의 조각은 뺍니다(tags.ts).
  const filter = conflictPicker(tagIndex({ DAY_MASTER, STRENGTH, GROUP_MANY, GROUP_NONE, ELEMENT_EXCESS, ELEMENT_LACK, GEUK, LUCKY, SPOUSE_PALACE, SPOUSE_AMOUNT, DAY_PHASE, DAY_COMBO, CHARM, WEALTH_AMOUNT }), [dm.core[0], dm.core[1], dm.work, dm.love, dm.money, dm.relations, dm.health], { social: 'Once people get to know you, another side comes out: ', other: 'Depending on the situation, ', lowerFirst: true });
  const pick = filter.pick;
  const also = (text: string | undefined | null) => (text ? filter.alias(`At the same time, ${lowerFirst(text)}`, text) : null);
  const none = TEN_GOD_GROUPS.filter((x) => g[x] < 4);
  const sk = strengthKey(r);
  const st = STRENGTH[sk];
  const ratios = r.elementRatios;
  let most = 0;
  let least = 0;
  ratios.forEach((v, i) => {
    if (v > ratios[most]) most = i;
    if (v < ratios[least]) least = i;
  });
  const excess = ratios[most] >= 35;
  const lack = ratios[least] < 5;
  const healthExcess = ratios[most] >= 30;
  // 지장간을 나눠 세면서 비율이 고르게 나오는 경우가 많아, 넘치는 기운이 없으면 가장 적은 기운의 관리법을 알려 드립니다.
  const healthLack = ratios[least] < 12 || ratios[most] < 30;
  const BALANCED =
    "The five energies in your chart are mixed fairly evenly, without leaning hard in one direction. You tend to adapt wherever you go without being thrown off balance. The flip side is that your true colors may not stand out as boldly, so pick one thing you truly love and dig deep into it. That's where your individuality comes alive.";
  const y = r.yongsin;
  const geukName = (r.geukgukLabel ?? '').split(' ')[0];
  const geuk = GEUK[geukName];
  const lucky = LUCKY[y.yong];
  const dayPillar = r.pillars.find((p) => p.key === 'day')!;
  const dayTg = dayPillar.branchTenGod as TenGodName;
  const spouseGroup: TenGodGroup = gender === 'M' ? '재성' : '관성';
  const amount = (v: number, many: number, few: number): AmountKey => (v >= many ? 'many' : v < few ? 'few' : 'normal');
  const dayCombos = r.combinations.filter((c) => c.positions.includes('day') && c.kind !== '천간합');
  const hap = dayCombos.some((c) => c.kind === '지지육합');
  const chung = dayCombos.some((c) => c.kind === '지지육충');
  // 신살·지지 관계 (v1.2): 도화는 삼합 기준으로 봅니다.
  const hits = findShinsal(r.pillars);
  const has = (k: string) => hits.some((h) => h.key === k);
  const rels = findBranchRelations(r.pillars);
  const relHas = (k: string) => rels.some((x) => x.kind === k && x.where.includes('day'));
  const peach = has('dohwa');
  const structs = detectStructures(r);
  const PK: Record<string, string> = { hour: 'hour', day: 'day', month: 'month', year: 'year' };
  const shinsalBasis = [
    ...(hits.length ? [`${'Symbolic stars'}: ${hits.map((h) => `${SHINSAL_EN[h.name]} ${h.hanja}(${h.where.map((w) => PK[w]).join('·')})`).join(', ')}`] : []),
    ...(rels.length ? [`${'Branch relations'}: ${rels.map((x) => `${BRANCH_REL_EN[x.kind]} ${x.branches.map((b) => BRANCHES_HANJA[b]).join('')}`).join(', ')}`] : []),
  ];
  const monthBranch = r.pillars.find((p) => p.key === 'month')!.branch.index;
  const season = [2, 3, 4].includes(monthBranch) ? 'spring' : [5, 6, 7].includes(monthBranch) ? 'summer' : [8, 9, 10].includes(monthBranch) ? 'autumn' : 'winter';
  const firstNone = none[0];

  const ageItems = (grp: TenGodGroup, what: string) => upcomingAges(r, grp).map((a) => `From age ${a}, for 10 years: ${what}`);
  const mergedAges = (pairs: [TenGodGroup, string][]) => {
    const byAge = new Map<number, string[]>();
    for (const [grp, what] of pairs) for (const a of upcomingAges(r, grp)) byAge.set(a, [...(byAge.get(a) ?? []), what]);
    return [...byAge.entries()].sort((a, b) => a[0] - b[0]).slice(0, 4).map(([a, whats]) => `From age ${a}, for 10 years: ${whats.join('; ')}`);
  };

  // Chart basis (terms)
  const ratioText = ratios.map((v, i) => `${EL[i]} ${Math.round(v)}%`).join(' · ');
  const groupText = TEN_GOD_GROUPS.map((x) => `${GROUP_EN[x]} ${Math.round(g[x])}%`).join(' · ');
  const yongText = `Useful element ${EL[y.yong]} · Favorable ${EL[y.hee]} · Unfavorable ${EL[y.gi]}`;
  const comboText = dayCombos.map(combinationEn).join(', ');
  const strengthText = r.strengthText ? STRENGTH_EN[r.strengthText] : '-';

  const general: ReadingSection = {
    key: 'general',
    title: 'Who you are',
    headline: { text: dm.title },
    keywords: uniq([dm.keywords[0], dm.keywords[1], GROUP_MANY[top].keyword]),
    paragraphs: pick([dm.core[0], st.personality, excess && ELEMENT_EXCESS[most].personality, lack && ELEMENT_LACK[least].personality, !excess && !lack && BALANCED, geuk?.weapon, has('gongmang') && SHINSAL.gongmang, lucky.intro]),
    facts: [
      { label: 'The energy you need most', value: `${EL[y.yong]} energy` },
      { label: 'Colors that help', value: lucky.colors.join(', ') },
      { label: 'Lucky numbers', value: lucky.numbers.join(', ') },
      { label: 'Good direction', value: lucky.direction },
      { label: 'Your season', value: lucky.season },
      { label: 'Places that recharge you', value: lucky.places.join(', ') },
    ],
    blocks: structs.map((k) => ({ title: `Your chart's shape · ${STRUCTURES[k].title}`, paragraphs: [STRUCTURES[k].text] })),
    tips: [...lucky.activities, ...structs.map((k) => STRUCTURES[k].tip)],
    basis: [dmBasis, `Strength: ${strengthText}`, `Structure: ${geukEn(r.geukgukLabel)}`, yongText, `Element balance: ${ratioText}`, ...(structs.length ? [`Patterns: ${structs.map((k) => STRUCTURE_NAME_EN[k]).join(', ')}`] : []), ...shinsalBasis],
  };

  const personality: ReadingSection = {
    key: 'personality',
    title: 'Personality',
    keywords: [...dm.keywords],
    paragraphs: pick([dm.core[1], GROUP_MANY[top].personality, second && also(GROUP_MANY[second].personality), DAY_PHASE[dayPillar.growthPhase], firstNone && GROUP_NONE[firstNone].personality, has('hwagae') && SHINSAL.hwagae, (has('goegang') && SHINSAL.goegang) || (has('yangin') && SHINSAL.yangin) || (has('baekho') && SHINSAL.baekho), dm.stress]),
    energize: uniq([...dm.energize, GROUP_MANY[top].energize]),
    drain: uniq([...dm.drain, GROUP_MANY[top].drain]),
    tips: [...dm.tips],
    basis: [
      dmBasis,
      `Day branch life stage: ${GROWTH_EN[dayPillar.growthPhase] ?? dayPillar.growthPhase}`,
      `Dominant Ten God group: ${GROUP_EN[top]}`,
      `Ten God balance: ${groupText}`,
      ...(none.length ? [`Nearly absent: ${none.map((x) => GROUP_EN[x]).join(', ')}`] : []),
    ],
  };

  const workNone = none.find((x) => x === '관성' || x === '식상');
  const aptitude: ReadingSection = {
    key: 'aptitude',
    title: 'Work & talents',
    headline: geuk ? { label: 'Your natural edge', text: geuk.weapon } : undefined,
    keywords: uniq([GROUP_MANY[top].keyword, dm.keywords[0]]),
    paragraphs: pick([
      dm.work,
      GROUP_MANY[top].work,
      second && also(GROUP_MANY[second].work),
      geuk?.work,
      st.work,
      workNone && GROUP_NONE[workNone].work,
      `You'll also do well in ${ELEMENT_JOBS[y.yong]}, which draw on the ${EL[y.yong]} energy you need most. Work like this tops up what you're missing, so you tire less even over the long haul.`,
    ]),
    chips: { label: 'Work that suits you', items: uniq([...dm.jobs, ...GROUP_MANY[top].jobs, ...(second ? GROUP_MANY[second].jobs.slice(0, 2) : [])]).slice(0, 12) },
    timing: { label: 'When work picks up momentum', items: mergedAges([['관성', 'your role and responsibilities tend to grow'], ['식상', 'a good time to put your talents and ideas out there']]) },
    tips: uniq([st.tip, workNone && GROUP_NONE[workNone].tip]),
    basis: [dmBasis, `Structure: ${geukEn(r.geukgukLabel)}`, `Dominant Ten God group: ${GROUP_EN[top]}`, `Strength: ${strengthText}`, yongText],
  };

  const spouse = SPOUSE_PALACE[dayTg];
  const love: ReadingSection = {
    key: 'love',
    title: 'Love & partnership',
    headline: { label: "You're drawn to", text: spouse.attract },
    keywords: uniq([dm.keywords[2], GROUP_MANY[top].keyword]),
    paragraphs: pick([dm.love, spouse.love, SPOUSE_AMOUNT[amount(g[spouseGroup], 25, 8)], hap && DAY_COMBO.hap.love, chung && DAY_COMBO.chung.love, top !== tenGodGroup(dayTg) && GROUP_MANY[top].love, st.love, peach && CHARM]),
    caution: spouse.caution,
    timing: { label: 'When relationships tend to deepen', items: ageItems(spouseGroup, 'good connections tend to come along, or a relationship deepens') },
    basis: [
      dmBasis,
      `Day branch (spouse palace): ${branchLabelEn(dayPillar.branch)} · ${TEN_GOD_EN[dayTg]}`,
      `Partner star group (${GROUP_EN[spouseGroup]}) ${Math.round(g[spouseGroup])}%`,
      ...(comboText ? [`Day branch interactions: ${comboText}`] : []),
      ...(peach ? ['Peach Blossom: by the year or day branch triad'] : []),
    ],
  };

  const wealthNone = none.includes('재성');
  const wealth: ReadingSection = {
    key: 'wealth',
    title: 'Money',
    keywords: uniq([dm.keywords[1], GROUP_MANY[top].keyword]),
    paragraphs: pick([
      dm.money,
      WEALTH_AMOUNT[amount(g['재성'], 25, 10)],
      GROUP_MANY[top].money,
      second && also(GROUP_MANY[second].money),
      st.money,
      wealthNone && GROUP_NONE['재성'].money,
      g['비겁'] >= 30 && 'With so many people around you, money often ends up shared with others too. Put any co-signing or joint venture in writing, and give yourself extra time before you decide.',
    ]),
    timing: { label: 'When money starts moving', items: ageItems('재성', 'chances to earn more tend to arrive along with bigger expenses') },
    tips: uniq([wealthNone && GROUP_NONE['재성'].tip]),
    basis: [
      dmBasis,
      `Wealth group ${Math.round(g['재성'])}% (Indirect Wealth ${Math.round(r.tenGodRatios!['편재'])}% · Direct Wealth ${Math.round(r.tenGodRatios!['정재'])}%)`,
      `Strength: ${strengthText}`,
      `Dominant Ten God group: ${GROUP_EN[top]}`,
    ],
  };

  const health: ReadingSection = {
    key: 'health',
    title: 'Health',
    keywords: uniq([`Bring in ${EL[y.yong]}`, healthLack && least !== y.yong && `Top up ${EL[least]}`, healthExcess && most !== y.yong && `Calm ${EL[most]}`]),
    paragraphs: pick([dm.health, healthLack && ELEMENT_LACK[least].health, healthExcess && ELEMENT_EXCESS[most].health, st.health, !opts.southern && SEASON_HEALTH[season as keyof typeof SEASON_HEALTH]]),
    tips: uniq([healthLack && ELEMENT_LACK[least].tip, healthExcess && ELEMENT_EXCESS[most].tip, lucky.activities[0]]),
    note: HEALTH_DISCLAIMER,
    basis: [dmBasis, `Element balance: ${ratioText}`, `Month branch: ${branchLabelEn(r.pillars.find((p) => p.key === 'month')!.branch)}`, yongText],
  };

  const relNone = none.find((x) => x === '비겁' || x === '인성') ?? firstNone;
  const relations: ReadingSection = {
    key: 'relations',
    title: 'Relationships',
    keywords: uniq([dm.keywords[2], GROUP_PLAIN[top]]),
    paragraphs: pick([dm.relations, GROUP_MANY[top].relations, second && also(GROUP_MANY[second].relations), st.relations, hap && DAY_COMBO.hap.relations, chung && DAY_COMBO.chung.relations, relNone && GROUP_NONE[relNone].relations, has('cheoneul') && SHINSAL.cheoneul, rels.some((x) => x.kind === '삼합') && SHINSAL.samhap, (relHas('원진') && SHINSAL.wonjin) || (relHas('형') && SHINSAL.hyeong)]),
    tips: uniq([relNone && GROUP_NONE[relNone].tip, dm.tips[2]]),
    basis: [dmBasis, `Dominant Ten God group: ${GROUP_EN[top]}`, `Companion ${Math.round(g['비겁'])}% · Resource ${Math.round(g['인성'])}%`, ...(comboText ? [`Day branch interactions: ${comboText}`] : [])],
  };

  return [general, personality, aptitude, love, wealth, health, relations];
}

// ---------------------------------------------------------------- Year reading
const SOLAR_LABEL = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan (next year)'];

export function yearReadingEn(r: SajuResult, year: number): YearReadingView | null {
  const yf: YearFortune | undefined = r.daewunYearFortunes.flat().find((x) => x.year === year) ?? r.yearFortunes.find((x) => x.year === year);
  if (!yf || !r.yongsin) return null;
  const favor = fortuneFavor(r, yf);
  const stemTg = yf.stemTenGod as TenGodName;
  const branchTg = yf.branchTenGod as TenGodName;
  const main = YEAR[stemTg];
  const ganzhi = ganzhiFull(yf.stem.index, yf.branch.index);
  const dayBranch = r.pillars.find((p) => p.key === 'day')!.branch.index;
  const yb = yf.branch.index;
  const relation = yb === dayBranch ? 'same' : BRANCH_CHUNG.has(pairKey(yb, dayBranch)) ? 'chung' : BRANCH_HAP[pairKey(yb, dayBranch)] !== undefined ? 'hap' : null;

  const overview = uniq([main.overview, branchTg !== stemTg && YEAR[branchTg].base, relation && YEAR_DAY[relation]]);
  const used = new Set<string>();
  const months = monthFortunesOf(year, r.dayMaster.index).map((m, i): MonthLine => {
    const mf = fortuneFavor(r, m);
    const text = pickMonthText(MONTH, m.stemTenGod as TenGodName, m.branchTenGod as TenGodName, mf, used, [firstSentence(MONTH_DETAIL[m.stemTenGod as TenGodName].overview), firstSentence(MONTH_DETAIL[m.branchTenGod as TenGodName].overview)]);
    return { label: SOLAR_LABEL[i], ganzhi: ganzhiFull(m.stem.index, m.branch.index), favor: mf, text };
  });
  const pick = (f: FavorKey) => months.filter((m) => m.favor === f).map((m) => m.label);
  const y = r.yongsin;

  return {
    year,
    ganzhi,
    favor,
    title: main.title,
    intro: YEAR_FAVOR[favor][year % 2],
    overview,
    fields: [
      { label: 'Work', text: main.work },
      { label: 'Money', text: main.money },
      { label: 'Love', text: main.love },
      { label: 'Health', text: main.health },
      { label: 'People', text: main.relations },
    ],
    months,
    goodMonths: pick('good'),
    cautionMonths: pick('caution'),
    tips: [...main.tips],
    basis: [
      `${year} annual pillar: ${ganzhi}`,
      `Stem ${TEN_GOD_EN[stemTg]} · Branch ${TEN_GOD_EN[branchTg]}`,
      `Useful ${EL[y.yong]} · Favorable ${EL[y.hee]} · Unfavorable ${EL[y.gi]} → ${favorWord(favor)}`,
      ...(relation ? [`Day branch ${BRANCH_EN[dayBranch]} and year branch ${BRANCH_EN[yb]}: ${relation === 'chung' ? 'clash' : relation === 'hap' ? 'combination' : 'same branch'}`] : []),
      'Months follow the solar terms (Tiger month to Ox month); a month is good when its elements are your useful or favorable ones, take care when they are unfavorable.',
    ],
  };
}

export const YEAR_FAVOR_LABEL_EN: Record<FavorKey, string> = { good: 'A supportive year', normal: 'A steady year', caution: 'A year to pace yourself' };

/** 오늘의 나: 그날 일진의 기운(천간 십신)과 나에게 맞는 정도로 한 줄 조언 */
export function todayReadingEn(r: SajuResult, date = new Date()): { ganzhi: string; favor: FavorKey; text: string } | null {
  if (!r.yongsin) return null;
  const gz = dayPillars(date.getFullYear(), date.getMonth() + 1, date.getDate()).day;
  const stem = (STEMS_HANJA_LIST as readonly string[]).indexOf(gz[0]);
  const branch = (BRANCHES_HANJA_LIST as readonly string[]).indexOf(gz[1]);
  const favor = fortuneFavor(r, { stem: { element: STEM_EL[stem] }, branch: { element: BRANCH_EL[branch], index: branch } });
  const tg = calcTenGod(r.dayMaster.index, stem) as TenGodName;
  return { ganzhi: gz, favor, text: DAY_LINE[tg][favor] };
}

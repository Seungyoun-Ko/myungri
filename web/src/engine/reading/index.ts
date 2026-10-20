// 새 사주 풀이: 쉬운 말로, 풍성하게.
// 계산 결과(SajuResult)로 문장 조각을 골라 항목별 풀이를 만듭니다. 본문에는 전문 용어를 쓰지 않고,
// 용어는 항목마다 '명리 근거'(basis)에만 모읍니다.
import type { Element } from '../constants';
import { BRANCHES_HANJA, BRANCHES_KO, STEMS_HANJA } from '../constants';
import type { SajuResult, TenGod, TenGodGroup, YearFortune } from '../saju';
import { BRANCH_CHUNG, BRANCH_HAP, TEN_GOD_GROUPS, TEN_GODS, monthFortunesOf, pairKey, tenGodGroup } from '../saju';
import { ELEMENT_JOBS, HEALTH_DISCLAIMER, SEASON_HEALTH } from '../tongbyeon-data';
import type { AmountKey, DayMasterReading, FavorKey, StrengthKey, TenGodName } from './types';
import { DAY_MASTER_A } from './day-master-a';
import { DAY_MASTER_B } from './day-master-b';
import { GROUP_MANY, GROUP_NONE, STRENGTH } from './groups';
import { ELEMENT_EXCESS, ELEMENT_LACK, GEUK, LUCKY } from './elements';
import { CHARM, DAY_COMBO, DAY_PHASE, SPOUSE_AMOUNT, SPOUSE_PALACE, WEALTH_AMOUNT } from './love';
import { MONTH, YEAR, YEAR_DAY, YEAR_FAVOR } from './fortune';

export const DAY_MASTER: DayMasterReading[] = [...DAY_MASTER_A, ...DAY_MASTER_B];

export interface ReadingSection {
  key: string;
  title: string;
  /** 맨 위에 크게 보이는 한 줄 (label이 있으면 작은 머리말을 붙임) */
  headline?: { label?: string; text: string };
  keywords: string[];
  paragraphs: string[];
  energize?: string[];
  drain?: string[];
  /** 잘 어울리는 일 같은 낱말 묶음 */
  chips?: { label: string; items: string[] };
  /** 행운 정보 같은 이름-값 목록 */
  facts?: { label: string; value: string }[];
  /** 좋은 시기 (나이와 설명) */
  timing?: { label: string; items: string[] };
  /** 조심할 점 한 문단 */
  caution?: string;
  tips?: string[];
  /** 명리 근거 (전문 용어 사용) */
  basis: string[];
  /** 본문 아래 작은 안내 */
  note?: string;
  /** 여러 자리를 한 항목에 묶을 때 (자미두수의 사람 자리·생활 자리) */
  blocks?: { title: string; paragraphs: string[] }[];
}

export const READING_TABS: [string, string][] = [
  ['general', '나는 어떤 사람'],
  ['personality', '성격'],
  ['aptitude', '일과 적성'],
  ['love', '연애·결혼'],
  ['wealth', '재물'],
  ['health', '건강'],
  ['relations', '사람 관계'],
];

const EL = ['나무', '불', '흙', '쇠', '물'];
const EL_TERM = ['목', '화', '토', '금', '수'];
const GROUP_PLAIN: Record<TenGodGroup, string> = { 비겁: '내 편과 경쟁', 식상: '표현과 재능', 재성: '재물', 관성: '일과 책임', 인성: '배움과 도움' };

const uniq = <T>(xs: (T | null | undefined | false)[]) => [...new Set(xs.filter(Boolean) as T[])];

function groupRatios(r: SajuResult): Record<TenGodGroup, number> {
  const out = Object.fromEntries(TEN_GOD_GROUPS.map((g) => [g, 0])) as Record<TenGodGroup, number>;
  if (r.tenGodRatios) for (const t of TEN_GODS) out[tenGodGroup(t)] += r.tenGodRatios[t];
  return out;
}

/** 십신 무리를 많은 순으로. 비슷하면 태어난 달의 무리를 앞에 둡니다. */
function rankedGroups(r: SajuResult): TenGodGroup[] {
  const g = groupRatios(r);
  const month = r.pillars.find((p) => p.key === 'month');
  const monthGroup = month ? tenGodGroup(month.branchTenGod as TenGod) : null;
  return [...TEN_GOD_GROUPS].sort((a, b) => {
    const diff = g[b] - g[a];
    if (Math.abs(diff) > 0.05) return diff;
    return (b === monthGroup ? 1 : 0) - (a === monthGroup ? 1 : 0);
  });
}

const strengthKey = (r: SajuResult): StrengthKey =>
  r.strengthText === '극강' || r.strengthText === '신강' ? 'strong' : r.strengthText === '중화' ? 'mid' : 'weak';

/** 지금 10년 운부터 앞으로, 그 무리가 들어오는 10년 운의 시작 나이 (최대 3개) */
function upcomingAges(r: SajuResult, g: TenGodGroup): number[] {
  const from = Math.max(0, r.currentBigFortuneIndex);
  return r.bigFortunes
    .slice(from)
    .filter((b) => tenGodGroup(b.stemTenGod) === g || tenGodGroup(b.branchTenGod) === g)
    .slice(0, 3)
    .map((b) => b.startAge);
}

/** 그 기운이 나에게 얼마나 맞는지: 필요한 기운 +1, 부담 되는 기운 -1 */
function elementFavor(r: SajuResult, e: Element): number {
  const y = r.yongsin;
  if (!y) return 0;
  if (e === y.yong || e === y.hee) return 1;
  if (e === y.gi || e === y.gu) return -1;
  return 0;
}
const favorOf = (score: number): FavorKey => (score >= 1 ? 'good' : score <= -1 ? 'caution' : 'normal');

const charLabel = (c: { korean: string; hanja: string; element: number }) => `${c.korean}${EL_TERM[c.element]}(${c.hanja})`;

// ---------------------------------------------------------------- 사주 풀이
export function sajuReading(r: SajuResult, gender: 'M' | 'F'): ReadingSection[] {
  const dm = DAY_MASTER[r.dayMaster.index];
  const dmBasis = `일간: ${charLabel(r.dayMaster)}`;

  // 출생시간을 모르면 일간 중심으로만 풀이합니다.
  if (r.incompleteBirthTime || !r.elementRatios || !r.yongsin) {
    const note = '출생시간을 넣으면 힘의 세기, 가장 많은 기운, 필요한 기운까지 더해 훨씬 자세하게 풀이해 드려요.';
    const base = { keywords: [...dm.keywords], basis: [dmBasis, '출생시간 모름: 일간 중심 풀이'], note };
    return [
      { key: 'general', title: '나는 어떤 사람', headline: { text: dm.title }, paragraphs: [dm.core[0]], ...base },
      { key: 'personality', title: '성격', paragraphs: [dm.core[1], dm.stress], energize: [...dm.energize], drain: [...dm.drain], tips: [...dm.tips], ...base },
      { key: 'aptitude', title: '일과 적성', paragraphs: [dm.work], chips: { label: '잘 어울리는 일', items: dm.jobs }, ...base },
      { key: 'love', title: '연애·결혼', paragraphs: [dm.love], ...base },
      { key: 'wealth', title: '재물', paragraphs: [dm.money], ...base },
      { key: 'health', title: '건강', paragraphs: [dm.health, HEALTH_DISCLAIMER], ...base },
      { key: 'relations', title: '사람 관계', paragraphs: [dm.relations], ...base },
    ];
  }

  const g = groupRatios(r);
  const ranked = rankedGroups(r);
  const top = ranked[0];
  // 두 번째로 많은 기운도 넉넉하면(18% 이상) 그 문단을 '또 한편으로는'으로 이어 붙입니다.
  const second = g[ranked[1]] >= 18 ? ranked[1] : null;
  const also = (text: string | undefined | null) => (text ? `또 한편으로는 ${text}` : null);
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
  // 건강은 조금만 치우쳐도 관리법을 알려 드립니다.
  const healthExcess = ratios[most] >= 30;
  const healthLack = ratios[least] < 12;
  const BALANCED = '다섯 기운이 한쪽으로 크게 치우치지 않고 고르게 섞여 있어요. 어느 환경에 가도 크게 흔들리지 않고 적응하는 편이에요. 다만 뚜렷한 색이 덜 드러날 수 있으니, 내가 정말 좋아하는 것을 하나 정해 깊게 파고들면 개성이 살아나요.';
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
  const peach = r.pillars.some((p) => (p.key === 'day' || p.key === 'year') && [0, 3, 6, 9].includes(p.branch.index));
  const monthBranch = r.pillars.find((p) => p.key === 'month')!.branch.index;
  const season = [2, 3, 4].includes(monthBranch) ? 'spring' : [5, 6, 7].includes(monthBranch) ? 'summer' : [8, 9, 10].includes(monthBranch) ? 'autumn' : 'winter';
  const firstNone = none[0];

  const ageItems = (grp: TenGodGroup, what: string) => upcomingAges(r, grp).map((a) => `${a}세부터 10년: ${what}`);
  /** 여러 무리의 시기를 나이별로 합칩니다. 같은 나이는 한 줄로 */
  const mergedAges = (pairs: [TenGodGroup, string][]) => {
    const byAge = new Map<number, string[]>();
    for (const [grp, what] of pairs) for (const a of upcomingAges(r, grp)) byAge.set(a, [...(byAge.get(a) ?? []), what]);
    return [...byAge.entries()].sort((a, b) => a[0] - b[0]).slice(0, 4).map(([a, whats]) => `${a}세부터 10년: ${whats.join(', ')}`);
  };

  // 명리 근거 (전문 용어)
  const ratioText = ratios.map((v, i) => `${EL_TERM[i]} ${Math.round(v)}%`).join(' · ');
  const groupText = TEN_GOD_GROUPS.map((x) => `${x} ${Math.round(g[x])}%`).join(' · ');
  const yongText = `용신 ${EL_TERM[y.yong]} · 희신 ${EL_TERM[y.hee]} · 기신 ${EL_TERM[y.gi]}`;
  const comboText = dayCombos.map((c) => c.text).join(', ');

  const general: ReadingSection = {
    key: 'general',
    title: '나는 어떤 사람',
    headline: { text: dm.title },
    keywords: uniq([dm.keywords[0], dm.keywords[1], GROUP_MANY[top].keyword]),
    paragraphs: uniq([dm.core[0], st.personality, excess && ELEMENT_EXCESS[most].personality, lack && ELEMENT_LACK[least].personality, !excess && !lack && BALANCED, geuk?.weapon, lucky.intro]),
    facts: [
      { label: '나에게 필요한 기운', value: `${EL[y.yong]} 기운` },
      { label: '힘이 되는 색', value: lucky.colors.join(', ') },
      { label: '행운의 숫자', value: lucky.numbers.join(', ') },
      { label: '좋은 방향', value: lucky.direction },
      { label: '힘이 나는 계절', value: lucky.season },
      { label: '머물면 좋은 곳', value: lucky.places.join(', ') },
    ],
    tips: [...lucky.activities],
    basis: [dmBasis, `강약: ${r.strengthText}`, `격국: ${r.geukgukLabel ?? '-'}`, yongText, `오행 비율: ${ratioText}`],
  };

  const personality: ReadingSection = {
    key: 'personality',
    title: '성격',
    keywords: [...dm.keywords],
    paragraphs: uniq([dm.core[1], GROUP_MANY[top].personality, second && also(GROUP_MANY[second].personality), DAY_PHASE[dayPillar.growthPhase], firstNone && GROUP_NONE[firstNone].personality, dm.stress]),
    energize: uniq([...dm.energize, GROUP_MANY[top].energize]),
    drain: uniq([...dm.drain, GROUP_MANY[top].drain]),
    tips: [...dm.tips],
    basis: [dmBasis, `일지 12운성: ${dayPillar.growthPhase}`, `가장 많은 십신 무리: ${top}`, `십신 비율: ${groupText}`, ...(none.length ? [`거의 없는 무리: ${none.join(', ')}`] : [])],
  };

  const workNone = none.find((x) => x === '관성' || x === '식상');
  const aptitude: ReadingSection = {
    key: 'aptitude',
    title: '일과 적성',
    headline: geuk ? { label: '타고난 무기', text: geuk.weapon } : undefined,
    keywords: uniq([GROUP_MANY[top].keyword, dm.keywords[0]]),
    paragraphs: uniq([dm.work, GROUP_MANY[top].work, second && also(GROUP_MANY[second].work), geuk?.work, st.work, workNone && GROUP_NONE[workNone].work, `나에게 필요한 ${EL[y.yong]} 기운과 맞닿은 ${ELEMENT_JOBS[y.yong]}도 잘 어울려요. 필요한 기운을 일로 채우는 셈이라 오래 해도 덜 지쳐요.`]),
    chips: { label: '잘 어울리는 일', items: uniq([...dm.jobs, ...GROUP_MANY[top].jobs, ...(second ? GROUP_MANY[second].jobs.slice(0, 2) : [])]).slice(0, 12) },
    timing: { label: '일에서 힘이 붙는 시기', items: mergedAges([['관성', '맡는 역할과 책임이 커지기 쉬운 때'], ['식상', '재능과 아이디어를 펼치기 좋은 때']]) },
    tips: uniq([st.tip, workNone && GROUP_NONE[workNone].tip]),
    basis: [dmBasis, `격국: ${r.geukgukLabel ?? '-'}`, `가장 많은 십신 무리: ${top}`, `강약: ${r.strengthText}`, yongText],
  };

  const spouse = SPOUSE_PALACE[dayTg];
  const love: ReadingSection = {
    key: 'love',
    title: '연애·결혼',
    headline: { label: '이런 사람에게 끌려요', text: spouse.attract },
    keywords: uniq([dm.keywords[2], GROUP_MANY[top].keyword]),
    paragraphs: uniq([
      dm.love,
      spouse.love,
      SPOUSE_AMOUNT[amount(g[spouseGroup], 25, 8)],
      hap && DAY_COMBO.hap.love,
      chung && DAY_COMBO.chung.love,
      top !== tenGodGroup(dayTg) && GROUP_MANY[top].love,
      st.love,
      peach && CHARM,
    ]),
    caution: spouse.caution,
    timing: { label: '인연이 깊어지기 쉬운 시기', items: ageItems(spouseGroup, '좋은 인연을 만나거나 관계가 깊어지기 쉬운 때') },
    basis: [dmBasis, `일지(배우자궁): ${charLabel(dayPillar.branch)} · ${dayTg}`, `배우자 별(${spouseGroup}) ${Math.round(g[spouseGroup])}%`, ...(comboText ? [`일지 합충: ${comboText}`] : []), ...(peach ? ['도화: 연지 또는 일지가 자·오·묘·유'] : [])],
  };

  const wealthNone = none.includes('재성');
  const wealth: ReadingSection = {
    key: 'wealth',
    title: '재물',
    keywords: uniq([dm.keywords[1], GROUP_MANY[top].keyword]),
    paragraphs: uniq([
      dm.money,
      WEALTH_AMOUNT[amount(g['재성'], 25, 10)],
      GROUP_MANY[top].money,
      second && also(GROUP_MANY[second].money),
      st.money,
      wealthNone && GROUP_NONE['재성'].money,
      g['비겁'] >= 30 && '주변에 사람이 많은 만큼 돈을 나눌 일도 생기기 쉬워요. 보증이나 동업은 꼭 문서로 정리하고, 한 번 더 시간을 두고 결정하세요.',
    ]),
    timing: { label: '돈의 흐름이 활발해지는 시기', items: ageItems('재성', '수입을 늘릴 기회와 큰 지출이 함께 오기 쉬운 때') },
    tips: uniq([wealthNone && GROUP_NONE['재성'].tip]),
    basis: [dmBasis, `재성 ${Math.round(g['재성'])}% (편재 ${Math.round(r.tenGodRatios!['편재'])}% · 정재 ${Math.round(r.tenGodRatios!['정재'])}%)`, `강약: ${r.strengthText}`, `가장 많은 십신 무리: ${top}`],
  };

  const health: ReadingSection = {
    key: 'health',
    title: '건강',
    keywords: uniq([`${EL[y.yong]} 기운 채우기`, healthLack && `${EL[least]} 기운 보충`, healthExcess && `${EL[most]} 기운 다스리기`]),
    paragraphs: uniq([dm.health, healthLack && ELEMENT_LACK[least].health, healthExcess && ELEMENT_EXCESS[most].health, st.health, SEASON_HEALTH[season as keyof typeof SEASON_HEALTH]]),
    tips: uniq([healthLack && ELEMENT_LACK[least].tip, healthExcess && ELEMENT_EXCESS[most].tip, lucky.activities[0]]),
    note: HEALTH_DISCLAIMER,
    basis: [dmBasis, `오행 비율: ${ratioText}`, `월지: ${charLabel(r.pillars.find((p) => p.key === 'month')!.branch)}`, yongText],
  };

  const relNone = none.find((x) => x === '비겁' || x === '인성') ?? firstNone;
  const relations: ReadingSection = {
    key: 'relations',
    title: '사람 관계',
    keywords: uniq([dm.keywords[2], GROUP_PLAIN[top]]),
    paragraphs: uniq([dm.relations, GROUP_MANY[top].relations, second && also(GROUP_MANY[second].relations), st.relations, hap && DAY_COMBO.hap.relations, chung && DAY_COMBO.chung.relations, relNone && GROUP_NONE[relNone].relations]),
    tips: uniq([relNone && GROUP_NONE[relNone].tip, dm.tips[2]]),
    basis: [dmBasis, `가장 많은 십신 무리: ${top}`, `비겁 ${Math.round(g['비겁'])}% · 인성 ${Math.round(g['인성'])}%`, ...(comboText ? [`일지 합충: ${comboText}`] : [])],
  };

  return [general, personality, aptitude, love, wealth, health, relations];
}

// ---------------------------------------------------------------- 올해 운세 (월별 포함)
export interface MonthLine {
  /** 양력 기준 이름 (절기로 바뀌므로 '경'을 붙여 안내) */
  label: string;
  ganzhi: string;
  favor: FavorKey;
  text: string;
}
export interface YearReadingView {
  year: number;
  ganzhi: string;
  favor: FavorKey;
  title: string;
  intro: string;
  overview: string[];
  fields: { label: string; text: string }[];
  months: MonthLine[];
  goodMonths: string[];
  cautionMonths: string[];
  tips: string[];
  basis: string[];
}

const SOLAR_LABEL = ['2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월', '다음 해 1월'];

/** 해와 달의 기운이 나에게 맞는 정도 (천간 + 지지) */
function fortuneFavor(r: SajuResult, f: { stem: { element: number }; branch: { element: number } }): FavorKey {
  return favorOf(elementFavor(r, f.stem.element as Element) + elementFavor(r, f.branch.element as Element));
}

export function yearReading(r: SajuResult, year: number): YearReadingView | null {
  const yf: YearFortune | undefined = r.daewunYearFortunes.flat().find((x) => x.year === year) ?? r.yearFortunes.find((x) => x.year === year);
  if (!yf || !r.yongsin) return null;
  const favor = fortuneFavor(r, yf);
  const stemTg = yf.stemTenGod as TenGodName;
  const branchTg = yf.branchTenGod as TenGodName;
  const main = YEAR[stemTg];
  const ganzhi = `${yf.stem.korean}${yf.branch.korean}`;
  const dayBranch = r.pillars.find((p) => p.key === 'day')!.branch.index;
  const yb = yf.branch.index;
  const relation = yb === dayBranch ? 'same' : BRANCH_CHUNG.has(pairKey(yb, dayBranch)) ? 'chung' : BRANCH_HAP[pairKey(yb, dayBranch)] !== undefined ? 'hap' : null;

  const overview = uniq([main.overview, branchTg !== stemTg && YEAR[branchTg].base, relation && YEAR_DAY[relation]]);
  // 같은 문장이 되풀이되면 그 달의 바탕 기운(지지) 문장으로 바꿉니다.
  const used = new Set<string>();
  const months = monthFortunesOf(year, r.dayMaster.index).map((m, i): MonthLine => {
    const mf = fortuneFavor(r, m);
    let text = MONTH[m.stemTenGod as TenGodName][mf];
    if (used.has(text)) text = MONTH[m.branchTenGod as TenGodName][mf];
    used.add(text);
    return { label: SOLAR_LABEL[i], ganzhi: `${m.stem.korean}${m.branch.korean}`, favor: mf, text };
  });
  const pick = (f: FavorKey) => months.filter((m) => m.favor === f).map((m) => m.label);

  return {
    year,
    ganzhi,
    favor,
    title: main.title,
    intro: YEAR_FAVOR[favor][year % 2],
    overview,
    fields: [
      { label: '일·직장', text: main.work },
      { label: '돈', text: main.money },
      { label: '연애·관계', text: main.love },
      { label: '건강', text: main.health },
      { label: '사람', text: main.relations },
    ],
    months,
    goodMonths: pick('good'),
    cautionMonths: pick('caution'),
    tips: [...main.tips],
    basis: [
      `${year}년 세운: ${ganzhi}(${STEMS_HANJA[yf.stem.index]}${BRANCHES_HANJA[yf.branch.index]})`,
      `천간 ${stemTg} · 지지 ${branchTg}`,
      `용신 ${EL_TERM[r.yongsin.yong]} · 희신 ${EL_TERM[r.yongsin.hee]} · 기신 ${EL_TERM[r.yongsin.gi]} → ${favor === 'good' ? '도움' : favor === 'caution' ? '부담' : '보통'}`,
      ...(relation ? [`일지 ${BRANCHES_KO[dayBranch]}와 세운 지지 ${BRANCHES_KO[yb]}: ${relation === 'chung' ? '충' : relation === 'hap' ? '육합' : '같은 글자'}`] : []),
      '월별: 절기 기준 월운(인월~축월), 천간·지지 오행이 용신·희신이면 좋음, 기신·구신이면 조심',
    ],
  };
}


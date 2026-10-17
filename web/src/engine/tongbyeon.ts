// 통변 조립 (기획서 6장). 계산 결과로만 문장을 만들고, 계산은 바꾸지 않습니다.
import { ELEMENTS_KO } from './constants';
import type { Combination, PillarKey, SajuResult, TenGodGroup } from './saju';
import { TEN_GOD_GROUPS, tenGodGroup, TEN_GODS } from './saju';
import type { JamidusuChart, OverlayChart, Palace, PalaceName } from './jamidusu';
import {
  DAY_MASTER_IMAGE,
  DAY_MASTER_PERSONALITY,
  DISCLAIMER,
  ELEMENT_FEW,
  ELEMENT_LIFE,
  ELEMENT_MANY,
  GEUKGUK_STRENGTH,
  GEUKGUK_TEXT,
  GROUP_APTITUDE,
  GROUP_FIELD,
  GROUP_LOVE,
  GROUP_PERSONALITY,
  YINYANG_TEXT,
  STRENGTH_PERSONALITY,
  WORK_STYLE,
  ELEMENT_JOBS,
  SPOUSE_STAR_PILLAR,
  LOVE_STRENGTH,
  WEALTH_STYLE,
  WEALTH_BALANCE,
  WEALTH_LEAK,
  ELEMENT_BODY,
  HEALTH_STRENGTH,
  SEASON_HEALTH,
  PILLAR_PAIR_TEXT,
  HEALTH_DISCLAIMER,
  PALACE_FIELD,
  STAR_TEXT,
  STRENGTH_SENTENCE,
  UNSEONG,
  AUX_MEANING,
  PAIR_TEXT,
  SAL_MEANING,
  SIHWA_MEANING,
} from './tongbyeon-data';
import { BRANCH_TEXT, SPOUSE_PALACE } from './ilju-data';
import { FORTUNE_TEN_GOD, yongsinSentence } from './fortune-tongbyeon';
import { daehanChart } from './jamidusu';
import { BRANCHES_KO } from './constants';
import { BRIGHT_PLAIN, CHUNG, HAP, T, V, charName, elementName, ganzhiName, group, josa, palace, phase, plainJosa, sihwa, tenGod, term, yong } from './terms';

export { josa };

export interface TongbyeonSection {
  key: string;
  title: string;
  paragraphs: string[];
}

export const SAJU_TABS = [
  ['general', '총론'],
  ['personality', '성격'],
  ['aptitude', '적성'],
  ['love', '연애'],
  ['wealth', '재물'],
  ['health', '건강'],
] as const;

const firstSentence = (text: string) => {
  const m = text.match(/^.*?[.!?요](\s|$)/);
  return (m ? m[0] : text).trim();
};
const joinNames = (names: string[]) => names.join('·');

// ---------------------------------------------------------------- 사주
const ORGANS = ['간·눈·근육', '심장·혈액 순환', '위장·소화', '폐·호흡기·피부', '신장·방광·몸의 수분'];

function groupRatios(r: SajuResult): Record<TenGodGroup, number> {
  const out = Object.fromEntries(TEN_GOD_GROUPS.map((g) => [g, 0])) as Record<TenGodGroup, number>;
  if (!r.tenGodRatios) return out;
  for (const t of TEN_GODS) out[tenGodGroup(t)] += r.tenGodRatios[t];
  return out;
}

function extremeElements(r: SajuResult) {
  const ratios = r.elementRatios!;
  let most = 0;
  let least = 0;
  ratios.forEach((v, i) => {
    if (v > ratios[most]) most = i;
    if (v < ratios[least]) least = i;
  });
  return { most, least, ratios };
}

/** 가장 많은 십신 무리. 같으면 월지(격국)의 무리를 우선합니다. */
export function topGroup(r: SajuResult): TenGodGroup {
  return rankedGroups(r)[0];
}

function rankedGroups(r: SajuResult): TenGodGroup[] {
  const g = groupRatios(r);
  const month = r.pillars.find((p) => p.key === 'month');
  const monthGroup = month ? tenGodGroup(month.branchTenGod as (typeof TEN_GODS)[number]) : null;
  return [...TEN_GOD_GROUPS].sort((a, b) => {
    const diff = g[b] - g[a];
    if (Math.abs(diff) > 0.05) return diff;
    return (b === monthGroup ? 1 : 0) - (a === monthGroup ? 1 : 0);
  });
}

function sajuWealth(r: SajuResult) {
  const g = groupRatios(r);
  const out: string[] = [];
  if (g['재성'] >= 25) out.push('사주에 재물 별이 넉넉해요. 돈의 흐름을 읽는 감각이 있어 기회를 잘 잡아요.');
  else if (g['재성'] < 10) out.push('사주에 재물 별이 적은 편이에요. 큰 한 방보다 월급처럼 꾸준한 수입과 자동 저축이 잘 맞아요.');
  else out.push('사주에 재물 별이 알맞게 있어요. 계획을 세워 꾸준히 모으면 재물이 안정돼요.');
  if (g['식상'] >= 15 && g['재성'] >= 15) out.push('재능과 표현이 돈으로 이어지는 흐름이 있어요. 잘하는 것을 상품이나 서비스로 만들어 보세요.');
  return out;
}

const guaranteeCaution = (r: SajuResult) =>
  groupRatios(r)['비겁'] >= 30 ? '내 편이 많은 만큼 돈을 나눌 일도 생겨요. 보증이나 동업은 꼭 문서로 정리하고 신중하게 결정하세요.' : null;

const strengthBucket = (r: SajuResult) => (r.strengthText === '극강' || r.strengthText === '신강' ? 'strong' : r.strengthText === '중화' ? 'mid' : 'weak');

/** 지금 대운부터 앞으로, 천간이나 지지에 그 무리가 들어오는 대운의 시작 나이 (최대 3개) */
function upcomingAges(r: SajuResult, g: TenGodGroup): number[] {
  const from = Math.max(0, r.currentBigFortuneIndex);
  return r.bigFortunes
    .slice(from)
    .filter((b) => tenGodGroup(b.stemTenGod) === g || tenGodGroup(b.branchTenGod) === g)
    .slice(0, 3)
    .map((b) => b.startAge);
}
const agesText = (ages: number[]) => ages.map((a) => `${a}세`).join(', ');

export function sajuTongbyeon(r: SajuResult, gender: 'M' | 'F'): TongbyeonSection[] {
  const dm = r.dayMaster.index;
  const image = DAY_MASTER_IMAGE[dm];
  const personality = DAY_MASTER_PERSONALITY[dm];

  if (r.incompleteBirthTime || !r.elementRatios) {
    const notice = '출생시간을 입력하면 이 부분을 자세히 볼 수 있어요.';
    return SAJU_TABS.map(([key, title]) => {
      if (key === 'general') return { key, title, paragraphs: [`${term.일간} ${josa(charName(r.dayMaster), '은', '는')} ${josa(image, '을', '를')} 닮았어요.`, notice] };
      if (key === 'personality') return { key, title, paragraphs: [personality] };
      return { key, title, paragraphs: [notice] };
    });
  }

  const { most, least, ratios } = extremeElements(r);
  const g = groupRatios(r);
  const ranked = rankedGroups(r);
  const top = ranked[0];
  const second = ranked[1];
  const dayPillar = r.pillars.find((p) => p.key === 'day')!;
  const dayBranchTg = dayPillar.branchTenGod as (typeof TEN_GODS)[number];
  const spouseGroup: TenGodGroup = gender === 'M' ? '재성' : '관성';
  const spouse = g[spouseGroup];
  const peach = r.pillars.some((p) => [0, 3, 6, 9].includes(p.branch.index));
  const geuk = (r.geukgukLabel ?? '').split(' ')[0];
  const y = r.yongsin!;
  const me = r.dayMaster.element;
  const wealthEl = (me + 2) % 5;

  // 총론
  const general = [
    `사주는 ${josa(image, '을', '를')} 닮았어요.`,
    STRENGTH_SENTENCE[r.strengthText!],
    `${josa(elementName(most), '이', '가')} 가장 많아요. ${ELEMENT_MANY[most].replace(/^\S+ 기운이 많아 /, '그래서 ')} 반대로 ${josa(elementName(least), '이', '가')} ${ratios[least] === 0 ? '없어요' : '가장 적어요'}. ${ELEMENT_FEW[least].replace(/^\S+ 기운이 부족해 /, '')}`,
  ];
  if (GEUKGUK_TEXT[geuk]) general.push(GEUKGUK_TEXT[geuk].replace(`${geuk}이에요`, josa(T('사주', geuk), '이에요', '예요')));
  general.push(
    `${josa(yong('용신'), '은', '는')} ${elementName(y.yong)}이고, ${josa(yong('희신'), '은', '는')} ${josa(elementName(y.hee), '이에요', '예요')}. 반대로 ${josa(elementName(y.gi), '은', '는')} 부담이 되기 쉬워요.`,
    `${josa(yong('용신'), '을', '를')} 채우는 생활: ${ELEMENT_LIFE[y.yong]}`,
  );
  general.push(...combinationLines(r));

  // 성격
  const dayBranch = dayPillar.branch.index;
  const ph = UNSEONG.find(([n]) => n === dayPillar.growthPhase);
  const animal = BRANCH_TEXT[dayBranch][0];
  const personalityParas = [
    DAY_MASTER_PERSONALITY[dm],
    `${V(`태어난 날 아래에 ${BRANCHES_KO[dayBranch]}${['목', '화', '토', '금', '수'][dayPillar.branch.element]}(${animal}) 기운이 있어서`, `일지 ${dayPillar.branch.hanja}(${animal}) 위에 서 있어서`)}, ${BRANCH_TEXT[dayBranch][3]}`,
    GROUP_PERSONALITY[top],
  ];
  if (ph) personalityParas.push(`${V('내 힘의 세기로 보면', '일간의 12운성은')} ${josa(phase(ph[0]), '이에요', '예요')}. ${ph[1]}`);
  const yangCount = r.pillars.reduce((n, p) => n + (p.stem.index % 2 === 0 ? 1 : 0) + (p.branch.index % 2 === 0 ? 1 : 0), 0);
  personalityParas.push(yangCount >= 6 ? YINYANG_TEXT.yang : yangCount <= 2 ? YINYANG_TEXT.yin : YINYANG_TEXT.even);
  personalityParas.push(STRENGTH_PERSONALITY[strengthBucket(r)]);

  // 적성
  const aptitude = [GROUP_APTITUDE[top]];
  if (g[second] >= 15 && g[top] - g[second] <= 10) aptitude.push(`${group(second)}의 힘도 함께 있어서, ${firstSentence(GROUP_APTITUDE[second])}`);
  if (GEUKGUK_STRENGTH[geuk]) aptitude.push(`${T('이 사주', geuk)}의 강점인 ${josa(GEUKGUK_STRENGTH[geuk], '을', '를')} 살릴 수 있는 일을 고르면 오래 즐겁게 할 수 있어요.`);
  aptitude.push(WORK_STYLE[strengthBucket(r)]);
  if (g['관성'] >= 20) aptitude.push(`${josa(group('관성'), '이', '가')} 뚜렷해서 직급과 역할이 분명한 조직에서 인정받기 쉬워요. 공공기관, 큰 회사, 자격이 필요한 직업이 잘 맞아요.`);
  else if (g['비겁'] + g['식상'] >= 45) aptitude.push(`${group('비겁')}과 ${josa(group('식상'), '이', '가')} 강해서 자기 이름을 걸고 하는 일이 잘 맞아요. 창업, 프리랜서, 전문 기술처럼 내 방식대로 일할 수 있는 길을 열어 두세요.`);
  aptitude.push(`${josa(elementName(y.yong), '과', '와')} 맞닿은 ${ELEMENT_JOBS[y.yong]}도 잘 어울려요. 나에게 필요한 기운을 일로 채우는 셈이라 오래 해도 덜 지쳐요.`);
  const workAges = upcomingAges(r, '관성');
  if (workAges.length) aptitude.push(`${agesText(workAges)}에 시작하는 ${term.대운}에는 ${josa(group('관성'), '이', '가')} 들어와 맡는 역할이 커지기 쉬워요. 자리를 옮기거나 한 단계 올라서기 좋은 때예요.`);

  // 연애
  const love = [`${V('태어난 날의 아래 글자는 배우자 자리라고 불러요.', '일지는 배우자 자리예요.')} ${SPOUSE_PALACE[dayBranchTg]}`];
  const spouseWord = gender === 'M' ? '아내·연인을 뜻하는 별' : '남편·연인을 뜻하는 별';
  if (spouse >= 25) love.push(`${spouseWord}이 넉넉해서 인연이 잘 찾아오는 편이에요. 오히려 한 사람에게 마음을 모으는 것이 중요해요.`);
  else if (spouse < 8) love.push(`${spouseWord}이 적은 편이라 인연이 늦게 오거나 천천히 깊어질 수 있어요. 서두르지 않아도 괜찮아요.`);
  else love.push(`${spouseWord}이 알맞게 있어서 자연스럽게 인연을 만들어 가요.`);
  const dayCombos = r.combinations.filter((c) => c.positions.includes('day') && c.kind !== '천간합');
  if (dayCombos.some((c) => c.kind === '지지육합')) love.push(`배우자 자리가 옆 기둥과 ${HAP} 정이 깊고, 한번 맺은 인연을 오래 이어 가는 편이에요.`);
  if (dayCombos.some((c) => c.kind === '지지육충')) love.push(`배우자 자리가 옆 기둥과 ${CHUNG} 관계에 변화가 생기기 쉬워요. 서로의 거리와 생활 방식을 미리 맞춰 두면 좋아요.`);
  const SPOUSE_ORDER: PillarKey[] = ['day', 'month', 'hour', 'year'];
  const starAt = SPOUSE_ORDER.find((k) => {
    const p = r.pillars.find((x) => x.key === k);
    if (!p) return false;
    const stemG = p.stemTenGod === '일간' ? null : tenGodGroup(p.stemTenGod);
    return stemG === spouseGroup || tenGodGroup(p.branchTenGod as (typeof TEN_GODS)[number]) === spouseGroup;
  });
  if (starAt) love.push(SPOUSE_STAR_PILLAR[starAt]);
  love.push(LOVE_STRENGTH[strengthBucket(r)]);
  if (top !== tenGodGroup(dayBranchTg)) love.push(`사주 전체로 보면, ${GROUP_LOVE[top]}`);
  if (peach) love.push('사람을 끄는 매력(도화)이 있어 이성에게 인기가 있는 편이에요.');
  const loveAges = upcomingAges(r, spouseGroup);
  if (loveAges.length) love.push(`${agesText(loveAges)}에 시작하는 ${term.대운}에는 ${spouseWord}이 들어와, 좋은 인연을 만나거나 관계가 깊어지기 쉬워요.`);

  // 재물
  const wealth = sajuWealth(r);
  const tg = r.tenGodRatios!;
  if (tg['편재'] + tg['정재'] >= 5) wealth.push(tg['편재'] - tg['정재'] >= 10 ? WEALTH_STYLE.active : tg['정재'] - tg['편재'] >= 10 ? WEALTH_STYLE.steady : WEALTH_STYLE.both);
  const bucket = strengthBucket(r);
  if (g['재성'] >= 25 && bucket === 'weak') wealth.push(WEALTH_BALANCE.heavy);
  else if (g['재성'] >= 15 && bucket === 'strong') wealth.push(WEALTH_BALANCE.able);
  else if (g['재성'] < 10 && bucket === 'strong') wealth.push(WEALTH_BALANCE.light);
  if (wealthEl === y.yong || wealthEl === y.hee) wealth.push(`재물을 뜻하는 ${josa(elementName(wealthEl), '이', '가')} 나에게 필요한 기운이라, 돈을 버는 활동 자체가 힘이 되는 사주예요. 적극적으로 기회를 찾아도 좋아요.`);
  else if (wealthEl === y.gi || wealthEl === y.gu) wealth.push(`재물을 뜻하는 ${josa(elementName(wealthEl), '이', '가')} 부담이 되는 쪽이라, 돈을 먼저 쫓기보다 실력과 신용을 쌓으면 재물이 따라오기 쉬워요.`);
  wealth.push(WEALTH_LEAK[top]);
  const caution = guaranteeCaution(r);
  if (caution) wealth.push(caution);
  const moneyAges = upcomingAges(r, '재성');
  if (moneyAges.length) wealth.push(`${agesText(moneyAges)}에 시작하는 ${term.대운}에는 ${josa(group('재성'), '이', '가')} 들어와 돈의 움직임이 활발해지기 쉬워요. 수입을 늘릴 기회도, 지출이 커질 일도 함께 오니 계획을 세워 두세요.`);

  // 건강
  const health = [`${josa(elementName(least), '이', '가')} 약한 편이라 ${ORGANS[least]} 쪽을 미리 챙겨 주면 좋아요. ${ELEMENT_LIFE[least]}`];
  if (ratios[most] >= 35) health.push(`${josa(elementName(most), '이', '가')} 지나치게 많아요. 넘치는 기운도 균형을 깨기 쉬우니 ${ORGANS[most]} 쪽이 무리하지 않게 살펴 주세요.`);
  health.push(ELEMENT_BODY[me]);
  health.push(HEALTH_STRENGTH[strengthBucket(r)]);
  const mb = r.pillars.find((p) => p.key === 'month')!.branch.index;
  health.push(SEASON_HEALTH[[2, 3, 4].includes(mb) ? 'spring' : [5, 6, 7].includes(mb) ? 'summer' : [8, 9, 10].includes(mb) ? 'autumn' : 'winter']);
  health.push(HEALTH_DISCLAIMER);

  return [
    { key: 'general', title: '총론', paragraphs: general },
    { key: 'personality', title: '성격', paragraphs: personalityParas },
    { key: 'aptitude', title: '적성', paragraphs: aptitude },
    { key: 'love', title: '연애', paragraphs: love },
    { key: 'wealth', title: '재물', paragraphs: wealth },
    { key: 'health', title: '건강', paragraphs: health },
  ];
}

const PILLAR_WORD: Record<PillarKey, string> = { hour: '시', day: '날', month: '달', year: '해' };
const ELEMENT_WORD = ['나무', '불', '흙', '쇠', '물'];

/** 원국 합충의 뜻 */
function combinationLines(r: SajuResult): string[] {
  const byKey = Object.fromEntries(r.pillars.map((p) => [p.key, p])) as Record<PillarKey, (typeof r.pillars)[number]>;
  return r.combinations.map((c) => {
    const [a, b] = c.positions;
    const pair = PILLAR_PAIR_TEXT[`${a}-${b}`] ?? '';
    const isStem = c.kind === '천간합';
    const chars = [a, b].map((k) => (isStem ? byKey[k].stem : byKey[k].branch));
    const names = chars.map((x) => x.korean + ['목', '화', '토', '금', '수'][x.element]);
    const plainSubject = plainJosa(`태어난 ${plainJosa(PILLAR_WORD[a], '과', '와')} ${PILLAR_WORD[b]}의 ${isStem ? '겉 기운' : '바탕 기운'}인 ${plainJosa(names[0], '과', '와')} ${names[1]}`, '이', '가');
    const termSubject = c.text.split(' → ')[0];
    if (c.kind === '지지육충') {
      return `${V(`${plainSubject} 서로 부딪쳐(충)`, `${termSubject}:`)} ${pair} 사이에 부딪침과 움직임이 있어요. 변화가 잦은 대신 정체되지 않는 힘도 돼요.`;
    }
    const el = c.element ?? 0;
    return `${V(`${plainSubject} 서로 끌어당겨(합) ${ELEMENT_WORD[el]} 기운(${['목', '화', '토', '금', '수'][el]})이 더해져요.`, `${c.text}:`)} ${josa(pair, '이', '가')} 서로 돕는 모습이에요.`;
  });
}

// ---------------------------------------------------------------- 자미두수
const TAB_PALACE: Record<string, PalaceName> = {
  general: '명궁',
  personality: '명궁',
  aptitude: '관록궁',
  love: '부처궁',
  wealth: '재백궁',
  health: '질액궁',
};
const OTHER_PALACES: PalaceName[] = ['형제궁', '자녀궁', '천이궁', '노복궁', '전택궁', '복덕궁', '부모궁'];

interface StarsInPalace {
  names: string[];
  borrowed: boolean;
  palace: Palace;
}

/** 궁의 주성. 비어 있으면 맞은편 궁의 주성을 빌립니다. */
export function mainStarsOf(chart: JamidusuChart, branch: number): StarsInPalace {
  const p = chart.palaces[branch];
  const own = p.stars.filter((s) => s.kind === 'main').map((s) => s.name);
  if (own.length) return { names: own, borrowed: false, palace: p };
  const opp = chart.palaces[(branch + 6) % 12];
  return { names: opp.stars.filter((s) => s.kind === 'main').map((s) => s.name), borrowed: true, palace: p };
}

const pairKeyOf = (names: string[]) => [...names].sort().join('·');
const STRONG = new Set(['묘', '왕']);
const WEAK = new Set(['불', '함']);

/** 궁 이름 (쉬운 말: '일·직업을 보는 자리(관록궁)') */
const pal = (name: PalaceName | string) => palace(name, PALACE_FIELD[name]);

/** 주성 소개(두 별이면 함께 있는 모습 먼저) */
function starLines(stars: StarsInPalace, field: keyof (typeof STAR_TEXT)[string], palaceName: PalaceName) {
  const lines: string[] = [];
  const label = pal(palaceName);
  if (stars.borrowed) lines.push(`${josa(label, '은', '는')} ${josa(term.주성, '이', '가')} 비어 있어 맞은편 자리의 ${joinNames(stars.names)} 기운을 빌려 봐요.`);
  else lines.push(`${label}에는 ${josa(joinNames(stars.names), '이', '가')} 있어요.`);
  if (stars.names.length === 2 && PAIR_TEXT[pairKeyOf(stars.names)]) lines.push(PAIR_TEXT[pairKeyOf(stars.names)]);
  for (const n of stars.names) lines.push(STAR_TEXT[n][field]);
  return lines;
}

const brightLabel = (name: string, b: string) => V(`${name}(${BRIGHT_PLAIN[b]})`, `${name}(${b})`);

/** 밝기, 보좌·살성, 사화로 그 궁의 풀이를 보탭니다. */
function palaceDetailLines(chart: JamidusuChart, branch: number, stars: StarsInPalace, overlay?: OverlayChart) {
  const p = chart.palaces[branch];
  const out: string[] = [];
  if (!stars.borrowed) {
    const mains = p.stars.filter((x) => x.kind === 'main');
    const strong = mains.filter((x) => STRONG.has(x.brightness));
    const weak = mains.filter((x) => WEAK.has(x.brightness));
    if (strong.length) out.push(`${josa(strong.map((x) => brightLabel(x.name, x.brightness)).join('·'), '은', '는')} 별빛이 밝은 자리에 있어 장점이 잘 드러나요.`);
    if (weak.length) out.push(`${josa(weak.map((x) => brightLabel(x.name, x.brightness)).join('·'), '은', '는')} 별빛이 약한 자리라 장점이 늦게 드러날 수 있어요. 서두르기보다 경험을 쌓을수록 힘이 붙어요.`);
  }
  const good = p.stars.filter((x) => x.kind === 'aux' && AUX_MEANING[x.name]);
  const sal = p.stars.filter((x) => x.kind === 'sal' && SAL_MEANING[x.name]);
  if (good.length) out.push(`돕는 별 ${josa(good.map((x) => `${x.name}(${AUX_MEANING[x.name]})`).join(', '), '이', '가')} 함께 있어 힘을 보태요.`);
  if (sal.length) out.push(`부딪치는 별 ${sal.map((x) => `${x.name}(${SAL_MEANING[x.name]})`).join(', ')}의 기운도 함께 있어요. 부딪치는 일이 있을 때 한 박자 쉬어 가면 오히려 추진력이 돼요.`);
  const hw = [
    ...p.stars.filter((x) => x.sihwa && x.kind !== 'minor').map((x) => ({ star: x.name, kind: x.sihwa!, prefix: '화' })),
    ...(overlay?.sihwa.filter((x) => x.branch === branch) ?? []).map((x) => ({ star: x.star, kind: x.sihwa, prefix: x.label[0] })),
  ];
  for (const h of hw) {
    const mark = josa(sihwa(h.kind, h.prefix), '이', '가');
    out.push(
      h.kind === '기'
        ? `${h.star}에 ${mark} 붙어 있어요. 이 분야는 욕심보다 꾸준함으로 다가가 보세요.`
        : `${h.star}에 ${mark} 붙어 이 분야에 ${SIHWA_MEANING[h.kind]}이 깃들어 있어요.`,
    );
  }
  return out;
}

/** 이어진 자리(맞은편과 삼합 자리)까지 함께 본 힘 */
function connectedLine(chart: JamidusuChart, branch: number, names: PalaceName[], palaceName: PalaceName) {
  const related = [(branch + 6) % 12, (branch + 4) % 12, (branch + 8) % 12];
  const all = [branch, ...related].map((b) => chart.palaces[b]);
  const good = all.flatMap((p) => p.stars.filter((x) => x.kind === 'aux' && AUX_MEANING[x.name])).length + all.flatMap((p) => p.stars.filter((x) => x.sihwa && x.sihwa !== '기')).length;
  const bad = all.flatMap((p) => p.stars.filter((x) => x.kind === 'sal')).length + all.flatMap((p) => p.stars.filter((x) => x.sihwa === '기')).length;
  const rel = V(related.map((b) => `'${PALACE_FIELD[names[b]]}'`).join(', '), related.map((b) => names[b].replace('궁', '')).join('·'));
  const lead = `${josa(pal(palaceName), '과', '와')} 이어진 ${rel} 자리까지 함께 보면`;
  if (good >= bad + 2) return `${lead} 돕는 기운이 넉넉해서, 주변의 도움을 받아 일을 키우기 좋아요.`;
  if (bad >= good + 2) return `${lead} 부딪치는 기운이 많은 편이라, 혼자 버티기보다 믿을 만한 사람과 나누면 좋아요.`;
  return `${lead} 돕는 기운과 부딪치는 기운이 고르게 섞여 있어요.`;
}

const branchOfName = (names: PalaceName[], name: PalaceName) => names.indexOf(name);

export function jamidusuTongbyeon(chart: JamidusuChart, overlay?: OverlayChart): TongbyeonSection[] {
  const names: PalaceName[] = overlay ? overlay.names : chart.palaces.map((p) => p.name);
  const prefix = overlay ? overlay.sihwa[0].label[0] : '화';
  const hwSource = overlay ? overlay.sihwa : chart.sihwa.map((s) => ({ ...s, label: '화' + s.sihwa }));
  const fieldOf = (kind: string) => {
    const h = hwSource.find((s) => s.sihwa === kind)!;
    return { mark: sihwa(kind, prefix), field: PALACE_FIELD[names[h.branch]] };
  };

  const sections: TongbyeonSection[] = SAJU_TABS.map(([key, title]) => {
    const palaceName = TAB_PALACE[key];
    // 성격 탭은 늘 선천 명궁 기준
    const branch = key === 'personality' ? chart.mingBranch : branchOfName(names, palaceName);
    const stars = mainStarsOf(chart, branch);

    if (key === 'general') {
      const paras: string[] = [];
      if (overlay) {
        const natalName = chart.palaces[overlay.mingBranch].name;
        const lead = overlay.kind === 'daehan' ? `${overlay.range!.start}-${overlay.range!.end}세 ${term.대한} 동안은` : `${overlay.year}년에는`;
        paras.push(`${lead} '${PALACE_FIELD[natalName]}' 분야가 삶의 중심 주제가 되기 쉬워요.`);
        for (const n of stars.names) paras.push(STAR_TEXT[n].flow);
      } else {
        paras.push(...starLines(stars, 'image', '명궁').slice(0, 1));
        if (stars.names.length === 2 && PAIR_TEXT[pairKeyOf(stars.names)]) paras.push(PAIR_TEXT[pairKeyOf(stars.names)]);
        for (const n of stars.names) paras.push(`${josa(n, '은', '는')} ${josa(STAR_TEXT[n].image, '이에요', '예요')}. ${josa(STAR_TEXT[n].strength, '이', '가')} 있어요.`);
        paras.push(...palaceDetailLines(chart, branch, stars));
        const shen = chart.palaces[chart.shenBranch];
        if (!shen.isMing) paras.push(`${josa(term.신궁, '은', '는')} ${pal(shen.name)}에 있어요. 나이가 들수록 '${PALACE_FIELD[shen.name]}' 분야에 마음과 힘을 쏟게 되기 쉬워요.`);
        else paras.push(`${josa(term.신궁, '이', '가')} ${josa(pal('명궁'), '과', '와')} 같은 자리에 있어, 타고난 성향이 평생 한결같이 이어지는 편이에요.`);
      }
      const lu = fieldOf('록');
      const quan = fieldOf('권');
      const ke = fieldOf('과');
      const ji = fieldOf('기');
      paras.push(`${josa(lu.mark, '은', '는')} '${lu.field}' 분야에 들어 있어요. 이 분야에서 기회와 도움을 얻기 쉬워요.`);
      paras.push(`${josa(quan.mark, '은', '는')} '${quan.field}' 분야에, ${josa(ke.mark, '은', '는')} '${ke.field}' 분야에 있어요.`);
      paras.push(`${josa(ji.mark, '은', '는')} '${ji.field}' 분야에 있어요. 서두르지 말고 한 번 더 살펴보세요.`);
      return { key, title, paragraphs: paras };
    }

    const field = ({ personality: 'personality', aptitude: 'aptitude', love: 'love', wealth: 'wealth', health: 'health' } as const)[key];
    const paras = starLines(stars, field, palaceName);
    // 성격 탭은 총론과 같은 명궁이라 밝기·보좌성 설명을 되풀이하지 않습니다.
    if (key !== 'personality') paras.push(...palaceDetailLines(chart, branch, stars, overlay));
    if (key === 'aptitude' || key === 'wealth') paras.push(connectedLine(chart, branch, names, palaceName));
    if (overlay && key !== 'personality') {
      const lead = overlay.kind === 'daehan' ? `이 ${term.대한} 동안` : '올해';
      paras.push(`${lead} ${josa(pal(palaceName), '은', '는')} 원래 명반의 ${josa(pal(chart.palaces[branch].name), '이에요', '예요')}.`);
      for (const n of stars.names) paras.push(STAR_TEXT[n].flow);
    }
    if (key === 'health') paras.push(HEALTH_DISCLAIMER);
    return { key, title, paragraphs: paras };
  });

  // 그 밖의 궁
  const others = OTHER_PALACES.map((pn) => {
    const b = branchOfName(names, pn);
    const st = mainStarsOf(chart, b);
    const p = chart.palaces[b];
    const tone = st.borrowed
      ? `${josa(term.주성, '이', '가')} 비어 맞은편 기운을 빌려 보는 자리예요`
      : p.stars.some((x) => x.kind === 'main' && WEAK.has(x.brightness))
        ? '별빛이 약한 편이라 천천히 다져 가면 좋은 자리예요'
        : p.stars.some((x) => x.kind === 'main' && STRONG.has(x.brightness))
          ? '별빛이 밝아 장점이 잘 드러나는 자리예요'
          : '무난한 자리예요';
    const extras: string[] = [];
    const good = p.stars.filter((x) => x.kind === 'aux' && AUX_MEANING[x.name]).map((x) => x.name);
    const sal = p.stars.filter((x) => x.kind === 'sal').map((x) => x.name);
    if (good.length) extras.push(`돕는 별(${good.join('·')})`);
    if (sal.length) extras.push(`부딪치는 별(${sal.join('·')})`);
    const hw = p.stars.filter((x) => x.sihwa && x.kind !== 'minor').map((x) => sihwa(x.sihwa!));
    if (hw.length) extras.push(hw.join(', '));
    const strengths = st.names.map((n) => STAR_TEXT[n].strength).join(', ');
    return `${pal(pn)}: ${joinNames(st.names)} — ${josa(strengths, '이', '가')} 이 분야에 드러나요. ${tone}.${extras.length ? ` 함께 있는 것: ${extras.join(', ')}.` : ''}`;
  });
  sections.push({ key: 'others', title: '그 밖의 궁', paragraphs: others });
  return sections;
}

// ---------------------------------------------------------------- 종합
/** 사주 십신 무리가 가리키는 명반 분야들 */
const GROUP_TO_FIELDS: Record<TenGodGroup, string[]> = {
  비겁: ['나 자신', '형제·동료', '친구·인맥'],
  식상: ['자녀·아랫사람', '마음·취미', '바깥 활동·이동'],
  재성: ['돈·재물', '집·부동산'],
  관성: ['일·직업', '부모·윗사람'],
  인성: ['부모·윗사람', '마음·취미', '집·부동산'],
};
/** 배우자를 뜻하는 별(남자는 재성, 여자는 관성)은 '배우자·연애' 분야도 가리킵니다. */
const fieldMatches = (group: TenGodGroup, field: string, gender: 'M' | 'F') =>
  GROUP_TO_FIELDS[group].includes(field) || (field === '배우자·연애' && group === (gender === 'M' ? '재성' : '관성'));

function mingBrightness(chart: JamidusuChart): 'bright' | 'dim' | 'mid' {
  const mains = chart.palaces[chart.mingBranch].stars.filter((x) => x.kind === 'main');
  if (mains.some((x) => STRONG.has(x.brightness))) return 'bright';
  if (mains.some((x) => WEAK.has(x.brightness))) return 'dim';
  return 'mid';
}

const MING = T('나 자신을 보는 자리', '명궁');
const SELF_SYNTH: Record<string, string> = {
  'strong/bright': `사주의 기운도 강하고 ${MING}의 별빛도 밝아, 자기 색이 뚜렷하고 어디서든 존재감이 드러나는 편이에요.`,
  'strong/dim': `사주의 기운은 강한데 ${MING}의 별빛은 은은한 편이라, 겉으로 드러내기보다 속으로 단단한 사람이에요.`,
  'strong/mid': `사주의 기운이 강해 스스로 밀고 나가는 힘이 있고, ${josa(MING, '은', '는')} 그 힘을 무난하게 받쳐 줘요.`,
  'weak/bright': `사주의 기운은 약한 편이지만 ${MING}의 별빛이 밝아, 사람들과 함께할 때 장점이 크게 살아나요.`,
  'weak/dim': `사주의 기운도 ${MING}의 별빛도 은은한 편이라, 서두르지 않고 경험을 쌓을수록 힘이 붙는 사람이에요.`,
  'weak/mid': `사주의 기운은 약한 편이라 도움을 받을 때 힘이 나고, ${josa(MING, '은', '는')} 그 흐름을 무난하게 받쳐 줘요.`,
  'mid/bright': `사주의 기운이 고르고 ${MING}의 별빛도 밝아, 균형 잡힌 모습 속에서 장점이 잘 드러나요.`,
  'mid/dim': `사주의 기운이 고르고 ${MING}의 별빛은 은은해, 조용히 자기 몫을 해내는 사람이에요.`,
  'mid/mid': `사주의 기운이 고르고 ${josa(MING, '도', '도')} 무난해, 상황에 맞춰 균형을 잡는 힘이 있어요.`,
};

export function combinedTongbyeon(r: SajuResult, chart: JamidusuChart, now = new Date(), gender: 'M' | 'F' = chart.gender): TongbyeonSection[] {
  const dm = r.dayMaster.index;
  const ming = mainStarsOf(chart, chart.mingBranch);
  const mingStars = joinNames(ming.names);
  const strengths = ming.names.map((n) => STAR_TEXT[n].strength).join(', ');
  const sajuStrong = r.strengthText === '극강' || r.strengthText === '신강' ? 'strong' : r.strengthText === '중화' ? 'mid' : 'weak';

  // 본모습
  const self = [
    `사주는 ${josa(DAY_MASTER_IMAGE[dm], '을', '를')} 닮았어요. ${firstSentence(DAY_MASTER_PERSONALITY[dm])} 자미두수에서 ${MING}의 ${josa(mingStars, '은', '는')} 여기에 ${josa(strengths, '을', '를')} 더해 줘요.`,
    SELF_SYNTH[`${sajuStrong}/${mingBrightness(chart)}`],
  ];

  // 힘이 나는 곳
  const ranked = rankedGroups(r);
  const top = ranked[0];
  const lu = chart.sihwa.find((s) => s.sihwa === '록')!;
  const quan = chart.sihwa.find((s) => s.sihwa === '권')!;
  const luField = PALACE_FIELD[lu.palace];
  const quanField = PALACE_FIELD[quan.palace];
  const power: string[] = [];
  const shared = [luField, quanField].find((f) => fieldMatches(top, f, gender) || fieldMatches(ranked[1], f, gender));
  if (shared) {
    const g = fieldMatches(top, shared, gender) ? top : ranked[1];
    power.push(`두 풀이가 함께 가리키는 곳은 ${josa(`'${shared}'`, '이에요', '예요')}. 사주의 ${josa(group(g), '과', '와')} 명반의 ${josa(sihwa(shared === luField ? '록' : '권'), '이', '가')} 같은 쪽을 향해요.`);
  } else {
    power.push(`사주는 '${GROUP_FIELD[top]}' 쪽에서 힘이 나고, 명반은 '${luField}' 분야에 ${sihwa('록')}, '${quanField}' 분야에 ${josa(sihwa('권'), '이', '가')} 있어요. 두 곳을 함께 살리면 좋아요.`);
  }
  const career = mainStarsOf(chart, chart.palaces.find((p) => p.name === '관록궁')!.branch);
  power.push(`사주가 권하는 일: ${firstSentence(GROUP_APTITUDE[top])}`);
  power.push(`${josa(pal('관록궁'), '이', '가')} 권하는 일: ${career.names.map((n) => firstSentence(STAR_TEXT[n].aptitude)).join(' ')}`);

  // 지금 시기
  const nowParas: string[] = [];
  const big = r.bigFortunes[r.currentBigFortuneIndex];
  const koreanAge = now.getFullYear() - chart.lunar.year + 1;
  const dh = daehanChart(chart, koreanAge);
  const dhField = PALACE_FIELD[chart.palaces[dh.mingBranch].name];
  if (big) {
    const bigGroup = tenGodGroup(big.stemTenGod);
    nowParas.push(`지금은 ${big.startAge}세 ${ganzhiName(big.stem, big.branch)} ${josa(term.대운, '과', '와')} ${dh.range!.start}-${dh.range!.end}세 ${josa(term.대한, '이', '가')} 겹치는 시기예요.`);
    nowParas.push(`사주로 보면 ${V('겉으로', '천간에')} ${josa(tenGod(big.stemTenGod), '이', '가')} 들어온 10년이에요. ${firstSentence(FORTUNE_TEN_GOD[big.stemTenGod])} 명반으로 보면 '${dhField}' 분야가 삶의 중심 주제가 되기 쉬워요.`);
    if (fieldMatches(bigGroup, dhField, gender)) nowParas.push(`두 풀이가 모두 '${dhField}' 쪽을 가리키고 있어, 지금은 이 분야에 힘을 모으면 좋아요.`);
    else nowParas.push(`사주는 '${GROUP_FIELD[bigGroup]}', 명반은 '${dhField}' 쪽을 비추고 있어요. 두 흐름을 함께 챙기면 시기를 잘 쓸 수 있어요.`);
    const tone = yongsinSentence(r, big);
    if (tone) nowParas.push(tone);
  } else {
    nowParas.push(`아직 첫 ${josa(term.대운, '이', '가')} 시작되는 ${r.bigFortunes[0]?.startAge ?? '-'}세 전이에요. 명반으로 보면 지금은 '${dhField}' 분야가 중심이 되는 ${dh.range!.start}-${dh.range!.end}세 ${josa(term.대한, '이에요', '예요')}.`);
  }
  const dlu = dh.sihwa.find((x) => x.sihwa === '록')!;
  const dji = dh.sihwa.find((x) => x.sihwa === '기')!;
  nowParas.push(`${josa(sihwa('록', '대'), '은', '는')} '${PALACE_FIELD[dh.names[dlu.branch]]}' 분야에, ${josa(sihwa('기', '대'), '은', '는')} '${PALACE_FIELD[dh.names[dji.branch]]}' 분야에 있어요.`);

  // 재물
  const wealthPalace = mainStarsOf(chart, chart.palaces.find((p) => p.name === '재백궁')!.branch);
  const money = [sajuWealth(r)[0], ...wealthPalace.names.map((n) => STAR_TEXT[n].wealth)];
  const caution = guaranteeCaution(r);
  if (caution) money.push(caution);

  // 채우면 좋은 점
  const y = r.yongsin!;
  const ji = chart.sihwa.find((s) => s.sihwa === '기')!;
  const fill = [
    `사주에서 ${josa(yong('용신'), '은', '는')} ${josa(elementName(y.yong), '이에요', '예요')}. ${ELEMENT_LIFE[y.yong]}`,
    `명반에서는 '${PALACE_FIELD[ji.palace]}' 분야에 ${josa(sihwa('기'), '이', '가')} 있어요. 이 분야는 욕심보다 꾸준함으로 다가가 보세요.`,
  ];

  return [
    { key: 'self', title: '본모습', paragraphs: self },
    { key: 'power', title: '힘이 나는 곳', paragraphs: power },
    { key: 'now', title: '지금 시기', paragraphs: nowParas },
    { key: 'wealth', title: '재물', paragraphs: money },
    { key: 'fill', title: '채우면 좋은 점', paragraphs: fill },
  ];
}

export { DISCLAIMER };

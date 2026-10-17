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
  GROUP_PERSONALITY,
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

// ---------------------------------------------------------------- 한국어 조사
const hasBatchim = (word: string) => {
  const c = word.charCodeAt(word.length - 1);
  if (c < 0xac00 || c > 0xd7a3) return false;
  return (c - 0xac00) % 28 !== 0;
};
/** 끝이 괄호면 괄호 안 마지막 글자로 조사를 고릅니다. 예: '태양(함)' → '태양(함)은' */
export const josa = (word: string, withB: string, withoutB: string) => {
  const base = word.endsWith(')') ? word.slice(0, -1) : word;
  return word + (hasBatchim(base) ? withB : withoutB);
};
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

export function sajuTongbyeon(r: SajuResult, gender: 'M' | 'F'): TongbyeonSection[] {
  const dm = r.dayMaster.index;
  const image = DAY_MASTER_IMAGE[dm];
  const personality = DAY_MASTER_PERSONALITY[dm];

  if (r.incompleteBirthTime || !r.elementRatios) {
    const notice = '출생시간을 입력하면 이 부분을 자세히 볼 수 있어요.';
    return SAJU_TABS.map(([key, title]) => {
      if (key === 'general') return { key, title, paragraphs: [`${josa(r.dayMaster.hanja + ' 일간', '은', '는')} ${josa(image, '을', '를')} 닮았어요.`, notice] };
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
  const lackText = ratios[least] === 0 ? `${ELEMENTS_KO[least]} 기운이 없어요.` : `${ELEMENTS_KO[least]} 기운이 가장 적어요.`;
  const geuk = (r.geukgukLabel ?? '').split(' ')[0];
  const y = r.yongsin!;
  const me = r.dayMaster.element;
  const wealthEl = (me + 2) % 5;

  // 총론
  const general = [
    `사주는 ${josa(image, '을', '를')} 닮았어요.`,
    STRENGTH_SENTENCE[r.strengthText!],
    `${ELEMENTS_KO[most]} 기운이 가장 많아요. ${ELEMENT_MANY[most]} ${lackText} ${ELEMENT_FEW[least]}`,
  ];
  if (GEUKGUK_TEXT[geuk]) general.push(GEUKGUK_TEXT[geuk]);
  general.push(
    `나에게 가장 필요한 기운(용신)은 ${ELEMENTS_KO[y.yong]}, 그 기운을 돕는 희신은 ${josa(ELEMENTS_KO[y.hee], '이에요', '예요')}. 반대로 ${ELEMENTS_KO[y.gi]} 기운은 부담이 되기 쉬워요.`,
    `용신을 채우는 생활: ${ELEMENT_LIFE[y.yong]}`,
  );
  general.push(...combinationLines(r.combinations));

  // 성격
  const dayBranch = dayPillar.branch.index;
  const phase = UNSEONG.find(([n]) => n === dayPillar.growthPhase);
  const personalityParas = [
    DAY_MASTER_PERSONALITY[dm],
    `태어난 날의 지지 ${dayPillar.branch.hanja}(${BRANCH_TEXT[dayBranch][0]}) 위에 서 있어서, ${BRANCH_TEXT[dayBranch][3]}`,
    GROUP_PERSONALITY[top],
  ];
  if (phase) personalityParas.push(`일간이 일지에서 ‘${phase[0]}’의 자리에 있어요. ${phase[1]}`);

  // 적성
  const aptitude = [GROUP_APTITUDE[top]];
  if (g[second] >= 15 && g[top] - g[second] <= 10) aptitude.push(`${second} 쪽 재능도 함께 있어서, ${firstSentence(GROUP_APTITUDE[second])}`);
  if (GEUKGUK_STRENGTH[geuk]) aptitude.push(`${geuk}의 강점인 ${josa(GEUKGUK_STRENGTH[geuk], '을', '를')} 살릴 수 있는 일을 고르면 오래 즐겁게 할 수 있어요.`);

  // 연애
  const love = [`태어난 날의 지지는 배우자 자리예요. ${SPOUSE_PALACE[dayBranchTg]}`];
  const spouseWord = gender === 'M' ? '아내·연인을 뜻하는 별' : '남편·연인을 뜻하는 별';
  if (spouse >= 25) love.push(`${spouseWord}이 넉넉해서 인연이 잘 찾아오는 편이에요. 오히려 한 사람에게 마음을 모으는 것이 중요해요.`);
  else if (spouse < 8) love.push(`${spouseWord}이 적은 편이라 인연이 늦게 오거나 천천히 깊어질 수 있어요. 서두르지 않아도 괜찮아요.`);
  else love.push(`${spouseWord}이 알맞게 있어서 자연스럽게 인연을 만들어 가요.`);
  const dayCombos = r.combinations.filter((c) => c.positions.includes('day') && c.kind !== '천간합');
  if (dayCombos.some((c) => c.kind === '지지육합')) love.push('배우자 자리가 옆 기둥과 합을 이뤄 정이 깊고, 한번 맺은 인연을 오래 이어 가는 편이에요.');
  if (dayCombos.some((c) => c.kind === '지지육충')) love.push('배우자 자리가 옆 기둥과 충을 이뤄 관계에 변화가 생기기 쉬워요. 서로의 거리와 생활 방식을 미리 맞춰 두면 좋아요.');
  if (peach) love.push('사람을 끄는 매력(도화)이 있어 이성에게 인기가 있는 편이에요.');

  // 재물
  const wealth = sajuWealth(r);
  if (wealthEl === y.yong || wealthEl === y.hee) wealth.push(`재물의 기운(${ELEMENTS_KO[wealthEl]})이 나에게 필요한 기운이라, 돈을 버는 활동 자체가 힘이 되는 사주예요. 적극적으로 기회를 찾아도 좋아요.`);
  else if (wealthEl === y.gi || wealthEl === y.gu) wealth.push(`재물의 기운(${ELEMENTS_KO[wealthEl]})이 부담이 되는 쪽이라, 돈을 먼저 쫓기보다 실력과 신용을 쌓으면 재물이 따라오기 쉬워요.`);
  const caution = guaranteeCaution(r);
  if (caution) wealth.push(caution);

  // 건강
  const health = [`${ELEMENTS_KO[least]} 기운이 약한 편이라 ${ORGANS[least]} 쪽을 미리 챙겨 주면 좋아요. ${ELEMENT_LIFE[least]}`];
  if (ratios[most] >= 35) health.push(`${ELEMENTS_KO[most]} 기운이 지나치게 많아요. 넘치는 기운도 균형을 깨기 쉬우니 ${ORGANS[most]} 쪽이 무리하지 않게 살펴 주세요.`);
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

/** 원국 합충의 뜻 */
function combinationLines(combos: Combination[]): string[] {
  return combos.map((c) => {
    const pair = PILLAR_PAIR_TEXT[c.positions.join('-') as `${PillarKey}-${PillarKey}`] ?? '';
    if (c.kind === '지지육충') return `${c.text}: ${pair} 사이에 부딪침과 움직임이 있어요. 변화가 잦은 대신 정체되지 않는 힘도 돼요.`;
    const el = c.element !== undefined ? ELEMENTS_KO[c.element] : '';
    return `${c.text}: ${josa(pair, '이', '가')} 서로 끌어당겨 협력하는 모습이에요. 합으로 ${el} 기운이 더해져요.`;
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

/** 주성 소개(두 별이면 함께 있는 모습 먼저) */
function starLines(stars: StarsInPalace, field: keyof (typeof STAR_TEXT)[string], palaceLabel: string) {
  const lines: string[] = [];
  if (stars.borrowed) lines.push(`${palaceLabel}은 주성이 비어 있어 맞은편 궁의 ${joinNames(stars.names)} 기운을 빌려 봐요.`);
  else lines.push(`${palaceLabel}에는 ${josa(joinNames(stars.names), '이', '가')} 있어요.`);
  if (stars.names.length === 2 && PAIR_TEXT[pairKeyOf(stars.names)]) lines.push(PAIR_TEXT[pairKeyOf(stars.names)]);
  for (const n of stars.names) lines.push(STAR_TEXT[n][field]);
  return lines;
}

/** 밝기, 보좌·살성, 사화로 그 궁의 풀이를 보탭니다. */
function palaceDetailLines(chart: JamidusuChart, branch: number, stars: StarsInPalace, overlay?: OverlayChart) {
  const p = chart.palaces[branch];
  const out: string[] = [];
  if (!stars.borrowed) {
    const mains = p.stars.filter((x) => x.kind === 'main');
    const strong = mains.filter((x) => STRONG.has(x.brightness)).map((x) => `${x.name}(${x.brightness})`);
    const weak = mains.filter((x) => WEAK.has(x.brightness)).map((x) => `${x.name}(${x.brightness})`);
    if (strong.length) out.push(`${josa(joinNames(strong), '은', '는')} 빛이 밝은 자리에 있어 장점이 잘 드러나요.`);
    if (weak.length) out.push(`${josa(joinNames(weak), '은', '는')} 빛이 약한 자리라 장점이 늦게 드러날 수 있어요. 서두르기보다 경험을 쌓을수록 힘이 붙어요.`);
  }
  const good = p.stars.filter((x) => x.kind === 'aux' && AUX_MEANING[x.name]);
  const sal = p.stars.filter((x) => x.kind === 'sal' && SAL_MEANING[x.name]);
  if (good.length) out.push(`돕는 별 ${josa(good.map((x) => `${x.name}(${AUX_MEANING[x.name]})`).join(', '), '이', '가')} 함께 있어 힘을 보태요.`);
  if (sal.length) out.push(`${sal.map((x) => `${x.name}(${SAL_MEANING[x.name]})`).join(', ')}의 기운도 함께 있어요. 부딪치는 일이 있을 때 한 박자 쉬어 가면 오히려 추진력이 돼요.`);
  const hw = [
    ...p.stars.filter((x) => x.sihwa && x.kind !== 'minor').map((x) => ({ star: x.name, sihwa: x.sihwa!, label: '화' + x.sihwa })),
    ...(overlay?.sihwa.filter((x) => x.branch === branch) ?? []).map((x) => ({ star: x.star, sihwa: x.sihwa, label: x.label })),
  ];
  for (const h of hw) {
    out.push(
      h.sihwa === '기'
        ? `${h.star}에 ${h.label}가 붙어 이 분야는 ${SIHWA_MEANING[h.sihwa]}이 있는 곳이에요. 욕심보다 꾸준함으로 다가가 보세요.`
        : `${h.star}에 ${h.label}이 붙어 이 분야에 ${SIHWA_MEANING[h.sihwa]}이 깃들어 있어요.`,
    );
  }
  return out;
}

/** 이어진 자리(맞은편과 삼합 자리)까지 함께 본 힘 */
function connectedLine(chart: JamidusuChart, branch: number, names: PalaceName[], label: string) {
  const related = [(branch + 6) % 12, (branch + 4) % 12, (branch + 8) % 12];
  const all = [branch, ...related].map((b) => chart.palaces[b]);
  const good = all.flatMap((p) => p.stars.filter((x) => x.kind === 'aux' && AUX_MEANING[x.name])).length + all.flatMap((p) => p.stars.filter((x) => x.sihwa && x.sihwa !== '기')).length;
  const bad = all.flatMap((p) => p.stars.filter((x) => x.kind === 'sal')).length + all.flatMap((p) => p.stars.filter((x) => x.sihwa === '기')).length;
  const relNames = related.map((b) => names[b].replace('궁', '')).join('·');
  if (good >= bad + 2) return `${label}과 이어진 ${relNames} 자리까지 함께 보면 돕는 기운이 넉넉해서, 주변의 도움을 받아 일을 키우기 좋아요.`;
  if (bad >= good + 2) return `${label}과 이어진 ${relNames} 자리까지 함께 보면 부딪치는 기운이 많은 편이라, 혼자 버티기보다 믿을 만한 사람과 나누면 좋아요.`;
  return `${label}과 이어진 ${relNames} 자리까지 함께 보면 돕는 기운과 부딪치는 기운이 고르게 섞여 있어요.`;
}

const branchOfName = (names: PalaceName[], name: PalaceName) => names.indexOf(name);

export function jamidusuTongbyeon(chart: JamidusuChart, overlay?: OverlayChart): TongbyeonSection[] {
  const names: PalaceName[] = overlay ? overlay.names : chart.palaces.map((p) => p.name);
  const hwSource = overlay ? overlay.sihwa : chart.sihwa.map((s) => ({ ...s, label: '화' + s.sihwa }));
  const fieldOf = (sihwa: string) => {
    const h = hwSource.find((s) => s.sihwa === sihwa)!;
    return { label: h.label, star: h.star, field: PALACE_FIELD[names[h.branch]] };
  };

  const sections: TongbyeonSection[] = SAJU_TABS.map(([key, title]) => {
    const palaceName = TAB_PALACE[key];
    // 성격 탭은 늘 선천 명궁 기준
    const branch = key === 'personality' ? chart.mingBranch : branchOfName(names, palaceName);
    const stars = mainStarsOf(chart, branch);
    const label = palaceName;

    if (key === 'general') {
      const paras: string[] = [];
      if (overlay) {
        const natalName = chart.palaces[overlay.mingBranch].name;
        const lead = overlay.kind === 'daehan' ? `${overlay.range!.start}-${overlay.range!.end}세 대한 동안은` : `${overlay.year}년에는`;
        paras.push(`${lead} '${PALACE_FIELD[natalName]}' 분야가 삶의 중심 주제가 되기 쉬워요.`);
        for (const n of stars.names) paras.push(STAR_TEXT[n].flow);
      } else {
        paras.push(...starLines(stars, 'image', '명궁').slice(0, 1));
        if (stars.names.length === 2 && PAIR_TEXT[pairKeyOf(stars.names)]) paras.push(PAIR_TEXT[pairKeyOf(stars.names)]);
        for (const n of stars.names) paras.push(`${josa(n, '은', '는')} ${josa(STAR_TEXT[n].image, '이에요', '예요')}. ${josa(STAR_TEXT[n].strength, '이', '가')} 있어요.`);
        paras.push(...palaceDetailLines(chart, branch, stars));
        const shen = chart.palaces[chart.shenBranch];
        if (!shen.isMing) paras.push(`몸과 후반생을 보는 신궁은 ${shen.name}에 있어요. 나이가 들수록 '${PALACE_FIELD[shen.name]}' 분야에 마음과 힘을 쏟게 되기 쉬워요.`);
        else paras.push('신궁이 명궁과 같은 자리에 있어, 타고난 성향이 평생 한결같이 이어지는 편이에요.');
      }
      const lu = fieldOf('록');
      const quan = fieldOf('권');
      const ke = fieldOf('과');
      const ji = fieldOf('기');
      paras.push(`좋은 기운(${lu.label})은 '${lu.field}' 분야에 들어 있어요. 이 분야에서 기회와 도움을 얻기 쉬워요.`);
      paras.push(`힘과 주도권(${quan.label})은 '${quan.field}' 분야에, 명예와 좋은 평판(${ke.label})은 '${ke.field}' 분야에 있어요.`);
      paras.push(`마음을 써야 할 기운(${ji.label})은 '${ji.field}' 분야에 있어요. 서두르지 말고 한 번 더 살펴보세요.`);
      return { key, title, paragraphs: paras };
    }

    const field = ({ personality: 'personality', aptitude: 'aptitude', love: 'love', wealth: 'wealth', health: 'health' } as const)[key];
    const paras = starLines(stars, field, label);
    // 성격 탭은 총론과 같은 명궁이라 밝기·보좌성 설명을 되풀이하지 않습니다.
    if (key !== 'personality') paras.push(...palaceDetailLines(chart, branch, stars, overlay));
    if (key === 'aptitude' || key === 'wealth') paras.push(connectedLine(chart, branch, names, label));
    if (overlay && key !== 'personality') {
      const lead = overlay.kind === 'daehan' ? '이 대한 동안' : '올해';
      paras.push(`${lead} ${palaceName} 자리는 원래 명반의 ${chart.palaces[branch].name}이에요.`);
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
      ? '주성이 비어 맞은편 기운을 빌려 보는 자리예요'
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
    const hw = p.stars.filter((x) => x.sihwa && x.kind !== 'minor').map((x) => `화${x.sihwa}`);
    if (hw.length) extras.push(hw.join('·'));
    const strengths = st.names.map((n) => STAR_TEXT[n].strength).join(', ');
    return `${pn}(${PALACE_FIELD[pn]}): ${joinNames(st.names)} — ${josa(strengths, '이', '가')} 이 분야에 드러나요. ${tone}.${extras.length ? ` 함께 있는 것: ${extras.join(', ')}.` : ''}`;
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

const SELF_SYNTH: Record<string, string> = {
  'strong/bright': '사주의 기운도 강하고 명궁의 별빛도 밝아, 자기 색이 뚜렷하고 어디서든 존재감이 드러나는 편이에요.',
  'strong/dim': '사주의 기운은 강한데 명궁의 별빛은 은은한 편이라, 겉으로 드러내기보다 속으로 단단한 사람이에요.',
  'strong/mid': '사주의 기운이 강해 스스로 밀고 나가는 힘이 있고, 명궁은 그 힘을 무난하게 받쳐 줘요.',
  'weak/bright': '사주의 기운은 약한 편이지만 명궁의 별빛이 밝아, 사람들과 함께할 때 장점이 크게 살아나요.',
  'weak/dim': '사주의 기운도 명궁의 별빛도 은은한 편이라, 서두르지 않고 경험을 쌓을수록 힘이 붙는 사람이에요.',
  'weak/mid': '사주의 기운은 약한 편이라 도움을 받을 때 힘이 나고, 명궁은 그 흐름을 무난하게 받쳐 줘요.',
  'mid/bright': '사주의 기운이 고르고 명궁의 별빛도 밝아, 균형 잡힌 모습 속에서 장점이 잘 드러나요.',
  'mid/dim': '사주의 기운이 고르고 명궁의 별빛은 은은해, 조용히 자기 몫을 해내는 사람이에요.',
  'mid/mid': '사주의 기운이 고르고 명궁도 무난해, 상황에 맞춰 균형을 잡는 힘이 있어요.',
};

export function combinedTongbyeon(r: SajuResult, chart: JamidusuChart, now = new Date(), gender: 'M' | 'F' = chart.gender): TongbyeonSection[] {
  const dm = r.dayMaster.index;
  const ming = mainStarsOf(chart, chart.mingBranch);
  const mingStars = joinNames(ming.names);
  const strengths = ming.names.map((n) => STAR_TEXT[n].strength).join(', ');
  const sajuStrong = r.strengthText === '극강' || r.strengthText === '신강' ? 'strong' : r.strengthText === '중화' ? 'mid' : 'weak';

  // 본모습
  const self = [
    `사주는 ${josa(DAY_MASTER_IMAGE[dm], '을', '를')} 닮았어요. ${firstSentence(DAY_MASTER_PERSONALITY[dm])} 자미두수 명궁의 ${josa(mingStars, '은', '는')} 여기에 ${josa(strengths, '을', '를')} 더해 줘요.`,
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
    const group = fieldMatches(top, shared, gender) ? top : ranked[1];
    power.push(`두 풀이가 함께 가리키는 곳은 '${shared}'${hasBatchim(shared) ? '이에요' : '예요'}. 사주의 ${group} 기운과 명반의 ${shared === luField ? '화록' : '화권'}이 같은 쪽을 향해요.`);
  }
  else power.push(`사주는 '${GROUP_FIELD[top]}' 쪽에서 힘이 나고, 명반은 '${luField}' 분야에 좋은 기운(화록), '${quanField}' 분야에 주도권(화권)이 있어요. 두 곳을 함께 살리면 좋아요.`);
  const career = mainStarsOf(chart, chart.palaces.find((p) => p.name === '관록궁')!.branch);
  power.push(`사주가 권하는 일: ${firstSentence(GROUP_APTITUDE[top])}`);
  power.push(`관록궁이 권하는 일: ${career.names.map((n) => firstSentence(STAR_TEXT[n].aptitude)).join(' ')}`);

  // 지금 시기
  const nowParas: string[] = [];
  const big = r.bigFortunes[r.currentBigFortuneIndex];
  const koreanAge = now.getFullYear() - chart.lunar.year + 1;
  const dh = daehanChart(chart, koreanAge);
  const dhField = PALACE_FIELD[chart.palaces[dh.mingBranch].name];
  if (big) {
    const bigGroup = tenGodGroup(big.stemTenGod);
    nowParas.push(`지금은 ${big.startAge}세 ${big.ganzhi} 대운과 ${dh.range!.start}-${dh.range!.end}세 대한이 겹치는 시기예요.`);
    nowParas.push(`사주로 보면 천간에 ${josa(big.stemTenGod, '이', '가')} 들어온 10년이에요. ${firstSentence(FORTUNE_TEN_GOD[big.stemTenGod])} 명반으로 보면 '${dhField}' 분야가 삶의 중심 주제가 되기 쉬워요.`);
    if (fieldMatches(bigGroup, dhField, gender)) nowParas.push(`두 풀이가 모두 '${dhField}' 쪽을 가리키고 있어, 지금은 이 분야에 힘을 모으면 좋아요.`);
    else nowParas.push(`사주는 '${GROUP_FIELD[bigGroup]}', 명반은 '${dhField}' 쪽을 비추고 있어요. 두 흐름을 함께 챙기면 시기를 잘 쓸 수 있어요.`);
    const tone = yongsinSentence(r, big);
    if (tone) nowParas.push(tone);
  } else {
    nowParas.push(`아직 첫 대운(${r.bigFortunes[0]?.startAge ?? '-'}세)이 시작되기 전이에요. 명반으로 보면 지금은 '${dhField}' 분야가 중심이 되는 ${dh.range!.start}-${dh.range!.end}세 대한이에요.`);
  }
  const dlu = dh.sihwa.find((x) => x.sihwa === '록')!;
  const dji = dh.sihwa.find((x) => x.sihwa === '기')!;
  nowParas.push(`이 대한의 좋은 기운(대록)은 '${PALACE_FIELD[dh.names[dlu.branch]]}' 분야에, 마음을 써야 할 기운(대기)은 '${PALACE_FIELD[dh.names[dji.branch]]}' 분야에 있어요.`);

  // 재물
  const wealthPalace = mainStarsOf(chart, chart.palaces.find((p) => p.name === '재백궁')!.branch);
  const money = [sajuWealth(r)[0], ...wealthPalace.names.map((n) => STAR_TEXT[n].wealth)];
  const caution = guaranteeCaution(r);
  if (caution) money.push(caution);

  // 채우면 좋은 점
  const y = r.yongsin!;
  const ji = chart.sihwa.find((s) => s.sihwa === '기')!;
  const fill = [
    `사주에서 나에게 가장 필요한 기운은 ${josa(ELEMENTS_KO[y.yong], '이에요', '예요')}. ${ELEMENT_LIFE[y.yong]}`,
    `명반에서는 '${PALACE_FIELD[ji.palace]}' 분야에 마음을 써야 할 기운(화기)이 있어요. 이 분야는 욕심보다 꾸준함으로 다가가 보세요.`,
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

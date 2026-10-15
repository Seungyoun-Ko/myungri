// 통변 조립 (기획서 6장). 계산 결과로만 문장을 만들고, 계산은 바꾸지 않습니다.
import { ELEMENTS_KO } from './constants';
import type { SajuResult, TenGodGroup } from './saju';
import { TEN_GOD_GROUPS, tenGodGroup, TEN_GODS } from './saju';
import type { JamidusuChart, OverlayChart, Palace, PalaceName } from './jamidusu';
import {
  DAY_MASTER_IMAGE,
  DAY_MASTER_PERSONALITY,
  DISCLAIMER,
  ELEMENT_FEW,
  ELEMENT_LIFE,
  ELEMENT_MANY,
  GROUP_APTITUDE,
  GROUP_FIELD,
  GROUP_LOVE,
  HEALTH_DISCLAIMER,
  PALACE_FIELD,
  STAR_TEXT,
  STRENGTH_SENTENCE,
} from './tongbyeon-data';

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
export const josa = (word: string, withB: string, withoutB: string) => word + (hasBatchim(word) ? withB : withoutB);
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

export function topGroup(r: SajuResult): TenGodGroup {
  const g = groupRatios(r);
  return TEN_GOD_GROUPS.reduce((a, b) => (g[b] > g[a] ? b : a));
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
  const top = topGroup(r);
  const dayBranchGroup = tenGodGroup(r.pillars.find((p) => p.key === 'day')!.branchTenGod as (typeof TEN_GODS)[number]);
  const spouseGroup: TenGodGroup = gender === 'M' ? '재성' : '관성';
  const spouse = g[spouseGroup];
  const peach = r.pillars.some((p) => [0, 3, 6, 9].includes(p.branch.index));
  const lackText = ratios[least] === 0 ? `${ELEMENTS_KO[least]} 기운이 없어요.` : `${ELEMENTS_KO[least]} 기운이 가장 적어요.`;

  const general = [
    `사주는 ${josa(image, '을', '를')} 닮았어요.`,
    STRENGTH_SENTENCE[r.strengthText!],
    `${ELEMENTS_KO[most]} 기운이 가장 많아요. ${ELEMENT_MANY[most]}`,
    `${lackText} ${ELEMENT_FEW[least]}`,
    `부족한 기운을 채우는 생활: ${ELEMENT_LIFE[least]}`,
  ];

  const love = [GROUP_LOVE[dayBranchGroup]];
  const spouseWord = gender === 'M' ? '아내·연인을 뜻하는 별' : '남편·연인을 뜻하는 별';
  if (spouse >= 25) love.push(`${spouseWord}이 넉넉해서 인연이 잘 찾아오는 편이에요. 오히려 한 사람에게 마음을 모으는 것이 중요해요.`);
  else if (spouse < 8) love.push(`${spouseWord}이 적은 편이라 인연이 늦게 오거나 천천히 깊어질 수 있어요. 서두르지 않아도 괜찮아요.`);
  else love.push(`${spouseWord}이 알맞게 있어서 자연스럽게 인연을 만들어 가요.`);
  if (peach) love.push('사람을 끄는 매력(도화)이 있어 이성에게 인기가 있는 편이에요.');

  const wealth = sajuWealth(r);
  const caution = guaranteeCaution(r);
  if (caution) wealth.push(caution);

  return [
    { key: 'general', title: '총론', paragraphs: general },
    { key: 'personality', title: '성격', paragraphs: [personality] },
    { key: 'aptitude', title: '적성', paragraphs: [GROUP_APTITUDE[top]] },
    { key: 'love', title: '연애', paragraphs: love },
    { key: 'wealth', title: '재물', paragraphs: wealth },
    {
      key: 'health',
      title: '건강',
      paragraphs: [`${ELEMENTS_KO[least]} 기운이 약한 편이라 ${ORGANS[least]} 쪽을 미리 챙겨 주면 좋아요. ${ELEMENT_LIFE[least]}`, HEALTH_DISCLAIMER],
    },
  ];
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

function starLines(stars: StarsInPalace, field: keyof (typeof STAR_TEXT)[string], palaceLabel: string) {
  const lines: string[] = [];
  if (stars.borrowed) lines.push(`${palaceLabel}은 주성이 비어 있어 맞은편 궁의 ${joinNames(stars.names)} 기운을 빌려 봐요.`);
  else lines.push(`${palaceLabel}에는 ${josa(joinNames(stars.names), '이', '가')} 있어요.`);
  for (const n of stars.names) lines.push(STAR_TEXT[n][field]);
  return lines;
}

const branchOfName = (names: PalaceName[], name: PalaceName) => names.indexOf(name);

export function jamidusuTongbyeon(chart: JamidusuChart, overlay?: OverlayChart): TongbyeonSection[] {
  const names: PalaceName[] = overlay ? overlay.names : chart.palaces.map((p) => p.name);
  const luSource = overlay ? overlay.sihwa : chart.sihwa.map((s) => ({ ...s, label: '화' + s.sihwa }));
  const lu = luSource.find((s) => s.sihwa === '록')!;
  const ji = luSource.find((s) => s.sihwa === '기')!;
  const luField = PALACE_FIELD[names[lu.branch]];
  const jiField = PALACE_FIELD[names[ji.branch]];

  return SAJU_TABS.map(([key, title]) => {
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
        for (const n of stars.names) paras.push(`${josa(n, '은', '는')} ${josa(STAR_TEXT[n].image, '이에요', '예요')}. ${josa(STAR_TEXT[n].strength, '이', '가')} 있어요.`);
      }
      paras.push(`좋은 기운(${lu.label})은 '${luField}' 분야에 들어 있어요. 이 분야에서 기회와 도움을 얻기 쉬워요.`);
      paras.push(`마음을 써야 할 기운(${ji.label})은 '${jiField}' 분야에 있어요. 서두르지 말고 한 번 더 살펴보세요.`);
      return { key, title, paragraphs: paras };
    }

    const field = ({ personality: 'personality', aptitude: 'aptitude', love: 'love', wealth: 'wealth', health: 'health' } as const)[key];
    const paras = starLines(stars, field, label);
    if (overlay && key !== 'personality') {
      const lead = overlay.kind === 'daehan' ? '이 대한 동안' : '올해';
      paras.push(`${lead} ${palaceName} 자리는 원래 명반의 ${chart.palaces[branch].name}이에요.`);
      for (const n of stars.names) paras.push(STAR_TEXT[n].flow);
    }
    if (key === 'health') paras.push(HEALTH_DISCLAIMER);
    return { key, title, paragraphs: paras };
  });
}

// ---------------------------------------------------------------- 종합
const GROUP_TO_PALACE_FIELD: Record<TenGodGroup, string> = {
  비겁: '나 자신',
  식상: '마음·취미',
  재성: '돈·재물',
  관성: '일·직업',
  인성: '부모·윗사람',
};

export function combinedTongbyeon(r: SajuResult, chart: JamidusuChart): TongbyeonSection[] {
  const dm = r.dayMaster.index;
  const ming = mainStarsOf(chart, chart.mingBranch);
  const mingStars = joinNames(ming.names);
  const strengths = ming.names.map((n) => STAR_TEXT[n].strength).join(', ');

  const self = [
    `사주는 ${josa(DAY_MASTER_IMAGE[dm], '을', '를')} 닮았어요. ${firstSentence(DAY_MASTER_PERSONALITY[dm])} 자미두수 명궁의 ${josa(mingStars, '은', '는')} 여기에 ${josa(strengths, '을', '를')} 더해 줘요.`,
  ];

  const top = topGroup(r);
  const sajuField = GROUP_TO_PALACE_FIELD[top];
  const lu = chart.sihwa.find((s) => s.sihwa === '록')!;
  const luField = PALACE_FIELD[lu.palace];
  const power: string[] = [];
  if (sajuField === luField) power.push(`두 풀이가 함께 가리키는 곳은 '${luField}'${hasBatchim(luField) ? '이에요' : '예요'}.`);
  else power.push(`사주는 '${GROUP_FIELD[top]}' 쪽에서 힘이 나고, 명반은 '${luField}' 분야에 좋은 기운(화록)이 들어 있어요.`);
  const career = mainStarsOf(chart, chart.palaces.find((p) => p.name === '관록궁')!.branch);
  power.push(`사주가 권하는 일: ${firstSentence(GROUP_APTITUDE[top])}`);
  power.push(`관록궁이 권하는 일: ${career.names.map((n) => firstSentence(STAR_TEXT[n].aptitude)).join(' ')}`);

  const wealthPalace = mainStarsOf(chart, chart.palaces.find((p) => p.name === '재백궁')!.branch);
  const money = [sajuWealth(r)[0], ...wealthPalace.names.map((n) => STAR_TEXT[n].wealth)];
  const caution = guaranteeCaution(r);
  if (caution) money.push(caution);

  const { least, ratios } = extremeElements(r);
  const ji = chart.sihwa.find((s) => s.sihwa === '기')!;
  const fill = [
    `사주에는 ${ELEMENTS_KO[least]} 기운이 ${ratios[least] === 0 ? '없어요' : '부족해요'}. ${ELEMENT_LIFE[least]}`,
    `명반에서는 '${PALACE_FIELD[ji.palace]}' 분야에 마음을 써야 할 기운(화기)이 있어요. 이 분야는 욕심보다 꾸준함으로 다가가 보세요.`,
  ];

  return [
    { key: 'self', title: '본모습', paragraphs: self },
    { key: 'power', title: '힘이 나는 곳', paragraphs: power },
    { key: 'wealth', title: '재물', paragraphs: money },
    { key: 'fill', title: '채우면 좋은 점', paragraphs: fill },
  ];
}

export { DISCLAIMER };

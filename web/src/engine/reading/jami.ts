// 자미두수 풀이와 사주·자미두수 종합 풀이 (쉬운 말 · 풍성하게).
// 본문에는 별 이름 대신 쉬운 별명(nick), 궁 이름 대신 '일·직업 자리' 같은 말을 씁니다. 용어는 basis에만.
import type { JamidusuChart, OverlayChart, PalaceName } from '../jamidusu';
import { daehanChart } from '../jamidusu';
import type { SajuResult, TenGod, TenGodGroup } from '../saju';
import { TEN_GOD_GROUPS, TEN_GODS, tenGodGroup } from '../saju';
import { PALACE_FIELD } from '../tongbyeon-data';
import type { ReadingSection } from './index';
import { DAY_MASTER } from './index';
import type { StarReading, TenGodName } from './types';
import { STARS_A } from './jami-stars-a';
import { STARS_B } from './jami-stars-b';
import { JAMI_EXTRA, PALACES } from './jami-palaces';
import { GEUK, LUCKY, ELEMENT_LACK } from './elements';
import { GROUP_MANY } from './groups';
import { WEALTH_AMOUNT } from './love';
import { BIG, BIG_FAVOR } from './big';
import { fortuneScore, favorOfScore } from './flow';

export const STARS: Record<string, StarReading> = { ...STARS_A, ...STARS_B };

type Field = 'self' | 'work' | 'money' | 'love' | 'health' | 'relations' | 'life';
const FIELD_OF: Record<PalaceName, Field> = {
  명궁: 'self', 형제궁: 'relations', 부처궁: 'love', 자녀궁: 'relations', 재백궁: 'money', 질액궁: 'health',
  천이궁: 'life', 노복궁: 'relations', 관록궁: 'work', 전택궁: 'money', 복덕궁: 'life', 부모궁: 'relations',
};
const STRONG = new Set(['묘', '왕']);
const WEAK = new Set(['불', '함']);
const SIHWA_PLAIN = { 록: '좋은 기운이 깃든 자리', 권: '힘이 실리는 자리', 과: '평판이 따르는 자리', 기: '마음을 써야 할 자리' } as const;

const area = (name: PalaceName) => `${PALACE_FIELD[name]} 자리`;
const firstSentences = (t: string, n: number) => (t.match(/[^.!?]+[.!?]+/g) ?? [t]).slice(0, n).map((x) => x.trim()).join(' ');

interface PalaceView {
  name: PalaceName;
  names: string[];
  borrowed: boolean;
  paragraphs: string[];
  basis: string;
}

/** 한 자리의 풀이. names는 그 시점(선천·대한·유년)의 궁 이름표 */
function palaceView(chart: JamidusuChart, branch: number, name: PalaceName, overlay?: OverlayChart, withBrightness = true): PalaceView {
  const p = chart.palaces[branch];
  const ownMains = p.stars.filter((s) => s.kind === 'main');
  const borrowed = ownMains.length === 0;
  const mains = borrowed ? chart.palaces[(branch + 6) % 12].stars.filter((s) => s.kind === 'main') : ownMains;
  const field = FIELD_OF[name];
  const paras: string[] = [];
  if (borrowed) paras.push(PALACES[name].empty);
  for (const m of mains) if (STARS[m.name]) paras.push(STARS[m.name][field]);
  // 건강 자리에는 일반 보좌·살성·사화·밝기 문장(말솜씨, 이동 등)이 맞지 않아 넣지 않습니다(v1.1에서 건강 전용 문장 예정).
  const generic = name !== '질액궁';
  if (!borrowed && withBrightness && generic) {
    if (ownMains.some((s) => STRONG.has(s.brightness))) paras.push(JAMI_EXTRA.bright[branch % 2]);
    else if (ownMains.some((s) => WEAK.has(s.brightness))) paras.push(JAMI_EXTRA.dim[branch % 2]);
  }
  for (const s of generic ? p.stars : []) {
    if (s.kind === 'aux' && JAMI_EXTRA.aux[s.name]) paras.push(JAMI_EXTRA.aux[s.name]);
    if (s.kind === 'sal' && JAMI_EXTRA.sal[s.name]) paras.push(JAMI_EXTRA.sal[s.name]);
  }
  for (const s of generic ? p.stars : []) if (s.sihwa && s.kind !== 'minor') paras.push(JAMI_EXTRA.sihwa[s.sihwa].natal);
  for (const h of generic ? (overlay?.sihwa.filter((x) => x.branch === branch) ?? []) : []) paras.push(JAMI_EXTRA.sihwa[h.sihwa].period);
  const starBasis = p.stars
    .filter((s) => s.kind !== 'minor')
    .map((s) => `${s.name}${s.kind === 'main' ? `(${s.brightness})` : ''}${s.sihwa ? `·화${s.sihwa}` : ''}`)
    .join(' ');
  return {
    name,
    names: mains.map((m) => m.name),
    borrowed,
    paragraphs: [...new Set(paras)],
    basis: `${name}(${p.branchKo}): ${starBasis || '주성 없음'}${borrowed ? ` → 맞은편 ${chart.palaces[(branch + 6) % 12].name}의 주성 차용` : ''}`,
  };
}

const nicks = (names: string[]) => names.filter((n) => STARS[n]).map((n) => `'${STARS[n].nick}'`).join('과 ');
const headlineOf = (v: PalaceView) =>
  v.borrowed ? `${area(v.name)}는 비어 있어 맞은편의 ${nicks(v.names)} 기운을 빌려 봐요` : `${area(v.name)}에 ${nicks(v.names)}이 떠 있어요`;

export function jamiReading(chart: JamidusuChart, overlay?: OverlayChart): ReadingSection[] {
  const names: PalaceName[] = overlay ? overlay.names : chart.palaces.map((p) => p.name);
  const branchOf = (n: PalaceName) => names.indexOf(n);
  const view = (n: PalaceName) => palaceView(chart, branchOf(n), n, overlay);
  const sihwaFacts = (overlay ? overlay.sihwa.map((s) => ({ kind: s.sihwa, branch: s.branch })) : chart.sihwa.map((s) => ({ kind: s.sihwa, branch: s.branch }))).map((s) => ({
    label: SIHWA_PLAIN[s.kind],
    value: PALACE_FIELD[names[s.branch]],
  }));
  const sihwaBasis = (overlay ? overlay.sihwa.map((s) => `${s.label} ${s.star}: ${names[s.branch]}`) : chart.sihwa.map((s) => `화${s.sihwa} ${s.star}: ${s.palace}`)).join(' · ');

  const sections: ReadingSection[] = [];

  // 대한·유년을 골랐을 때: 이 시기
  if (overlay) {
    const center = chart.palaces[overlay.mingBranch];
    const centerMains = (center.stars.some((s) => s.kind === 'main') ? center : chart.palaces[(overlay.mingBranch + 6) % 12]).stars.filter((s) => s.kind === 'main');
    const when = overlay.kind === 'daehan' ? `${overlay.range!.start}~${overlay.range!.end}세 10년` : `${overlay.year}년 한 해`;
    sections.push({
      key: 'now',
      title: '이 시기',
      headline: { label: when, text: `이 시기에는 '${PALACE_FIELD[center.name]}' 쪽이 삶의 중심 주제가 되기 쉬워요` },
      keywords: centerMains.filter((s) => STARS[s.name]).map((s) => STARS[s.name].keywords[0]),
      paragraphs: [...centerMains.filter((s) => STARS[s.name]).map((s) => STARS[s.name].flow), ...overlay.sihwa.map((s) => `${PALACE_FIELD[names[s.branch]]} 자리 — ${JAMI_EXTRA.sihwa[s.sihwa].period}`)],
      facts: sihwaFacts,
      basis: [`${overlay.label}: 명궁 ${center.branchKo} (선천 ${center.name})`, sihwaBasis],
    });
  }

  // 나 자신 (늘 선천 명궁)
  const self = palaceView(chart, chart.mingBranch, '명궁');
  const mingStars = self.names.filter((n) => STARS[n]);
  const shen = chart.palaces[chart.shenBranch];
  sections.push({
    key: 'general',
    title: '나 자신',
    headline: mingStars.length ? { label: headlineOf(self), text: STARS[mingStars[0]].title } : undefined,
    keywords: [...new Set(mingStars.flatMap((n) => STARS[n].keywords))].slice(0, 4),
    paragraphs: [...mingStars.map((n) => STARS[n].nature), ...self.paragraphs, shen.isMing ? JAMI_EXTRA.shenSame : JAMI_EXTRA.shen.replace('{field}', PALACE_FIELD[shen.name])],
    facts: overlay ? undefined : sihwaFacts,
    basis: [self.basis, `신궁: ${shen.name}(${shen.branchKo})`, `오행국: ${chart.guk.name}`, `생년 사화: ${chart.sihwa.map((s) => `화${s.sihwa} ${s.star}(${s.palace})`).join(' · ')}`],
  });

  const mingStar = mingStars[0];
  /** 이어진 세 자리(맞은편·삼합)까지 본 돕는 기운과 부딪치는 기운 */
  const connected = (n: PalaceName) => {
    const b = branchOf(n);
    const all = [b, (b + 6) % 12, (b + 4) % 12, (b + 8) % 12].map((x) => chart.palaces[x]);
    const good = all.flatMap((p) => p.stars.filter((x) => (x.kind === 'aux' && JAMI_EXTRA.aux[x.name]) || (x.sihwa && x.sihwa !== '기' && x.kind !== 'minor'))).length;
    const bad = all.flatMap((p) => p.stars.filter((x) => x.kind === 'sal' || (x.sihwa === '기' && x.kind !== 'minor'))).length;
    if (good >= bad + 2) return '이 자리와 이어진 다른 자리들에도 돕는 기운이 넉넉해요. 혼자 애쓰기보다 주변의 도움을 받으면 이 분야를 훨씬 크게 키울 수 있어요.';
    if (bad >= good + 2) return '이 자리와 이어진 다른 자리들에 부딪치는 기운이 많은 편이에요. 혼자 버티기보다 믿을 만한 사람과 나누며 가면 부딪침이 오히려 추진력이 돼요.';
    return '이 자리와 이어진 다른 자리들에는 돕는 기운과 부딪치는 기운이 고르게 섞여 있어요. 꾸준히 다져 가면 무리 없이 자라는 분야예요.';
  };
  const single = (key: string, title: string, n: PalaceName, selfField: Field): ReadingSection => {
    const v = view(n);
    const lens = mingStar && !v.names.includes(mingStar) ? `나 자신 자리의 '${STARS[mingStar].nick}'도 이 분야에 색을 더해요. ${firstSentences(STARS[mingStar][selfField], 2)}` : null;
    return {
      key,
      title,
      headline: { text: headlineOf(v) },
      keywords: [...new Set(v.names.filter((x) => STARS[x]).map((x) => STARS[x].keywords[0]))],
      paragraphs: [PALACES[n].intro, ...v.paragraphs, ...(lens ? [lens] : []), connected(n)],
      basis: [v.basis, `삼방사정: ${[0, 6, 4, 8].map((d) => chart.palaces[(branchOf(n) + d) % 12].name).join('·')}`],
      note: n === '질액궁' ? '의학적 진단이 아니에요. 몸이 불편하면 전문가와 상담해 주세요.' : undefined,
    };
  };
  const group = (key: string, title: string, list: PalaceName[]): ReadingSection => {
    // 여러 자리를 묶을 때는 밝기 문장을 빼서 같은 문장이 되풀이되지 않게 합니다
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
    single('work', '일·직업', '관록궁', 'work'),
    single('wealth', '돈·재물', '재백궁', 'money'),
    single('love', '배우자·연애', '부처궁', 'love'),
    single('health', '건강', '질액궁', 'health'),
    group('people', '사람 자리', ['부모궁', '형제궁', '노복궁', '자녀궁']),
    group('life', '생활 자리', ['천이궁', '전택궁', '복덕궁']),
  );
  return sections;
}

// ---------------------------------------------------------------- 종합 (사주 + 자미두수)
const GROUP_TO_FIELDS: Record<TenGodGroup, string[]> = {
  비겁: ['나 자신', '형제·동료', '친구·인맥'],
  식상: ['자녀·아랫사람', '마음·취미', '바깥 활동·이동'],
  재성: ['돈·재물', '집·부동산'],
  관성: ['일·직업', '부모·윗사람'],
  인성: ['부모·윗사람', '마음·취미', '집·부동산'],
};
const GROUP_PLAIN: Record<TenGodGroup, string> = { 비겁: '내 힘과 동료', 식상: '표현과 재능', 재성: '재물과 현실 감각', 관성: '일과 책임', 인성: '배움과 도움' };
const SELF_SYNTH: Record<string, string> = {
  'strong/bright': '사주의 기운도 강하고 명반에서 나를 비추는 별빛도 밝아요. 자기 색이 뚜렷하고, 어느 자리에 가도 존재감이 자연스럽게 드러나는 사람이에요.',
  'strong/dim': '사주의 기운은 강한데 나를 비추는 별빛은 은은한 편이에요. 겉으로 드러내기보다 속으로 단단하게 버티는, 알수록 믿음이 가는 사람이에요.',
  'strong/mid': '사주의 기운이 강해 스스로 밀고 나가는 힘이 있고, 명반의 별빛이 그 힘을 무난하게 받쳐 줘요. 혼자서도 길을 만들어 가는 사람이에요.',
  'weak/bright': '사주의 기운은 부드러운 편이지만 나를 비추는 별빛이 밝아요. 사람들과 함께할 때 장점이 크게 살아나고, 도움을 주고받으며 커 가는 사람이에요.',
  'weak/dim': '사주의 기운도 별빛도 은은한 편이에요. 서두르지 않고 경험을 차곡차곡 쌓을수록 힘이 붙는, 늦게 꽃피어 오래가는 사람이에요.',
  'weak/mid': '사주의 기운은 부드러운 편이라 좋은 사람들 곁에서 힘이 나고, 명반의 별빛이 그 흐름을 무난하게 받쳐 줘요.',
  'mid/bright': '사주의 기운이 고르고 나를 비추는 별빛도 밝아요. 균형 잡힌 모습 속에서 장점이 또렷하게 드러나는 사람이에요.',
  'mid/dim': '사주의 기운이 고르고 별빛은 은은해요. 요란하지 않게 자기 몫을 해내는, 곁에 있으면 편안한 사람이에요.',
  'mid/mid': '사주의 기운도 별빛도 고르게 섞여 있어요. 상황에 맞춰 균형을 잡는 힘이 있어 어디서든 무리 없이 어울려요.',
};

function groupRatios(r: SajuResult): Record<TenGodGroup, number> {
  const out = Object.fromEntries(TEN_GOD_GROUPS.map((g) => [g, 0])) as Record<TenGodGroup, number>;
  if (r.tenGodRatios) for (const t of TEN_GODS) out[tenGodGroup(t)] += r.tenGodRatios[t];
  return out;
}

export function combinedReading(r: SajuResult, chart: JamidusuChart, now = new Date()): ReadingSection[] {
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
    title: '본모습',
    headline: { label: '사주와 명반이 함께 그린 모습', text: dm.title },
    keywords: [...new Set([dm.keywords[0], dm.keywords[1], ...(mingStar ? [STARS[mingStar].keywords[0]] : [])])],
    paragraphs: [
      firstSentences(dm.core[0], 2),
      ...(mingStar ? [`명반에서 나를 비추는 별은 '${STARS[mingStar].nick}'이에요. ${firstSentences(STARS[mingStar].self, 2)}`] : []),
      SELF_SYNTH[`${r.yongsin ? sk : 'mid'}/${bright}`],
    ],
    basis: [`일간 ${r.dayMaster.korean}${['목', '화', '토', '금', '수'][r.dayMaster.element]} · 강약 ${r.strengthText ?? '-'}`, self.basis],
  });

  // 힘이 나는 곳: 사주의 가장 많은 기운과 명반의 좋은 기운 자리가 겹치는지
  const lu = chart.sihwa.find((s) => s.sihwa === '록')!;
  const quan = chart.sihwa.find((s) => s.sihwa === '권')!;
  const luField = PALACE_FIELD[lu.palace];
  const quanField = PALACE_FIELD[quan.palace];
  const shared = [luField, quanField].find((f) => GROUP_TO_FIELDS[top].includes(f));
  const work = palaceView(chart, chart.palaces.find((p) => p.name === '관록궁')!.branch, '관록궁');
  const workStar = work.names.find((n) => STARS[n]);
  out.push({
    key: 'power',
    title: '힘이 나는 곳',
    headline: geuk ? { label: '타고난 무기', text: geuk.weapon } : undefined,
    keywords: [GROUP_MANY[top].keyword],
    paragraphs: [
      shared
        ? `사주의 '${GROUP_PLAIN[top]}' 기운과 명반의 좋은 기운이 함께 '${shared}' 쪽을 가리켜요. 두 풀이가 겹치는 곳이라, 이 분야에 힘을 모으면 성과가 크게 나기 쉬워요.`
        : `사주는 '${GROUP_PLAIN[top]}' 쪽에서 힘이 나고, 명반은 '${luField}' 쪽에 좋은 기운, '${quanField}' 쪽에 힘이 실려 있어요. 두 곳을 함께 살리면 좋아요.`,
      firstSentences(GROUP_MANY[top].work, 2),
      ...(workStar ? [`명반의 일·직업 자리에는 '${STARS[workStar].nick}'이 있어요. ${firstSentences(STARS[workStar].work, 2)}`] : []),
    ],
    chips: { label: '잘 어울리는 일', items: [...new Set([...dm.jobs.slice(0, 4), ...GROUP_MANY[top].jobs.slice(0, 4)])] },
    basis: [`가장 많은 십신 무리: ${top}`, `격국: ${r.geukgukLabel ?? '-'}`, `화록 ${lu.star}(${lu.palace}) · 화권 ${quan.star}(${quan.palace})`, work.basis],
  });

  // 지금 시기: 10년 운 + 명반의 10년 흐름
  const big = r.bigFortunes[r.currentBigFortuneIndex];
  const koreanAge = now.getFullYear() - chart.lunar.year + 1;
  const dh = daehanChart(chart, koreanAge);
  const dhCenter = chart.palaces[dh.mingBranch];
  const dhMains = (dhCenter.stars.some((s) => s.kind === 'main') ? dhCenter : chart.palaces[(dh.mingBranch + 6) % 12]).stars.filter((s) => s.kind === 'main' && STARS[s.name]);
  const nowParas: string[] = [];
  if (big && r.yongsin) {
    const favor = favorOfScore(fortuneScore(r, big));
    nowParas.push(`지금은 ${big.startAge}세부터 이어지는 10년 운 안에 있어요. ${BIG_FAVOR[favor][0]}`, firstSentences(BIG[big.stemTenGod as TenGodName].overview, 3));
  }
  nowParas.push(`명반으로 보면 ${dh.range!.start}~${dh.range!.end}세에는 '${PALACE_FIELD[dhCenter.name]}' 쪽이 삶의 중심 주제가 되기 쉬워요.`, ...dhMains.map((s) => STARS[s.name].flow));
  out.push({
    key: 'now',
    title: '지금 시기',
    headline: big ? { label: `${big.startAge}~${big.startAge + 9}세의 10년`, text: BIG[big.stemTenGod as TenGodName].title } : undefined,
    keywords: [],
    paragraphs: nowParas,
    basis: [...(big ? [`대운 ${big.startAge}세 ${big.stem.korean}${big.branch.korean} · 천간 ${big.stemTenGod as TenGod}`] : []), `대한 ${dh.range!.start}-${dh.range!.end}세: 명궁 ${dhCenter.branchKo}(선천 ${dhCenter.name})`],
  });

  // 재물
  const money = palaceView(chart, chart.palaces.find((p) => p.name === '재백궁')!.branch, '재백궁');
  const moneyStar = money.names.find((n) => STARS[n]);
  out.push({
    key: 'wealth',
    title: '재물',
    keywords: [],
    paragraphs: [
      r.yongsin ? WEALTH_AMOUNT[g['재성'] >= 25 ? 'many' : g['재성'] < 10 ? 'few' : 'normal'] : firstSentences(dm.money, 2),
      firstSentences(dm.money, 2),
      ...(moneyStar ? [`명반의 돈·재물 자리에는 '${STARS[moneyStar].nick}'이 있어요. ${firstSentences(STARS[moneyStar].money, 2)}`] : []),
    ],
    basis: [`재성 ${Math.round(g['재성'])}%`, money.basis],
  });

  // 채우면 좋은 점
  const ji = chart.sihwa.find((s) => s.sihwa === '기')!;
  const fill: ReadingSection = {
    key: 'fill',
    title: '채우면 좋은 점',
    keywords: [],
    paragraphs: [`명반에서는 '${PALACE_FIELD[ji.palace]}' 자리가 마음을 써야 할 곳이에요. ${JAMI_EXTRA.sihwa['기'].natal}`],
    basis: [`화기 ${ji.star}: ${ji.palace}`],
  };
  if (r.yongsin && r.elementRatios) {
    const y = r.yongsin;
    const least = r.elementRatios.indexOf(Math.min(...r.elementRatios));
    fill.paragraphs.unshift(LUCKY[y.yong].intro, ...(r.elementRatios[least] < 12 ? [ELEMENT_LACK[least].personality] : []));
    fill.tips = [...LUCKY[y.yong].activities];
    fill.facts = [
      { label: '힘이 되는 색', value: LUCKY[y.yong].colors.join(', ') },
      { label: '행운의 숫자', value: LUCKY[y.yong].numbers.join(', ') },
      { label: '좋은 방향', value: LUCKY[y.yong].direction },
      { label: '힘이 나는 계절', value: LUCKY[y.yong].season },
    ];
    fill.basis.unshift(`용신 ${['목', '화', '토', '금', '수'][y.yong]}`);
  }
  out.push(fill);
  return out;
}

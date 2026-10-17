// 운 흐름 통변: 대운·세운·월운 풀이.
// 운의 십신(천간 = 겉으로 드러나는 일, 지지 = 생활의 바탕), 용신과의 관계, 일간의 12운성,
// 원국과의 합충을 조합합니다. 예측·보장이 아니라 흐름의 성격을 설명합니다.
import { BRANCH_CHUNG, BRANCH_HAP, STEM_HAP, pairKey, type Fortune, type PillarKey, type SajuResult } from './saju';
import { CHUNG, HAP, T, V, charName, ganzhiName, josa, tenGod, term, yong } from './terms';

const PILLAR_NAME: Record<PillarKey, string> = { hour: T('태어난 시', '시주'), day: T('태어난 날', '일주'), month: T('태어난 달', '월주'), year: T('태어난 해', '년주') };
const OUTER = V('겉으로는', '천간에');
const INNER = V('바탕에는', '지지에');

/** 운에 들어온 천간 십신의 뜻 */
export const FORTUNE_TEN_GOD: Record<string, string> = {
  비견: '나와 같은 기운이 들어와 자립심과 추진력이 커지는 흐름이에요. 혼자 힘으로 일을 벌이거나 뜻이 맞는 동료와 함께하기 좋아요.',
  겁재: '경쟁하는 기운이 들어오는 흐름이에요. 승부욕이 커져 일을 밀고 나가기 좋지만, 돈을 나누거나 빌려주는 일은 조심하는 게 좋아요.',
  식신: '여유와 즐거움, 재능이 살아나는 흐름이에요. 배운 것을 꾸준히 펼치고 몸과 마음을 돌보기 좋아요.',
  상관: '표현력과 재치가 커지는 흐름이에요. 새로운 시도와 창작에 좋지만, 말이나 규칙 문제로 부딪치지 않게 한 번 더 살피세요.',
  편재: '활동 무대가 넓어지고 돈이 크게 움직이는 흐름이에요. 사업과 거래의 기회가 보이는 만큼 씀씀이도 커지기 쉬워요.',
  정재: '성실하게 쌓는 재물과 안정의 흐름이에요. 수입을 정리하고 살림의 기반을 다지기 좋아요.',
  편관: '책임과 압박이 커지는 흐름이에요. 버거워도 견뎌 내면 실력과 자리가 따라오기 쉬우니, 체력 관리를 함께 챙기세요.',
  정관: '질서와 명예의 흐름이에요. 직장과 조직에서 인정받거나 맡은 역할이 분명해지기 쉬워요.',
  편인: '생각이 깊어지고 남다른 관심사가 생기는 흐름이에요. 공부, 연구, 자격 준비에 좋지만 혼자 고민이 길어지지 않게 하세요.',
  정인: '배움과 도움의 흐름이에요. 윗사람이나 문서, 자격과 인연이 닿기 쉽고 마음이 안정돼요.',
};

/** 운의 지지 십신: 생활의 바탕에 깔리는 기운 */
const BASE_TEN_GOD: Record<string, string> = {
  비견: '곁에 함께하는 사람들',
  겁재: '경쟁과 나눔',
  식신: '먹고 즐기는 생활의 여유',
  상관: '표현하고 바꾸려는 마음',
  편재: '바깥 활동과 큰돈의 움직임',
  정재: '꾸준한 수입과 살림',
  편관: '무거운 책임과 긴장',
  정관: '규칙과 직장 생활',
  편인: '혼자만의 생각과 공부',
  정인: '돌봄과 배움',
};

/** 일간의 12운성으로 본 그 시기의 기운 */
const PHASE_ENERGY: Record<string, string> = {
  장생: '새로 시작하는 힘이 붙는',
  목욕: '호기심이 커지고 변화가 잦은',
  관대: '자신감이 오르고 앞에 나서기 좋은',
  건록: '스스로 일어서 실속을 챙기는',
  제왕: '기운이 가장 왕성한',
  쇠: '노련하게 속도를 조절하는',
  병: '쉬어 가며 몸과 마음을 돌보는',
  사: '생각을 정리하고 마무리하는',
  묘: '거두어 모으고 저장하는',
  절: '끊을 것은 끊고 새로 바꾸는',
  태: '새 계획이 싹트는',
  양: '차분히 힘을 기르는',
};

/** 원국 기둥이 가리키는 삶의 영역 */
const PILLAR_AREA: Record<PillarKey, string> = {
  year: '집안·윗세대',
  month: '일터·사회생활',
  day: '배우자·나의 자리',
  hour: '자녀·아랫사람·앞날의 계획',
};

type Tone = 'good' | 'bad' | 'neutral';
function toneOf(r: SajuResult, element: number): { tone: Tone; label: string } {
  const y = r.yongsin;
  if (!y) return { tone: 'neutral', label: '' };
  if (element === y.yong) return { tone: 'good', label: '용신' };
  if (element === y.hee) return { tone: 'good', label: '희신' };
  if (element === y.gi) return { tone: 'bad', label: '기신' };
  if (element === y.gu) return { tone: 'bad', label: '구신' };
  return { tone: 'neutral', label: '한신' };
}

export function yongsinSentence(r: SajuResult, f: Fortune) {
  if (!r.yongsin) return null;
  const s = toneOf(r, f.stem.element);
  const b = toneOf(r, f.branch.element);
  const who = `${term.천간} ${josa(charName(f.stem), '은', '는')} ${yong(s.label)}, ${term.지지} ${josa(charName(f.branch), '은', '는')} ${yong(b.label)}이에요.`;
  const text: Record<string, string> = {
    'good/good': '나에게 필요한 기운이 위아래로 들어와 힘을 받기 좋은 흐름이에요.',
    'good/neutral': '필요한 기운이 겉으로 들어와 일을 풀어 가기 비교적 수월한 흐름이에요.',
    'neutral/good': '필요한 기운이 바탕에 깔려 차근차근 힘이 붙는 흐름이에요.',
    'good/bad': '겉으로는 기회가 보여도 바탕에 부담이 있어, 무리하지 말고 실속을 챙기면 좋아요.',
    'bad/good': '처음엔 부담스러워도 바탕이 받쳐 주어 차근차근 풀어 가기 좋아요.',
    'neutral/neutral': '크게 치우치지 않은 무난한 흐름이라, 하던 일을 꾸준히 이어 가기 좋아요.',
    'bad/neutral': '부담되는 기운이 겉으로 들어와, 새로 벌이는 일은 한 번 더 따져 보는 게 좋아요.',
    'neutral/bad': '바탕에 부담되는 기운이 깔려, 무리한 확장보다 생활의 기본을 지키는 게 좋아요.',
    'bad/bad': '부담되는 기운이 겹치는 시기라 새로 벌이기보다 지키고 다지는 데 힘을 쓰면 좋아요.',
  };
  return `${who} ${text[`${s.tone}/${b.tone}`]}`;
}

/** 운의 글자와 원국의 합충 */
function interactions(r: SajuResult, f: Fortune) {
  const out: string[] = [];
  const day = r.pillars.find((p) => p.key === 'day')!;
  if (STEM_HAP[pairKey(f.stem.index, day.stem.index)] !== undefined) {
    out.push(`이 운의 ${term.천간} ${josa(charName(f.stem), '이', '가')} ${term.일간} ${josa(charName(day.stem), '과', '와')} ${HAP}, 마음이 끌리는 일이나 사람을 만나기 쉬워요.`);
  }
  const chung = r.pillars.filter((p) => BRANCH_CHUNG.has(pairKey(f.branch.index, p.branch.index)));
  const hap = r.pillars.filter((p) => BRANCH_HAP[pairKey(f.branch.index, p.branch.index)] !== undefined);
  // 같은 글자가 여러 기둥에 있으면 한 문장으로 묶습니다.
  const where = (ps: typeof r.pillars) => {
    const names = ps.map((p) => PILLAR_NAME[p.key]).join('·');
    const areas = ps.map((p) => `'${PILLAR_AREA[p.key]}'`).join(', ');
    const chars = [...new Map(ps.map((p) => [p.branch.index, p.branch])).values()].map((b) => charName(b)).join('·');
    return { areas, label: `${names}의 ${josa(chars, '과', '와')}` };
  };
  if (chung.length) {
    const w = where(chung);
    out.push(`이 운의 ${term.지지} ${josa(charName(f.branch), '이', '가')} ${w.label} ${CHUNG} ${w.areas} 쪽에 변화와 움직임이 생기기 쉬워요. 이사, 이동, 관계의 정리처럼 바뀌는 일이 있을 때 서두르지 말고 살펴보세요.`);
  }
  if (hap.length) {
    const w = where(hap);
    out.push(`이 운의 ${term.지지} ${josa(charName(f.branch), '이', '가')} ${w.label} ${HAP} ${w.areas} 쪽에 새로운 인연이나 협력이 생기기 쉬워요.`);
  }
  return out;
}

function fortuneParagraphs(r: SajuResult, f: Fortune, lead: string) {
  const ph = f.growthPhase;
  const paras = [
    `${lead} ${OUTER} ${tenGod(f.stemTenGod)}, ${INNER} ${tenGod(f.branchTenGod)}의 기운이 들어와요. ${FORTUNE_TEN_GOD[f.stemTenGod]}`,
    `생활의 바탕에는 '${BASE_TEN_GOD[f.branchTenGod]}'의 기운이 깔려요. ${V(`내 힘의 세기로 보면 ${PHASE_ENERGY[ph]} 시기(${ph})예요.`, `일간의 12운성으로 보면 ${PHASE_ENERGY[ph]} ‘${ph}’의 시기예요.`)}`,
  ];
  const y = yongsinSentence(r, f);
  if (y) paras.push(y);
  paras.push(...interactions(r, f));
  return paras;
}

export interface FortuneReading {
  title: string;
  paragraphs: string[];
}

export function bigFortuneReading(r: SajuResult, index: number): FortuneReading | null {
  const b = r.bigFortunes[index];
  if (!b) return null;
  const gz = ganzhiName(b.stem, b.branch);
  const lead = `${b.startAge}~${b.startAge + 9}세(${b.startYear}~${b.endYear}년) ${gz} ${term.대운} 동안에는`;
  return { title: `${b.startAge}세 ${term.대운} ${gz} 풀이`, paragraphs: fortuneParagraphs(r, b, lead) };
}

export function yearFortuneReading(r: SajuResult, bigIndex: number, year: number): FortuneReading | null {
  const y = r.daewunYearFortunes[bigIndex]?.find((x) => x.year === year);
  if (!y) return null;
  const gz = ganzhiName(y.stem, y.branch);
  const paras = fortuneParagraphs(r, y, `${year}년 ${gz} ${term.세운}에는`);
  const big = r.bigFortunes[bigIndex];
  if (big && big.branch.index === y.branch.index) {
    paras.push(`${term.대운}과 ${term.세운}의 ${V('바탕 기운이', '지지가')} ${josa(charName(y.branch), '으로', '로')} 같아, 그 기운이 한층 또렷하게 느껴지는 해예요.`);
  } else if (big && BRANCH_CHUNG.has(pairKey(big.branch.index, y.branch.index))) {
    paras.push(`${term.대운}의 ${josa(charName(big.branch), '과', '와')} ${term.세운}의 ${josa(charName(y.branch), '이', '가')} ${CHUNG}, 큰 흐름 안에서 방향을 한 번 점검하게 되는 해예요.`);
  }
  return { title: `${year}년 ${term.세운} ${gz} 풀이`, paragraphs: paras };
}

export function monthFortuneReading(r: SajuResult, month: number): FortuneReading | null {
  const m = r.monthFortunes.find((x) => x.month === month);
  if (!m) return null;
  const gz = ganzhiName(m.stem, m.branch);
  const paras = [`${month}월(절기 기준) ${gz}에는 ${OUTER} ${tenGod(m.stemTenGod)}, ${INNER} ${tenGod(m.branchTenGod)}의 기운이 들어와요. ${FORTUNE_TEN_GOD[m.stemTenGod].split('. ')[0]}.`];
  const y = yongsinSentence(r, m);
  if (y) paras.push(y);
  paras.push(...interactions(r, m).slice(0, 2));
  return { title: `${month}월 ${term.월운} ${gz} 풀이`, paragraphs: paras };
}

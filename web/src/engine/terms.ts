// 통변 문장의 전문 용어 표기.
// 문장 안에서는 용어를 '표시 조각'으로 만들어 두고, 화면에 낼 때 보기 방식에 맞춰 바꿉니다.
//  - 쉬운 말(기본): 쉬운 말 뒤 괄호에 용어  예) 성실하게 모으는 돈(정재), 한자는 한글로  예) 계수
//  - 용어로 보기: 용어만, 한자 그대로       예) 정재, 癸
// 조사는 화면에 낼 때 정합니다. 한국어 표기 관례대로 괄호 앞 낱말에 맞춥니다. 예) 국제연합(UN)은, 돈(정재)이 / 정재가

export type TermMode = 'plain' | 'term';

const T_OPEN = '\u0001';
const H_OPEN = '\u0004';
const V_OPEN = '\u0005';
const J_OPEN = '\u0006';
const SEP = '\u0002';
const CLOSE = '\u0003';

/** 쉬운 말 + 용어: 쉬운 말 모드에서는 '쉬운 말(용어)', 용어 모드에서는 '용어' */
export const T = (plain: string, term: string) => (plain === term ? term : `${T_OPEN}${plain}${SEP}${term}${CLOSE}`);
/** 한자: 쉬운 말 모드에서는 한글(예: 계수), 용어 모드에서는 '한글(한자)' */
export const H = (korean: string, hanja: string) => `${H_OPEN}${korean}${SEP}${hanja}${CLOSE}`;
/** 보기 방식마다 다른 표현 (괄호 없이 통째로 바뀜). 뒤에 조사를 붙이지 않습니다. */
export const V = (plain: string, term: string) => `${V_OPEN}${plain}${SEP}${term}${CLOSE}`;

const TOKEN = /([\u0001\u0004\u0005])([^\u0002\u0003\u0006]*)\u0002([^\u0003]*)\u0003/g;
const JOSA = /\u0006([^\u0002]*)\u0002([^\u0003]*)\u0003/;

const isHangul = (c: number) => c >= 0xac00 && c <= 0xd7a3;
const endsWithBatchim = (s: string) => {
  const c = s.charCodeAt(s.length - 1);
  return isHangul(c) && (c - 0xac00) % 28 !== 0;
};

/** 조사를 고를 낱말: 끝이 괄호면 괄호 앞 낱말 */
function josaBase(text: string): string {
  let t = text.trimEnd();
  while (t.endsWith(')')) {
    let depth = 0;
    let i = t.length - 1;
    for (; i >= 0; i--) {
      if (t[i] === ')') depth++;
      else if (t[i] === '(' && --depth === 0) break;
    }
    if (i <= 0) break;
    t = t.slice(0, i).trimEnd();
  }
  return t.replace(/['’"]+$/, '');
}

export function renderTerms(text: string, mode: TermMode): string {
  let out = text.replace(TOKEN, (_m, kind: string, a: string, b: string) => {
    if (kind === T_OPEN) return mode === 'plain' ? `${a}(${b})` : b;
    if (kind === H_OPEN) return mode === 'plain' ? a : `${a}(${b})`;
    return mode === 'plain' ? a : b;
  });
  // 조사는 바로 앞에 실제로 보이는 글자에 맞춥니다.
  for (let m = JOSA.exec(out); m; m = JOSA.exec(out)) {
    const before = out.slice(0, m.index);
    const pick = endsWithBatchim(josaBase(before)) ? m[1] : m[2];
    out = before + pick + out.slice(m.index + m[0].length);
  }
  return out;
}

// ---------------------------------------------------------------- 조사
/** 조사는 화면에 낼 때 정합니다. withB: 받침 있을 때, withoutB: 없을 때 */
export const josa = (word: string, withB: string, withoutB: string) => `${word}${J_OPEN}${withB}${SEP}${withoutB}${CLOSE}`;

// ---------------------------------------------------------------- 용어집
const ELEMENT_PLAIN = ['나무', '불', '흙', '쇠', '물'];
export const elementName = (e: number) => T(`${ELEMENT_PLAIN[e]} 기운`, ['목', '화', '토', '금', '수'][e]);

export const TEN_GOD_PLAIN: Record<string, string> = {
  비견: '나와 같은 힘',
  겁재: '경쟁하는 힘',
  식신: '여유와 재능',
  상관: '표현과 재치',
  편재: '활동적인 재물',
  정재: '성실하게 모으는 돈',
  편관: '무거운 책임',
  정관: '직장과 질서',
  편인: '깊은 생각과 직관',
  정인: '배움과 도움',
};
export const tenGod = (name: string) => T(TEN_GOD_PLAIN[name] ?? name, name);

export const GROUP_PLAIN: Record<string, string> = {
  비겁: '내 편과 경쟁',
  식상: '표현과 재능',
  재성: '재물',
  관성: '일과 책임',
  인성: '배움과 도움',
};
export const group = (name: string) => T(GROUP_PLAIN[name] ?? name, name);

const YONG_PLAIN: Record<string, string> = {
  용신: '가장 필요한 기운',
  희신: '힘을 보태는 기운',
  기신: '부담되는 기운',
  구신: '부담을 키우는 기운',
  한신: '크게 영향이 없는 기운',
};
export const yong = (label: string) => T(YONG_PLAIN[label] ?? label, label);

const PHASE_PLAIN: Record<string, string> = {
  장생: '새로 시작하는 때',
  목욕: '변화가 잦은 때',
  관대: '자신감이 오르는 때',
  건록: '스스로 일어서는 때',
  제왕: '기운이 가장 센 때',
  쇠: '속도를 조절하는 때',
  병: '쉬어 가는 때',
  사: '정리하는 때',
  묘: '거두어 모으는 때',
  절: '새로 바꾸는 때',
  태: '계획이 싹트는 때',
  양: '힘을 기르는 때',
};
export const phase = (name: string) => T(PHASE_PLAIN[name] ?? name, name);

export const BRIGHT_PLAIN: Record<string, string> = { 묘: '아주 밝음', 왕: '밝음', 득: '알맞음', 리: '조금 밝음', 평: '보통', 불: '어두움', 함: '빛이 약함' };
export const bright = (b: string) => T(BRIGHT_PLAIN[b] ?? b, b);

const SIHWA_PLAIN: Record<string, string> = { 록: '좋은 기운', 권: '힘과 주도권', 과: '좋은 평판', 기: '마음 쓸 기운' };
/** 사화 표시. prefix: '화'(선천), '대'(대한), '년'(유년) */
export const sihwa = (kind: string, prefix = '화') => T(prefix === '화' ? SIHWA_PLAIN[kind] : `이 시기의 ${SIHWA_PLAIN[kind]}`, prefix + kind);

export const term = {
  천간: V('겉으로 드러나는 기운', '천간'),
  지지: V('바탕에 깔린 기운', '지지'),
  일간: T('나를 뜻하는 글자', '일간'),
  일지: T('태어난 날의 아래 글자', '일지'),
  주성: T('중심 별', '주성'),
  대운: T('10년 운', '대운'),
  세운: T('한 해 운', '세운'),
  월운: T('한 달 운', '월운'),
  대한: T('10년 흐름', '대한'),
  신궁: T('후반생을 보는 자리', '신궁'),
  합: T('서로 끌어당김', '합'),
  충: T('서로 부딪침', '충'),
};

/** 궁 이름: 쉬운 말은 '○○을 보는 자리' */
export function palace(name: string, field: string) {
  const c = field.charCodeAt(field.length - 1);
  const obj = c >= 0xac00 && c <= 0xd7a3 && (c - 0xac00) % 28 !== 0 ? '을' : '를';
  return T(`${field}${obj} 보는 자리`, name);
}

/** 천간·지지 글자: 쉬운 말은 '병화', 용어로 보면 '병화(丙)' */
export const charName = (c: { hanja: string; korean: string; element: number }) => H(c.korean + ['목', '화', '토', '금', '수'][c.element], c.hanja);
/** 간지 두 글자: 쉬운 말은 '계묘' */
export const ganzhiName = (stem: { hanja: string; korean: string }, branch: { hanja: string; korean: string }) => H(stem.korean + branch.korean, stem.hanja + branch.hanja);

/** 쉬운 말 문장 안에서 바로 정하는 조사 (표시 조각이 없는 평범한 낱말용) */
export function plainJosa(word: string, withB: string, withoutB: string) {
  const c = word.charCodeAt(word.length - 1);
  return word + (c >= 0xac00 && c <= 0xd7a3 && (c - 0xac00) % 28 !== 0 ? withB : withoutB);
}

/** 합·충을 이루는 동사구: 쉬운 말은 '서로 끌어당겨(합)', 용어는 '합을 이뤄' */
export const HAP = V('서로 끌어당겨(합)', '합을 이뤄');
export const CHUNG = V('서로 부딪쳐(충)', '충을 이뤄');

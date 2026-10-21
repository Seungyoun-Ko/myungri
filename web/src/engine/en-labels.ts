// English names for chart terms. The Korean engine keeps Korean names internally;
// the English screens and the English "chart basis" boxes translate them here.
import type { Combination, PillarKey, StrengthLabel, TenGod, TenGodGroup } from './saju';
import type { PalaceName, Sihwa } from './jamidusu';
import { PILLAR_TITLES } from './saju';
import { BRANCHES_HANJA, STEMS_HANJA } from './constants';

/** Korean romanization of the 10 stems and 12 branches */
export const STEM_EN = ['Gap', 'Eul', 'Byeong', 'Jeong', 'Mu', 'Gi', 'Gyeong', 'Sin', 'Im', 'Gye'] as const;
export const BRANCH_EN = ['Ja', 'Chuk', 'In', 'Myo', 'Jin', 'Sa', 'O', 'Mi', 'Sin', 'Yu', 'Sul', 'Hae'] as const;
export const ELEMENT_EN = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'] as const;
export const ZODIAC_EN = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'] as const;

export const yinYangEn = (index: number) => (index % 2 === 0 ? 'Yang' : 'Yin');
/** e.g. "Gapja" */
export const ganzhiEn = (stem: number, branch: number) => `${STEM_EN[stem]}${BRANCH_EN[branch].toLowerCase()}`;
/** e.g. "Gapja 甲子" */
export const ganzhiFull = (stem: number, branch: number) => `${ganzhiEn(stem, branch)} ${STEMS_HANJA[stem]}${BRANCHES_HANJA[branch]}`;
/** Stem label for basis lines, e.g. "甲 Gap · Yang Wood" */
export const stemLabelEn = (c: { index: number; hanja: string; element: number }) => `${c.hanja} ${STEM_EN[c.index]} · ${yinYangEn(c.index)} ${ELEMENT_EN[c.element]}`;
/** Branch label, e.g. "子 Ja · Water" */
export const branchLabelEn = (c: { index: number; hanja: string; element: number }) => `${c.hanja} ${BRANCH_EN[c.index]} · ${ELEMENT_EN[c.element]}`;

export const TEN_GOD_EN: Record<TenGod | '일간', string> = {
  비견: 'Friend',
  겁재: 'Rob Wealth',
  식신: 'Eating God',
  상관: 'Hurting Officer',
  편재: 'Indirect Wealth',
  정재: 'Direct Wealth',
  편관: 'Seven Killings',
  정관: 'Direct Officer',
  편인: 'Indirect Resource',
  정인: 'Direct Resource',
  일간: 'Day Master',
};
/** Labels for tight grid cells: full words that wrap onto two short lines
 *  (no word longer than 8 letters) instead of clipped abbreviations */
export const TEN_GOD_SHORT: Record<TenGod | '일간', string> = {
  비견: 'Friend',
  겁재: 'Rob Wealth',
  식신: 'Eating God',
  상관: 'Hurting Officer',
  편재: 'Indirect Wealth',
  정재: 'Direct Wealth',
  편관: '7 Killings',
  정관: 'Direct Officer',
  편인: 'Indirect Resource',
  정인: 'Direct Resource',
  일간: 'Day Master',
};
export const GROUP_EN: Record<TenGodGroup, string> = {
  비겁: 'Companion',
  식상: 'Output',
  재성: 'Wealth',
  관성: 'Officer',
  인성: 'Resource',
};
export const GROWTH_EN: Record<string, string> = {
  장생: 'Birth',
  목욕: 'Bath',
  관대: 'Coming of Age',
  건록: 'Prosperity',
  임관: 'Prosperity',
  제왕: 'Peak',
  쇠: 'Decline',
  병: 'Sickness',
  사: 'Death',
  묘: 'Tomb',
  절: 'Severance',
  태: 'Conception',
  양: 'Nurture',
};
export const STRENGTH_EN: Record<StrengthLabel, string> = {
  극강: 'Very strong',
  신강: 'Strong',
  중화: 'Balanced',
  신약: 'Weak',
  극약: 'Very weak',
};
const GEUK_EN: Record<string, string> = {
  건록격: 'Prosperity structure',
  양인격: 'Yang Blade structure',
  식신격: 'Eating God structure',
  상관격: 'Hurting Officer structure',
  편재격: 'Indirect Wealth structure',
  정재격: 'Direct Wealth structure',
  칠살격: 'Seven Killings structure',
  정관격: 'Direct Officer structure',
  편인격: 'Indirect Resource structure',
  정인격: 'Direct Resource structure',
};
export const geukEn = (label: string | null) => {
  if (!label) return '-';
  const [name] = label.split(' ');
  return `${GEUK_EN[name] ?? name}${label.includes('전왕격') ? ' (possible Dominant structure)' : ''}`;
};
export const PILLAR_EN: Record<PillarKey, string> = { hour: 'Hour', day: 'Day', month: 'Month', year: 'Year' };
/** The 24 solar terms (Korean name → English) */
export const SOLAR_TERM_EN: Record<string, string> = {
  입춘: 'Start of Spring', 우수: 'Rain Water', 경칩: 'Insects Awaken', 춘분: 'Spring Equinox', 청명: 'Clear and Bright', 곡우: 'Grain Rain',
  입하: 'Start of Summer', 소만: 'Grain Buds', 망종: 'Grain in Ear', 하지: 'Summer Solstice', 소서: 'Minor Heat', 대서: 'Major Heat',
  입추: 'Start of Autumn', 처서: 'End of Heat', 백로: 'White Dew', 추분: 'Autumn Equinox', 한로: 'Cold Dew', 상강: 'Frost Descent',
  입동: 'Start of Winter', 소설: 'Minor Snow', 대설: 'Major Snow', 동지: 'Winter Solstice', 소한: 'Minor Cold', 대한: 'Major Cold',
};

export const combinationEn = (c: Combination) => {
  const [a, b] = c.positions;
  const pair = `${PILLAR_EN[a]}–${PILLAR_EN[b]}`;
  if (c.kind === '천간합') return `${pair} stem combination ${c.chars} → ${ELEMENT_EN[c.element!]}`;
  if (c.kind === '지지육합') return `${pair} branch combination ${c.chars} → ${ELEMENT_EN[c.element!]}`;
  return `${pair} branch clash ${c.chars}`;
};
void PILLAR_TITLES;

// ---------------------------------------------------------------- Zi Wei Dou Shu
/** Classical names, shown next to the English name in the palace detail (e.g. Mind = 福德 Fortune & Virtue) */
export const PALACE_HANJA: Record<PalaceName, string> = {
  명궁: '命宮', 형제궁: '兄弟宮', 부처궁: '夫妻宮', 자녀궁: '子女宮', 재백궁: '財帛宮', 질액궁: '疾厄宮',
  천이궁: '遷移宮', 노복궁: '奴僕宮', 관록궁: '官祿宮', 전택궁: '田宅宮', 복덕궁: '福德宮', 부모궁: '父母宮',
};
export const PALACE_EN: Record<PalaceName, string> = {
  명궁: 'Life',
  형제궁: 'Siblings',
  부처궁: 'Spouse',
  자녀궁: 'Children',
  재백궁: 'Wealth',
  질액궁: 'Health',
  천이궁: 'Travel',
  노복궁: 'Friends',
  관록궁: 'Career',
  전택궁: 'Property',
  복덕궁: 'Mind',
  부모궁: 'Parents',
};
/** Plain area names used in the reading body */
export const PALACE_FIELD_EN: Record<PalaceName, string> = {
  명궁: 'your sense of self',
  형제궁: 'siblings & peers',
  부처궁: 'partner & love',
  자녀궁: 'children & juniors',
  재백궁: 'money',
  질액궁: 'health',
  천이궁: 'going out & travel',
  노복궁: 'friends & network',
  관록궁: 'work & career',
  전택궁: 'home & property',
  복덕궁: 'inner life & hobbies',
  부모궁: 'parents & elders',
};
export const STAR_EN: Record<string, string> = {
  자미: 'Zi Wei', 천기: 'Tian Ji', 태양: 'Tai Yang', 무곡: 'Wu Qu', 천동: 'Tian Tong', 염정: 'Lian Zhen', 천부: 'Tian Fu',
  태음: 'Tai Yin', 탐랑: 'Tan Lang', 거문: 'Ju Men', 천상: 'Tian Xiang', 천량: 'Tian Liang', 칠살: 'Qi Sha', 파군: 'Po Jun',
  좌보: 'Zuo Fu', 우필: 'You Bi', 문창: 'Wen Chang', 문곡: 'Wen Qu', 천괴: 'Tian Kui', 천월: 'Tian Yue', 녹존: 'Lu Cun', 천마: 'Tian Ma',
  경양: 'Qing Yang', 타라: 'Tuo Luo', 화성: 'Huo Xing', 영성: 'Ling Xing', 지공: 'Di Kong', 지겁: 'Di Jie',
  천형: 'Tian Xing', 천요: 'Tian Yao', 음살: 'Yin Sha', 천무: 'Tian Wu', 천공: 'Tian Kong', 순공: 'Xun Kong', 절공: 'Jie Kong',
  삼태: 'San Tai', 팔좌: 'Ba Zuo', 은광: 'En Guang', 천귀: 'Tian Gui', 태보: 'Tai Fu', 봉고: 'Feng Gao', 홍란: 'Hong Luan',
  천희: 'Tian Xi', 화개: 'Hua Gai', 함지: 'Xian Chi', 고진: 'Gu Chen', 과숙: 'Gua Su', 천재: 'Tian Cai', 천수: 'Tian Shou',
  천주: 'Tian Chu', 파쇄: 'Po Sui', 비렴: 'Fei Lian', 용지: 'Long Chi', 봉각: 'Feng Ge', 천곡: 'Tian Ku', 천허: 'Tian Xu',
  천관: 'Tian Guan', 천복: 'Tian Fu', 천덕: 'Tian De', 월덕: 'Yue De', 해신: 'Jie Shen', 천사: 'Tian Shi',
};
/** 天傷 shares the Korean name 천상 with the main star 天相 */
export const starEn = (s: { name: string; key?: string }) => (s.key === 'tianshang' ? 'Tian Shang' : (STAR_EN[s.name] ?? s.name));
export const KIND_EN = { main: 'Main star', aux: 'Helper star', sal: 'Friction star', minor: 'Minor star' } as const;
export const BRIGHTNESS_EN: Record<string, string> = { 묘: 'Temple', 왕: 'Prosperous', 득: 'Gained', 리: 'Beneficial', 평: 'Neutral', 불: 'Weak', 함: 'Fallen' };
export const BRIGHTNESS_HANJA: Record<string, string> = { 묘: '廟', 왕: '旺', 득: '得', 리: '利', 평: '平', 불: '不', 함: '陷' };
export const SIHWA_EN: Record<Sihwa, string> = { 록: 'Lu', 권: 'Quan', 과: 'Ke', 기: 'Ji' };
export const SIHWA_HANJA: Record<Sihwa, string> = { 록: '祿', 권: '權', 과: '科', 기: '忌' };
export const SIHWA_MEANING_EN: Record<Sihwa, string> = { 록: 'Prosperity', 권: 'Power', 과: 'Fame', 기: 'Obstacle' };
/** "수2국" → "Water 2 Bureau" (the five-element bureau, 五行局) */
export const gukEn = (name: string) => {
  const el = ['목', '화', '토', '금', '수'].indexOf(name[0]);
  return `${ELEMENT_EN[el] ?? name[0]} ${name.replace(/\D/g, '')} Bureau`;
};

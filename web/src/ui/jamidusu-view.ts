// 자미두수 명반 화면 (기획서 2.4, 3.4)
import { ZODIAC_KO } from '../engine/constants';
import { type JamidusuChart, type OverlayChart, type PalaceName, type PlacedStar, SPIRIT_HANJA, SPIRIT_NAMES, spokenSummary } from '../engine/jamidusu';
import { EN, tr } from '../i18n';
import { BRANCH_EN, BRIGHTNESS_EN, BRIGHTNESS_HANJA, KIND_EN, PALACE_EN, PALACE_HANJA, SIHWA_EN, SIHWA_HANJA, SIHWA_MEANING_EN, ZODIAC_EN, gukEn, starEn } from '../engine/en-labels';

/** 영어 화면의 명반 칸은 한자로 보여 줍니다(영어 이름은 칸에 들어가지 않아서). */
const starLabel = (s: PlacedStar) => (EN ? s.hanja : s.name);
const brightLabel = (b: string) => (EN ? (BRIGHTNESS_HANJA[b] ?? b) : b);
const spirit = (kind: keyof typeof SPIRIT_NAMES, name: string) => (EN ? (SPIRIT_HANJA[kind][SPIRIT_NAMES[kind].indexOf(name)] ?? name) : name);
const palaceLabel = (n: PalaceName) => (EN ? PALACE_EN[n] : n.replace('궁', ''));
const overlayBadge = (o: { sihwa: keyof typeof SIHWA_HANJA; label: string }, overlay: OverlayChart) => (EN ? `${overlay.kind === 'daehan' ? '大' : '年'}${SIHWA_HANJA[o.sihwa]}` : o.label);
export const overlayTitle = (o: OverlayChart) => (EN ? (o.kind === 'daehan' ? `Decade chart, ages ${o.range!.start}–${o.range!.end}` : `Yearly chart, ${o.year}`) : o.label);
import { esc } from './dom';

/** 지지 → [행, 열] (사오미신 / 진··유 / 묘··술 / 인축자해) */
const POS: Record<number, [number, number]> = {
  5: [0, 0], 6: [0, 1], 7: [0, 2], 8: [0, 3],
  4: [1, 0], 9: [1, 3],
  3: [2, 0], 10: [2, 3],
  2: [3, 0], 1: [3, 1], 0: [3, 2], 11: [3, 3],
};

const GOOD_AUX = new Set(['좌보', '우필', '문창', '문곡', '천괴', '천월', '녹존', '천마']);
const KIND_LABEL = { main: '주성', aux: '보좌성', sal: '살성', minor: '잡성' } as const;

export type ChartMode = 'natal' | 'daehan' | 'yunyeon';

function badges(star: PlacedStar, overlay?: OverlayChart) {
  let out = star.sihwa ? `<span class="badge ${star.sihwa}" title="${EN ? `Hua ${SIHWA_EN[star.sihwa]}` : `화${star.sihwa}`}">${EN ? SIHWA_HANJA[star.sihwa] : star.sihwa}</span>` : '';
  const o = overlay?.sihwa.find((s) => s.star === star.name && star.kind !== 'minor');
  if (o && overlay) out += `<span class="badge ${o.sihwa}" title="${overlayBadge(o, overlay)}">${overlayBadge(o, overlay)}</span>`;
  return out;
}

function namesOf(chart: JamidusuChart, overlay?: OverlayChart): PalaceName[] {
  return overlay ? overlay.names : chart.palaces.map((p) => p.name);
}

function palaceCell(chart: JamidusuChart, b: number, overlay: OverlayChart | undefined, selected: number) {
  const p = chart.palaces[b];
  const names = namesOf(chart, overlay);
  const [r, c] = POS[b];
  const mains = p.stars.filter((s) => s.kind === 'main');
  const aux = p.stars.filter((s) => s.kind === 'aux' || s.kind === 'sal');
  const minor = p.stars.filter((s) => s.kind === 'minor');
  const isMing = overlay ? overlay.mingBranch === b : p.isMing;
  const label = palaceLabel(names[b]);
  return `<button type="button" class="palace${isMing ? ' ming' : ''}${selected === b ? ' selected' : ''}" data-palace="${b}"
      style="grid-row:${r + 1};grid-column:${c + 1}" aria-label="${esc(EN ? spokenEn(chart, b, names) : spokenSummary(chart, b, names))}">
    <div class="left">
      <span class="pname">${label}</span>
      <span class="mains">${mains
        .map((s) => `<span class="star-v"><span class="nm">${starLabel(s)}</span><span class="br">${brightLabel(s.brightness)}</span>${badges(s, overlay)}</span>`)
        .join('')}</span>
    </div>
    <div class="right">
      ${aux.map((s) => `<span class="aux ${GOOD_AUX.has(s.name) ? 'good' : 'sal'}">${starLabel(s)}${s.brightness ? `<span class="muted" style="font-weight:400">${brightLabel(s.brightness)}</span>` : ''}${badges(s, overlay)}</span>`).join('')}
      ${minor.map((s) => `<span class="minor">${starLabel(s)}</span>`).join('')}
    </div>
    <div class="bottom">
      <span><span class="gz">${p.ganzhi}</span>${p.isShen ? ` <span class="shen-tag" title="${tr('신궁', 'Body palace')}">身</span>` : ''}<br>${p.daehan.start}-${p.daehan.end}</span>
      <span class="shin">${spirit('changsheng', p.changsheng)} ${spirit('boshi', p.boshi)}<br>${spirit('suiqian', p.suiqian)} ${spirit('jiangqian', p.jiangqian)}</span>
    </div>
  </button>`;
}

function linesSvg(chart: JamidusuChart, overlay?: OverlayChart) {
  const names = namesOf(chart, overlay);
  const ming = overlay ? overlay.mingBranch : chart.mingBranch;
  const center = (b: number) => {
    const [r, c] = POS[b];
    return [(c + 0.5) * 100, (r + 0.5) * 108];
  };
  const [mx, my] = center(ming);
  const to = (name: PalaceName, cls: string) => {
    const [x, y] = center(names.indexOf(name));
    return `<line class="${cls}" x1="${mx}" y1="${my}" x2="${x}" y2="${y}"/>`;
  };
  return `<svg class="board-lines" viewBox="0 0 400 432" preserveAspectRatio="none" aria-hidden="true">
    ${to('재백궁', 'gold')}${to('관록궁', 'gold')}${to('천이궁', 'blue')}
  </svg>`;
}

export interface BoardOptions {
  name: string;
  solarText: string;
  lunarText: string;
  overlay?: OverlayChart;
  selected: number;
}

export function boardView(chart: JamidusuChart, o: BoardOptions) {
  const cells = Object.keys(POS).map((b) => palaceCell(chart, Number(b), o.overlay, o.selected)).join('');
  const shenName = chart.palaces[chart.shenBranch].name;
  const mingP = chart.palaces[chart.mingBranch];
  return `<div class="board-wrap">
    ${linesSvg(chart, o.overlay)}
    <div class="board" role="group" aria-label="${tr('자미두수 명반', 'Zi Wei Dou Shu chart')}">
      ${cells}
      <div class="board-center">
        <div class="center-text">
          <div class="title">${esc(o.name)}</div>
          <div>${esc(o.solarText)}</div>
          <div>${esc(o.lunarText)}</div>
          ${EN
            ? `<div><span class="gz">${chart.yearGanzhi}</span> · Year of the ${ZODIAC_EN[chart.yearBranch]} · ${chart.gender === 'M' ? 'Male' : 'Female'}</div>
          <div><b>${gukEn(chart.guk.name)}</b> · decades run ${chart.forward ? 'forward' : 'backward'}</div>
          <div>Life palace <span class="gz">${mingP.ganzhi}</span> · Body in ${PALACE_EN[shenName]}</div>`
            : `<div><span class="gz">${chart.yearGanzhi}</span>년 ${ZODIAC_KO[chart.yearBranch]}띠 · ${chart.gender === 'M' ? '남' : '여'}</div>
          <div><b>${chart.guk.name}</b> · 대한 ${chart.forward ? '순행' : '역행'}</div>
          <div>명궁 <span class="gz">${mingP.ganzhi}</span> · 신궁 ${shenName.replace('궁', '')}궁</div>`}
          <div style="margin-top:2px;color:var(--primary);font-weight:800">${o.overlay ? esc(overlayTitle(o.overlay)) : tr('선천 명반', 'Natal chart')}</div>
        </div>
      </div>
    </div>
  </div>
  <div style="display:flex;gap:8px;align-items:flex-start;margin-top:6px"><p class="small muted" style="flex:1">${tr('금색 선: 명궁 → 재백궁·관록궁, 청색 선: 명궁 → 천이궁. 궁을 누르면 자세히 볼 수 있어요.', 'Gold lines: Life → Wealth and Career. Blue line: Life → Travel. Tap a palace for star names and details.')}</p><span style="display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end"><button type="button" class="icon-btn" data-zoom>${tr('크게 보기', 'Enlarge')}</button><button type="button" class="icon-btn" data-save-image="board">${tr('이미지로 저장', 'Save as image')}</button></span></div>`;
}

export function palaceDetail(chart: JamidusuChart, b: number, overlay?: OverlayChart) {
  const p = chart.palaces[b];
  const names = namesOf(chart, overlay);
  const sihwaText = (s: PlacedStar) => {
    const parts: string[] = [];
    if (s.sihwa) parts.push(EN ? `Hua ${SIHWA_EN[s.sihwa]} (${SIHWA_MEANING_EN[s.sihwa]})` : `화${s.sihwa}`);
    const o = overlay?.sihwa.find((x) => x.star === s.name && s.kind !== 'minor');
    if (o && overlay) parts.push(EN ? `${overlay.kind === 'daehan' ? 'Decade' : 'Year'} Hua ${SIHWA_EN[o.sihwa]}` : o.label);
    return parts.join(' · ');
  };
  return `<div class="palace-detail">
    <h3>${EN ? `${PALACE_EN[names[b]]} palace <span class="hanja small muted">${PALACE_HANJA[names[b]]}</span>` : names[b]}${overlay ? ` <span class="small muted">(${tr('선천', 'natal')} ${EN ? PALACE_EN[p.name] : p.name})</span>` : ''} · <span class="hanja">${p.ganzhi}</span></h3>
    <p class="small muted">${tr(`대한 ${p.daehan.start}-${p.daehan.end}세`, `Decade: ages ${p.daehan.start}–${p.daehan.end} (East Asian age, 1 at birth)`)}${p.isShen ? tr(' · 신궁', ' · Body palace') : ''}</p>
    <ul>
      ${p.stars.length ? p.stars
        .map((s) => `<li><span><b class="hanja">${s.hanja}</b> ${EN ? starEn(s) : s.name} <span class="muted small">${EN ? KIND_EN[s.kind] : KIND_LABEL[s.kind]}</span></span><span>${[EN ? (BRIGHTNESS_EN[s.brightness] ?? s.brightness) : s.brightness, sihwaText(s)].filter(Boolean).join(' · ')}</span></li>`)
        .join('') : `<li>${tr('별이 없어요.', 'No stars here.')}</li>`}
    </ul>
    ${p.stars.some((s) => s.kind === 'main') ? '' : `<p class="small muted" style="margin-top:8px">${tr(`주성이 없는 자리라 맞은편 ${chart.palaces[(b + 6) % 12].name}의 주성을 빌려 은은하게 봐요.`, `No main star here, so this palace is read, more softly, through the main stars of the opposite ${PALACE_EN[chart.palaces[(b + 6) % 12].name]} palace.`)}</p>`}
    <p class="small" style="margin-top:10px">${EN ? `Life cycle ${spirit('changsheng', p.changsheng)} · Doctor ${spirit('boshi', p.boshi)} · Year spirit ${spirit('suiqian', p.suiqian)} · General ${spirit('jiangqian', p.jiangqian)}` : `장생 ${p.changsheng} · 박사 ${p.boshi} · 태세 ${p.suiqian} · 장성 ${p.jiangqian}`}</p>
  </div>`;
}

/** 화면 낭독기용 영어 요약 */
function spokenEn(chart: JamidusuChart, branch: number, names: PalaceName[]) {
  const p = chart.palaces[branch];
  const main = p.stars.filter((s) => s.kind === 'main').map((s) => `${starEn(s)}${s.brightness ? ` ${BRIGHTNESS_EN[s.brightness] ?? ''}` : ''}`);
  return [`${PALACE_EN[names[branch]]} palace, ${BRANCH_EN[branch]}`, `decade ages ${p.daehan.start} to ${p.daehan.end}`, ...(main.length ? main : ['no main star'])].join(', ') + ', double tap for details';
}

// 자미두수 명반 화면 (기획서 2.4, 3.4)
import { ZODIAC_KO } from '../engine/constants';
import { type JamidusuChart, type OverlayChart, type PalaceName, type PlacedStar, spokenSummary } from '../engine/jamidusu';
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
  let out = star.sihwa ? `<span class="badge ${star.sihwa}" title="화${star.sihwa}">${star.sihwa}</span>` : '';
  const o = overlay?.sihwa.find((s) => s.star === star.name && star.kind !== 'minor');
  if (o) out += `<span class="badge ${o.sihwa}" title="${o.label}">${o.label}</span>`;
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
  const label = names[b].replace('궁', '');
  return `<button type="button" class="palace${isMing ? ' ming' : ''}${selected === b ? ' selected' : ''}" data-palace="${b}"
      style="grid-row:${r + 1};grid-column:${c + 1}" aria-label="${esc(spokenSummary(chart, b, names))}">
    <div class="left">
      <span class="pname">${label}</span>
      <span class="mains">${mains
        .map((s) => `<span class="star-v"><span class="nm">${s.name}</span><span class="br">${s.brightness}</span>${badges(s, overlay)}</span>`)
        .join('')}</span>
    </div>
    <div class="right">
      ${aux.map((s) => `<span class="aux ${GOOD_AUX.has(s.name) ? 'good' : 'sal'}">${s.name}${s.brightness ? `<span class="muted" style="font-weight:400">${s.brightness}</span>` : ''}${badges(s, overlay)}</span>`).join('')}
      ${minor.map((s) => `<span class="minor">${s.name}</span>`).join('')}
    </div>
    <div class="bottom">
      <span><span class="gz">${p.ganzhi}</span>${p.isShen ? ' <span class="shen-tag" title="신궁">身</span>' : ''}<br>${p.daehan.start}-${p.daehan.end}</span>
      <span class="shin">${p.changsheng} ${p.boshi}<br>${p.suiqian} ${p.jiangqian}</span>
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
    <div class="board" role="group" aria-label="자미두수 명반">
      ${cells}
      <div class="board-center">
        <div class="center-text">
          <div class="title">${esc(o.name)}</div>
          <div>${esc(o.solarText)}</div>
          <div>${esc(o.lunarText)}</div>
          <div><span class="gz">${chart.yearGanzhi}</span>년 ${ZODIAC_KO[chart.yearBranch]}띠 · ${chart.gender === 'M' ? '남' : '여'}</div>
          <div><b>${chart.guk.name}</b> · 대한 ${chart.forward ? '순행' : '역행'}</div>
          <div>명궁 <span class="gz">${mingP.ganzhi}</span> · 신궁 ${shenName.replace('궁', '')}궁</div>
          <div style="margin-top:2px;color:var(--primary);font-weight:800">${o.overlay ? esc(o.overlay.label) : '선천 명반'}</div>
        </div>
      </div>
    </div>
  </div>
  <div style="display:flex;gap:8px;align-items:flex-start;margin-top:6px"><p class="small muted" style="flex:1">금색 선: 명궁 → 재백궁·관록궁, 청색 선: 명궁 → 천이궁. 궁을 누르면 자세히 볼 수 있어요.</p><span style="display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end"><button type="button" class="icon-btn" data-zoom>크게 보기</button><button type="button" class="icon-btn" data-save-image="board">이미지로 저장</button></span></div>`;
}

export function palaceDetail(chart: JamidusuChart, b: number, overlay?: OverlayChart) {
  const p = chart.palaces[b];
  const names = namesOf(chart, overlay);
  const sihwaText = (s: PlacedStar) => {
    const parts: string[] = [];
    if (s.sihwa) parts.push(`화${s.sihwa}`);
    const o = overlay?.sihwa.find((x) => x.star === s.name && s.kind !== 'minor');
    if (o) parts.push(o.label);
    return parts.join(' · ');
  };
  return `<div class="palace-detail">
    <h3>${names[b]}${overlay ? ` <span class="small muted">(선천 ${p.name})</span>` : ''} · <span class="hanja">${p.ganzhi}</span></h3>
    <p class="small muted">대한 ${p.daehan.start}-${p.daehan.end}세${p.isShen ? ' · 신궁' : ''}</p>
    <ul>
      ${p.stars.length ? p.stars
        .map((s) => `<li><span><b class="hanja">${s.hanja}</b> ${s.name} <span class="muted small">${KIND_LABEL[s.kind]}</span></span><span>${[s.brightness, sihwaText(s)].filter(Boolean).join(' · ')}</span></li>`)
        .join('') : '<li>별이 없어요. 맞은편 궁의 주성을 빌려 봐요.</li>'}
    </ul>
    <p class="small" style="margin-top:10px">장생 ${p.changsheng} · 박사 ${p.boshi} · 태세 ${p.suiqian} · 장성 ${p.jiangqian}</p>
  </div>`;
}

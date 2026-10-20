// 결과 화면 (기획서 2.1 ~ 2.5)
import { cityById } from '../engine/cities';
import type { NormalizedBirth } from '../engine/birth';
import { daehanChart, yunyeonChart, type JamidusuChart, type OverlayChart } from '../engine/jamidusu';
import { combinedTongbyeon, jamidusuTongbyeon } from '../engine/tongbyeon';
import { sajuReading } from '../engine/reading';
import { readingView } from './reading-view';
import { CALCULATION_BASIS } from '../engine/saju';
import { archive, type Snapshot } from '../archive';
import { activateAds, adSlot } from '../ads';
import { $, esc, pad2, toast } from './dom';
import { flowView, monthIndexOf, ratioCard, summaryCard, tongbyeonView, wongukCard } from './saju-view';
import { boardView, palaceDetail, type ChartMode } from './jamidusu-view';
import { PLAY_STORE_URL } from './brand';
import { saveAsImage } from './share-image';
import { renderTerms } from '../engine/terms';
import { getTermMode, termToggleButton, toggleTermMode } from './term-mode';

export interface ResultState {
  snapshot: Snapshot;
  archiveId: string | null;
  mainTab: 'saju' | 'jamidusu' | 'combined';
  sajuTab: 'wonguk' | 'flow' | 'tong';
  ratioMode: 'base' | 'transform';
  selectedBig: number;
  selectedYear: number;
  selectedMonth: number;
  sajuTong: string;
  jamiMode: ChartMode;
  daehanAge: number;
  yunyeonYear: number;
  selectedPalace: number;
  jamiTong: string;
}

export function initialResultState(snapshot: Snapshot, archiveId: string | null = null, now = new Date()): ResultState {
  const koreanAge = now.getFullYear() - (snapshot.chart?.lunar.year ?? snapshot.birth.solar.year) + 1;
  const bigIndex = Math.max(0, snapshot.saju.currentBigFortuneIndex);
  const years = snapshot.saju.daewunYearFortunes[bigIndex] ?? [];
  const startYear = years.some((y) => y.year === now.getFullYear()) ? now.getFullYear() : (years[0]?.year ?? now.getFullYear());
  return {
    snapshot,
    archiveId,
    mainTab: 'saju',
    sajuTab: 'wonguk',
    ratioMode: 'base',
    selectedBig: bigIndex,
    selectedYear: startYear,
    selectedMonth: monthIndexOf(now),
    sajuTong: 'general',
    jamiMode: 'natal',
    daehanAge: Math.max(koreanAge, snapshot.chart?.guk.number ?? 2),
    yunyeonYear: now.getFullYear(),
    selectedPalace: snapshot.chart?.mingBranch ?? -1,
    jamiTong: 'general',
  };
}

const fmtSolar = (b: NormalizedBirth) => {
  const d = `${b.solar.year}.${pad2(b.solar.month)}.${pad2(b.solar.day)}`;
  return b.timeUnknown || !b.clock ? `${d} 시간 모름` : `${d} ${pad2(b.clock.hour)}:${pad2(b.clock.minute)}`;
};
const fmtLunar = (b: NormalizedBirth) => `음력 ${b.lunar.year}.${b.lunar.leap ? '윤' : ''}${pad2(b.lunar.month)}.${pad2(b.lunar.day)}`;
const displayName = (b: NormalizedBirth) => b.input.name?.trim() || '이름 없음';

function profileCard(st: ResultState) {
  const { birth, saju } = st.snapshot;
  const day = saju.pillars.find((p) => p.key === 'day')!;
  const city = cityById(birth.input.cityId ?? 'seoul');
  const corr = birth.corrected
    ? `보정 ${pad2(birth.corrected.hour)}:${pad2(birth.corrected.minute)} (자오선 ${birth.corrections.meridian}분${birth.corrections.dst ? `, 서머타임 ${birth.corrections.dst}분` : ''}${birth.corrections.longitude ? `, 경도 ${birth.corrections.longitude}분` : ''})`
    : '';
  const stale = st.archiveId && saju.basis !== CALCULATION_BASIS;
  return `<div class="card">
    <div class="profile">
      <div class="ilju hanja" aria-label="일주">${day.stem.hanja}<br>${day.branch.hanja}</div>
      <div style="min-width:0">
        <div class="name">${esc(displayName(birth))} <span class="small muted">${birth.input.gender === 'M' ? '남' : '여'}</span></div>
        <div class="meta">양력 ${fmtSolar(birth)} · ${fmtLunar(birth)}</div>
        <div class="meta">${city.name}${birth.input.useLongitude ? ' · 경도 보정' : ''}${corr ? ` · ${corr}` : ''}</div>
      </div>
      <div class="result-actions" data-no-export>
        <button type="button" class="icon-btn" data-action="edit" aria-label="편집">편집</button>
        <a class="icon-btn" href="#/archive" aria-label="보관함" style="text-decoration:none;color:inherit">보관함</a>
        <button type="button" class="icon-btn" data-action="save" aria-label="저장">${st.archiveId ? '저장됨' : '저장'}</button>
      </div>
    </div>
    ${st.archiveId ? `<div class="notice" style="margin-top:12px;display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        <span style="flex:1">보관함에 저장된 결과예요 (계산 기준 ${esc(saju.basis)}).${stale ? ' 지금 기준과 달라요.' : ''}</span>
        <button type="button" class="btn small" data-action="recalc">현재 기준으로 새로 계산</button></div>` : ''}
  </div>`;
}

function overlayOf(st: ResultState, chart: JamidusuChart): OverlayChart | undefined {
  if (st.jamiMode === 'daehan') return daehanChart(chart, st.daehanAge);
  if (st.jamiMode === 'yunyeon') return yunyeonChart(chart, st.yunyeonYear);
  return undefined;
}

const tabButtons = (group: string, items: [string, string][], current: string) =>
  items.map(([k, l]) => `<button type="button" role="tab" data-value="${k}" aria-selected="${current === k}">${l}</button>`).join('');

function jamiPicker(st: ResultState, chart: JamidusuChart, overlay?: OverlayChart) {
  if (st.jamiMode === 'daehan') {
    const ranges = [...chart.palaces].sort((a, c) => a.daehan.start - c.daehan.start);
    return `<div class="age-chips" style="margin-top:10px" aria-label="대한 선택">${ranges
      .map((p) => `<button type="button" data-daehan="${p.daehan.start}" aria-pressed="${overlay?.range?.start === p.daehan.start}">${p.daehan.start}-${p.daehan.end}</button>`)
      .join('')}</div>`;
  }
  if (st.jamiMode === 'yunyeon') {
    return `<div class="year-step" style="margin-top:10px">
      <button type="button" class="icon-btn" data-year-step="-1" aria-label="이전 해">&lt;</button>
      <input type="number" id="yunyeon-year" data-year-input min="1900" max="2100" value="${st.yunyeonYear}" aria-label="유년 연도">
      <button type="button" class="icon-btn" data-year-step="1" aria-label="다음 해">&gt;</button>
    </div>`;
  }
  return '';
}

function jamiBoard(st: ResultState, chart: JamidusuChart, wide: boolean, overlay?: OverlayChart) {
  const b = st.snapshot.birth;
  const board = boardView(chart, { name: displayName(b), solarText: `양력 ${fmtSolar(b)}`, lunarText: fmtLunar(b), overlay, selected: st.selectedPalace });
  const detail = st.selectedPalace >= 0 && wide ? `<aside class="card">${palaceDetail(chart, st.selectedPalace, overlay)}</aside>` : '';
  return `<div class="board-split" style="margin-top:12px"><div class="card" style="padding:10px">${board}</div>${detail}</div>`;
}

function combinedHtml(st: ResultState) {
  const { saju, chart } = st.snapshot;
  if (!chart || saju.incompleteBirthTime) return `<div class="card"><p class="notice">출생시간을 입력하면 사주와 자미두수를 함께 본 종합 통변을 볼 수 있어요.</p></div>`;
  const sections = combinedTongbyeon(saju, chart);
  return `<div class="card tongbyeon">
    <div class="tong-head" style="justify-content:flex-end">${termToggleButton()}</div>
    ${sections.map((x) => `<h2 style="margin-top:6px">${x.title}</h2>${x.paragraphs.map((p) => `<p>${esc(renderTerms(p, getTermMode()))}</p>`).join('')}`).join('<div style="height:14px"></div>')}
    <p class="disclaimer">타고난 성향을 풀이한 참고용 내용이며, 특정 사건을 예측하거나 보장하지 않아요.</p>
  </div>`;
}

function appBanner() {
  return `<div class="card app-banner" style="margin-top:14px">
    <div class="text"><b>인설명리 앱</b>으로 보관함과 달력을 휴대폰에서 바로 쓰세요.</div>
    <a class="btn small" href="${PLAY_STORE_URL}" target="_blank" rel="noopener">Google Play</a>
  </div>`;
}

export interface ResultCallbacks {
  onEdit: () => void;
  onRecalc: (st: ResultState) => void;
}

/**
 * 결과 화면은 처음에 한 번 틀을 그리고, 이후에는 바뀐 부분(region)만 다시 그립니다.
 * 탭은 숨김/보임만 바꾸므로 광고 자리는 다시 만들어지지 않아 광고를 다시 요청하지 않습니다.
 */
export function renderResult(root: HTMLElement, st: ResultState, cb: ResultCallbacks) {
  const wide = window.matchMedia('(min-width: 1100px)').matches;
  const s = st.snapshot.saju;
  const chart = st.snapshot.chart;

  root.innerHTML = `
    <div data-region="profile"></div>
    <div class="segmented primary" role="tablist" data-tabs="main" style="margin-top:14px">
      ${tabButtons('main', [['saju', '사주팔자'], ['jamidusu', '자미두수 명반'], ['combined', '종합 통변']], st.mainTab)}
    </div>
    <section data-panel="saju" style="margin-top:14px">
      <div class="segmented" role="tablist" data-tabs="saju">${tabButtons('saju', [['wonguk', '원국'], ['flow', '운 흐름'], ['tong', '풀이']], st.sajuTab)}</div>
      <div data-sub="wonguk" class="stack" style="margin-top:14px">
        <div data-region="wonguk"></div>
        ${adSlot('resultTop')}
        <div data-region="summary"></div>
        <div data-region="ratio"></div>
      </div>
      <div data-sub="flow" class="stack" style="margin-top:14px"><div data-region="flow" class="stack"></div>${adSlot('sajuFlow')}</div>
      <div data-sub="tong" style="margin-top:14px"><div data-region="sajuTong"></div>${adSlot('sajuTong')}</div>
    </section>
    <section data-panel="jamidusu" style="margin-top:14px">
      ${chart
        ? `<div class="segmented" role="tablist" data-tabs="jami">${tabButtons('jami', [['natal', '선천 명반'], ['daehan', '대한 명반'], ['yunyeon', '유년 명반']], st.jamiMode)}</div>
           <div data-region="picker"></div>
           <div data-region="board"></div>
           <div data-region="jamiTong" style="margin-top:14px"></div>
           ${adSlot('jamiBottom')}`
        : `<div class="card"><p class="notice">출생시간을 입력해야 명반을 완성 시킬 수 있습니다.</p></div>`}
    </section>
    <section data-panel="combined" style="margin-top:14px">
      <div data-region="combined"></div>
      ${chart && !s.incompleteBirthTime ? adSlot('combinedBottom') : ''}
    </section>
    ${appBanner()}`;

  const region = (name: string) => root.querySelector<HTMLElement>(`[data-region="${name}"]`);
  const paint = {
    profile: () => (region('profile')!.innerHTML = profileCard(st)),
    wonguk: () => (region('wonguk')!.innerHTML = wongukCard(s)),
    summary: () => (region('summary')!.innerHTML = s.incompleteBirthTime ? '' : summaryCard(s)),
    ratio: () => (region('ratio')!.innerHTML = s.incompleteBirthTime ? '' : ratioCard(s, st.ratioMode)),
    flow: () => (region('flow')!.innerHTML = flowView(s, st.selectedBig, st.selectedYear, st.selectedMonth)),
    sajuTong: () => (region('sajuTong')!.innerHTML = readingView(sajuReading(s, st.snapshot.birth.input.gender), st.sajuTong, 'data-saju-tong')),
    jami: () => {
      if (!chart) return;
      const overlay = overlayOf(st, chart);
      region('picker')!.innerHTML = jamiPicker(st, chart, overlay);
      region('board')!.innerHTML = jamiBoard(st, chart, wide, overlay);
      region('jamiTong')!.innerHTML = tongbyeonView(jamidusuTongbyeon(chart, overlay), st.jamiTong, 'data-jami-tong');
    },
    combined: () => (region('combined')!.innerHTML = combinedHtml(st)),
    board: () => {
      if (chart) region('board')!.innerHTML = jamiBoard(st, chart, wide, overlayOf(st, chart));
    },
  };

  /** 대운을 바꾸면 세운 선택도 그 대운 안의 해로 맞춥니다(올해가 있으면 올해, 없으면 첫해). */
  const selectBig = (i: number) => {
    st.selectedBig = i;
    const years = s.daewunYearFortunes[i] ?? [];
    if (!years.some((y) => y.year === st.selectedYear)) {
      const thisYear = new Date().getFullYear();
      st.selectedYear = years.some((y) => y.year === thisYear) ? thisYear : (years[0]?.year ?? thisYear);
    }
  };

  const syncTabs = () => {
    root.querySelectorAll<HTMLElement>('[data-panel]').forEach((p) => (p.hidden = p.dataset.panel !== st.mainTab));
    root.querySelectorAll<HTMLElement>('[data-sub]').forEach((p) => (p.hidden = p.dataset.sub !== st.sajuTab));
    const sel = (group: string, v: string) =>
      root.querySelectorAll<HTMLElement>(`[data-tabs="${group}"] button`).forEach((b) => b.setAttribute('aria-selected', String(b.dataset.value === v)));
    sel('main', st.mainTab);
    sel('saju', st.sajuTab);
    sel('jami', st.jamiMode);
    activateAds(root);
  };

  Object.values(paint).forEach((f) => f());
  syncTabs();

  root.onclick = (e) => {
    const t = e.target as HTMLElement;
    const tabBtn = t.closest<HTMLButtonElement>('[data-tabs] button');
    if (tabBtn) {
      const group = tabBtn.parentElement!.dataset.tabs;
      const v = tabBtn.dataset.value!;
      if (group === 'main') st.mainTab = v as ResultState['mainTab'];
      if (group === 'saju') st.sajuTab = v as ResultState['sajuTab'];
      if (group === 'jami' && chart) {
        st.jamiMode = v as ChartMode;
        st.selectedPalace = overlayOf(st, chart)?.mingBranch ?? chart.mingBranch;
        paint.jami();
      }
      syncTabs();
      return;
    }
    if (t.closest('[data-term-toggle]')) {
      toggleTermMode();
      paint.sajuTong();
      paint.flow();
      paint.jami();
      paint.combined();
      return;
    }
    const ratio = t.closest<HTMLButtonElement>('[data-ratio-mode] button');
    if (ratio) {
      st.ratioMode = ratio.dataset.value as ResultState['ratioMode'];
      return paint.ratio();
    }
    const big = t.closest<HTMLElement>('[data-big]');
    if (big) {
      selectBig(Number(big.dataset.big));
      return paint.flow();
    }
    const yr = t.closest<HTMLElement>('[data-year]');
    if (yr) {
      st.selectedYear = Number(yr.dataset.year);
      return paint.flow();
    }
    const mo = t.closest<HTMLElement>('[data-month]');
    if (mo) {
      st.selectedMonth = Number(mo.dataset.month);
      return paint.flow();
    }
    const step = t.closest<HTMLElement>('[data-big-step]');
    if (step) {
      selectBig(Math.min(Math.max(0, st.selectedBig + Number(step.dataset.bigStep)), s.bigFortunes.length - 1));
      return paint.flow();
    }
    const stong = t.closest<HTMLElement>('[data-saju-tong]');
    if (stong) {
      st.sajuTong = stong.dataset.sajuTong!;
      return paint.sajuTong();
    }
    const jtong = t.closest<HTMLElement>('[data-jami-tong]');
    if (jtong) {
      st.jamiTong = jtong.dataset.jamiTong!;
      return paint.jami();
    }
    const dh = t.closest<HTMLElement>('[data-daehan]');
    if (dh && chart) {
      st.daehanAge = Number(dh.dataset.daehan);
      st.selectedPalace = daehanChart(chart, st.daehanAge).mingBranch;
      return paint.jami();
    }
    const ys = t.closest<HTMLElement>('[data-year-step]');
    if (ys && chart) {
      st.yunyeonYear += Number(ys.dataset.yearStep);
      st.selectedPalace = yunyeonChart(chart, st.yunyeonYear).mingBranch;
      return paint.jami();
    }
    const pal = t.closest<HTMLElement>('[data-palace]');
    if (pal && chart) {
      st.selectedPalace = Number(pal.dataset.palace);
      if (wide) return paint.board();
      openSheet(palaceDetail(chart, st.selectedPalace, overlayOf(st, chart)));
      return;
    }
    const save = t.closest<HTMLElement>('[data-save-image]');
    if (save) {
      const b = st.snapshot.birth;
      const base = `${displayName(b)}_${b.solar.year}${pad2(b.solar.month)}${pad2(b.solar.day)}`.replace(/[\\/:*?"<>|\s]+/g, '_');
      if (save.dataset.saveImage === 'wonguk') {
        void saveAsImage([region('profile')!, region('wonguk')!], { fileName: `${base}_사주원국.png`, width: 640, caption: '사주팔자 원국' });
      } else {
        void saveAsImage([root.querySelector<HTMLElement>('.board-wrap')!], { fileName: `${base}_자미두수명반.png`, width: 820, caption: '자미두수 명반' });
      }
      return;
    }
    if (t.closest('[data-zoom]')) {
      const wrap = root.querySelector('.board-wrap')!;
      const sheet = document.createElement('div');
      sheet.className = 'zoom-sheet';
      sheet.setAttribute('role', 'dialog');
      sheet.setAttribute('aria-label', '명반 크게 보기');
      sheet.innerHTML = `<div class="zoom-bar"><b>명반 크게 보기</b><button type="button" class="btn small" data-close>닫기</button></div>${wrap.outerHTML}`;
      sheet.addEventListener('click', (ev) => {
        if ((ev.target as HTMLElement).closest('[data-close]')) sheet.remove();
      });
      document.body.append(sheet);
      return;
    }
    const action = t.closest<HTMLElement>('[data-action]')?.dataset.action;
    if (action === 'edit') cb.onEdit();
    if (action === 'recalc') cb.onRecalc(st);
    if (action === 'save') {
      if (st.archiveId) return toast('이미 보관함에 있어요.');
      const saved = archive.save({
        name: displayName(st.snapshot.birth),
        input: st.snapshot.birth.input,
        basis: s.basis,
        snapshot: st.snapshot,
      });
      if (!saved) return toast('브라우저 저장 공간을 쓸 수 없어 저장하지 못했어요.');
      st.archiveId = saved.id;
      paint.profile();
      toast('보관함에 저장했어요. 이 브라우저에만 보관돼요.');
    }
  };

  root.onchange = (e) => {
    const inp = (e.target as HTMLElement).closest<HTMLInputElement>('[data-year-input]');
    if (!inp || !chart) return;
    const y = Number(inp.value);
    if (Number.isInteger(y) && y >= 1900 && y <= 2100) {
      st.yunyeonYear = y;
      st.selectedPalace = yunyeonChart(chart, y).mingBranch;
      paint.jami();
    }
  };
}

function openSheet(html: string) {
  const back = document.createElement('div');
  back.className = 'sheet-backdrop';
  back.innerHTML = `<div class="sheet" role="dialog" aria-modal="true">${html}<button type="button" class="btn ghost block" style="margin-top:14px" data-close>닫기</button></div>`;
  const close = () => back.remove();
  back.addEventListener('click', (e) => {
    if (e.target === back || (e.target as HTMLElement).closest('[data-close]')) close();
  });
  document.addEventListener('keydown', function onKey(ev) {
    if (ev.key === 'Escape') {
      close();
      document.removeEventListener('keydown', onKey);
    }
  });
  document.body.append(back);
  $('[data-close]', back).focus();
}

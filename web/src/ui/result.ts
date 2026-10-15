// 결과 화면 (기획서 2.1 ~ 2.5)
import { cityById } from '../engine/cities';
import type { NormalizedBirth } from '../engine/birth';
import { daehanChart, yunyeonChart, type JamidusuChart, type OverlayChart } from '../engine/jamidusu';
import { combinedTongbyeon, jamidusuTongbyeon, sajuTongbyeon } from '../engine/tongbyeon';
import { CALCULATION_BASIS } from '../engine/saju';
import { archive, type Snapshot } from '../archive';
import { adSlot, fillAds } from '../ads';
import { $, esc, pad2, toast } from './dom';
import { flowView, ratioCard, summaryCard, tongbyeonView, wongukCard } from './saju-view';
import { boardView, palaceDetail, type ChartMode } from './jamidusu-view';
import { PLAY_STORE_URL } from './brand';

export interface ResultState {
  snapshot: Snapshot;
  archiveId: string | null;
  mainTab: 'saju' | 'jamidusu' | 'combined';
  sajuTab: 'wonguk' | 'flow' | 'tong';
  ratioMode: 'base' | 'transform';
  selectedBig: number;
  sajuTong: string;
  jamiMode: ChartMode;
  daehanAge: number;
  yunyeonYear: number;
  selectedPalace: number;
  jamiTong: string;
}

export function initialResultState(snapshot: Snapshot, archiveId: string | null = null, now = new Date()): ResultState {
  const koreanAge = now.getFullYear() - (snapshot.chart?.lunar.year ?? snapshot.birth.solar.year) + 1;
  return {
    snapshot,
    archiveId,
    mainTab: 'saju',
    sajuTab: 'wonguk',
    ratioMode: 'base',
    selectedBig: Math.max(0, snapshot.saju.currentBigFortuneIndex),
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
      <div class="result-actions">
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

function sajuSection(st: ResultState) {
  const s = st.snapshot.saju;
  const tabs = `<div class="segmented" role="tablist" data-tabs="saju">
    ${[['wonguk', '원국'], ['flow', '운 흐름'], ['tong', '통변']].map(([k, l]) => `<button type="button" role="tab" data-value="${k}" aria-selected="${st.sajuTab === k}">${l}</button>`).join('')}
  </div>`;
  let body = '';
  if (st.sajuTab === 'wonguk') body = wongukCard(s) + adSlot('resultTop') + (s.incompleteBirthTime ? '' : summaryCard(s) + ratioCard(s, st.ratioMode));
  if (st.sajuTab === 'flow') body = flowView(s, st.selectedBig);
  if (st.sajuTab === 'tong') body = tongbyeonView(sajuTongbyeon(s, st.snapshot.birth.input.gender), st.sajuTong, 'data-saju-tong') + adSlot('resultBottom');
  return `${tabs}<div class="stack" style="margin-top:14px">${body}</div>`;
}

function overlayOf(st: ResultState, chart: JamidusuChart): OverlayChart | undefined {
  if (st.jamiMode === 'daehan') return daehanChart(chart, st.daehanAge);
  if (st.jamiMode === 'yunyeon') return yunyeonChart(chart, st.yunyeonYear);
  return undefined;
}

function jamidusuSection(st: ResultState, wide: boolean) {
  const chart = st.snapshot.chart;
  if (!chart) return `<div class="card"><p class="notice">출생시간을 입력해야 명반을 완성 시킬 수 있습니다.</p></div>`;
  const b = st.snapshot.birth;
  const overlay = overlayOf(st, chart);
  const tabs = `<div class="segmented" role="tablist" data-tabs="jami">
    ${[['natal', '선천 명반'], ['daehan', '대한 명반'], ['yunyeon', '유년 명반']].map(([k, l]) => `<button type="button" role="tab" data-value="${k}" aria-selected="${st.jamiMode === k}">${l}</button>`).join('')}
  </div>`;
  let picker = '';
  if (st.jamiMode === 'daehan') {
    const ranges = [...chart.palaces].sort((a, c) => a.daehan.start - c.daehan.start);
    picker = `<div class="age-chips" style="margin-top:10px" aria-label="대한 선택">${ranges
      .map((p) => `<button type="button" data-daehan="${p.daehan.start}" aria-pressed="${overlay?.range?.start === p.daehan.start}">${p.daehan.start}-${p.daehan.end}</button>`)
      .join('')}</div>`;
  }
  if (st.jamiMode === 'yunyeon') {
    picker = `<div class="year-step" style="margin-top:10px">
      <button type="button" class="icon-btn" data-year-step="-1" aria-label="이전 해">&lt;</button>
      <input type="number" data-year-input min="1900" max="2100" value="${st.yunyeonYear}" aria-label="유년 연도">
      <button type="button" class="icon-btn" data-year-step="1" aria-label="다음 해">&gt;</button>
    </div>`;
  }
  const board = boardView(chart, {
    name: displayName(b),
    solarText: `양력 ${fmtSolar(b)}`,
    lunarText: fmtLunar(b),
    overlay,
    selected: st.selectedPalace,
  });
  const detail = st.selectedPalace >= 0 && wide ? `<aside class="card">${palaceDetail(chart, st.selectedPalace, overlay)}</aside>` : '';
  const tong = tongbyeonView(jamidusuTongbyeon(chart, overlay), st.jamiTong, 'data-jami-tong');
  return `${tabs}${picker}
    <div class="board-split" style="margin-top:12px"><div class="card" style="padding:10px">${board}</div>${detail}</div>
    <div style="margin-top:14px">${tong}</div>`;
}

function combinedSection(st: ResultState) {
  const { saju, chart } = st.snapshot;
  if (!chart || saju.incompleteBirthTime) return `<div class="card"><p class="notice">출생시간을 입력하면 사주와 자미두수를 함께 본 종합 통변을 볼 수 있어요.</p></div>`;
  const sections = combinedTongbyeon(saju, chart);
  return `<div class="card tongbyeon">
    ${sections.map((s) => `<h2 style="margin-top:6px">${s.title}</h2>${s.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}`).join('<div style="height:14px"></div>')}
    <p class="disclaimer">타고난 성향을 풀이한 참고용 내용이며, 특정 사건을 예측하거나 보장하지 않아요.</p>
  </div>${adSlot('resultBottom')}`;
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

export function renderResult(root: HTMLElement, st: ResultState, cb: ResultCallbacks) {
  const wide = window.matchMedia('(min-width: 1100px)').matches;
  const main = `<div class="segmented primary" role="tablist" data-tabs="main" style="margin-top:14px">
    ${[['saju', '사주팔자'], ['jamidusu', '자미두수 명반'], ['combined', '종합 통변']].map(([k, l]) => `<button type="button" role="tab" data-value="${k}" aria-selected="${st.mainTab === k}">${l}</button>`).join('')}
  </div>`;
  const body = st.mainTab === 'saju' ? sajuSection(st) : st.mainTab === 'jamidusu' ? jamidusuSection(st, wide) : combinedSection(st);
  root.innerHTML = `${profileCard(st)}${main}<div style="margin-top:14px">${body}</div>${appBanner()}`;
  fillAds(root);

  const rerender = () => renderResult(root, st, cb);
  const keepScroll = (fn: () => void) => {
    const y = window.scrollY;
    fn();
    rerender();
    window.scrollTo({ top: y });
  };

  root.onclick = (e) => {
    const t = e.target as HTMLElement;
    const tabBtn = t.closest<HTMLButtonElement>('[data-tabs] button');
    if (tabBtn) {
      const group = tabBtn.parentElement!.dataset.tabs;
      const v = tabBtn.dataset.value!;
      keepScroll(() => {
        if (group === 'main') st.mainTab = v as ResultState['mainTab'];
        if (group === 'saju') st.sajuTab = v as ResultState['sajuTab'];
        if (group === 'jami') {
          st.jamiMode = v as ChartMode;
          const chart = st.snapshot.chart;
          if (chart) st.selectedPalace = overlayOf(st, chart)?.mingBranch ?? chart.mingBranch;
        }
      });
      return;
    }
    const ratio = t.closest<HTMLButtonElement>('[data-ratio-mode] button');
    if (ratio) return keepScroll(() => (st.ratioMode = ratio.dataset.value as ResultState['ratioMode']));
    const big = t.closest<HTMLElement>('[data-big]');
    if (big) return keepScroll(() => (st.selectedBig = Number(big.dataset.big)));
    const step = t.closest<HTMLElement>('[data-big-step]');
    if (step) return keepScroll(() => (st.selectedBig = Math.min(Math.max(0, st.selectedBig + Number(step.dataset.bigStep)), st.snapshot.saju.bigFortunes.length - 1)));
    const stong = t.closest<HTMLElement>('[data-saju-tong]');
    if (stong) return keepScroll(() => (st.sajuTong = stong.dataset.sajuTong!));
    const jtong = t.closest<HTMLElement>('[data-jami-tong]');
    if (jtong) return keepScroll(() => (st.jamiTong = jtong.dataset.jamiTong!));
    const dh = t.closest<HTMLElement>('[data-daehan]');
    if (dh) {
      return keepScroll(() => {
        st.daehanAge = Number(dh.dataset.daehan);
        st.selectedPalace = daehanChart(st.snapshot.chart!, st.daehanAge).mingBranch;
      });
    }
    const ys = t.closest<HTMLElement>('[data-year-step]');
    if (ys) {
      return keepScroll(() => {
        st.yunyeonYear += Number(ys.dataset.yearStep);
        st.selectedPalace = yunyeonChart(st.snapshot.chart!, st.yunyeonYear).mingBranch;
      });
    }
    const pal = t.closest<HTMLElement>('[data-palace]');
    if (pal) {
      const b = Number(pal.dataset.palace);
      if (wide) return keepScroll(() => (st.selectedPalace = b));
      st.selectedPalace = b;
      openSheet(palaceDetail(st.snapshot.chart!, b, overlayOf(st, st.snapshot.chart!)));
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
        basis: st.snapshot.saju.basis,
        snapshot: st.snapshot,
      });
      if (!saved) return toast('브라우저 저장 공간을 쓸 수 없어 저장하지 못했어요.');
      st.archiveId = saved.id;
      keepScroll(() => undefined);
      toast('보관함에 저장했어요. 이 브라우저에만 보관돼요.');
    }
  };

  root.onchange = (e) => {
    const inp = (e.target as HTMLElement).closest<HTMLInputElement>('[data-year-input]');
    if (!inp) return;
    const y = Number(inp.value);
    if (Number.isInteger(y) && y >= 1900 && y <= 2100) {
      keepScroll(() => {
        st.yunyeonYear = y;
        st.selectedPalace = yunyeonChart(st.snapshot.chart!, y).mingBranch;
      });
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

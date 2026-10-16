import './styles.css';
import { normalizeBirth, type BirthInput } from './engine/birth';
import { computeSaju } from './engine/saju';
import { computeJamidusu } from './engine/jamidusu';
import type { Snapshot } from './archive';
import { renderInput } from './ui/input';
import { initialResultState, renderResult, type ResultState } from './ui/result';
import { renderCalendar } from './ui/calendar-view';
import { renderArchive } from './ui/archive-view';
import { SEAL_SVG } from './ui/brand';
import { $ } from './ui/dom';
import { activateAds, adSlot, loadAdSense } from './ads';

const LAST_INPUT = 'inseol.lastInput';
let current: ResultState | null = null;

export function calculate(input: BirthInput): Snapshot {
  const birth = normalizeBirth(input);
  const saju = computeSaju(birth);
  const chart = birth.timeUnknown ? null : computeJamidusu(birth);
  return { birth, saju, chart };
}

function readLastInput(): BirthInput | null {
  try {
    const raw = sessionStorage.getItem(LAST_INPUT);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function showResult(st: ResultState) {
  current = st;
  const app = $('#app');
  app.querySelector('.layout')!.classList.add('with-result');
  const pane = $('#result-pane', app);
  renderResult(pane, st, {
    onEdit: () => {
      $('#f-name')?.focus();
      $('.input-pane')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    onRecalc: (old) => {
      const snap = calculate(old.snapshot.birth.input);
      showResult({ ...initialResultState(snap), archiveId: null });
    },
  });
}

function home() {
  const app = $('#app');
  app.innerHTML = `
    <div class="layout${current ? ' with-result' : ''}">
      <section class="input-pane" aria-label="입력">
        <div class="hero">
          <h1>사주팔자 &amp; 자미두수 명반</h1>
          <p>만세력과 명반을 한곳에서, 무료로. 쉬운 말로 풀어 드려요.</p>
        </div>
        <div id="input-root"></div>
      </section>
      <section id="result-pane" aria-live="polite"></section>
    </div>`;
  renderInput($('#input-root'), current?.snapshot.birth.input ?? readLastInput(), (input) => {
    try {
      sessionStorage.setItem(LAST_INPUT, JSON.stringify(input));
    } catch {
      /* 무시 */
    }
    const pane = $('#result-pane');
    pane.innerHTML = '<div class="card loading">사주와 자미두수 명반을 계산하고 있어요. 잠시만 기다려 주세요.</div>';
    app.querySelector('.layout')!.classList.add('with-result');
    setTimeout(() => {
      try {
        showResult(initialResultState(calculate(input)));
        if (!window.matchMedia('(min-width: 900px)').matches) pane.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch (e) {
        pane.innerHTML = `<div class="card"><p class="notice warn">계산하지 못했어요. 입력을 다시 확인해 주세요.</p></div>`;
        console.error(e);
      }
    }, 30);
  });
  if (current) showResult(current);
}

function route() {
  const hash = location.hash.replace(/^#/, '') || '/';
  document.querySelectorAll<HTMLAnchorElement>('[data-nav]').forEach((a) => {
    if (a.dataset.nav === hash) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  const app = $('#app');
  if (hash === '/calendar') {
    document.title = '만세력 달력 · 인설명리';
    // 달력은 날짜를 누를 때마다 다시 그리므로 광고는 그 바깥에 둡니다.
    app.innerHTML = `<div id="calendar-root"></div>${adSlot('calendar')}`;
    renderCalendar($('#calendar-root'));
    activateAds(app);
  } else if (hash === '/archive') {
    document.title = '보관함 · 인설명리';
    renderArchive(app, (entry) => {
      current = initialResultState(entry.snapshot, entry.id);
      location.hash = '#/';
    });
  } else {
    document.title = '인설명리 · 사주팔자 & 자미두수 명반';
    home();
  }
  window.scrollTo({ top: 0 });
}

function setupTheme() {
  const btn = $('#theme-toggle');
  const apply = (t: string | null) => {
    if (t) document.documentElement.dataset.theme = t;
    else delete document.documentElement.dataset.theme;
    const dark = t ? t === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    btn.textContent = dark ? '☀' : '☾';
    btn.setAttribute('aria-label', dark ? '밝은 화면으로' : '어두운 화면으로');
  };
  let saved: string | null = null;
  try {
    saved = localStorage.getItem('inseol.theme');
  } catch {
    /* 무시 */
  }
  apply(saved);
  btn.addEventListener('click', () => {
    const dark = document.documentElement.dataset.theme
      ? document.documentElement.dataset.theme === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    const next = dark ? 'light' : 'dark';
    try {
      localStorage.setItem('inseol.theme', next);
    } catch {
      /* 무시 */
    }
    apply(next);
  });
}

document.querySelectorAll('[data-seal]').forEach((el) => (el.innerHTML = SEAL_SVG));
setupTheme();
loadAdSense();
window.addEventListener('hashchange', route);
route();

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => undefined));
}

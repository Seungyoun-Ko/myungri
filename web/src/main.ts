import './styles.css';
import type { BirthInput } from './engine/birth';
import { renderInput } from './ui/input';
import type { ResultState } from './ui/result';
import { renderArchive } from './ui/archive-view';
import { SEAL_SVG } from './ui/brand';
import { $ } from './ui/dom';
import { activateAds, adSlot, loadAdSense } from './ads';
import { tr } from './i18n';

const LAST_INPUT = 'inseol.lastInput';
let current: ResultState | null = null;

/** 계산·결과 코드는 처음 필요할 때 한 번만 불러옵니다. */
let heavyPromise: Promise<typeof import('./heavy')> | null = null;
const heavy = () => (heavyPromise ??= import('./heavy').then(async (m) => (await m.readingsReady, m)));

function readLastInput(): BirthInput | null {
  try {
    const raw = sessionStorage.getItem(LAST_INPUT);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function showResult(st: ResultState) {
  const { renderResult, initialResultState, calculate } = await heavy();
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
      void showResult({ ...initialResultState(snap), archiveId: null });
    },
  });
}

function home() {
  const app = $('#app');
  app.innerHTML = `
    <div class="layout${current ? ' with-result' : ''}">
      <section class="input-pane" aria-label="${tr('입력', 'Birth details')}">
        <div class="hero">
          <h1>${tr('사주팔자 &amp; 자미두수 명반', 'Korean Saju &amp; Zi Wei Dou Shu Chart')}</h1>
          <p>${tr('만세력과 명반을 한곳에서, 무료로. 쉬운 말로 풀어 드려요.', 'Your Four Pillars (BaZi) and Purple Star charts in one place. Free, and explained in plain English.')}</p>
          <p class="small" style="margin-top:6px"><a href="${tr('/2027/', '/en/2027/')}">${tr('2027 정미년 신년운세 · 띠별 운세 보기', '2027 Year of the Fire Goat · forecast by zodiac animal')}</a> · <a href="#/match">${tr('두 사람 궁합', 'Compatibility')}</a></p>
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
    pane.innerHTML = `<div class="card loading">${tr('사주와 자미두수 명반을 계산하고 있어요. 잠시만 기다려 주세요.', 'Calculating your charts. Just a moment…')}</div>`;
    app.querySelector('.layout')!.classList.add('with-result');
    setTimeout(async () => {
      try {
        const { calculate, initialResultState } = await heavy();
        await showResult(initialResultState(calculate(input)));
        if (!window.matchMedia('(min-width: 900px)').matches) pane.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch (e) {
        pane.innerHTML = `<div class="card"><p class="notice warn">${tr('계산하지 못했어요. 입력을 다시 확인해 주세요.', 'Something went wrong. Please check your details and try again.')}</p></div>`;
        console.error(e);
      }
    }, 30);
  });
  if (current) void showResult(current);
}

function route() {
  const raw = location.hash.replace(/^#/, '') || '/';
  const [hash, query = ''] = raw.split('?');
  document.querySelectorAll<HTMLAnchorElement>('[data-nav]').forEach((a) => {
    if (a.dataset.nav === hash) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  const app = $('#app');
  if (hash.startsWith('/r/')) {
    // 결과 링크: 주소 # 뒤의 입력값으로 바로 계산합니다(서버로 가지 않음).
    app.innerHTML = `<div class="card loading">${tr('사주와 자미두수 명반을 계산하고 있어요. 잠시만 기다려 주세요.', 'Calculating your charts. Just a moment…')}</div>`;
    void heavy().then(({ decodeInput, calculate, initialResultState }) => {
      const input = decodeInput(hash.slice(3));
      if (input) {
        try {
          current = initialResultState(calculate(input));
          sessionStorage.setItem(LAST_INPUT, JSON.stringify(input));
        } catch {
          /* 잘못된 링크면 첫 화면으로 */
        }
      }
      location.replace('#/');
    });
    return;
  }
  if (hash === '/match') {
    document.title = tr('두 사람 궁합 · 인설명리', 'Compatibility · Inseol Saju');
    app.innerHTML = `<div class="card loading">${tr('불러오고 있어요.', 'Loading…')}</div>`;
    void heavy().then(({ renderMatch, parseCode }) => {
      const day = current?.snapshot.saju.pillars.find((p) => p.key === 'day');
      renderMatch(app, parseCode(new URLSearchParams(query).get('a')), day ? { stem: day.stem.index, branch: day.branch.index } : null);
    });
    window.scrollTo({ top: 0 });
    return;
  }
  if (hash === '/calendar') {
    document.title = tr('만세력 달력 · 인설명리', 'Saju Calendar · Inseol Saju');
    // 달력은 날짜를 누를 때마다 다시 그리므로 광고는 그 바깥에 둡니다.
    app.innerHTML = `<div id="calendar-root"><div class="card loading">${tr('달력을 불러오고 있어요.', 'Loading the calendar…')}</div></div>${adSlot('calendar')}`;
    void heavy().then(({ renderCalendar }) => {
      if ((location.hash.replace(/^#/, '') || '/') !== '/calendar') return;
      renderCalendar($('#calendar-root'));
      activateAds(app);
    });
  } else if (hash === '/archive') {
    document.title = tr('보관함 · 인설명리', 'Saved charts · Inseol Saju');
    renderArchive(app, async (entry) => {
      const { initialResultState } = await heavy();
      current = initialResultState(entry.snapshot, entry.id);
      location.hash = '#/';
    });
  } else {
    document.title = tr('인설명리 · 사주팔자 & 자미두수 명반', 'Free Korean Saju & Zi Wei Dou Shu Chart · Inseol Saju');
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
    btn.setAttribute('aria-label', dark ? tr('밝은 화면으로', 'Switch to light mode') : tr('어두운 화면으로', 'Switch to dark mode'));
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

// 첫 화면이 뜬 뒤 쉬는 시간에 계산 코드를 미리 받아 두어 '결과 보기'를 바로 누를 수 있게 합니다.
const idle = (window as any).requestIdleCallback ?? ((f: () => void) => setTimeout(f, 1200));
idle(() => void heavy());

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => undefined));
}

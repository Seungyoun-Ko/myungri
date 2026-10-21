// 달력 탭 (기획서 2.6)
import { BRANCH_ELEMENT, STEM_ELEMENT, branchIndex, mainHiddenStem, stemIndex } from '../engine/constants';
import { dayPillars, monthDays } from '../engine/calendar';
import { calcTenGod } from '../engine/saju';
import { archive } from '../archive';
import { esc, pad2 } from './dom';
import { EN, tr } from '../i18n';
import { SOLAR_TERM_EN, TEN_GOD_EN, ganzhiEn } from '../engine/en-labels';

const termName = (n: string) => (EN ? (SOLAR_TERM_EN[n] ?? n) : n);
const DOW = EN ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] : ['일', '월', '화', '수', '목', '금', '토'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const gzText = (gz: string) => (EN ? ganzhiEn(stemIndex(gz[0]), branchIndex(gz[1])) : gz);

interface CalState {
  year: number;
  month: number;
  selected: number;
  personId: string;
}

const today = new Date();
const state: CalState = { year: today.getFullYear(), month: today.getMonth() + 1, selected: today.getDate(), personId: '' };

const gzSpan = (gz: string) => {
  const s = stemIndex(gz[0]);
  const b = branchIndex(gz[1]);
  return `<span class="hanja"><span class="el-${STEM_ELEMENT[s]}">${gz[0]}</span><span class="el-${BRANCH_ELEMENT[b]}">${gz[1]}</span></span>`;
};

export function renderCalendar(root: HTMLElement) {
  const days = monthDays(state.year, state.month);
  const first = days[0].dow;
  const isToday = (d: number) => state.year === today.getFullYear() && state.month === today.getMonth() + 1 && d === today.getDate();
  const people = archive.list();
  const person = people.find((p) => p.id === state.personId);

  const cells = [
    ...Array.from({ length: first }, () => '<div class="cal-day blank" aria-hidden="true"></div>'),
    ...days.map((d) => {
      const cls = ['cal-day', d.dow === 0 ? 'sun' : '', d.dow === 6 ? 'sat' : '', isToday(d.day) ? 'today' : '', d.day === state.selected ? 'selected' : '']
        .filter(Boolean)
        .join(' ');
      const lunar = `${d.lunar.leap ? tr('윤', 'L') : ''}${d.lunar.day === 1 ? tr(`${d.lunar.month}월 1일`, `${d.lunar.month}/1`) : EN ? `${d.lunar.month}/${d.lunar.day}` : `${d.lunar.month}.${d.lunar.day}`}`;
      const term = d.terms.map((t) => `${termName(t.name)} ${pad2(t.hour)}:${pad2(t.minute)}`).join(' ');
      return `<button type="button" class="${cls}" data-day="${d.day}" aria-label="${tr(`${d.month}월 ${d.day}일 ${d.dayGanzhi}일, 음력 ${lunar}`, `${MONTHS[d.month - 1]} ${d.day}, ${gzText(d.dayGanzhi)} day, lunar ${lunar}`)}${term ? ', ' + term : ''}">
        <span class="d">${d.day}</span><span class="gz">${gzSpan(d.dayGanzhi)}</span><span class="lunar">${lunar}</span>${term ? `<span class="term">${term}</span>` : ''}
      </button>`;
    }),
  ].join('');

  const sel = days[state.selected - 1] ?? days[0];
  const p = dayPillars(sel.year, sel.month, sel.day);
  let tenGod = '';
  if (person) {
    const dm = person.snapshot.saju.dayMaster.index;
    const ds = stemIndex(p.day[0]);
    const db = branchIndex(p.day[1]);
    const t1 = calcTenGod(dm, ds);
    const t2 = calcTenGod(dm, mainHiddenStem(db));
    tenGod = EN
      ? `<p style="margin-top:8px">For <b>${esc(person.name)}</b> (Day Master <span class="hanja">${person.snapshot.saju.dayMaster.hanja}</span>), this day's stem is <b>${TEN_GOD_EN[t1]}</b> and its branch is <b>${TEN_GOD_EN[t2]}</b>.</p>`
      : `<p style="margin-top:8px"><b>${esc(person.name)}</b>님 일간 <span class="hanja">${person.snapshot.saju.dayMaster.hanja}</span> 기준: 일진 천간 <b>${t1}</b>, 지지 <b>${t2}</b></p>`;
  }

  root.innerHTML = `<div class="layout" style="gap:14px">
    <div class="card">
      <div class="cal-head">
        <button type="button" class="icon-btn" data-step="-1" aria-label="${tr('이전 달', 'Previous month')}">&lt;</button>
        <div class="title">${tr(`${state.year}년 ${state.month}월`, `${MONTHS[state.month - 1]} ${state.year}`)}</div>
        <button type="button" class="icon-btn" data-step="1" aria-label="${tr('다음 달', 'Next month')}">&gt;</button>
      </div>
      <div class="cal-grid">
        ${DOW.map((d, i) => `<div class="dow ${i === 0 ? 'sun' : i === 6 ? 'sat' : ''}">${d}</div>`).join('')}
        ${cells}
      </div>
      <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
        <button type="button" class="btn ghost small" data-today>${tr('오늘', 'Today')}</button>
        <input type="month" data-jump value="${state.year}-${pad2(state.month)}" min="1900-01" max="2050-12" style="padding:6px 10px;border-radius:10px;border:1px solid var(--outline-variant);background:var(--surface)" aria-label="${tr('연월 이동', 'Go to month')}">
      </div>
    </div>
    <div class="card">
      <h2>${tr(`${sel.year}년 ${sel.month}월 ${sel.day}일 (${DOW[sel.dow]})`, `${DOW[sel.dow]}, ${MONTHS[sel.month - 1]} ${sel.day}, ${sel.year}`)}</h2>
      <div class="summary-grid">
        <div class="item"><div class="k">${tr('년', 'Year')}</div><div class="v">${gzSpan(p.year)}</div></div>
        <div class="item"><div class="k">${tr('월', 'Month')}</div><div class="v">${gzSpan(p.month)}</div></div>
        <div class="item"><div class="k">${tr('일진', 'Day')}</div><div class="v">${gzSpan(p.day)}</div></div>
        <div class="item"><div class="k">${tr('음력', 'Lunar date')}</div><div class="v">${tr(`${sel.lunar.leap ? '윤' : ''}${sel.lunar.month}월 ${sel.lunar.day}일`, `${sel.lunar.leap ? 'Leap month' : 'Month'} ${sel.lunar.month}, day ${sel.lunar.day}`)}</div></div>
      </div>
      ${sel.terms.length ? `<p class="notice" style="margin-top:10px">${EN
        ? `${sel.terms.map((t) => `<b>${termName(t.name)}</b> begins at ${pad2(t.hour)}:${pad2(t.minute)} Korea time`).join(', ')}. The year and month pillars above are as of noon.`
        : `${sel.terms.map((t) => `<b>${termName(t.name)}</b> ${pad2(t.hour)}:${pad2(t.minute)} (한국 시각)`).join(', ')} — 년·월 간지는 정오 기준이에요.`}</p>` : ''}
      <div class="field" style="margin-top:14px">
        <label for="cal-person">${tr('보관함 사람 기준 십신 보기', 'Ten Gods for a saved chart')}</label>
        <select id="cal-person" data-person>
          <option value="">${tr('선택 안 함', 'None')}</option>
          ${people.map((x) => `<option value="${x.id}" ${x.id === state.personId ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}
        </select>
      </div>
      ${tenGod}
    </div>
  </div>`;

  root.onclick = (e) => {
    const t = e.target as HTMLElement;
    const step = t.closest<HTMLElement>('[data-step]');
    if (step) {
      const m = state.month + Number(step.dataset.step);
      const y = state.year + (m > 12 ? 1 : m < 1 ? -1 : 0);
      if (y < 1900 || y > 2050) return;
      state.year = y;
      state.month = ((m + 11) % 12) + 1;
      state.selected = 1;
      return renderCalendar(root);
    }
    if (t.closest('[data-today]')) {
      Object.assign(state, { year: today.getFullYear(), month: today.getMonth() + 1, selected: today.getDate() });
      return renderCalendar(root);
    }
    const day = t.closest<HTMLElement>('[data-day]');
    if (day) {
      state.selected = Number(day.dataset.day);
      renderCalendar(root);
    }
  };
  root.onchange = (e) => {
    const t = e.target as HTMLInputElement;
    if (t.matches('[data-person]')) {
      state.personId = t.value;
      renderCalendar(root);
    }
    if (t.matches('[data-jump]') && t.value) {
      const [y, m] = t.value.split('-').map(Number);
      if (y >= 1900 && y <= 2050) Object.assign(state, { year: y, month: m, selected: 1 });
      renderCalendar(root);
    }
  };
}

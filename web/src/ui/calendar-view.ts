// 달력 탭 (기획서 2.6)
import { BRANCH_ELEMENT, STEM_ELEMENT, branchIndex, mainHiddenStem, stemIndex } from '../engine/constants';
import { dayPillars, monthDays } from '../engine/calendar';
import { calcTenGod } from '../engine/saju';
import { archive } from '../archive';
import { esc, pad2 } from './dom';

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
      const lunar = `${d.lunar.leap ? '윤' : ''}${d.lunar.day === 1 ? `${d.lunar.month}월 1일` : `${d.lunar.month}.${d.lunar.day}`}`;
      const term = d.terms.map((t) => `${t.name} ${pad2(t.hour)}:${pad2(t.minute)}`).join(' ');
      return `<button type="button" class="${cls}" data-day="${d.day}" aria-label="${d.month}월 ${d.day}일 ${d.dayGanzhi}일, 음력 ${lunar}${term ? ', ' + term : ''}">
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
    tenGod = `<p style="margin-top:8px"><b>${esc(person.name)}</b>님 일간 <span class="hanja">${person.snapshot.saju.dayMaster.hanja}</span> 기준: 일진 천간 <b>${calcTenGod(dm, ds)}</b>, 지지 <b>${calcTenGod(dm, mainHiddenStem(db))}</b></p>`;
  }

  root.innerHTML = `<div class="layout" style="gap:14px">
    <div class="card">
      <div class="cal-head">
        <button type="button" class="icon-btn" data-step="-1" aria-label="이전 달">&lt;</button>
        <div class="title">${state.year}년 ${state.month}월</div>
        <button type="button" class="icon-btn" data-step="1" aria-label="다음 달">&gt;</button>
      </div>
      <div class="cal-grid">
        ${['일', '월', '화', '수', '목', '금', '토'].map((d, i) => `<div class="dow ${i === 0 ? 'sun' : i === 6 ? 'sat' : ''}">${d}</div>`).join('')}
        ${cells}
      </div>
      <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
        <button type="button" class="btn ghost small" data-today>오늘</button>
        <input type="month" data-jump value="${state.year}-${pad2(state.month)}" min="1900-01" max="2050-12" style="padding:6px 10px;border-radius:10px;border:1px solid var(--outline-variant);background:var(--surface)" aria-label="연월 이동">
      </div>
    </div>
    <div class="card">
      <h2>${sel.year}년 ${sel.month}월 ${sel.day}일 (${['일', '월', '화', '수', '목', '금', '토'][sel.dow]})</h2>
      <div class="summary-grid">
        <div class="item"><div class="k">년</div><div class="v">${gzSpan(p.year)}</div></div>
        <div class="item"><div class="k">월</div><div class="v">${gzSpan(p.month)}</div></div>
        <div class="item"><div class="k">일진</div><div class="v">${gzSpan(p.day)}</div></div>
        <div class="item"><div class="k">음력</div><div class="v">${sel.lunar.leap ? '윤' : ''}${sel.lunar.month}월 ${sel.lunar.day}일</div></div>
      </div>
      ${sel.terms.length ? `<p class="notice" style="margin-top:10px">${sel.terms.map((t) => `<b>${t.name}</b> ${pad2(t.hour)}:${pad2(t.minute)} (한국 시각)`).join(', ')} — 년·월 간지는 정오 기준이에요.</p>` : ''}
      <div class="field" style="margin-top:14px">
        <label for="cal-person">보관함 사람 기준 십신 보기</label>
        <select id="cal-person" data-person>
          <option value="">선택 안 함</option>
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

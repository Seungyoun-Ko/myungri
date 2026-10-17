// 오늘의 일진 페이지: 한국 시각 기준으로 브라우저에서 계산합니다.
import { BRANCHES_HANJA, BRANCHES_KO, BRANCH_ELEMENT, ELEMENTS_KO, STEMS_HANJA, STEMS_KO, STEM_ELEMENT, branchIndex, stemIndex } from './engine/constants';
import { dayPillars, monthDays, termsOfMonth } from './engine/calendar';
import { calcTenGod } from './engine/saju';
import { DAY_MASTER_IMAGE, SIPSIN } from './engine/tongbyeon-data';
import { BRANCH_TEXT, iljuSlug } from './engine/ilju-data';
import { pad2 } from './ui/dom';

/** 지금 한국 날짜 */
function seoulToday() {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const get = (t: string) => Number(parts.find((p) => p.type === t)!.value);
  return { year: get('year'), month: get('month'), day: get('day') };
}

const gz = (g: string) => {
  const s = stemIndex(g[0]);
  const b = branchIndex(g[1]);
  return `<span class="hanja"><span class="el-${STEM_ELEMENT[s]}">${g[0]}</span><span class="el-${BRANCH_ELEMENT[b]}">${g[1]}</span></span>`;
};
const first = (t: string) => (t.match(/^.*?[.!?요](\s|$)/)?.[0] ?? t).trim();
const DOW = ['일', '월', '화', '수', '목', '금', '토'];

function nextTerm(t: { year: number; month: number; day: number }) {
  for (let i = 0; i < 3; i++) {
    const y = t.year + Math.floor((t.month - 1 + i) / 12);
    const m = ((t.month - 1 + i) % 12) + 1;
    const found = termsOfMonth(y, m).find((x) => y > t.year || m > t.month || x.day >= t.day);
    if (found) return { ...found, year: y, month: m };
  }
  return null;
}

function render() {
  const root = document.getElementById('today-root');
  if (!root) return;
  const t = seoulToday();
  const days = monthDays(t.year, t.month);
  const d = days[t.day - 1];
  const p = dayPillars(t.year, t.month, t.day);
  const s = stemIndex(p.day[0]);
  const b = branchIndex(p.day[1]);
  const term = nextTerm(t);
  const dday = term ? Math.round((Date.UTC(term.year, term.month - 1, term.day) - Date.UTC(t.year, t.month - 1, t.day)) / 86400000) : 0;

  const week = Array.from({ length: 7 }, (_, i) => {
    const dt = new Date(Date.UTC(t.year, t.month - 1, t.day + i));
    const y = dt.getUTCFullYear(), m = dt.getUTCMonth() + 1, dd = dt.getUTCDate();
    const g = dayPillars(y, m, dd).day;
    return `<div class="item"><div class="k">${m}/${dd} (${DOW[dt.getUTCDay()]})</div><div class="v">${gz(g)}</div></div>`;
  }).join('');

  const rows = STEMS_HANJA.map((h, dm) => {
    const tg = calcTenGod(dm, s);
    const meaning = first(SIPSIN.find(([n]) => n === tg)![3]);
    return `<tr><td><span class="hanja el-${STEM_ELEMENT[dm]}">${h}</span> ${STEMS_KO[dm]}</td><td><b>${tg}</b></td><td class="small">${meaning}</td></tr>`;
  }).join('');

  root.innerHTML = `
    <section class="card term-card">
      <h2>${t.year}년 ${t.month}월 ${t.day}일 (${DOW[d.dow]})</h2>
      <div class="today-hero">${gz(p.day)}<span>${STEMS_KO[s]}${BRANCHES_KO[b]}일</span></div>
      <div class="summary-grid" style="margin-top:12px">
        <div class="item"><div class="k">년</div><div class="v">${gz(p.year)}</div></div>
        <div class="item"><div class="k">월</div><div class="v">${gz(p.month)}</div></div>
        <div class="item"><div class="k">음력</div><div class="v">${d.lunar.leap ? '윤' : ''}${d.lunar.month}월 ${d.lunar.day}일</div></div>
        ${term ? `<div class="item"><div class="k">다음 절기</div><div class="v">${term.name} ${term.month}/${term.day} ${pad2(term.hour)}:${pad2(term.minute)}${dday === 0 ? ' (오늘)' : ` (D-${dday})`}</div></div>` : ''}
      </div>
    </section>
    <h2>오늘의 기운</h2>
    <p>오늘은 ${STEMS_HANJA[s]}(${STEMS_KO[s]}${ELEMENTS_KO[STEM_ELEMENT[s]]})의 날이에요. ${DAY_MASTER_IMAGE[s]}의 기운이 하늘에 있고, 땅에는 ${BRANCHES_HANJA[b]}(${BRANCH_TEXT[b][0]})의 기운이 흘러요. ${BRANCH_TEXT[b][3]}</p>
    <p class="small"><a href="/ilju/${iljuSlug(s, b)}.html">${STEMS_KO[s]}${BRANCHES_KO[b]}일주 풀이 보기</a></p>
    <h2>내 일간으로 보는 오늘</h2>
    <div class="table-scroll"><table class="today-table">
      <thead><tr><th>내 일간</th><th>오늘의 십신</th><th>뜻</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
    <h2>이번 주 일진</h2>
    <div class="summary-grid">${week}</div>`;
}

render();

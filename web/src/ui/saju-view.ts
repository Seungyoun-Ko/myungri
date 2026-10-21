// 사주팔자 화면: 원국 · 운 흐름 · 통변 (기획서 2.3)
import { ELEMENTS_HANJA, ELEMENTS_KO, mod, STEM_ELEMENT } from '../engine/constants';
import { type Fortune, type Pillar, type PillarKey, type SajuResult, TEN_GODS, type TenGod, PILLAR_TITLES } from '../engine/saju';
import { lifeGraphView, periodView, yearView } from './reading-view';
import { R } from './readings';
import { EN, tr } from '../i18n';
import { BRANCH_EN, ELEMENT_EN, GROWTH_EN, PILLAR_EN, SOLAR_TERM_EN, STEM_EN, STRENGTH_EN, TEN_GOD_EN, TEN_GOD_SHORT, combinationEn, ganzhiEn, geukEn } from '../engine/en-labels';
import { stemIndex, branchIndex } from '../engine/constants';
import { esc, pad2 } from './dom';
import { iljuSlug } from '../engine/ilju-data';

const charCell = (hanja: string, korean: string, el: number, extra = '', roman = '') =>
  `<div class="char bg-${el} el-${el} ${extra}"><span class="hanja">${hanja}</span><small>${EN ? `${roman} · ${ELEMENT_EN[el]}` : `${korean}·${ELEMENTS_KO[el]}`}</small></div>`;
const tg = (t: string) => (EN ? (TEN_GOD_SHORT[t as TenGod] ?? t) : t);
const tgLong = (t: string) => (EN ? (TEN_GOD_EN[t as TenGod] ?? t) : t);
const growth = (g: string) => (EN ? (GROWTH_EN[g] ?? g) : g);
/** 간지 두 글자(한자)의 읽기: 한국어 '갑자', 영어 'Gapja' */
const gzRead = (gz: string) => (EN ? ganzhiEn(stemIndex(gz[0]), branchIndex(gz[1])) : gz);

export function wongukTable(s: SajuResult) {
  const cols = s.pillars;
  const unc = new Set<PillarKey>(s.uncertainPillars);
  const head = cols.map((p) => `<th scope="col">${EN ? PILLAR_EN[p.key] : p.title}${unc.has(p.key) ? ' <span class="muted">*</span>' : ''}</th>`).join('');
  const row = (label: string, f: (p: Pillar) => string) => `<tr><td class="rowlabel">${label}</td>${cols.map((p) => `<td>${f(p)}</td>`).join('')}</tr>`;
  return `<table class="wonguk" aria-label="${tr('사주 원국표', 'Four Pillars chart')}">
    <thead><tr><th></th>${head}</tr></thead>
    <tbody>
      ${row(tr('십신', 'Ten God'), (p) => (p.stemTenGod === '일간' ? `<b>${tg('일간')}</b>` : tg(p.stemTenGod)))}
      ${row(tr('천간', 'Stem'), (p) => charCell(p.stem.hanja, p.stem.korean, p.stem.element, unc.has(p.key) ? 'uncertain' : '', STEM_EN[p.stem.index]))}
      ${row(tr('지지', 'Branch'), (p) => charCell(p.branch.hanja, p.branch.korean, p.branch.element, unc.has(p.key) ? 'uncertain' : '', BRANCH_EN[p.branch.index]))}
      ${row(tr('십신', 'Ten God'), (p) => tg(p.branchTenGod))}
      ${row(tr('지장간', 'Hidden stems'), (p) => `<span class="hidden-stems">${p.hiddenStems.map((h) => `<span class="el-${h.element}">${h.hanja}</span>`).join('')}</span>`)}
      ${row(tr('12운성', 'Life stage'), (p) => growth(p.growthPhase))}
    </tbody>
  </table>`;
}

function boundaryTable(s: SajuResult) {
  const b = s.boundaryTerm;
  if (!b) return '';
  const cell = (gz: string) => `<span class="hanja" style="font-size:1.3rem;font-weight:700">${gz}</span>`;
  const yearDiff = b.before.year !== b.after.year;
  return `<div class="notice" style="margin-top:12px">
      ${tr(
        `<b>${b.name} ${pad2(b.clock.hour)}:${pad2(b.clock.minute)}</b>에 절기가 바뀌는 날이에요. 태어난 시각에 따라 ${yearDiff ? '월주와 년주가' : '월주가'} 달라져요.`,
        `A new solar month begins on this day: <b>${SOLAR_TERM_EN[b.name] ?? b.name} at ${pad2(b.clock.hour)}:${pad2(b.clock.minute)}</b> local time, so your ${yearDiff ? 'month and year pillars depend' : 'month pillar depends'} on your birth time.`,
      )}
    </div>
    <table class="wonguk" style="margin-top:8px" aria-label="${tr('절입 전후 기둥', 'Pillars before and after the solar term')}">
      <thead><tr><th></th><th>${tr('절입 후', 'After term')}</th><th>${tr('절입 전', 'Before term')}</th></tr></thead>
      <tbody>
        <tr><td class="rowlabel">${tr('월주', 'Month')}</td><td>${cell(b.after.month)}</td><td>${cell(b.before.month)}</td></tr>
        ${yearDiff ? `<tr><td class="rowlabel">${tr('년주', 'Year')}</td><td>${cell(b.after.year)}</td><td>${cell(b.before.year)}</td></tr>` : ''}
      </tbody>
    </table>`;
}

const elChip = (e: number, label: string) => `<span class="chip"><span class="muted">${label}</span> <b class="el-${e}">${EN ? `${ELEMENT_EN[e]} ` : ELEMENTS_KO[e]}<span class="hanja">${ELEMENTS_HANJA[e]}</span></b></span>`;

export function summaryCard(s: SajuResult) {
  const day = s.pillars.find((p) => p.key === 'day')!;
  const items: [string, string][] = [
    EN
      ? ['Day pillar', `<span class="hanja">${day.stem.hanja}${day.branch.hanja}</span> ${ganzhiEn(day.stem.index, day.branch.index)}`]
      : ['일주', `<span class="hanja">${day.stem.hanja}${day.branch.hanja}</span> (${day.stem.korean}${day.branch.korean}) <a class="small" href="/ilju/${iljuSlug(day.stem.index, day.branch.index)}.html">풀이 보기</a>`],
  ];
  if (s.strengthText) items.push([tr('강약', 'Strength'), `${EN ? STRENGTH_EN[s.strengthText] : s.strengthText} <span class="muted small">(${s.strengthScore})</span>`]);
  if (s.geukgukLabel) items.push([tr('격국', 'Structure'), EN ? geukEn(s.geukgukLabel) : s.geukgukLabel]);
  const combos = s.combinations.length ? s.combinations.map((c) => esc(EN ? combinationEn(c) : c.text)).join('<br>') : tr('인접한 합충 없음', 'No combinations or clashes between adjacent pillars');
  return `<div class="card">
    <h2>${tr('핵심 요약', 'Key points')}</h2>
    <div class="summary-grid">${items.map(([k, v]) => `<div class="item"><div class="k">${k}</div><div class="v">${v}</div></div>`).join('')}</div>
    ${s.yongsin ? `<h3 style="margin-top:14px">${tr('용신 · 희신 · 기신 · 구신', 'Helpful &amp; unhelpful elements')}</h3><div class="yong">${elChip(s.yongsin.yong, tr('용신', 'Useful'))}${elChip(s.yongsin.hee, tr('희신', 'Favorable'))}${elChip(s.yongsin.gi, tr('기신', 'Unfavorable'))}${elChip(s.yongsin.gu, tr('구신', 'Harmful'))}</div>` : ''}
    <h3 style="margin-top:14px">${tr('합충', 'Combinations & clashes')}</h3><p class="small">${combos}</p>
  </div>`;
}

const tenGodElement = (dayStem: number, t: TenGod) => mod(STEM_ELEMENT[dayStem] + Math.floor(TEN_GODS.indexOf(t) / 2), 5);

export function ratioCard(s: SajuResult, mode: 'base' | 'transform') {
  if (!s.elementRatios || !s.tenGodRatios || !s.transformedRatios) return '';
  const el = mode === 'base' ? s.elementRatios : s.transformedRatios.element;
  const tgr = mode === 'base' ? s.tenGodRatios : s.transformedRatios.tenGod;
  const bar = (label: string, v: number, color: string) =>
    `<div class="bar"><span>${label}</span><span class="track"><span class="fill" style="width:${Math.min(v, 100)}%;background:${color}"></span></span><span class="val">${v.toFixed(1)}%</span></div>`;
  return `<div class="card">
    <div class="flow-nav"><h2 style="margin:0">${tr('오행 · 십신 비율', 'Balance')}</h2>
      <div class="segmented" data-ratio-mode style="flex:none">
        <button type="button" data-value="base" aria-selected="${mode === 'base'}">${tr('기본', 'Base')}</button>
        <button type="button" data-value="transform" aria-selected="${mode === 'transform'}">${tr('합충 반영', 'With combinations')}</button>
      </div>
    </div>
    <div class="ratio-grid" style="margin-top:12px">
      <div><h3>${tr('오행', 'Five elements')}</h3><div class="bars">${el.map((v, i) => bar(`${EN ? ELEMENT_EN[i] : ELEMENTS_KO[i]} <span class="hanja">${ELEMENTS_HANJA[i]}</span>`, v, `var(--el-${i})`)).join('')}</div></div>
      <div><h3>${tr('십신', 'Ten Gods')}</h3><div class="bars">${TEN_GODS.map((t) => bar(tgLong(t), tgr[t], `var(--el-${tenGodElement(s.dayMaster.index, t)})`)).join('')}</div></div>
    </div>
    <p class="small muted" style="margin-top:10px">${tr('가중치: 월지 30 · 일지 20 · 나머지 각 10. 십신 비율은 일간을 뺀 7자리로 계산해요.', 'Weights: month branch 30, day branch 20, all others 10. Ten God percentages leave out the Day Master and count the other 7 characters.')}</p>
  </div>`;
}

const fortuneCell = (f: Fortune, top: string, isNow: boolean, attrs: string) => `<button type="button" class="cell${isNow ? ' now' : ''}" ${attrs}>
    <div class="age">${top}</div>
    <div class="gz hanja"><span class="el-${f.stem.element}">${f.stem.hanja}</span><br><span class="el-${f.branch.element}">${f.branch.hanja}</span></div>
    <div class="tg">${tg(f.stemTenGod)}<br>${tg(f.branchTenGod)}</div>
  </button>`;

export function flowView(s: SajuResult, selectedBig: number, selectedYear: number, selectedMonth: number, now = new Date()) {
  if (!s.bigFortunes.length) return `<div class="card"><p class="notice">${tr('출생시간을 입력해야 대운과 세운을 볼 수 있어요.', 'A birth time is needed to see your 10-year and yearly cycles.')}</p></div>`;
  const thisYear = now.getFullYear();
  const thisMonthIdx = monthIndexOf(now);
  const big = s.bigFortunes
    .map((b, i) => fortuneCell(b, tr(`${b.startAge}세`, `Age ${b.startAge}`), i === s.currentBigFortuneIndex, `data-big="${i}" aria-pressed="${i === selectedBig}" aria-label="${tr(`${b.startAge}세 대운`, `10-year cycle from age ${b.startAge}`)} ${gzRead(b.ganzhi)}"`))
    .join('');
  const years = (s.daewunYearFortunes[selectedBig] ?? [])
    .map((y) => fortuneCell(y, `${y.year}`, y.year === thisYear, `data-year="${y.year}" aria-pressed="${y.year === selectedYear}" aria-label="${y.year} ${gzRead(y.ganzhi)}"`))
    .join('');
  const months = s.monthFortunes
    // 절기 달(인월=1)을 양력 이름으로 보여 줍니다: 인월은 양력 2월 무렵
    .map((m) => fortuneCell(m, EN ? MONTH_ABBR[m.month % 12] : `${m.month === 12 ? 1 : m.month + 1}월`, m.month === thisMonthIdx, `data-month="${m.month}" aria-pressed="${m.month === selectedMonth}" aria-label="${EN ? `Around ${MONTH_FULL[m.month % 12]}` : `양력 ${m.month === 12 ? 1 : m.month + 1}월 무렵`} ${gzRead(m.ganzhi)}"`))
    .join('');
  const sel = s.bigFortunes[selectedBig];
  return `<div class="card">
      <div class="flow-nav">
        <h2 style="margin:0">${tr('10년 운', '10-year cycles')} <span class="small muted">${EN ? (s.bigFortuneForward ? 'run forward' : 'run backward') : `대운 · ${s.bigFortuneForward ? '순행' : '역행'}`}</span></h2>
        <div style="display:flex;gap:6px;align-items:center">
          <button type="button" class="icon-btn" data-big-step="1" aria-label="${tr('다음 운', 'Next cycle')}" ${selectedBig >= s.bigFortunes.length - 1 ? 'disabled' : ''}>&lt;</button>
          <button type="button" class="icon-btn" data-big-step="-1" aria-label="${tr('이전 운', 'Previous cycle')}" ${selectedBig <= 0 ? 'disabled' : ''}>&gt;</button>
        </div>
      </div>
      ${lifeGraphView(R.life(s))}
      <div class="flow">${big}</div>
      ${periodView(R.big(s, selectedBig))}
    </div>
    <div class="card">
      <h2>${tr('한 해 운세', 'Year by year')} <span class="small muted">${tr(`${sel.startAge}세부터 10년 · 해를 누르면 그 해 풀이가 나와요`, `ages ${sel.startAge}–${sel.startAge + 9} · tap a year to read it`)}</span></h2>
      <div class="flow">${years}</div>
      ${yearView(R.year(s, selectedYear))}
    </div>
    <div class="card">
      <h2>${tr('이번 해 달마다 운', 'Month by month this year')} <span class="small muted">${tr(`${thisYear}년 · 절기 기준이라 달은 4~8일 무렵 바뀌어요`, `${thisYear} · solar months start around the 4th–8th`)}</span></h2>
      <div class="flow months">${months}</div>
      ${periodView(R.month(s, selectedMonth))}
      <p class="disclaimer">${R.disclaimer}</p>
    </div>`;
}

export { monthIndexOf };
const MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** 오늘이 몇 번째 절기월(인월=1)인지 대략 계산 */
function monthIndexOf(d: Date) {
  const starts = [[2, 4], [3, 6], [4, 5], [5, 6], [6, 6], [7, 7], [8, 8], [9, 8], [10, 8], [11, 7], [12, 7]];
  const m = d.getMonth() + 1;
  const day = d.getDate();
  let idx = 12; // 1월 소한 이후 ~ 입춘 전은 12월(축월)
  starts.forEach(([sm, sd], i) => {
    if (m > sm || (m === sm && day >= sd)) idx = i + 1;
  });
  if (m === 1 || (m === 2 && day < 4)) idx = 12;
  return idx;
}

export function wongukCard(s: SajuResult) {
  const note = s.incompleteBirthTime
    ? `<p class="notice" style="margin-top:12px">${tr('출생시간을 몰라 시주 없이 보여 드려요. 일주는 그날 정오 기준의 참고값이고, 강약·용신·대운은 제공하지 않아요.', 'Without a birth time, the hour pillar is left out and the day pillar is calculated for noon. Strength, helpful elements and 10-year cycles are not available.')}</p>`
    : '';
  return `<div class="card"><div class="card-head"><h2>${tr('원국', 'Four Pillars')}</h2><button type="button" class="icon-btn" data-save-image="wonguk" data-no-export>${tr('이미지로 저장', 'Save as image')}</button></div>${wongukTable(s)}${boundaryTable(s)}${note}</div>`;
}

export { PILLAR_TITLES };

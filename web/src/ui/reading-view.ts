// 새 사주 풀이와 한 해 운세 화면
import type { ReadingSection, YearReadingView } from '../engine/reading';
import type { LifePoint, PeriodReadingView } from '../engine/reading/flow';
import type { FavorKey } from '../engine/reading/types';
import { R } from './readings';
import { EN, tr } from '../i18n';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const list = (items: string[], tag: 'ul' | 'ol' = 'ul') => `<${tag}>${items.map((x) => `<li>${esc(x)}</li>`).join('')}</${tag}>`;
const box = (cls: string, title: string, inner: string) => `<div class="rd-box ${cls}"><h4>${title}</h4>${inner}</div>`;
const basis = (items: string[]) => `<details class="rd-basis"><summary>${tr('명리 근거 보기', 'Chart basis')}</summary>${list(items)}</details>`;

function sectionBody(s: ReadingSection) {
  const out: string[] = [];
  if (s.headline) out.push(`<div class="rd-headline">${s.headline.label ? `<span class="rd-label">${esc(s.headline.label)}</span>` : ''}<p>${esc(s.headline.text)}</p></div>`);
  if (s.keywords.length) out.push(`<p class="rd-keywords">${s.keywords.map((k) => `<span>#${esc(k)}</span>`).join('')}</p>`);
  if (s.paragraphs.length) out.push(`<div class="rd-text">${s.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}</div>`);
  for (const b of s.blocks ?? []) out.push(`<section class="rd-block"><h3>${esc(b.title)}</h3><div class="rd-text">${b.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}</div></section>`);
  if (s.facts?.length) out.push(`<dl class="rd-facts">${s.facts.map((f) => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`).join('')}</dl>`);
  if (s.energize?.length || s.drain?.length) {
    out.push(`<div class="rd-two">${s.energize?.length ? box('good', tr('이럴 때 힘이 나요', 'What energizes you'), list(s.energize)) : ''}${s.drain?.length ? box('warn', tr('이럴 때 지쳐요', 'What drains you'), list(s.drain)) : ''}</div>`);
  }
  if (s.caution) out.push(box('warn', tr('관계에서 조심할 점', 'Relationship pitfalls'), `<p>${esc(s.caution)}</p>`));
  if (s.chips?.items.length) out.push(`<div class="rd-chips"><h4>${esc(s.chips.label)}</h4><p>${s.chips.items.map((c) => `<span>${esc(c)}</span>`).join('')}</p></div>`);
  if (s.timing?.items.length) out.push(box('time', esc(s.timing.label), list(s.timing.items)));
  if (s.tips?.length) out.push(box('tip', tr('실천 팁', 'Try this'), list(s.tips, 'ol')));
  if (s.note) out.push(`<p class="rd-note">${esc(s.note)}</p>`);
  out.push(basis(s.basis));
  return out.join('\n');
}

/** 사주 풀이 카드 (항목 탭 + 내용) */
export function readingView(sections: ReadingSection[], selected: string, attr: string) {
  const cur = sections.find((s) => s.key === selected) ?? sections[0];
  return `<div class="card">
    <div class="tabs-under rd-tabs" role="tablist">${sections.map((s) => `<button type="button" role="tab" ${attr}="${s.key}" aria-selected="${s.key === cur.key}">${esc(s.title)}</button>`).join('')}</div>
    <div class="rd" role="tabpanel">${sectionBody(cur)}</div>
    <p class="disclaimer">${R.disclaimer}</p>
  </div>`;
}

const FAVOR_LABEL: Record<FavorKey, string> = EN ? { good: 'Good', normal: 'Steady', caution: 'Take care' } : { good: '좋음', normal: '보통', caution: '조심' };
const YEAR_FAVOR_LABEL: Record<FavorKey, string> = EN
  ? { good: 'A supportive year', normal: 'A steady year', caution: 'A year to pace yourself' }
  : { good: '힘이 되는 해', normal: '무난한 해', caution: '속도를 조절할 해' };

/** 한 해 운세 (분야별 + 월별) */
export function yearView(v: YearReadingView | null) {
  if (!v) return '';
  const months = v.months
    .map((m) => `<li class="m-${m.favor}"><span class="m-name">${esc(m.label)}</span><span class="favor favor-${m.favor}">${FAVOR_LABEL[m.favor]}</span><span class="m-text">${esc(m.text)}</span></li>`)
    .join('');
  const summary = [
    v.goodMonths.length ? `<p><b>${tr('힘이 붙는 달', 'Months with momentum')}</b> ${esc(v.goodMonths.join(', '))}</p>` : '',
    v.cautionMonths.length ? `<p><b>${tr('속도를 늦출 달', 'Months to slow down')}</b> ${esc(v.cautionMonths.join(', '))}</p>` : '',
  ].join('');
  return `<div class="rd rd-year">
    <div class="rd-headline"><span class="rd-label">${EN ? `${v.year} · ${esc(v.ganzhi)} year` : `${v.year}년 ${esc(v.ganzhi)}년`} · <span class="favor favor-${v.favor}">${YEAR_FAVOR_LABEL[v.favor]}</span></span><p>${esc(v.title)}</p></div>
    <div class="rd-text"><p>${esc(v.intro)}</p>${v.overview.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
    <div class="rd-fields">${v.fields.map((f) => `<div><h4>${esc(f.label)}</h4><p>${esc(f.text)}</p></div>`).join('')}</div>
    <h4 class="rd-subhead">${tr(`${v.year}년 달마다 운세`, `${v.year} month by month`)} <span class="small muted">${tr('절기 기준이라 달이 바뀌는 날은 4~8일 무렵이에요', 'solar months start around the 4th–8th')}</span></h4>
    ${summary ? `<div class="rd-month-summary">${summary}</div>` : ''}
    <ol class="rd-months">${months}</ol>
    ${box('tip', tr('올해의 실천 팁', 'Tips for the year'), list(v.tips, 'ol'))}
    ${basis(v.basis)}
  </div>`;
}

/** 탭 없이 위에서 아래로 이어 읽는 풀이 (종합) */
export function stackedReadingView(sections: ReadingSection[]) {
  return `<div class="stack">${sections
    .map((s) => `<div class="card"><h2>${esc(s.title)}</h2><div class="rd">${sectionBody(s)}</div></div>`)
    .join('')}<p class="disclaimer">${R.disclaimer}</p></div>`;
}

const PERIOD_FAVOR_LABEL: Record<FavorKey, string> = EN
  ? { good: 'A supportive time', normal: 'A steady time', caution: 'A time to pace yourself' }
  : { good: '힘이 되는 때', normal: '무난한 때', caution: '속도를 조절할 때' };

/** 10년 운·이번 달 풀이 */
export function periodView(v: PeriodReadingView | null) {
  if (!v) return '';
  return `<div class="rd rd-year">
    <div class="rd-headline"><span class="rd-label">${esc(v.label)} · <span class="favor favor-${v.favor}">${PERIOD_FAVOR_LABEL[v.favor]}</span></span><p>${esc(v.title)}</p></div>
    <div class="rd-text">${v.intro ? `<p>${esc(v.intro)}</p>` : ''}${v.overview.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
    <div class="rd-fields">${v.fields.map((f) => `<div><h4>${esc(f.label)}</h4><p>${esc(f.text)}</p></div>`).join('')}</div>
    ${v.tips.length ? box('tip', tr('이 시기의 실천 팁', 'Tips for this period'), list(v.tips, 'ol')) : ''}
    ${basis(v.basis)}
  </div>`;
}

/** 인생 흐름 그래프: 10년 운마다 나에게 맞는 정도 (-2 ~ +2) */
export function lifeGraphView(points: LifePoint[]) {
  if (!points.length) return '';
  // 휴대폰 폭에 맞춰 줄어들어도 글자가 읽히도록 좌표를 작게 잡습니다
  const W = 560;
  const H = 210;
  const padX = EN ? 54 : 40;
  const top = 30;
  const bottom = 56;
  const x = (i: number) => padX + (i * (W - padX * 2)) / Math.max(1, points.length - 1);
  const y = (score: number) => top + ((2 - score) * (H - top - bottom)) / 4;
  const line = points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.score).toFixed(1)}`).join(' ');
  const area = `${line} L${x(points.length - 1).toFixed(1)},${(H - bottom).toFixed(1)} L${x(0).toFixed(1)},${(H - bottom).toFixed(1)} Z`;
  const grid = [2, 0, -2]
    .map((v) => `<line class="lg-grid" x1="${padX}" x2="${W - padX}" y1="${y(v)}" y2="${y(v)}"/><text class="lg-axis" x="${padX - 6}" y="${y(v) + 5}" text-anchor="end">${v === 2 ? tr('좋음', 'Good') : v === 0 ? tr('보통', 'Steady') : tr('조절', 'Slow')}</text>`)
    .join('');
  const dots = points
    .map(
      (p, i) => `<g class="lg-point${p.current ? ' current' : ''}" data-big="${p.index}" role="button" tabindex="0" aria-label="${tr(`${p.startAge}세부터 10년`, `10 years from age ${p.startAge}`)}: ${esc(p.title)}">
        <circle class="lg-dot favor-dot-${p.favor}" cx="${x(i)}" cy="${y(p.score)}" r="${p.current ? 10 : 7}"/>
        <text class="lg-age" x="${x(i)}" y="${H - bottom + 22}" text-anchor="middle">${tr(`${p.startAge}세`, `${p.startAge}`)}</text>
        <text class="lg-gz" x="${x(i)}" y="${H - bottom + 42}" text-anchor="middle">${esc(p.ganzhi)}</text>
        ${p.current ? `<text class="lg-now" x="${x(i)}" y="${y(p.score) - 17}" text-anchor="middle">${tr('지금', 'Now')}</text>` : ''}
      </g>`,
    )
    .join('');
  return `<figure class="life-graph">
    <figcaption>${tr('인생 흐름 · 10년마다 들어오는 기운이 나에게 얼마나 맞는지', 'Life graph · how well each 10-year cycle suits you')} <span class="small muted">${tr('점을 누르면 그 10년 풀이가 나와요', 'tap a dot to read that decade')}</span></figcaption>
    <div class="lg-scroll"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${tr('10년 운 흐름 그래프', '10-year cycle graph')}">${grid}<path class="lg-area" d="${area}"/><path class="lg-line" d="${line}"/>${dots}</svg></div>
  </figure>`;
}

// 새 사주 풀이와 한 해 운세 화면
import type { ReadingSection, YearReadingView } from '../engine/reading';
import type { FavorKey } from '../engine/reading/types';
import { DISCLAIMER } from '../engine/tongbyeon-data';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const list = (items: string[], tag: 'ul' | 'ol' = 'ul') => `<${tag}>${items.map((x) => `<li>${esc(x)}</li>`).join('')}</${tag}>`;
const box = (cls: string, title: string, inner: string) => `<div class="rd-box ${cls}"><h4>${title}</h4>${inner}</div>`;
const basis = (items: string[]) => `<details class="rd-basis"><summary>명리 근거 보기</summary>${list(items)}</details>`;

function sectionBody(s: ReadingSection) {
  const out: string[] = [];
  if (s.headline) out.push(`<div class="rd-headline">${s.headline.label ? `<span class="rd-label">${esc(s.headline.label)}</span>` : ''}<p>${esc(s.headline.text)}</p></div>`);
  if (s.keywords.length) out.push(`<p class="rd-keywords">${s.keywords.map((k) => `<span>#${esc(k)}</span>`).join('')}</p>`);
  out.push(`<div class="rd-text">${s.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}</div>`);
  if (s.facts?.length) out.push(`<dl class="rd-facts">${s.facts.map((f) => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`).join('')}</dl>`);
  if (s.energize?.length || s.drain?.length) {
    out.push(`<div class="rd-two">${s.energize?.length ? box('good', '이럴 때 힘이 나요', list(s.energize)) : ''}${s.drain?.length ? box('warn', '이럴 때 지쳐요', list(s.drain)) : ''}</div>`);
  }
  if (s.caution) out.push(box('warn', '관계에서 조심할 점', `<p>${esc(s.caution)}</p>`));
  if (s.chips?.items.length) out.push(`<div class="rd-chips"><h4>${esc(s.chips.label)}</h4><p>${s.chips.items.map((c) => `<span>${esc(c)}</span>`).join('')}</p></div>`);
  if (s.timing?.items.length) out.push(box('time', esc(s.timing.label), list(s.timing.items)));
  if (s.tips?.length) out.push(box('tip', '실천 팁', list(s.tips, 'ol')));
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
    <p class="disclaimer">${DISCLAIMER}</p>
  </div>`;
}

const FAVOR_LABEL: Record<FavorKey, string> = { good: '좋음', normal: '보통', caution: '조심' };
const YEAR_FAVOR_LABEL: Record<FavorKey, string> = { good: '힘이 되는 해', normal: '무난한 해', caution: '속도를 조절할 해' };

/** 한 해 운세 (분야별 + 월별) */
export function yearView(v: YearReadingView | null) {
  if (!v) return '';
  const months = v.months
    .map((m) => `<li class="m-${m.favor}"><span class="m-name">${esc(m.label)}</span><span class="favor favor-${m.favor}">${FAVOR_LABEL[m.favor]}</span><span class="m-text">${esc(m.text)}</span></li>`)
    .join('');
  const summary = [
    v.goodMonths.length ? `<p><b>힘이 붙는 달</b> ${esc(v.goodMonths.join(', '))}</p>` : '',
    v.cautionMonths.length ? `<p><b>속도를 늦출 달</b> ${esc(v.cautionMonths.join(', '))}</p>` : '',
  ].join('');
  return `<div class="rd rd-year">
    <div class="rd-headline"><span class="rd-label">${v.year}년 ${esc(v.ganzhi)}년 · <span class="favor favor-${v.favor}">${YEAR_FAVOR_LABEL[v.favor]}</span></span><p>${esc(v.title)}</p></div>
    <div class="rd-text"><p>${esc(v.intro)}</p>${v.overview.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
    <div class="rd-fields">${v.fields.map((f) => `<div><h4>${esc(f.label)}</h4><p>${esc(f.text)}</p></div>`).join('')}</div>
    <h4 class="rd-subhead">${v.year}년 달마다 운세 <span class="small muted">절기 기준이라 달이 바뀌는 날은 4~8일 무렵이에요</span></h4>
    ${summary ? `<div class="rd-month-summary">${summary}</div>` : ''}
    <ol class="rd-months">${months}</ol>
    ${box('tip', '올해의 실천 팁', list(v.tips, 'ol'))}
    ${basis(v.basis)}
  </div>`;
}

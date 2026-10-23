// 결과 화면 (기획서 2.1 ~ 2.5)
import { cityById } from '../engine/cities';
import type { NormalizedBirth } from '../engine/birth';
import { daehanChart, yunyeonChart, type JamidusuChart, type OverlayChart } from '../engine/jamidusu';
import { readingView, stackedReadingView } from './reading-view';
import { R } from './readings';
import { EN, tr } from '../i18n';
import { CALCULATION_BASIS } from '../engine/saju';
import { archive, type Snapshot } from '../archive';
import { activateAds, adSlot } from '../ads';
import { $, esc, pad2, toast } from './dom';
import { flowView, monthIndexOf, ratioCard, summaryCard, wongukCard } from './saju-view';
import { boardView, palaceDetail, type ChartMode } from './jamidusu-view';
import { PLAY_STORE_URL } from './brand';
import { saveAsImage, saveShareCard } from './share-image';
import { shareResultLink } from './share-link';
import { KAKAO_SITE, shareKakao } from './kakao';
import { iljuTypeEn, iljuTypeKo } from '../engine/ilju-type';
import { mbtiLike } from '../engine/mbti-like';

/** 띠 동물 이모지 (지지 순서) */
const ANIMAL_EMOJI = ['🐭', '🐮', '🐯', '🐰', '🐲', '🐍', '🐴', '🐑', '🐵', '🐔', '🐶', '🐷'];
import { ganzhiEn } from '../engine/en-labels';

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
    // v1.2: 첫 화면은 쉬운 말 풀이부터 (원국 표는 '원국' 탭)
    sajuTab: 'tong',
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

const MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmtSolar = (b: NormalizedBirth) => {
  if (EN) {
    const d = `${MONTH_ABBR[b.solar.month - 1]} ${b.solar.day}, ${b.solar.year}`;
    return b.timeUnknown || !b.clock ? `${d}, time unknown` : `${d}, ${pad2(b.clock.hour)}:${pad2(b.clock.minute)}`;
  }
  const d = `${b.solar.year}.${pad2(b.solar.month)}.${pad2(b.solar.day)}`;
  return b.timeUnknown || !b.clock ? `${d} 시간 모름` : `${d} ${pad2(b.clock.hour)}:${pad2(b.clock.minute)}`;
};
/** 명반이 있으면 명반에 쓴 음력 날짜(해외 출생은 보정 날짜 기준일 수 있음)를 보여 줍니다. */
const fmtLunar = (b: NormalizedBirth, chart?: JamidusuChart | null) => {
  const l = chart?.lunar ?? b.lunar;
  if (EN) return `Lunar ${l.year}, ${l.leap ? 'leap ' : ''}month ${l.month}, day ${l.day}`;
  return `음력 ${l.year}.${l.leap ? '윤' : ''}${pad2(l.month)}.${pad2(l.day)}`;
};
const displayName = (b: NormalizedBirth) => b.input.name?.trim() || tr('이름 없음', 'No name');
const utcText = (m: number) => `UTC${m < 0 ? '−' : '+'}${Math.floor(Math.abs(m) / 60)}${Math.abs(m) % 60 ? `:${pad2(Math.abs(m) % 60)}` : ''}`;
const signed = (n: number) => (n > 0 ? `+${n}` : `${n}`);
/** 명반의 잡성·12신 보이기: 넓은 화면은 기본으로 보이고, 휴대폰은 기본으로 숨깁니다 */
let showMinor = typeof window === 'undefined' || window.matchMedia('(min-width: 600px)').matches;

function profileCard(st: ResultState) {
  const { birth, saju } = st.snapshot;
  const day = saju.pillars.find((p) => p.key === 'day')!;
  const city = cityById(birth.input.cityId ?? 'seoul');
  const c = birth.corrections;
  const at = birth.corrected ? `${pad2(birth.corrected.hour)}:${pad2(birth.corrected.minute)}` : '';
  const corr = !birth.corrected
    ? ''
    : birth.utcOffset !== undefined
      ? tr(
          `보정 ${at} (${utcText(birth.utcOffset)}${c.dst ? `, 서머타임 ${c.dst}분` : ''}${c.longitude ? `, 현지 태양시 ${signed(c.longitude)}분` : ''})`,
          `adjusted to ${at} (${utcText(birth.utcOffset)}${c.dst ? `, daylight saving ${c.dst} min` : ''}${c.longitude ? `, local solar time ${signed(c.longitude)} min` : ''})`,
        )
      : tr(
          `보정 ${at} (자오선 ${c.meridian}분${c.dst ? `, 서머타임 ${c.dst}분` : ''}${c.longitude ? `, 경도 ${c.longitude}분` : ''})`,
          `adjusted to ${at} (standard meridian ${c.meridian} min${c.dst ? `, daylight saving ${c.dst} min` : ''}${c.longitude ? `, longitude ${c.longitude} min` : ''})`,
        );
  const stale = st.archiveId && saju.basis !== CALCULATION_BASIS;
  return `<div class="card">
    <div class="profile">
      <div class="ilju hanja" aria-label="${tr('일주', 'Day pillar')}">${day.stem.hanja}<br>${day.branch.hanja}</div>
      <div style="min-width:0">
        <div class="name">${esc(displayName(birth))} <span class="small muted">${birth.input.gender === 'M' ? tr('남', 'Male') : tr('여', 'Female')}</span></div>
        <div class="meta">${tr('양력', 'Born')} ${fmtSolar(birth)} · ${fmtLunar(birth, st.snapshot.chart)}</div>
        <div class="meta">${EN ? city.en : city.name}${!city.tz && birth.input.useLongitude ? tr(' · 경도 보정', ' · longitude corrected') : ''}${corr ? ` · ${corr}` : ''}</div>
      </div>
      <div class="result-actions" data-no-export>
        <button type="button" class="icon-btn" data-action="edit">${tr('편집', 'Edit')}</button>
        <a class="icon-btn" href="#/archive" style="text-decoration:none;color:inherit">${tr('보관함', 'Saved charts')}</a>
        <button type="button" class="icon-btn" data-action="save">${st.archiveId ? tr('저장됨', 'Saved ✓') : tr('저장', 'Save')}</button>
      </div>
    </div>
    ${birth.utcOffset !== undefined && birth.solar.year < 1970 ? `<p class="small muted" style="margin-top:10px">${tr(
      `1970년 이전 해외 출생은 지역에 따라 당시 시간대 기록이 부정확할 수 있어요. 위의 ${utcText(birth.utcOffset)}가 출생 당시 그 지역 시각과 맞는지 확인해 주세요. 다르면 같은 오프셋을 쓰는 가까운 도시를 고르면 돼요.`,
      `For births outside Korea before 1970, historical time zone records can be wrong for some places. Check that ${utcText(birth.utcOffset)} above matches the local clock time when you were born. If it doesn't, choose a nearby city that used the correct offset.`,
    )}</p>` : ''}
    ${birth.corrected && birth.corrected.hour === 23 ? `<p class="small muted" style="margin-top:8px">${tr(
      `밤 11시대(자시) 출생이에요. ${birth.input.jasi === 'same' ? '당일 기준(야자시)' : '다음 날 기준'}으로 일주와 명반을 계산했어요. 학파에 따라 일주가 하루 다르게 보일 수 있어요.`,
      `Born in the 11 pm hour. Your day pillar and Zi Wei chart use the ${birth.input.jasi === 'same' ? 'same-day' : 'next-day'} rule; schools differ on this, so other apps may show a different day pillar.`,
    )}</p>` : ''}
    ${st.snapshot.chart && st.snapshot.chart.lunar.leap ? `<p class="small muted" style="margin-top:8px">${tr(
      `윤달 출생이에요. 자미두수 명반은 '${{ same: '같은 달', mid: '15일 기준', next: '다음 달' }[birth.input.leapMode ?? 'mid']}'으로 배치했어요.`,
      `Born in a lunar leap month. The Zi Wei chart uses the "${{ same: 'same month', mid: 'split at day 15', next: 'next month' }[birth.input.leapMode ?? 'mid']}" rule.`,
    )}</p>` : ''}
    ${st.archiveId ? `<div class="notice" style="margin-top:12px;display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        <span style="flex:1">${tr('보관함에 저장된 결과예요', 'This is a saved chart')} (${tr('계산 기준', 'method')} ${esc(saju.basis)}).${stale ? tr(' 지금 기준과 달라요.', ' The calculation method has been updated since.') : ''}</span>
        <button type="button" class="btn small" data-action="recalc">${tr('현재 기준으로 새로 계산', 'Recalculate with latest method')}</button></div>` : ''}
  </div>`;
}

function overlayOf(st: ResultState, chart: JamidusuChart): OverlayChart | undefined {
  if (st.jamiMode === 'daehan') return daehanChart(chart, st.daehanAge);
  if (st.jamiMode === 'yunyeon') return yunyeonChart(chart, st.yunyeonYear);
  return undefined;
}

const FAVOR_WORD = { good: tr('힘이 되는 해', 'a supportive year'), normal: tr('무난한 해', 'a steady year'), caution: tr('속도를 조절할 해', 'a year to pace yourself') } as const;

/** 결과 맨 위 '한눈에' 카드: 일주 타입, 한 줄 은유, 올해, 지금 10년, 공유·궁합 버튼 */
function heroCard(st: ResultState) {
  const { birth, saju: s } = st.snapshot;
  const day = s.pillars.find((p) => p.key === 'day')!;
  const type = EN ? iljuTypeEn(day.stem.index, day.branch.index) : iljuTypeKo(day.stem.index, day.branch.index);
  const iljuName = EN ? `${day.stem.hanja}${day.branch.hanja} ${ganzhiEn(day.stem.index, day.branch.index)} day pillar` : `${day.stem.hanja}${day.branch.hanja} · ${day.stem.korean}${day.branch.korean}일주`;
  const general = R.saju(s, birth.input.gender, { southern: !!cityById(birth.input.cityId ?? 'seoul').south })[0];
  const thisYear = new Date().getFullYear();
  const year = s.incompleteBirthTime ? null : R.year(s, thisYear);
  const big = s.currentBigFortuneIndex >= 0 ? R.big(s, s.currentBigFortuneIndex) : null;
  const need = general.facts?.[0];
  const mbti = mbtiLike(s);
  const facts: [string, string][] = [];
  const today = R.today(s);
  if (today) facts.push([tr('오늘의 나', 'Today'), `${today.text} · ${{ good: tr('좋음', 'good'), normal: tr('보통', 'steady'), caution: tr('조심', 'take care') }[today.favor]}`]);
  if (year) facts.push([tr(`${thisYear}년`, `${thisYear}`), `${year.title} · ${FAVOR_WORD[year.favor]}`]);
  if (big) facts.push([tr('지금 10년', 'This decade'), big.title]);
  if (need) facts.push([need.label, need.value]);
  return `<div class="card hero-card">
    <div class="hero-type"><b>${esc(type)}</b><span class="hanja">${esc(iljuName)}</span></div>
    <p class="hero-title">${esc(general.headline?.text ?? '')}</p>
    <p class="rd-keywords">${general.keywords.map((k) => `<span>#${esc(k)}</span>`).join('')}</p>
    ${mbti ? `<details class="hero-mbti"><summary>${tr(`MBTI로 치면 <b>${mbti.code}</b>에 가까워요`, `Closest MBTI type: <b>${mbti.code}</b>`)} <span class="small muted">${tr('재미로 보는 비교 · 왜?', 'just for fun · why?')}</span></summary><ul>${mbti.reasons.map((x) => `<li><b>${x.letter}</b> ${esc(EN ? x.whyEn : x.why)}</li>`).join('')}</ul><p class="small muted">${tr('사주 계산값으로 가까운 쪽을 고른 재미 요소예요. 공식 MBTI 검사가 아니에요.', 'A playful comparison from your chart, not an official MBTI assessment.')}</p></details>` : ''}
    ${facts.length ? `<dl class="hero-facts">${facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>` : ''}
    <div class="hero-actions" data-no-export>
      <button type="button" class="btn small" data-share-card="story">${tr('나를 한 줄로 · 카드 저장', 'Save my card')}</button>
      ${EN ? '' : '<button type="button" class="btn small kakao" data-share-kakao>카카오톡 공유</button>'}
      <button type="button" class="btn small ghost" data-share-link>${tr('결과 링크 공유', 'Share link')}</button>
      <a class="btn small ghost" href="#/match">${tr('궁합 보기', 'Compatibility')}</a>
    </div>
  </div>`;
}

const tabButtons = (group: string, items: [string, string][], current: string) =>
  items.map(([k, l]) => `<button type="button" role="tab" data-value="${k}" aria-selected="${current === k}">${l}</button>`).join('');

function jamiPicker(st: ResultState, chart: JamidusuChart, overlay?: OverlayChart) {
  if (st.jamiMode === 'daehan') {
    const ranges = [...chart.palaces].sort((a, c) => a.daehan.start - c.daehan.start);
    return `${EN ? '<p class="small muted" style="margin-top:10px">Ages use the East Asian count, where you are 1 at birth.</p>' : ''}<div class="age-chips" style="margin-top:10px" aria-label="${tr('대한 선택', 'Choose a decade')}">${ranges
      .map((p) => `<button type="button" data-daehan="${p.daehan.start}" aria-pressed="${overlay?.range?.start === p.daehan.start}">${p.daehan.start}-${p.daehan.end}</button>`)
      .join('')}</div>`;
  }
  if (st.jamiMode === 'yunyeon') {
    return `<div class="year-step" style="margin-top:10px">
      <button type="button" class="icon-btn" data-year-step="-1" aria-label="${tr('이전 해', 'Previous year')}">&lt;</button>
      <input type="number" id="yunyeon-year" data-year-input min="1900" max="2100" value="${st.yunyeonYear}" aria-label="${tr('유년 연도', 'Year')}">
      <button type="button" class="icon-btn" data-year-step="1" aria-label="${tr('다음 해', 'Next year')}">&gt;</button>
    </div>`;
  }
  return '';
}

function jamiBoard(st: ResultState, chart: JamidusuChart, wide: boolean, overlay?: OverlayChart) {
  const b = st.snapshot.birth;
  // 유년을 볼 때는 그해의 대한 사화도 함께 겹쳐 보여 줍니다(大·年 두 층).
  const overlay2 = st.jamiMode === 'yunyeon' ? daehanChart(chart, st.yunyeonYear - chart.lunar.year + 1) : undefined;
  const board = boardView(chart, { name: displayName(b), solarText: `${tr('양력', 'Born')} ${fmtSolar(b)}`, lunarText: fmtLunar(b, chart), overlay, overlay2, selected: st.selectedPalace, showMinor });
  const detail = st.selectedPalace >= 0 && wide ? `<aside class="card">${palaceDetail(chart, st.selectedPalace, overlay)}</aside>` : '';
  return `<div class="board-split" style="margin-top:12px"><div class="card" style="padding:10px">${board}</div>${detail}</div>`;
}

function combinedHtml(st: ResultState) {
  const { saju, chart } = st.snapshot;
  if (!chart || saju.incompleteBirthTime) return `<div class="card"><p class="notice">${tr('출생시간을 입력하면 사주와 자미두수를 함께 본 종합 풀이를 볼 수 있어요.', 'Add your birth time to see the combined reading of both charts.')}</p></div>`;
  return stackedReadingView(R.combined(saju, chart));
}

function appBanner() {
  if (EN) return '';
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
    <div data-region="hero" style="margin-top:14px"></div>
    <div class="segmented primary" role="tablist" data-tabs="main" style="margin-top:14px">
      ${tabButtons('main', [['saju', tr('사주팔자', 'Saju')], ['jamidusu', tr('자미두수 명반', 'Zi Wei chart')], ['combined', tr('종합 풀이', 'Combined')]], st.mainTab)}
    </div>
    <section data-panel="saju" style="margin-top:14px">
      <div class="segmented" role="tablist" data-tabs="saju">${tabButtons('saju', [['wonguk', tr('원국', 'Chart')], ['flow', tr('운 흐름', 'Luck cycles')], ['tong', tr('풀이', 'Reading')]], st.sajuTab)}</div>
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
        ? `<div class="segmented" role="tablist" data-tabs="jami">${tabButtons('jami', [['natal', tr('선천 명반', 'Natal')], ['daehan', tr('대한 명반', 'Decade')], ['yunyeon', tr('유년 명반', 'Yearly')]], st.jamiMode)}</div>
           <div data-region="picker"></div>
           <div data-region="board"></div>
           <div data-region="jamiTong" style="margin-top:14px"></div>
           ${adSlot('jamiBottom')}`
        : `<div class="card"><p class="notice">${tr('출생시간을 입력해야 명반을 완성 시킬 수 있습니다.', 'A birth time is needed to build the Zi Wei chart.')}</p></div>`}
    </section>
    <section data-panel="combined" style="margin-top:14px">
      <div data-region="combined"></div>
      ${chart && !s.incompleteBirthTime ? adSlot('combinedBottom') : ''}
    </section>
    ${appBanner()}`;

  const region = (name: string) => root.querySelector<HTMLElement>(`[data-region="${name}"]`);
  const paint = {
    profile: () => (region('profile')!.innerHTML = profileCard(st)),
    hero: () => (region('hero')!.innerHTML = heroCard(st)),
    wonguk: () => (region('wonguk')!.innerHTML = wongukCard(s)),
    summary: () => (region('summary')!.innerHTML = s.incompleteBirthTime ? '' : summaryCard(s)),
    ratio: () => (region('ratio')!.innerHTML = s.incompleteBirthTime ? '' : ratioCard(s, st.ratioMode)),
    flow: () => (region('flow')!.innerHTML = flowView(s, st.selectedBig, st.selectedYear, st.selectedMonth)),
    sajuTong: () => (region('sajuTong')!.innerHTML = readingView(R.saju(s, st.snapshot.birth.input.gender, { southern: !!cityById(st.snapshot.birth.input.cityId ?? 'seoul').south }), st.sajuTong, 'data-saju-tong')),
    jami: () => {
      if (!chart) return;
      const overlay = overlayOf(st, chart);
      region('picker')!.innerHTML = jamiPicker(st, chart, overlay);
      region('board')!.innerHTML = jamiBoard(st, chart, wide, overlay);
      const jamiSections = R.jami(chart, overlay);
      if (!jamiSections.some((x) => x.key === st.jamiTong)) st.jamiTong = jamiSections[0].key;
      region('jamiTong')!.innerHTML = readingView(jamiSections, st.jamiTong, 'data-jami-tong');
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
        // 10년·1년 흐름을 고르면 '이 시기' 풀이부터, 선천으로 돌아오면 '나 자신'부터 보여 줍니다
        st.jamiTong = v === 'natal' ? 'general' : 'now';
        paint.jami();
      }
      syncTabs();
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
    const card = t.closest<HTMLElement>('[data-share-card]');
    if (card) {
      const day = s.pillars.find((p) => p.key === 'day')!;
      const general = R.saju(s, st.snapshot.birth.input.gender, { southern: !!cityById(st.snapshot.birth.input.cityId ?? 'seoul').south })[0];
      const mbtiC = mbtiLike(s);
      const facts = [
        ...(mbtiC ? [[tr('MBTI로 치면', 'Closest MBTI'), mbtiC.code] as [string, string]] : []),
        ...(general.facts ?? []).slice(0, mbtiC ? 2 : 3).map((f) => [f.label, f.value] as [string, string]),
      ];
      void saveShareCard({
        type: EN ? iljuTypeEn(day.stem.index, day.branch.index) : iljuTypeKo(day.stem.index, day.branch.index),
        ilju: EN ? `${day.stem.hanja}${day.branch.hanja} · ${ganzhiEn(day.stem.index, day.branch.index)} day pillar` : `${day.stem.hanja}${day.branch.hanja} · ${day.stem.korean}${day.branch.korean}일주`,
        title: general.headline?.text ?? '',
        keywords: general.keywords.slice(0, 3),
        facts,
        shape: (card.dataset.shareCard as 'story' | 'square') ?? 'story',
      });
      return;
    }
    if (t.closest('[data-share-kakao]')) {
      // 카톡 메시지에는 일주 타입과 한 줄 은유만 넣고, 이름·생년월일은 넣지 않습니다.
      const day = s.pillars.find((p) => p.key === 'day')!;
      const general = R.saju(s, st.snapshot.birth.input.gender, { southern: !!cityById(st.snapshot.birth.input.cityId ?? 'seoul').south })[0];
      const type = iljuTypeKo(day.stem.index, day.branch.index);
      const mbtiK = mbtiLike(s);
      void shareKakao({
        title: `${ANIMAL_EMOJI[day.branch.index]} 나는 '${type}' · ${day.stem.korean}${day.branch.korean}일주`,
        description: `${general.headline?.text ?? '인설명리에서 내 사주를 쉬운 말로 풀어 봤어요'}${mbtiK ? ` (MBTI로 치면 ${mbtiK.code})` : ''}`,
        url: `${KAKAO_SITE}/`,
        buttons: [
          { title: '나도 내 사주 보기', url: `${KAKAO_SITE}/` },
          { title: '우리 궁합 보기', url: `${KAKAO_SITE}/#/match?a=${day.stem.index}-${day.branch.index}` },
        ],
      });
      return;
    }
    if (t.closest('[data-share-link]')) {
      void shareResultLink(st.snapshot.birth.input);
      return;
    }
    const save = t.closest<HTMLElement>('[data-save-image]');
    if (save) {
      const b = st.snapshot.birth;
      const base = `${displayName(b)}_${b.solar.year}${pad2(b.solar.month)}${pad2(b.solar.day)}`.replace(/[\\/:*?"<>|\s]+/g, '_');
      if (save.dataset.saveImage === 'wonguk') {
        void saveAsImage([region('profile')!, region('wonguk')!], { fileName: `${base}_${tr('사주원국', 'saju-chart')}.png`, width: 640, caption: tr('사주팔자 원국', 'Saju Four Pillars chart') });
      } else {
        void saveAsImage([root.querySelector<HTMLElement>('.board-wrap')!], { fileName: `${base}_${tr('자미두수명반', 'ziwei-chart')}.png`, width: 820, caption: tr('자미두수 명반', 'Zi Wei Dou Shu chart') });
      }
      return;
    }
    if (t.closest('[data-toggle-minor]')) {
      showMinor = !showMinor;
      return paint.board();
    }
    if (t.closest('[data-zoom]')) {
      const wrap = root.querySelector('.board-wrap')!;
      const sheet = document.createElement('div');
      sheet.className = 'zoom-sheet';
      sheet.setAttribute('role', 'dialog');
      sheet.setAttribute('aria-label', tr('명반 크게 보기', 'Enlarged chart'));
      sheet.innerHTML = `<div class="zoom-bar"><b>${tr('명반 크게 보기', 'Enlarged chart')}</b><button type="button" class="btn small" data-close>${tr('닫기', 'Close')}</button></div>${wrap.outerHTML}`;
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
      if (st.archiveId) return toast(tr('이미 보관함에 있어요.', 'Already in Saved charts.'));
      const saved = archive.save({
        name: displayName(st.snapshot.birth),
        input: st.snapshot.birth.input,
        basis: s.basis,
        snapshot: st.snapshot,
      });
      if (!saved) return toast(tr('브라우저 저장 공간을 쓸 수 없어 저장하지 못했어요.', "Couldn't save: browser storage is unavailable."));
      st.archiveId = saved.id;
      paint.profile();
      toast(tr('보관함에 저장했어요. 이 브라우저에만 보관돼요.', 'Saved (in this browser only).'));
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
  back.innerHTML = `<div class="sheet" role="dialog" aria-modal="true">${html}<button type="button" class="btn ghost block" style="margin-top:14px" data-close>${tr('닫기', 'Close')}</button></div>`;
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

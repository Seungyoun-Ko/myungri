// 2027 정미년 신년운세 페이지 (한국어 /2027/, 영어 /en/2027/)를 만듭니다. 실행: npm run pages
import { mkdirSync, writeFileSync } from 'node:fs';
import { BRANCHES_HANJA, STEMS_HANJA, STEMS_KO, STEM_ELEMENT, HIDDEN_STEMS } from '../src/engine/constants.ts';
import { NEW_YEAR_2027, NEW_YEAR_2027_INTRO } from '../src/engine/reading/newyear-2027.ts';
import { NEW_YEAR_2027 as NEW_YEAR_2027_EN, NEW_YEAR_2027_INTRO as NEW_YEAR_2027_INTRO_EN } from '../src/engine/reading/en/newyear-2027.ts';
import { YEAR } from '../src/engine/reading/fortune.ts';
import { YEAR as YEAR_EN } from '../src/engine/reading/en/fortune.ts';

const SITE = 'https://app.inseol.com';
const YEAR_NUM = 2027;
const STEM = 3; // 丁
const BRANCH = 7; // 未
const TEN_GODS = ['비견', '겁재', '식신', '상관', '편재', '정재', '편관', '정관', '편인', '정인'] as const;
const mod = (n: number, m: number) => ((n % m) + m) % m;
const tenGod = (day: number, t: number) => TEN_GODS[mod(STEM_ELEMENT[t] - STEM_ELEMENT[day], 5) * 2 + (day % 2 === t % 2 ? 0 : 1)];
const firstSentences = (t: string, n: number) => (t.match(/[^.!?]+[.!?]+["']?/g) ?? [t]).slice(0, n).map((x) => x.trim()).join(' ');
const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const ANIMAL_KO = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];
const ANIMAL_EN = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
const SLUG = ['rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'];
const STEM_EN = ['Yang Wood', 'Yin Wood', 'Yang Fire', 'Yin Fire', 'Yang Earth', 'Yin Earth', 'Yang Metal', 'Yin Metal', 'Yang Water', 'Yin Water'];
/** 그 띠의 출생 연도 (1936~2020) */
const yearsOf = (b: number) => Array.from({ length: 100 }, (_, i) => 1924 + i).filter((y) => mod(y - 4, 12) === b && y >= 1936 && y <= 2020);

function head(lang: 'ko' | 'en', path: string, alt: string, title: string, desc: string) {
  const en = lang === 'en';
  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <link rel="canonical" href="${SITE}${path}">
  <link rel="alternate" hreflang="${lang}" href="${SITE}${path}">
  <link rel="alternate" hreflang="${en ? 'ko' : 'en'}" href="${SITE}${alt}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="${en ? 'Inseol Saju' : '인설명리'}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:url" content="${SITE}${path}">
  <meta property="og:image" content="${SITE}/${en ? 'og-en.png' : 'og.png'}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:locale" content="${en ? 'en_US' : 'ko_KR'}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@500;700;900&display=swap" rel="stylesheet">
</head>
<body>
  <div id="shell-top"></div>
  <main class="article">
`;
}
const tail = `  </main>
  <div id="shell-bottom"></div>
  <script type="module" src="/src/page.ts"></script>
</body>
</html>
`;

function koPage() {
  const intro = NEW_YEAR_2027_INTRO;
  const toc = ANIMAL_KO.map((a, i) => `<a href="#${SLUG[i]}">${a}띠</a>`).join(' · ');
  const animals = ANIMAL_KO.map((a, i) => {
    const r = NEW_YEAR_2027[i];
    return `    <section class="card" id="${SLUG[i]}" style="margin-top:14px">
      <h2>${a}띠 <span class="small muted">${yearsOf(i).join('·')}년생</span></h2>
      <p><b>${esc(r.title)}</b></p>
      <p>${esc(r.overview)}</p>
      <ul>
        <li><b>일</b> ${esc(r.work)}</li>
        <li><b>돈</b> ${esc(r.money)}</li>
        <li><b>연애·관계</b> ${esc(r.love)}</li>
        <li><b>건강</b> ${esc(r.health)}</li>
      </ul>
      <p class="small"><b>실천 팁</b> ${esc(r.tip)}</p>
    </section>`;
  }).join('\n');
  const dms = STEMS_KO.map((k, s) => {
    const tg = tenGod(s, STEM);
    const y = YEAR[tg as keyof typeof YEAR];
    return `      <li><b>${k}${['목', '목', '화', '화', '토', '토', '금', '금', '수', '수'][s]} <span class="hanja">${STEMS_HANJA[s]}</span></b> — ${esc(y.title)}. ${esc(firstSentences(y.overview, 2))}</li>`;
  }).join('\n');
  void HIDDEN_STEMS;
  const title = `${YEAR_NUM} 정미년 신년운세 · 붉은 양의 해 띠별 운세 · 인설명리`;
  const desc = `${YEAR_NUM}년 정미년(붉은 양의 해) 신년운세. 띠별 운세 12가지와 태어난 날의 기운별 한 해 흐름을 쉬운 말로 풀었어요. 내 생년월일시로 12달 운세도 무료로 볼 수 있어요.`;
  return (
    head('ko', '/2027/', '/en/2027/', title, desc) +
    `    <h1>${YEAR_NUM} 정미년 신년운세 <span class="hanja">${STEMS_HANJA[STEM]}${BRANCHES_HANJA[BRANCH]}</span></h1>
    <p><b>${esc(intro.title)}</b></p>
    <p>${esc(intro.intro)}</p>
    <ol>${intro.tips.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>
    <div class="notice" style="margin-top:14px"><b>내 사주로 보는 ${YEAR_NUM}년</b> — 띠별 운세는 태어난 해만 본 큰 흐름이에요. 생년월일시를 넣으면 ${YEAR_NUM}년 일·돈·연애·건강과 12달 흐름을 나에게 맞춰 풀어 드려요. <a href="/">내 ${YEAR_NUM}년 운세 무료로 보기</a></div>
    <h2 style="margin-top:22px">띠별 운세</h2>
    <p class="small muted">띠는 설날이 아니라 입춘(2월 4일 무렵)에 바뀌어요. 1월~2월 초 생일이면 앞 해의 띠일 수 있어요.</p>
    <p class="small">${toc}</p>
${animals}
    <h2 style="margin-top:22px">태어난 날의 기운(일간)별 ${YEAR_NUM}년</h2>
    <p>사주에서 나를 대표하는 것은 태어난 해가 아니라 태어난 날의 기운이에요. 내 일간은 <a href="/">결과 화면</a>의 일주에서 확인할 수 있어요.</p>
    <ul>
${dms}
    </ul>
    <p class="disclaimer">타고난 기운의 흐름을 풀이한 참고용 내용이며, 특정 사건을 예측하거나 보장하지 않아요.</p>
` +
    tail
  );
}

function enPage() {
  const intro = NEW_YEAR_2027_INTRO_EN;
  const toc = ANIMAL_EN.map((a, i) => `<a href="#${SLUG[i]}">${a}</a>`).join(' · ');
  const animals = ANIMAL_EN.map((a, i) => {
    const r = NEW_YEAR_2027_EN[i];
    return `    <section class="card" id="${SLUG[i]}" style="margin-top:14px">
      <h2>${a} <span class="small muted">born ${yearsOf(i).join(', ')}</span></h2>
      <p><b>${esc(r.title)}</b></p>
      <p>${esc(r.overview)}</p>
      <ul>
        <li><b>Work</b> ${esc(r.work)}</li>
        <li><b>Money</b> ${esc(r.money)}</li>
        <li><b>Love</b> ${esc(r.love)}</li>
        <li><b>Health</b> ${esc(r.health)}</li>
      </ul>
      <p class="small"><b>Try this</b> ${esc(r.tip)}</p>
    </section>`;
  }).join('\n');
  const dms = STEM_EN.map((k, s) => {
    const tg = tenGod(s, STEM);
    const y = YEAR_EN[tg as keyof typeof YEAR_EN];
    return `      <li><b>${k} <span class="hanja">${STEMS_HANJA[s]}</span></b> — ${esc(y.title)}. ${esc(firstSentences(y.overview, 2))}</li>`;
  }).join('\n');
  const title = `${YEAR_NUM} Year of the Fire Goat · Korean Zodiac Forecast by Animal · Inseol Saju`;
  const desc = `Your ${YEAR_NUM} Fire Goat year forecast for all 12 Korean zodiac animals, plus what the year brings for each birth-day element. Get a free personal 12-month forecast from your birth date and time.`;
  return (
    head('en', '/en/2027/', '/2027/', title, desc) +
    `    <h1>${YEAR_NUM}: Year of the Fire Goat <span class="hanja">${STEMS_HANJA[STEM]}${BRANCHES_HANJA[BRANCH]}</span></h1>
    <p><b>${esc(intro.title)}</b></p>
    <p>${esc(intro.intro)}</p>
    <ol>${intro.tips.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>
    <div class="notice" style="margin-top:14px"><b>Your personal ${YEAR_NUM}</b> — the zodiac animal only reflects your birth year. Enter your birth date and time to see ${YEAR_NUM} for work, money, love and health, plus a month-by-month forecast made for you. <a href="/en/">See my ${YEAR_NUM} forecast free</a></div>
    <h2 style="margin-top:22px">Forecast by zodiac animal</h2>
    <p class="small muted">The zodiac year turns at the Start of Spring, around February 4, not on January 1 or Lunar New Year. If your birthday is in January or early February, you may belong to the previous animal.</p>
    <p class="small">${toc}</p>
${animals}
    <h2 style="margin-top:22px">${YEAR_NUM} by birth-day element</h2>
    <p>In saju, the energy that stands for you is the day you were born, not the year. Find yours on your <a href="/en/">results screen</a> under "Day pillar".</p>
    <ul>
${dms}
    </ul>
    <p class="disclaimer">A reflection on the year's energy, not a prediction or guarantee of specific events.</p>
` +
    tail
  );
}

mkdirSync('2027', { recursive: true });
mkdirSync('en/2027', { recursive: true });
writeFileSync('2027/index.html', koPage());
writeFileSync('en/2027/index.html', enPage());
console.log('new year pages: /2027/, /en/2027/');

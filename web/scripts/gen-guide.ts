// 검색 유입용 공부 글 페이지(guide/*.html)를 만듭니다. 실행: npm run guide
import { writeFileSync, mkdirSync } from 'node:fs';
import { DAY_MASTER_IMAGE, DAY_MASTER_PERSONALITY, ELEMENT_FEW, ELEMENT_LIFE, ELEMENT_MANY, STAR_TEXT, GROUP_APTITUDE, SIPSIN, UNSEONG } from '../src/engine/tongbyeon-data.ts';

const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const STEMS_KO = ['갑목', '을목', '병화', '정화', '무토', '기토', '경금', '신금', '임수', '계수'];
const ELEMENTS = [['목', '木', '나무'], ['화', '火', '불'], ['토', '土', '흙'], ['금', '金', '쇠'], ['수', '水', '물']];
const STAR_HANJA: Record<string, string> = { 자미: '紫微', 천기: '天機', 태양: '太陽', 무곡: '武曲', 천동: '天同', 염정: '廉貞', 천부: '天府', 태음: '太陰', 탐랑: '貪狼', 거문: '巨門', 천상: '天相', 천량: '天梁', 칠살: '七殺', 파군: '破軍' };



const page = (path: string, title: string, desc: string, body: string) => `<!doctype html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${title} · 인설명리</title>
  <meta name="description" content="${desc}">
  <link rel="canonical" href="https://app.inseol.com${path}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="인설명리">
  <meta property="og:title" content="${title} · 인설명리">
  <meta property="og:description" content="${desc}">
  <meta property="og:url" content="https://app.inseol.com${path}">
  <meta property="og:image" content="https://app.inseol.com/og.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:locale" content="ko_KR">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@500;700;900&display=swap" rel="stylesheet">
</head>
<body>
  <div id="shell-top"></div>
  <main class="article">
    <p class="small"><a href="/guide/">명리 공부 글</a></p>
${body}
    <div class="card" style="margin-top:24px"><p>내 사주와 자미두수 명반이 궁금하다면 <a href="/">무료로 만세력 보기</a></p></div>
  </main>
  <div id="shell-bottom"></div>
  <script type="module" src="/src/page.ts"></script>
</body>
</html>
`;

const card = (title: string, sub: string, html: string) => `    <section class="card term-card"><h2>${title} <span class="small muted">${sub}</span></h2>${html}</section>`;

const pages: Record<string, [string, string, string]> = {
  'ilgan.html': [
    '일간 10가지: 나를 나타내는 글자',
    '사주에서 나 자신을 뜻하는 일간(日干) 甲乙丙丁戊己庚辛壬癸 10가지의 모습과 성격을 쉬운 말로 풀었어요.',
    `    <h1>일간 10가지: 나를 나타내는 글자</h1>
    <p>사주팔자 여덟 글자 가운데 태어난 날의 천간을 <b>일간(日干)</b>이라고 해요. 명리학에서는 일간을 ‘나 자신’으로 보고, 나머지 일곱 글자를 일간과의 관계로 풀어요.</p>
${STEMS.map((h, i) => card(`<span class="hanja">${h}</span> ${STEMS_KO[i]}`, DAY_MASTER_IMAGE[i], `<p>${DAY_MASTER_PERSONALITY[i]}</p>`)).join('\n')}`,
  ],
  'ohaeng.html': [
    '오행: 목·화·토·금·수',
    '오행(五行) 목화토금수가 많을 때와 부족할 때의 뜻, 기운을 채우는 생활 방법을 정리했어요.',
    `    <h1>오행: 목·화·토·금·수</h1>
    <p>오행은 세상을 이루는 다섯 가지 기운이에요. 목은 화를, 화는 토를, 토는 금을, 금은 수를, 수는 목을 생(生)하고, 목은 토를, 토는 수를, 수는 화를, 화는 금을, 금은 목을 극(克)해요. 인설명리는 월지 30, 일지 20, 나머지 자리 각 10의 가중치로 오행 비율을 계산해요.</p>
${ELEMENTS.map(([ko, h, img], i) => card(`${ko} <span class="hanja">${h}</span>`, img, `<p><b>많을 때</b> ${ELEMENT_MANY[i]}</p><p><b>부족할 때</b> ${ELEMENT_FEW[i]}</p><p><b>채우는 생활</b> ${ELEMENT_LIFE[i]}</p>`)).join('\n')}`,
  ],
  'sipsin.html': [
    '십신 10가지: 비견부터 정인까지',
    '십신(十神) 비견·겁재·식신·상관·편재·정재·편관·정관·편인·정인의 뜻을 쉬운 말로 풀었어요.',
    `    <h1>십신 10가지: 비견부터 정인까지</h1>
    <p>십신은 일간(나)과 다른 글자의 관계를 열 가지로 나눈 거예요. 오행이 같은지, 내가 생하는지, 내가 극하는지, 나를 극하는지, 나를 생하는지에 음양이 같은지 다른지를 더해 정해요.</p>
${SIPSIN.map(([ko, h, rule, text]) => card(`${ko} <span class="hanja">${h}</span>`, rule, `<p>${text}</p>`)).join('\n')}
    <h2>십신 무리로 보는 적성</h2>
${Object.entries(GROUP_APTITUDE).map(([g, t]) => card(g, '', `<p>${t}</p>`)).join('\n')}`,
  ],
  'unseong.html': [
    '12운성: 장생부터 양까지',
    '12운성(十二運星) 장생·목욕·관대·건록·제왕·쇠·병·사·묘·절·태·양의 뜻을 정리했어요.',
    `    <h1>12운성: 장생부터 양까지</h1>
    <p>12운성은 일간의 기운이 각 지지에서 얼마나 힘을 쓰는지를 사람의 한평생에 빗대어 나타낸 거예요. 양간은 순서대로, 음간은 거꾸로 돌아요.</p>
${UNSEONG.map(([ko, t]) => card(ko, '', `<p>${t}</p>`)).join('\n')}`,
  ],
  'stars.html': [
    '자미두수 14주성 소개',
    '자미두수 14주성 자미·천기·태양·무곡·천동·염정·천부·태음·탐랑·거문·천상·천량·칠살·파군의 성격과 적성을 풀었어요.',
    `    <h1>자미두수 14주성 소개</h1>
    <p>자미두수 명반의 12궁에는 14개의 주성이 자리 잡아요. 명궁에 있는 주성은 타고난 성격을, 관록궁은 일, 재백궁은 재물, 부처궁은 인연을 보여 줘요. 주성이 없는 궁은 맞은편 궁의 별을 빌려 봐요.</p>
${Object.entries(STAR_TEXT).map(([n, t]) => card(`${n} <span class="hanja">${STAR_HANJA[n]}</span>`, t.image, `<p><b>성격</b> ${t.personality}</p><p><b>적성</b> ${t.aptitude}</p><p><b>연애</b> ${t.love}</p><p><b>재물</b> ${t.wealth}</p>`)).join('\n')}`,
  ],
};

mkdirSync('guide', { recursive: true });
/** 카드 목록의 가운데에 중간 광고 자리를 넣습니다. */
function withMidAd(body: string) {
  const parts = body.split('\n    <section class="card term-card">');
  if (parts.length < 4) return body;
  const mid = Math.ceil((parts.length - 1) / 2);
  return parts.map((p, i) => (i === 0 ? p : '\n    <section class="card term-card">' + p) + (i === mid ? '\n    <div data-ad="guideMid"></div>' : '')).join('');
}
for (const [file, [title, desc, body]] of Object.entries(pages))
  writeFileSync(`guide/${file}`, page(`/guide/${file}`, title, desc, withMidAd(body) + '\n    <div data-ad="guideEnd"></div>'));

const index = `    <h1>명리 공부 글</h1>
    <p>사주와 자미두수를 처음 공부하는 분을 위해 기본 개념을 쉬운 말로 정리했어요.</p>
    <p class="notice"><a href="/ilju/">60일주 풀이</a>에서 갑자일주부터 계해일주까지 일주별 성격과 특징을 볼 수 있어요.</p>
    <div class="guide-grid">
${Object.entries(pages).map(([f, [t, d]]) => `      <a href="/guide/${f}"><div class="card"><h2 style="margin:0 0 6px">${t}</h2><p class="small muted">${d}</p></div></a>`).join('\n')}
    </div>`;
writeFileSync('guide/index.html', page('/guide/', '명리 공부 글', '사주팔자와 자미두수의 기본 개념(일간, 오행, 십신, 12운성, 14주성)을 쉬운 말로 정리한 공부 글 모음이에요.', index).replace('<p class="small"><a href="/guide/">명리 공부 글</a></p>\n', ''));
console.log('guide pages:', Object.keys(pages).length + 1);

// 검색 유입용 공부 글 페이지(guide/*.html)를 만듭니다. 실행: npm run guide
import { writeFileSync, mkdirSync } from 'node:fs';
import { DAY_MASTER_IMAGE, DAY_MASTER_PERSONALITY, ELEMENT_FEW, ELEMENT_LIFE, ELEMENT_MANY, STAR_TEXT, GROUP_APTITUDE } from '../src/engine/tongbyeon-data.ts';

const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const STEMS_KO = ['갑목', '을목', '병화', '정화', '무토', '기토', '경금', '신금', '임수', '계수'];
const ELEMENTS = [['목', '木', '나무'], ['화', '火', '불'], ['토', '土', '흙'], ['금', '金', '쇠'], ['수', '水', '물']];
const STAR_HANJA: Record<string, string> = { 자미: '紫微', 천기: '天機', 태양: '太陽', 무곡: '武曲', 천동: '天同', 염정: '廉貞', 천부: '天府', 태음: '太陰', 탐랑: '貪狼', 거문: '巨門', 천상: '天相', 천량: '天梁', 칠살: '七殺', 파군: '破軍' };

const SIPSIN: [string, string, string, string][] = [
  ['비견', '比肩', '나와 같은 오행, 같은 음양', '나와 어깨를 나란히 하는 사람이에요. 형제·친구·동료를 뜻하고, 스스로 서려는 자립심과 주체성을 보여 줘요. 많으면 고집과 경쟁심이 커지고, 알맞으면 든든한 내 편이 돼요.'],
  ['겁재', '劫財', '나와 같은 오행, 다른 음양', '나와 비슷하지만 경쟁하는 사람이에요. 승부욕과 추진력이 강하고, 재물을 나누거나 빼앗길 일과도 관련 있어요. 동업·보증은 신중하게 보는 것이 좋아요.'],
  ['식신', '食神', '내가 생하는 오행, 같은 음양', '먹고 즐기고 표현하는 별이에요. 여유, 재능, 꾸준한 생산력을 뜻하고, 여성에게는 자녀를 뜻하기도 해요. 알맞으면 복이 오래가요.'],
  ['상관', '傷官', '내가 생하는 오행, 다른 음양', '틀을 깨고 말과 재주로 드러내는 별이에요. 창의력과 비판 정신이 뛰어나지만, 규칙과 부딪칠 수 있어요. 예술·기술·말하는 일에서 빛나요.'],
  ['편재', '偏財', '내가 극하는 오행, 같은 음양', '크게 움직이는 돈과 활동 무대예요. 사업 감각, 유통, 투자, 넓은 인간관계를 뜻해요. 남성에게는 이성 인연을 뜻하기도 해요.'],
  ['정재', '正財', '내가 극하는 오행, 다른 음양', '성실하게 모으는 돈이에요. 월급, 저축, 살림, 계획적인 생활을 뜻하고, 남성에게는 아내를 뜻해요.'],
  ['편관', '偏官', '나를 극하는 오행, 같은 음양', '나를 몰아붙이는 강한 힘이에요. 압박과 책임을 견디며 큰일을 해내는 힘, 결단력, 권위를 뜻해요. 칠살이라고도 불러요.'],
  ['정관', '正官', '나를 극하는 오행, 다른 음양', '나를 바르게 다스리는 질서예요. 직장, 명예, 규칙, 신뢰를 뜻하고, 여성에게는 남편을 뜻해요.'],
  ['편인', '偏印', '나를 생하는 오행, 같은 음양', '남다른 직관과 깊은 생각이에요. 종교·철학·기술·특수 분야와 인연이 있고, 혼자 파고드는 힘이 강해요.'],
  ['정인', '正印', '나를 생하는 오행, 다른 음양', '나를 키워 주는 어머니 같은 별이에요. 배움, 자격, 문서, 따뜻한 보살핌을 뜻해요.'],
];

const UNSEONG: [string, string][] = [
  ['장생', '갓 태어난 아기처럼 새로 시작하는 기운이에요. 순수하고 배우려는 마음이 커요.'],
  ['목욕', '태어나 처음 씻는 때예요. 호기심이 많고 변화가 잦으며, 멋과 감성에 관심이 커요.'],
  ['관대', '옷을 갖춰 입고 세상에 나서는 청년의 기운이에요. 자신감과 추진력이 강해요.'],
  ['건록', '스스로 벌어 먹고 사는 어른의 기운이에요. 자립심이 강하고 실속이 있어요.'],
  ['제왕', '가장 힘이 센 전성기예요. 주도권을 쥐고 이끄는 힘이 있지만, 지나치면 독단이 될 수 있어요.'],
  ['쇠', '전성기를 지나 노련해진 때예요. 신중하고 경험에서 나오는 판단이 좋아요.'],
  ['병', '몸이 약해져 쉬어야 하는 때예요. 남을 이해하는 마음과 감수성이 깊어요.'],
  ['사', '움직임이 멈추고 생각이 깊어지는 때예요. 연구와 정리에 강해요.'],
  ['묘', '창고에 거두어 저장하는 때예요. 모으고 지키는 힘, 집중력이 있어요.'],
  ['절', '끊어지고 새로 바뀌는 때예요. 변화에 빠르게 적응하지만 마음이 흔들리기 쉬워요.'],
  ['태', '새 생명이 잉태되는 때예요. 계획과 가능성이 자라나는 기운이에요.'],
  ['양', '뱃속에서 길러지는 때예요. 보호받으며 차분히 힘을 기르는 기운이에요.'],
];

const page = (path: string, title: string, desc: string, body: string) => `<!doctype html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${title} · 인설명리</title>
  <meta name="description" content="${desc}">
  <link rel="canonical" href="https://app.inseol.com${path}">
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
    <div class="guide-grid">
${Object.entries(pages).map(([f, [t, d]]) => `      <a href="/guide/${f}"><div class="card"><h2 style="margin:0 0 6px">${t}</h2><p class="small muted">${d}</p></div></a>`).join('\n')}
    </div>`;
writeFileSync('guide/index.html', page('/guide/', '명리 공부 글', '사주팔자와 자미두수의 기본 개념(일간, 오행, 십신, 12운성, 14주성)을 쉬운 말로 정리한 공부 글 모음이에요.', index).replace('<p class="small"><a href="/guide/">명리 공부 글</a></p>\n', ''));
console.log('guide pages:', Object.keys(pages).length + 1);

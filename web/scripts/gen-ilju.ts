// 60일주 페이지(ilju/*.html)와 사이트맵을 만듭니다. 실행: npm run pages
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { BRANCHES_HANJA, BRANCHES_KO, BRANCH_ELEMENT, ELEMENTS_HANJA, ELEMENTS_KO, HIDDEN_STEMS, STEMS_HANJA, STEMS_KO, STEM_ELEMENT } from '../src/engine/constants.ts';
import { DAY_MASTER_IMAGE, DAY_MASTER_PERSONALITY, GROUP_APTITUDE, SIPSIN, UNSEONG } from '../src/engine/tongbyeon-data.ts';
import { BRANCH_TEXT, NAYIN_NAMES, SPOUSE_PALACE, STEM_BRANCH_RELATION, iljuSlug } from '../src/engine/ilju-data.ts';

const SITE = 'https://app.inseol.com';
const TODAY = new Date().toISOString().slice(0, 10);
const TEN_GODS = ['비견', '겁재', '식신', '상관', '편재', '정재', '편관', '정관', '편인', '정인'];
const GROUPS = ['비겁', '식상', '재성', '관성', '인성'];
const PHASES = ['장생', '목욕', '관대', '건록', '제왕', '쇠', '병', '사', '묘', '절', '태', '양'];
const START_JI = [11, 6, 2, 9, 2, 9, 5, 0, 8, 3];
const mod = (n: number, m: number) => ((n % m) + m) % m;
const tenGod = (day: number, t: number) => TEN_GODS[mod(STEM_ELEMENT[t] - STEM_ELEMENT[day], 5) * 2 + (day % 2 === t % 2 ? 0 : 1)];
const groupOf = (tg: string) => GROUPS[Math.floor(TEN_GODS.indexOf(tg) / 2)];
const phase = (s: number, b: number) => PHASES[s % 2 === 0 ? mod(b - START_JI[s], 12) : mod(START_JI[s] - b, 12)];
const hasBatchim = (w: string) => {
  const c = w.charCodeAt(w.length - 1);
  return c >= 0xac00 && c <= 0xd7a3 && (c - 0xac00) % 28 !== 0;
};
const josa = (w: string, a: string, b: string) => w + (hasBatchim(w) ? a : b);
/** 한글 읽기 기준 조사 (한자 뒤에 붙일 때) */
const pick = (reading: string, a: string, b: string) => (hasBatchim(reading) ? a : b);
const first = (t: string) => (t.match(/^.*?[.!?요](\s|$)/)?.[0] ?? t).trim();

interface Ilju {
  idx: number;
  stem: number;
  branch: number;
  ko: string;
  hanja: string;
  slug: string;
}
const ALL: Ilju[] = Array.from({ length: 60 }, (_, i) => ({
  idx: i,
  stem: i % 10,
  branch: i % 12,
  ko: STEMS_KO[i % 10] + BRANCHES_KO[i % 12],
  hanja: STEMS_HANJA[i % 10] + BRANCHES_HANJA[i % 12],
  slug: iljuSlug(i % 10, i % 12),
}));

// 블로그(content/blog)에 같은 일주의 자세한 글이 있으면 연결합니다.
const BLOG_POST: Record<string, number> = {};
if (existsSync('content/blog')) {
  for (const f of readdirSync('content/blog').filter((x) => x.endsWith('.json'))) {
    const post = JSON.parse(readFileSync(`content/blog/${f}`, 'utf8')) as { id: number; ilju?: { slug: string } };
    if (post.ilju) BLOG_POST[post.ilju.slug] = post.id;
  }
}

const STEM_NAME = ['갑목', '을목', '병화', '정화', '무토', '기토', '경금', '신금', '임수', '계수'];
const BRANCH_NAME = (b: number) => `${BRANCHES_KO[b]}${ELEMENTS_KO[BRANCH_ELEMENT[b]]}`;
const yy = (n: number) => (n % 2 === 0 ? '양' : '음');

const head = (path: string, title: string, desc: string, type = 'article') => `<!doctype html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <link rel="canonical" href="${SITE}${path}">
  <meta property="og:type" content="${type}">
  <meta property="og:site_name" content="인설명리">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:url" content="${SITE}${path}">
  <meta property="og:image" content="${SITE}/og.png">
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
`;
const tail = `  </main>
  <div id="shell-bottom"></div>
  <script type="module" src="/src/page.ts"></script>
</body>
</html>
`;
const el = (e: number, text: string) => `<span class="el-${e}">${text}</span>`;

function page(j: Ilju) {
  const { stem, branch } = j;
  const main = HIDDEN_STEMS[branch][HIDDEN_STEMS[branch].length - 1];
  const branchTg = tenGod(stem, main);
  const group = groupOf(branchTg);
  const ph = phase(stem, branch);
  const phText = UNSEONG.find(([n]) => n === ph)![1];
  const [nayinHanja, nayinKo] = NAYIN_NAMES[Math.floor(j.idx / 2)];
  const xun = mod(branch - stem, 12);
  const gongmang = [mod(xun + 10, 12), mod(xun + 11, 12)];
  const [animal, season, scene, nature] = BRANCH_TEXT[branch];
  const image = DAY_MASTER_IMAGE[stem];
  const title = `${j.ko}일주(${j.hanja}日柱) 성격과 특징 · 인설명리`;
  const desc = `${j.ko}일주(${j.hanja})는 ${STEM_NAME[stem]}이 ${BRANCH_NAME(branch)} 위에 앉은 일주예요. 성격, 연애와 배우자 자리, 적성, 지장간과 12운성(${ph}), 납음(${nayinKo})을 쉬운 말로 풀었어요.`;

  const hidden = HIDDEN_STEMS[branch]
    .map((h) => {
      const tg = tenGod(stem, h);
      const meaning = SIPSIN.find(([n]) => n === tg)![3];
      return `<li><b class="hanja">${el(STEM_ELEMENT[h], STEMS_HANJA[h])}</b> ${STEMS_KO[h]}${ELEMENTS_KO[STEM_ELEMENT[h]]} · <b>${tg}</b> — ${first(meaning)}</li>`;
    })
    .join('\n        ');

  const sameStem = ALL.filter((x) => x.stem === stem && x.idx !== j.idx);
  const prev = ALL[mod(j.idx - 1, 60)];
  const next = ALL[mod(j.idx + 1, 60)];

  const body = `    <p class="small"><a href="/ilju/">60일주 풀이</a></p>
    <h1>${j.ko}일주 <span class="hanja">${j.hanja}</span></h1>
    <p>${j.ko}일주는 천간 <b class="hanja">${el(STEM_ELEMENT[stem], STEMS_HANJA[stem])}</b>(${STEM_NAME[stem]})${pick(STEMS_KO[stem], '과', '와')} 지지 <b class="hanja">${el(BRANCH_ELEMENT[branch], BRANCHES_HANJA[branch])}</b>(${BRANCH_NAME(branch)}, ${animal}띠)${pick(BRANCHES_KO[branch], '이', '가')} 만난 일주예요. ${josa(image, '이', '가')} ${josa(scene, '을', '를')} 만난 모습이에요. 사주에서 태어난 날의 기둥인 일주는 ‘나 자신’과 ‘배우자 자리’를 함께 보여 줘요.</p>

    <section class="card term-card">
      <h2>한눈에 보기</h2>
      <div class="summary-grid">
        <div class="item"><div class="k">일간</div><div class="v"><span class="hanja">${el(STEM_ELEMENT[stem], STEMS_HANJA[stem])}</span> ${yy(stem)}의 ${ELEMENTS_KO[STEM_ELEMENT[stem]]}(${ELEMENTS_HANJA[STEM_ELEMENT[stem]]})</div></div>
        <div class="item"><div class="k">일지</div><div class="v"><span class="hanja">${el(BRANCH_ELEMENT[branch], BRANCHES_HANJA[branch])}</span> ${yy(branch)}의 ${ELEMENTS_KO[BRANCH_ELEMENT[branch]]} · ${animal}</div></div>
        <div class="item"><div class="k">일지 십신</div><div class="v">${branchTg}</div></div>
        <div class="item"><div class="k">12운성</div><div class="v">${ph}</div></div>
        <div class="item"><div class="k">납음</div><div class="v"><span class="hanja">${nayinHanja}</span> ${nayinKo}</div></div>
        <div class="item"><div class="k">공망</div><div class="v"><span class="hanja">${gongmang.map((b) => BRANCHES_HANJA[b]).join('')}</span> ${gongmang.map((b) => BRANCHES_KO[b]).join('·')}</div></div>
      </div>
    </section>

    <h2>일주의 모습</h2>
    <p>${STEM_BRANCH_RELATION[group]} ${BRANCHES_KO[branch]}(${BRANCHES_HANJA[branch]})${pick(BRANCHES_KO[branch], '은', '는')} 계절과 때로는 ${season}에 해당해요. ${nature}</p>

    <h2>성격</h2>
    <p>${DAY_MASTER_PERSONALITY[stem]}</p>
    <p>일간 ${STEMS_HANJA[stem]}에게 일지 ${BRANCHES_HANJA[branch]}${pick(BRANCHES_KO[branch], '은', '는')} 12운성으로 ‘${ph}’의 자리예요. ${phText}</p>

    <div data-ad="guideMid"></div>

    <h2>연애와 배우자 자리</h2>
    <p>일주의 지지는 배우자 자리라고 불러요. ${SPOUSE_PALACE[branchTg]}</p>

    <h2>적성</h2>
    <p>일지에 놓인 ${branchTg}의 기운으로 보면, ${GROUP_APTITUDE[group]}</p>

    <h2>지장간: 일지에 숨은 글자</h2>
    <p>${BRANCHES_HANJA[branch]} 안에는 천간 ${HIDDEN_STEMS[branch].length}개가 숨어 있어요. 마지막 글자가 가장 힘이 센 본기예요.</p>
    <ul>
        ${hidden}
    </ul>

${BLOG_POST[j.slug] ? `    <p class="notice"><b>더 자세히 읽기</b> · <a href="/${BLOG_POST[j.slug]}">${j.ko}일주 성격·직업·연애 자세한 풀이</a></p>\n` : ''}    <p class="notice">일주는 사주 여덟 글자 가운데 한 기둥이에요. 같은 ${j.ko}일주라도 태어난 달과 시간, 대운에 따라 풀이가 달라져요.</p>
    <div class="card" style="margin-top:16px"><p><b>내 사주 전체가 궁금하다면</b> 생년월일시를 넣고 원국, 대운, 자미두수 명반까지 무료로 확인해 보세요.</p><p style="margin-top:10px"><a class="btn" href="/">만세력 보기</a></p></div>

    <h2>같은 ${STEMS_HANJA[stem]} 일간의 다른 일주</h2>
    <p>${sameStem.map((x) => `<a href="/ilju/${x.slug}.html">${x.ko}일주</a>`).join(' · ')}</p>
    <p class="small"><a href="/ilju/${prev.slug}.html">← ${prev.ko}일주</a> · <a href="/ilju/${next.slug}.html">${next.ko}일주 →</a></p>

    <div data-ad="guideEnd"></div>
    <p class="disclaimer">타고난 성향을 풀이한 참고용 내용이며, 특정 사건을 예측하거나 보장하지 않아요.</p>
`;
  return head(`/ilju/${j.slug}.html`, title, desc) + body + tail;
}

function index() {
  const groups = STEMS_HANJA.map((h, s) => {
    const items = ALL.filter((x) => x.stem === s)
      .map((x) => `<a href="/ilju/${x.slug}.html"><div class="card"><b class="hanja">${el(STEM_ELEMENT[s], x.hanja[0])}${el(BRANCH_ELEMENT[x.branch], x.hanja[1])}</b> ${x.ko}일주</div></a>`)
      .join('\n        ');
    return `    <h2><span class="hanja">${el(STEM_ELEMENT[s], h)}</span> ${STEM_NAME[s]} 일간 · ${DAY_MASTER_IMAGE[s]}</h2>
    <div class="guide-grid ilju-grid">
        ${items}
    </div>`;
  }).join('\n');
  const body = `    <h1>60일주 풀이</h1>
    <p>일주는 태어난 날의 천간과 지지로, 사주에서 ‘나 자신’을 가장 잘 보여 주는 기둥이에요. 갑자부터 계해까지 60가지 일주의 성격, 연애와 배우자 자리, 적성, 지장간을 쉬운 말로 정리했어요.</p>
    <p class="notice">내 일주를 모르신다면 <a href="/">만세력 보기</a>에서 생년월일을 넣으면 바로 알 수 있어요.</p>
${groups}
    <div data-ad="guideEnd"></div>
`;
  return head('/ilju/', '60일주 풀이 · 갑자일주부터 계해일주까지 · 인설명리', '갑자일주부터 계해일주까지 60가지 일주의 성격, 연애와 배우자 자리, 적성, 지장간, 12운성, 납음을 쉬운 말로 풀었어요.', 'website') + body + tail;
}

mkdirSync('ilju', { recursive: true });
for (const j of ALL) writeFileSync(`ilju/${j.slug}.html`, page(j));
writeFileSync('ilju/index.html', index());

// 사이트맵: 고정 페이지 + 공부 글 + 일주
const fixed = ['/', '/today.html', '/about.html', '/privacy.html', '/terms.html', '/contact.html', '/licenses.html', '/en/', '/en/about.html', '/en/privacy.html', '/en/terms.html', '/2027/', '/en/2027/', '/android/'];
const guide = readdirSync('guide').filter((f) => f.endsWith('.html')).map((f) => (f === 'index.html' ? '/guide/' : `/guide/${f}`));
const ilju = ['/ilju/', ...ALL.map((j) => `/ilju/${j.slug}.html`)];
const urls = [...fixed, ...guide, ...ilju];
writeFileSync(
  'public/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${SITE}${u}</loc><lastmod>${TODAY}</lastmod></url>`).join('\n')}\n</urlset>\n`,
);
console.log('ilju pages:', ALL.length + 1, '· sitemap urls:', urls.length);

// 블로그 글 페이지(blog/*.html)와 목록(blog/index.html)을 만듭니다. 원본: content/blog/*.json
// 빌드가 끝나면 scripts/flatten-blog.ts가 blog/{id}.html을 사이트 맨 위(/{id})로 옮겨,
// 티스토리 때와 같은 주소(inseol.com/196)를 유지합니다.
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';

/** 글의 최종 주소 (티스토리에서 옮겨 온 주소를 그대로 씁니다) */
const SITE = 'https://inseol.com';
/** 이미지·공유 이미지 주소 (지금도, 주소 전환 뒤에도 열리는 곳) */
const ASSET = 'https://app.inseol.com';
/**
 * inseol.com 연결을 티스토리에서 이 사이트로 바꾸기 전까지는 false로 둡니다.
 * false면 검색엔진에 노출하지 않습니다(noindex). 티스토리 원본과 중복으로 잡히지 않게 하려는 것입니다.
 */
const LIVE = false;

interface Img { alt: string; w: number | null; h: number | null }
interface Post {
  id: number;
  title: string;
  description: string;
  tags: string[];
  category: string[];
  published: string;
  modified: string;
  edited?: string;
  ilju?: { slug: string; order: number; ko: string };
  images: Img[];
  html: string;
}

const CATEGORY: Record<string, { key: string; label: string; intro: string }> = {
  일주론: { key: 'ilju', label: '일주론', intro: '태어난 날의 기둥, 일주로 보는 나의 성격·직업·연애. 갑자일주부터 계해일주까지 60일주를 정리했습니다.' },
  격국: { key: 'geukguk', label: '격국', intro: '사주의 뼈대인 격국으로 보는 사회적 적성과 나의 무기. 팔정격부터 외격(종격)까지 정리했습니다.' },
};

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const date = (iso: string) => iso.slice(0, 10).replace(/-/g, '.');
const catOf = (p: Post) => CATEGORY[p.category[p.category.length - 1]];

const dir = 'content/blog';
const posts: Post[] = existsSync(dir)
  ? readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')) as Post)
  : [];
/** 일주 글은 60갑자 순서, 나머지는 글 번호 순서. 일주론 소개 글처럼 일주가 없는 글이 맨 앞에 옵니다. */
const sortKey = (p: Post) => (p.ilju ? p.ilju.order : p.id - 10000);
const byCat = (key: string) => posts.filter((p) => catOf(p)?.key === key).sort((a, b) => sortKey(a) - sortKey(b));

const head = (opt: { path: string; title: string; desc: string; type: string; image: string; ld?: object }) => `<!doctype html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(opt.title)}</title>
  <meta name="description" content="${esc(opt.desc)}">
${LIVE ? '' : '  <meta name="robots" content="noindex, follow">\n'}  <link rel="canonical" href="${SITE}${opt.path}">
  <meta property="og:type" content="${opt.type}">
  <meta property="og:site_name" content="인생설계 · 인설명리">
  <meta property="og:title" content="${esc(opt.title)}">
  <meta property="og:description" content="${esc(opt.desc)}">
  <meta property="og:url" content="${SITE}${opt.path}">
  <meta property="og:image" content="${opt.image}">
  <meta property="og:locale" content="ko_KR">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@500;700;900&display=swap" rel="stylesheet">
${opt.ld ? `  <script type="application/ld+json">${JSON.stringify(opt.ld)}</script>\n` : ''}</head>
<body>
  <div id="shell-top"></div>
  <main class="article blog">
`;
const tail = `  </main>
  <div id="shell-bottom"></div>
  <script type="module" src="/src/page.ts"></script>
</body>
</html>
`;

/** 본문: 이미지 자리표시를 실제 이미지로, 표는 가로 스크롤 상자로, 두 번째 소제목 앞에 광고 자리 */
function renderBody(p: Post) {
  let html = p.html.replace(/<figure data-img="(\d+)"><\/figure>/g, (_m, n: string) => {
    const i = Number(n);
    const img = p.images[i - 1];
    if (!img) return '';
    const size = img.w && img.h ? ` width="${img.w}" height="${img.h}"` : '';
    const alt = esc(img.alt || `${p.title} 이미지 ${i}`);
    return `<figure><img src="/blog-img/${p.id}-${i}.webp" alt="${alt}"${size}${i === 1 ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async"></figure>`;
  });
  html = html.replace(/<table>/g, '<div class="table-scroll"><table class="post-table">').replace(/<\/table>/g, '</table></div>');
  let h2 = 0;
  html = html.replace(/<h2>/g, (m) => (++h2 === 3 ? `<div data-ad="guideMid"></div>\n${m}` : m));
  return html;
}

function related(p: Post) {
  const cat = catOf(p);
  const list = byCat(cat.key);
  const idx = list.findIndex((x) => x.id === p.id);
  const prev = list[idx - 1];
  const next = list[idx + 1];
  let others: Post[];
  if (p.ilju) {
    // 같은 일간(천간)의 다른 일주 + 앞뒤 일주
    const stem = p.ilju.ko[0];
    others = list.filter((x) => x.id !== p.id && x.ilju && x.ilju.ko[0] === stem);
  } else {
    others = list.filter((x) => x.id !== p.id).slice(0, 12);
  }
  const items = others.map((x) => `<li><a href="/${x.id}">${esc(x.title)}</a></li>`).join('\n      ');
  const nav = [prev ? `<a href="/${prev.id}">← ${esc(prev.ilju ? `${prev.ilju.ko}일주` : prev.title.split(' - ')[0])}</a>` : '', next ? `<a href="/${next.id}">${esc(next.ilju ? `${next.ilju.ko}일주` : next.title.split(' - ')[0])} →</a>` : '']
    .filter(Boolean)
    .join(' · ');
  return `    <section class="post-related">
      <h2>${p.ilju ? `같은 ${p.ilju.ko[0]} 일간의 다른 일주` : `${cat.label} 다른 글`}</h2>
      <ul>
      ${items}
      </ul>
      <p class="small">${nav}</p>
      <p class="small"><a href="/blog/#${cat.key}">${cat.label} 글 전체 보기</a></p>
    </section>
`;
}

function page(p: Post) {
  const cat = catOf(p);
  const image = p.images.length ? `${ASSET}/blog-img/${p.id}-1.webp` : `${ASSET}/og.png`;
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: p.title,
    description: p.description,
    image,
    datePublished: p.published,
    dateModified: p.edited ?? p.modified,
    author: { '@type': 'Person', name: '나이더' },
    publisher: { '@type': 'Organization', name: '인생설계 · 인설명리' },
    mainEntityOfPage: `${SITE}/${p.id}`,
    keywords: p.tags.join(', '),
  };
  const ilju = p.ilju
    ? `    <p class="notice">한눈에 보는 요약 카드: <a href="/ilju/${p.ilju.slug}.html">${p.ilju.ko}일주 요약 보기</a></p>\n`
    : '';
  const body = `    <nav class="crumbs small" aria-label="위치"><a href="/blog/">블로그</a> › <a href="/blog/#${cat.key}">${cat.label}</a></nav>
    <h1>${esc(p.title)}</h1>
    <p class="post-meta small">나이더 · ${date(p.published)} 작성${p.edited ? ` · ${date(p.edited)} 고침` : ''}</p>
    <article class="post">
${renderBody(p)}
    </article>
    <p class="post-tags small">${p.tags.map((t) => `#${esc(t)}`).join(' ')}</p>
${ilju}    <div class="card cta"><p><b>${p.ilju ? `내 일주가 ${p.ilju.ko}일주인지 궁금하다면` : '내 사주의 격국이 궁금하다면'}</b> 생년월일시를 넣으면 사주 원국, 대운, 자미두수 명반과 쉬운 말 풀이를 무료로 볼 수 있습니다.</p><p style="margin-top:10px"><a class="btn" href="/">무료 만세력 보기</a></p></div>
${related(p)}    <div data-ad="guideEnd"></div>
    <p class="disclaimer">타고난 성향을 풀이한 참고용 내용이며, 특정 사건을 예측하거나 보장하지 않습니다.</p>
`;
  return head({ path: `/${p.id}`, title: p.title, desc: p.description, type: 'article', image, ld }) + body + tail;
}

function index() {
  const sections = Object.values(CATEGORY)
    .map((c) => {
      const list = byCat(c.key);
      if (!list.length) return '';
      const items = list.map((p) => `<li><a href="/${p.id}">${esc(p.title)}</a> <span class="small">${date(p.published)}</span></li>`).join('\n        ');
      return `    <section id="${c.key}">
      <h2>${c.label} <span class="small">${list.length}편</span></h2>
      <p>${c.intro}</p>
      <ul class="post-list">
        ${items}
      </ul>
    </section>`;
    })
    .join('\n');
  const body = `    <h1>인생설계 블로그</h1>
    <p>사주명리학과 자미두수를 일상의 언어로 풀어 쓰는 블로그입니다. 내 사주를 직접 보고 싶다면 <a href="/">무료 만세력</a>에서 생년월일시를 넣어 보세요.</p>
${sections}
    <div data-ad="guideEnd"></div>
`;
  return head({ path: '/blog/', title: '인생설계 블로그 · 일주론 · 격국', desc: '사주명리학 일주론 60일주와 격국(팔정격·외격)을 쉬운 말로 정리한 인생설계 블로그 글 모음입니다.', type: 'website', image: `${ASSET}/og.png` }) + body + tail;
}

rmSync('blog', { recursive: true, force: true });
mkdirSync('blog', { recursive: true });
for (const p of posts) writeFileSync(`blog/${p.id}.html`, page(p));
writeFileSync('blog/index.html', index());
console.log('blog pages:', posts.length, LIVE ? '(공개)' : '(검색 비노출 상태)');

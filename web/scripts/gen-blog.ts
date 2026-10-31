// 블로그를 만듭니다: 글 페이지(blog/{글번호}.html), 뉴스형 목록(blog/index.html, blog/page-2.html …),
// 분류별 목록(blog/{분류}.html, blog/{분류}-2.html …).
// 원고: content/blog/{글번호}.json · 분류 나무와 주소 넘기기: content/blog/site.json
// 빌드가 끝나면 scripts/flatten-blog.ts가 blog/{글번호}.html을 사이트 맨 위(/{글번호})로 옮겨,
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
/** 목록 한 페이지에 보여 줄 글 수 */
const PER_PAGE = 20;

interface Img { alt: string; w: number | null; h: number | null }
interface Post {
  id: number;
  title: string;
  description: string;
  tags: string[];
  published: string;
  modified: string;
  edited?: string;
  ilju?: { slug: string; order: number; ko: string };
  images: Img[];
  html: string;
}
/** 분류 나무의 한 칸. parent가 없으면 맨 위 분류(이론공부, 인설생각) */
interface Category { key: string; label: string; intro: string; cta: string; parent?: string }
interface SiteConfig {
  categories: Category[];
  /** 맨 아래 분류 key → 글 번호 목록 */
  assign: Record<string, number[]>;
  /** 합쳐진 글 번호 → 넘겨 줄 글 번호(또는 경로) */
  redirects: Record<string, number | string>;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const date = (iso: string) => iso.slice(0, 10).replace(/-/g, '.');

// ---------------------------------------------------------------- 원고와 분류 나무
const dir = 'content/blog';
const posts: Post[] = existsSync(dir)
  ? readdirSync(dir).filter((f) => /^\d+\.json$/.test(f)).map((f) => JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')) as Post)
  : [];
const config: SiteConfig = existsSync(`${dir}/site.json`)
  ? JSON.parse(readFileSync(`${dir}/site.json`, 'utf8'))
  : { categories: [], assign: {}, redirects: {} };

const cats = new Map(config.categories.map((c) => [c.key, c]));
const roots = config.categories.filter((c) => !c.parent);
const childrenOf = (key: string) => config.categories.filter((c) => c.parent === key);
/** 맨 위부터 이 분류까지의 줄 */
const chain = (key: string): Category[] => {
  const out: Category[] = [];
  for (let c = cats.get(key); c; c = c.parent ? cats.get(c.parent) : undefined) out.unshift(c);
  return out;
};
const leafOf = new Map<number, Category>();
for (const [key, ids] of Object.entries(config.assign)) for (const id of ids) leafOf.set(id, cats.get(key)!);
const unassigned = posts.filter((p) => !leafOf.has(p.id)).map((p) => p.id);
if (unassigned.length) throw new Error(`분류가 정해지지 않은 글: ${unassigned.join(', ')} (content/blog/site.json의 assign에 넣어 주세요)`);
const leaf = (p: Post) => leafOf.get(p.id)!;

/** 최신 글이 먼저. 일주 분류 안에서만 60갑자 순서 */
const newestFirst = (a: Post, b: Post) => b.published.localeCompare(a.published) || b.id - a.id;
const postsUnder = (key: string): Post[] => {
  const list = posts.filter((p) => chain(leaf(p).key).some((c) => c.key === key));
  if (key === 'ilju') return list.sort((a, b) => (a.ilju?.order ?? -1) - (b.ilju?.order ?? -1) || a.id - b.id);
  return list.sort(newestFirst);
};
const allPosts = [...posts].sort(newestFirst);

// ---------------------------------------------------------------- 공통 틀
const head = (opt: { path: string; title: string; desc: string; type: string; image: string; ld?: object; prev?: string; next?: string }) => `<!doctype html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(opt.title)}</title>
  <meta name="description" content="${esc(opt.desc)}">
${LIVE ? '' : '  <meta name="robots" content="noindex, follow">\n'}  <link rel="canonical" href="${SITE}${opt.path}">
${opt.prev ? `  <link rel="prev" href="${SITE}${opt.prev}">\n` : ''}${opt.next ? `  <link rel="next" href="${SITE}${opt.next}">\n` : ''}  <meta property="og:type" content="${opt.type}">
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
<body data-section="blog">
  <div id="shell-top"></div>
  <main class="article blog">
`;
const tail = `  </main>
  <div id="shell-bottom"></div>
  <script type="module" src="/src/page.ts"></script>
</body>
</html>
`;

/** 분류 목록 주소 (전체는 /blog/) */
const listPath = (key: string | null, page = 1) => {
  const base = key ? `/blog/${key}` : '/blog/';
  if (page === 1) return base;
  return key ? `${base}-${page}` : `/blog/page-${page}`;
};

/** 분류 메뉴: 전체 / 이론공부 / 인설생각, 고른 분류 아래로 한 단씩 펼침 */
function catNav(activeKey: string | null) {
  const active = activeKey ? chain(activeKey).map((c) => c.key) : [];
  const link = (key: string | null, label: string, on: boolean, count: number) =>
    `<a href="${listPath(key)}"${on ? ' aria-current="page"' : ''}>${esc(label)} <span>${count}</span></a>`;
  const rows = [
    `<div class="cat-row cat-top">${link(null, '전체', !activeKey, posts.length)}${roots.map((c) => link(c.key, c.label, active[0] === c.key, postsUnder(c.key).length)).join('')}</div>`,
  ];
  for (const key of active) {
    const kids = childrenOf(key);
    if (kids.length) rows.push(`<div class="cat-row">${kids.map((c) => link(c.key, c.label, active.includes(c.key), postsUnder(c.key).length)).join('')}</div>`);
  }
  return `    <nav class="cat-nav" aria-label="블로그 분류">\n      ${rows.join('\n      ')}\n    </nav>\n`;
}

/** 뉴스형 글 카드 */
function card(p: Post, featured = false) {
  const c = leaf(p);
  const img = p.images[0];
  const thumb = img
    ? `<img class="thumb" src="/blog-img/${p.id}-1.webp" alt=""${img.w && img.h ? ` width="${img.w}" height="${img.h}"` : ''} loading="${featured ? 'eager' : 'lazy'}" decoding="async">`
    : `<div class="thumb thumb-empty" aria-hidden="true"><span>${esc(c.label)}</span></div>`;
  return `<article class="news-card${featured ? ' featured' : ''}">
        <a href="/${p.id}">
          ${thumb}
          <div class="news-body">
            <span class="news-cat">${esc(chain(c.key).map((x) => x.label).join(' · '))}</span>
            <h${featured ? 2 : 3} class="news-title">${esc(p.title)}</h${featured ? 2 : 3}>
            <p class="news-excerpt">${esc(p.description)}</p>
            <time datetime="${p.published.slice(0, 10)}">${date(p.published)}</time>
          </div>
        </a>
      </article>`;
}

function pager(key: string | null, page: number, pages: number) {
  if (pages <= 1) return '';
  const nums = Array.from({ length: pages }, (_, i) => i + 1)
    .map((n) => (n === page ? `<span aria-current="page">${n}</span>` : `<a href="${listPath(key, n)}">${n}</a>`))
    .join('');
  return `    <nav class="pager" aria-label="페이지">
      ${page > 1 ? `<a href="${listPath(key, page - 1)}">← 이전</a>` : ''}${nums}${page < pages ? `<a href="${listPath(key, page + 1)}">다음 →</a>` : ''}
    </nav>
`;
}

/** 목록 페이지들 (전체 또는 한 분류) */
function listPages(key: string | null) {
  const c = key ? cats.get(key)! : null;
  const list = key ? postsUnder(key) : allPosts;
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const out: { file: string; html: string }[] = [];
  for (let page = 1; page <= pages; page++) {
    const items = list.slice((page - 1) * PER_PAGE, page * PER_PAGE);
    const featured = !key && page === 1 ? items.shift() : undefined;
    const title = c ? `${chain(c.key).map((x) => x.label).join(' › ')}${page > 1 ? ` (${page}쪽)` : ''} · 인생설계 블로그` : `인생설계 블로그${page > 1 ? ` (${page}쪽)` : ''} · 사주명리학 · 자미두수`;
    const desc = c ? c.intro : '사주명리학과 자미두수 이론 공부, 그리고 명리학을 일과 삶에 적용한 인설의 생각을 쉬운 말로 씁니다.';
    const body = `    <header class="blog-head">
      <h1>${c ? esc(c.label) : '인생설계 블로그'}</h1>
      <p>${esc(desc)}</p>
    </header>
${catNav(key)}${featured ? `    <div class="news-featured">\n      ${card(featured, true)}\n    </div>\n` : ''}    <div class="news-list">
      ${items.map((p) => card(p)).join('\n      ')}
    </div>
${pager(key, page, pages)}    <div data-ad="guideEnd"></div>
`;
    const path = listPath(key, page);
    const file = key ? `${key}${page > 1 ? `-${page}` : ''}` : page > 1 ? `page-${page}` : 'index';
    out.push({
      file,
      html: head({ path, title, desc, type: 'website', image: `${ASSET}/og.png`, prev: page > 1 ? listPath(key, page - 1) : undefined, next: page < pages ? listPath(key, page + 1) : undefined }) + body + tail,
    });
  }
  return out;
}

// ---------------------------------------------------------------- 글 페이지
/** 본문: 이미지 자리표시를 실제 이미지로, 표는 가로 스크롤 상자로, 세 번째 소제목 앞에 광고 자리 */
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
  const c = leaf(p);
  let others: Post[];
  let heading: string;
  if (p.ilju) {
    const stem = p.ilju.ko[0];
    others = postsUnder('ilju').filter((x) => x.id !== p.id && x.ilju && x.ilju.ko[0] === stem);
    heading = `같은 ${stem} 일간의 다른 일주`;
  } else {
    const list = postsUnder(c.key);
    const idx = list.findIndex((x) => x.id === p.id);
    const from = Math.max(0, Math.min(idx - 3, list.length - 7));
    others = list.slice(from, from + 7).filter((x) => x.id !== p.id).slice(0, 6);
    heading = `${c.label}의 다른 글`;
  }
  return `    <section class="post-related">
      <h2>${heading}</h2>
      <div class="news-list compact">
      ${others.map((x) => card(x)).join('\n      ')}
      </div>
      <p class="small"><a href="${listPath(c.key)}">${esc(c.label)} 글 전체 보기 (${postsUnder(c.key).length}편)</a> · <a href="/blog/">블로그 처음으로</a></p>
    </section>
`;
}

function page(p: Post) {
  const c = leaf(p);
  const path = chain(c.key);
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
    articleSection: path.map((x) => x.label).join(' > '),
    keywords: p.tags.join(', '),
  };
  const ilju = p.ilju ? `    <p class="notice">한눈에 보는 요약 카드: <a href="/ilju/${p.ilju.slug}.html">${p.ilju.ko}일주 요약 보기</a></p>\n` : '';
  const cta = p.ilju ? `내 일주가 ${p.ilju.ko}일주인지 궁금하다면` : c.cta;
  const crumbs = [`<a href="/blog/">블로그</a>`, ...path.map((x) => `<a href="${listPath(x.key)}">${esc(x.label)}</a>`)].join(' › ');
  const body = `    <nav class="crumbs small" aria-label="위치">${crumbs}</nav>
    <h1>${esc(p.title)}</h1>
    <p class="post-meta small">나이더 · ${date(p.published)} 작성${p.edited ? ` · ${date(p.edited)} 고침` : ''}</p>
    <article class="post">
${renderBody(p)}
    </article>
    <p class="post-tags small">${p.tags.map((t) => `#${esc(t)}`).join(' ')}</p>
${ilju}    <div class="card cta"><p><b>${cta}</b> 생년월일시를 넣으면 사주 원국, 대운, 자미두수 명반과 쉬운 말 풀이를 무료로 볼 수 있습니다.</p><p style="margin-top:10px"><a class="btn" href="/">무료 만세력 보기</a></p></div>
${related(p)}    <div data-ad="guideEnd"></div>
    <p class="disclaimer">타고난 성향을 풀이한 참고용 내용이며, 특정 사건을 예측하거나 보장하지 않습니다.</p>
`;
  return head({ path: `/${p.id}`, title: p.title, desc: p.description, type: 'article', image, ld }) + body + tail;
}

// ---------------------------------------------------------------- 쓰기
rmSync('blog', { recursive: true, force: true });
mkdirSync('blog', { recursive: true });
for (const p of posts) writeFileSync(`blog/${p.id}.html`, page(p));
let lists = 0;
for (const key of [null, ...config.categories.map((c) => c.key)]) {
  for (const l of listPages(key)) {
    writeFileSync(`blog/${l.file}.html`, l.html);
    lists++;
  }
}
// 합쳐진 글의 주소 넘기기 목록 (flatten-blog.ts가 dist/_redirects에 씀)
const redirects = Object.entries(config.redirects).map(([from, to]) => `/${from} ${typeof to === 'number' ? `/${to}` : to} 301`);
writeFileSync('blog/redirects.txt', redirects.join('\n') + '\n');
console.log('blog posts:', posts.length, '· list pages:', lists, '· redirects:', redirects.length, LIVE ? '(공개)' : '(검색 비노출 상태)');

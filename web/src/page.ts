// 정적 글 페이지(소개·정책·공부 글) 공통: 머리말·꼬리말·테마
import './styles.css';
import { CONTACT_EMAIL, SEAL_SVG } from './ui/brand';
import { EN } from './i18n';
import { loadAdSense, mountStaticAds } from './ads';

// 블로그 글·목록이면 상단 메뉴의 Blog를 켭니다
const inBlog = document.body.dataset.section === 'blog';
const top = document.getElementById('shell-top');
if (top) {
  top.outerHTML = EN
    ? `<header class="topbar">
    <a class="brand" href="/en/" aria-label="Inseol Saju home">${SEAL_SVG}
      <span><span class="brand-title">Inseol Saju</span><br><span class="brand-sub">Korean Saju &amp; Zi Wei Dou Shu</span></span></a>
    <nav class="mainnav" aria-label="Main menu"><a href="/en/" aria-current="page">My free chart</a><a href="/" hreflang="ko" lang="ko">한국어</a></nav>
    <button type="button" class="theme-toggle" id="theme-toggle" aria-label="Change theme">☾</button>
  </header>`
    : `<header class="topbar">
    <a class="brand" href="/" aria-label="인설명리 처음으로">${SEAL_SVG}
      <span><span class="brand-title">인설명리</span><br><span class="brand-sub">사주팔자 &amp; 자미두수 명반</span></span></a>
    <nav class="mainnav" aria-label="주 메뉴"><a href="/"${inBlog ? '' : ' aria-current="page"'}>내 사주팔자·명반 보기<span class="nowrap">(웹앱)</span></a><a href="/blog/"${inBlog ? ' aria-current="page"' : ''}>Blog</a><a href="/en/" hreflang="en" lang="en" class="lang-link">EN</a></nav>
    <button type="button" class="theme-toggle" id="theme-toggle" aria-label="화면 테마 바꾸기">☾</button>
  </header>`;
}
const bottom = document.getElementById('shell-bottom');
if (bottom) {
  bottom.outerHTML = EN
    ? `<footer class="site">
    <nav aria-label="Site information">
      <a href="/en/2027/">2027 forecast</a><a href="/en/about.html">About</a><a href="/en/privacy.html">Privacy</a><a href="/en/terms.html">Terms</a><a href="mailto:${CONTACT_EMAIL}">Contact</a><a href="/" hreflang="ko" lang="ko">한국어</a>
    </nav>
    <p>Readings describe natural tendencies for reflection. They do not predict or guarantee specific events.</p>
    <p>© Inseol · v1.4</p>
  </footer>`
    : `<footer class="site">
    <nav aria-label="사이트 정보">
      <a href="/about.html">인설명리 소개</a><a href="/blog/">블로그</a><a href="/guide/">명리 공부 글</a><a href="/2027/">2027 신년운세</a><a href="/today.html">오늘의 일진</a><a href="/ilju/">60일주 풀이</a><a href="/terms.html">이용약관</a><a href="/privacy.html">개인정보처리방침</a>
      <a href="/contact.html">문의</a><a href="/licenses.html">오픈소스 라이선스</a><a href="/en/" hreflang="en" lang="en">English</a>
    </nav>
    <p>타고난 성향을 풀이한 참고용 내용이며, 특정 사건을 예측하거나 보장하지 않아요.</p>
    <p>© 인설 (인생설계) · v1.4</p>
  </footer>`;
  // 상단 메뉴가 모든 화면 폭에서 보이므로 정적 페이지에는 하단 메뉴를 두지 않습니다
  document.body.classList.add('no-bottomnav');
}

const btn = document.getElementById('theme-toggle');
const apply = (t: string | null) => {
  if (t) document.documentElement.dataset.theme = t;
  const dark = t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  if (btn) btn.textContent = dark ? '☀' : '☾';
};
let saved: string | null = null;
try { saved = localStorage.getItem('inseol.theme'); } catch { /* 무시 */ }
apply(saved);
btn?.addEventListener('click', () => {
  const dark = document.documentElement.dataset.theme ? document.documentElement.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  const next = dark ? 'light' : 'dark';
  try { localStorage.setItem('inseol.theme', next); } catch { /* 무시 */ }
  apply(next);
});

loadAdSense();
mountStaticAds();

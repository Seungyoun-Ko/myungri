// 정적 글 페이지(소개·정책·공부 글) 공통: 머리말·꼬리말·테마
import './styles.css';
import { SEAL_SVG } from './ui/brand';

const top = document.getElementById('shell-top');
if (top) {
  top.outerHTML = `<header class="topbar">
    <a class="brand" href="/" aria-label="인설명리 처음으로">${SEAL_SVG}
      <span><span class="brand-title">인설명리</span><br><span class="brand-sub">사주팔자 &amp; 자미두수 명반</span></span></a>
    <nav class="topnav" aria-label="주 메뉴"><a href="/#/">명반</a><a href="/#/calendar">달력</a><a href="/guide/">공부 글</a></nav>
    <button type="button" class="theme-toggle" id="theme-toggle" aria-label="화면 테마 바꾸기">☾</button>
  </header>`;
}
const bottom = document.getElementById('shell-bottom');
if (bottom) {
  bottom.outerHTML = `<footer class="site">
    <nav aria-label="사이트 정보">
      <a href="/about.html">인설명리 소개</a><a href="/guide/">명리 공부 글</a><a href="/privacy.html">개인정보처리방침</a>
      <a href="/contact.html">문의</a><a href="/licenses.html">오픈소스 라이선스</a>
    </nav>
    <p>타고난 성향을 풀이한 참고용 내용이며, 특정 사건을 예측하거나 보장하지 않아요.</p>
    <p>© 인설 (인생설계)</p>
  </footer>
  <nav class="bottomnav" aria-label="하단 메뉴">
    <a href="/#/">명반</a><a href="/#/calendar">달력</a><a href="/guide/">공부 글</a>
  </nav>`;
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

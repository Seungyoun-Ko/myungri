// Generates promo HTML sources for v1.4 into marketing/2026-10-v1.4/images/src
import { writeFileSync, readFileSync } from 'node:fs';
const SRC = '/home/user/myungri/marketing/2026-10-v1.4/images/src';
const WEB = '/home/user/myungri/web/src/engine/reading';

// ---- facts pulled verbatim from the engine ----
const grab = (f) => [...readFileSync(`${WEB}/${f}`, 'utf8').matchAll(/title: '([^']+)',\s*\n\s*keywords: \[([^\]]+)\]/g)].map((m) => ({ title: m[1], keywords: [...m[2].matchAll(/'([^']+)'/g)].map((k) => k[1]) }));
const DM = [...grab('day-master-a.ts'), ...grab('day-master-b.ts')];
if (DM.length !== 10) throw new Error('expected 10 day masters, got ' + DM.length);
const STEM = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
const STEM_H = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const BR = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
const ANIMAL = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];
const EMOJI = ['🐭', '🐮', '🐯', '🐰', '🐲', '🐍', '🐴', '🐑', '🐵', '🐔', '🐶', '🐷'];
const COLORS = [
  { ko: '푸른', el: '나무', bg: '#2D6A9F', fg: '#fff', line: '#2D6A9F' },
  { ko: '붉은', el: '불', bg: '#B8352A', fg: '#fff', line: '#B8352A' },
  { ko: '노란', el: '흙', bg: '#E0A82E', fg: '#1F1B18', line: '#E0A82E' },
  { ko: '흰', el: '쇠', bg: '#FFFFFF', fg: '#1F1B18', line: '#cfc6b9', border: '#d9d1c5' },
  { ko: '검은', el: '물', bg: '#1F1B18', fg: '#fff', line: '#1F1B18' },
];

const FONTS = `<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;800;900&family=Noto+Serif+KR:wght@700;900&family=Noto+Color+Emoji&display=swap" rel="stylesheet">`;
const BASE = `*{box-sizing:border-box;margin:0;padding:0}
body{overflow:hidden;background:#F7F4EE;color:#1F1B18;font-family:'Noto Sans KR',sans-serif;position:relative;word-break:keep-all}
.emo{font-family:'Noto Color Emoji',sans-serif;font-weight:400}
.bg{position:absolute;inset:0;background:radial-gradient(circle at 85% 12%,#f1e3d6 0,transparent 42%),radial-gradient(circle at 10% 95%,#efe6da 0,transparent 40%)}
.brand{position:absolute;display:flex;align-items:center;gap:14px}
.brand .seal{width:64px;height:64px}
.brand b{font-family:'Noto Serif KR',serif;font-weight:900;font-size:34px;letter-spacing:-0.02em}
.brand span{display:block;font-size:20px;color:#6b635b;margin-top:2px}
h1{font-family:'Noto Serif KR',serif;font-weight:900;letter-spacing:-0.03em;line-height:1.25}
h1 em,.red{font-style:normal;color:#B8352A}
.sub{color:#5b534c;line-height:1.55}
.chips{display:flex;flex-wrap:wrap;gap:10px}
.chips span{background:#fff;border:2px solid #e5dfd6;border-radius:999px;padding:8px 18px;font-weight:700;color:#4a120c}
.phone{position:absolute;background:#1F1B18;border-radius:56px;padding:16px;box-shadow:0 30px 60px rgba(60,30,10,.22)}
.phone .screen{width:100%;height:100%;border-radius:42px;overflow:hidden;background:#F7F4EE;padding:44px 14px 0}
.phone img{width:100%;display:block}
.page{position:absolute;font-weight:700;color:#a39a90}
.urlbar{position:absolute;left:0;right:0;bottom:0;text-align:center;font-weight:800;color:#B8352A;background:linear-gradient(to bottom,rgba(247,244,238,0) 0,#F7F4EE 40%)}
.btn{display:inline-block;background:#B8352A;color:#fff;font-weight:800;border-radius:999px;box-shadow:0 12px 30px rgba(184,53,42,.3)}
`;
const SEAL = `<svg class="seal" viewBox="0 0 64 64" aria-hidden="true"><rect x="2" y="2" width="60" height="60" rx="9" fill="#B8352A"/><rect x="6.5" y="6.5" width="51" height="51" rx="6" fill="none" stroke="#F5F0E6" stroke-width="1.6" opacity="0.85"/><text x="32" y="29" text-anchor="middle" font-family="'Noto Serif KR', serif" font-weight="800" font-size="17" fill="#F5F0E6">인설</text><text x="32" y="49" text-anchor="middle" font-family="'Noto Serif KR', serif" font-weight="800" font-size="17" fill="#F5F0E6">명리</text></svg>`;
const brand = (style, sub = '사주팔자 · 자미두수 명반') => `<div class="brand" style="${style}">${SEAL}<div><b>인설명리</b><span>${sub}</span></div></div>`;
const doc = (w, h, css, body, { dsf = 1, lang = 'ko' } = {}) => `<!doctype html><html lang="${lang}"><head><meta charset="utf-8">${FONTS}
<style>${BASE}body{width:${w}px;height:${h}px}
${css}</style></head><body data-dsf="${dsf}"><div class="bg"></div>${body}</body></html>`;
const phone = (style, img, imgStyle = '') => `<div class="phone" style="${style}"><div class="screen"><img src="${img}" style="${imgStyle}"></div></div>`;
const PRIVACY = `<span>가입 없이</span><span>무료</span><span>출생 정보는 내 폰 안에서만 계산</span>`;
const out = (name, html) => { writeFileSync(`${SRC}/${name}.html`, html); };

// ================= A. Kakao-like chat mock (390 wide @2x) =================
out('shot-kakao-mock', `<!doctype html><html lang="ko"><head><meta charset="utf-8">${FONTS}<style>
*{box-sizing:border-box;margin:0;padding:0}
body{width:390px;height:620px;overflow:hidden;background:#B9CCDD;font-family:'Noto Sans KR',sans-serif;color:#1F1B18;position:relative;word-break:keep-all}
.emo{font-family:'Noto Color Emoji',sans-serif}
.top{height:56px;display:flex;align-items:center;padding:0 14px;gap:10px;font-weight:700;font-size:17px;background:#B9CCDD}
.top .back{font-size:28px;font-weight:400;line-height:1;margin-top:-4px}
.top small{color:#5d6b78;font-weight:500;font-size:14px}
.day{margin:6px auto 14px;width:max-content;background:rgba(0,0,0,.12);color:#fff;font-size:12px;padding:4px 12px;border-radius:999px}
.row{display:flex;gap:6px;padding:0 12px;margin-bottom:10px;align-items:flex-end}
.row.me{justify-content:flex-end}
.time{font-size:10.5px;color:#4b5864;white-space:nowrap}
.yb{background:#FEE34A;padding:9px 12px;border-radius:14px;font-size:14.5px;max-width:240px;line-height:1.45}
.wb{background:#fff;padding:9px 12px;border-radius:14px;font-size:14.5px;max-width:240px;line-height:1.45}
.av{width:38px;height:38px;border-radius:14px;background:#e6d9c8;display:flex;align-items:center;justify-content:center;font-size:22px;flex:none;align-self:flex-start}
.who{font-size:12.5px;color:#3d4954;margin-bottom:4px}
.card{width:270px;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,.06)}
.card img{width:100%;display:block;aspect-ratio:1200/630;object-fit:cover}
.card .t{padding:12px 14px 4px;font-weight:700;font-size:15px;line-height:1.4}
.card .d{padding:0 14px 12px;font-size:13px;color:#6b6b6b;line-height:1.5}
.card .bt{display:flex;gap:6px;padding:0 10px 10px}
.card .bt span{flex:1;text-align:center;background:#f2f2f2;border-radius:8px;padding:9px 0;font-size:12.5px;font-weight:600;white-space:nowrap}
.input{position:absolute;left:0;right:0;bottom:0;height:58px;background:#fff;display:flex;align-items:center;gap:10px;padding:0 12px}
.input div{flex:1;height:36px;border-radius:18px;background:#f3f3f3}
.input b{width:36px;height:36px;border-radius:50%;background:#FEE34A}
</style></head><body data-dsf="2">
<div class="top"><span class="back">‹</span><span>대학 동기들</span><small>4</small></div>
<div class="day">2026년 10월 24일 토요일</div>
<div class="row me"><span class="time">오후 8:12</span><div class="yb">나 흰 용이래 ㅋㅋ 너희는?</div></div>
<div class="row me"><span class="time">오후 8:12</span><div class="card"><img src="assets/og.png"><div class="t"><span class="emo">🐲</span> 나는 '흰 용' · 경진일주</div><div class="d">대장간의 무쇠처럼, 두드릴수록 쓸모 있는 칼이 되는 사람 (MBTI로 치면 ISTP)</div><div class="bt"><span>나도 내 사주 보기</span><span>우리 궁합 보기</span></div></div></div>
<div class="row"><div class="av"><span class="emo">🙂</span></div><div><div class="who">수빈</div><div style="display:flex;gap:6px;align-items:flex-end"><div class="wb">오 나도 해 볼래! 우리 궁합도 보자</div><span class="time">오후 8:13</span></div></div></div>
<div class="input"><div></div><b></b></div>
</body></html>`);

// ================= B. 60가지 일주 타입 carousel (1080x1350) =================
const N_TYPES = 7;
const pill = (c, txt, size) => `<span style="display:inline-block;background:${c.bg};color:${c.fg};${c.border ? `border:3px solid ${c.border};` : ''}border-radius:18px;padding:0 22px;font-size:${size}px;line-height:1.35">${txt}</span>`;

out('ig-types-01-cover', doc(1080, 1350, `
.formula{position:absolute;left:64px;top:560px;width:952px;background:#fff;border:2px solid #e8e1d6;border-radius:32px;padding:34px 36px}
.formula h3{font-size:24px;color:#6b635b;font-weight:700;margin-bottom:18px}
.sw{display:flex;gap:14px}
.sw div{flex:1;text-align:center}
.sw i{display:block;width:84px;height:84px;margin:0 auto 10px;border-radius:50%}
.sw b{font-size:28px;font-weight:800}
.sw small{display:block;font-size:20px;color:#8a8178;font-weight:600}
.x{text-align:center;font-size:40px;color:#B8352A;font-weight:900;margin:12px 0 4px}
.an{display:grid;grid-template-columns:repeat(12,1fr);text-align:center}
.an span{font-size:52px;line-height:1.2}
.an small{display:block;font-size:17px;color:#6b635b;font-weight:700}
.ex{position:absolute;left:64px;top:1032px;width:952px;display:flex;gap:28px;align-items:center;background:#1F1B18;color:#F7F4EE;border-radius:32px;padding:30px 36px}
.ex .e{font-size:96px;line-height:1}
.ex small{font-size:22px;color:#cbbfb0;font-weight:700}
.ex b{display:block;font-family:'Noto Serif KR',serif;font-size:42px;font-weight:900;margin:2px 0 6px}
.ex p{font-size:24px;line-height:1.45;color:#e9e1d6}
.next{position:absolute;right:64px;bottom:44px;font-size:26px;font-weight:800;color:#B8352A}
.url{position:absolute;left:64px;bottom:44px;font-size:26px;font-weight:800;color:#6b635b}
`, `${brand('left:64px;top:58px')}<div class="page" style="right:64px;top:74px;font-size:24px">1 / ${N_TYPES}</div>
<h1 style="position:absolute;left:64px;top:170px;font-size:96px">너는 무슨 <em>색</em>,<br>무슨 <em>동물</em>?</h1>
<p class="sub" style="position:absolute;left:64px;top:438px;font-size:32px">태어난 날(일주)의 기운으로 정해지는<br>나만의 타입 — <b style="color:#1F1B18">60가지 중 하나</b>예요.</p>
<div class="formula"><h3>타고난 날의 색 (5가지)</h3><div class="sw">${COLORS.map((c) => `<div><i style="background:${c.bg};${c.border ? `border:3px solid ${c.border}` : ''}"></i><b>${c.ko}</b><small>${c.el} 기운</small></div>`).join('')}</div>
<div class="x">×</div><div class="an">${ANIMAL.map((a, i) => `<div><span class="emo">${EMOJI[i]}</span><small>${a}</small></div>`).join('')}</div></div>
<div class="ex"><div class="e emo">🐲</div><div><small>예) 경진일에 태어났다면</small><b>흰 용</b><p>${DM[6].title}</p></div></div>
<div class="url">app.inseol.com</div><div class="next">넘겨서 색깔별로 보기 →</div>`));

COLORS.forEach((c, ci) => {
  const stems = [ci * 2, ci * 2 + 1];
  const block = (s) => {
    const brs = s % 2 === 0 ? [0, 2, 4, 6, 8, 10] : [1, 3, 5, 7, 9, 11];
    const d = DM[s];
    return `<div class="blk"><div class="hd"><div class="stem" style="background:${c.bg};color:${c.fg};${c.border ? `border:3px solid ${c.border}` : ''}"><b>${STEM_H[s]}</b><small>${STEM[s]}</small></div>
<div><div class="lab">${STEM[s]}(${STEM_H[s]})일에 태어났다면</div><p class="ttl">${d.title}</p></div></div>
<div class="chips kw">${d.keywords.map((k) => `<span>#${k}</span>`).join('')}</div>
<div class="tiles">${brs.map((b) => `<div><span class="emo">${EMOJI[b]}</span><b>${c.ko} ${ANIMAL[b]}</b><small>${STEM[s]}${BR[b]}일주</small></div>`).join('')}</div></div>`;
  };
  out(`ig-types-0${ci + 2}-${['blue', 'red', 'yellow', 'white', 'black'][ci]}`, doc(1080, 1350, `
.blk{position:absolute;left:64px;width:952px;height:440px;background:#fff;border:2px solid #e8e1d6;border-left:12px solid ${c.line};border-radius:28px;padding:30px 30px 0 30px}
.hd{display:flex;gap:24px;align-items:center;min-height:108px}
.stem{flex:none;width:104px;height:104px;border-radius:22px;display:flex;flex-direction:column;align-items:center;justify-content:center}
.stem b{font-family:'Noto Serif KR',serif;font-size:50px;line-height:1;font-weight:900}
.stem small{font-size:20px;font-weight:800;margin-top:4px;opacity:.85}
.lab{font-size:21px;color:#8a8178;font-weight:700;margin-bottom:4px}
.ttl{font-family:'Noto Serif KR',serif;font-weight:900;font-size:31px;line-height:1.38;letter-spacing:-0.02em;text-wrap:balance}
.kw{margin:20px 0 20px;font-size:21px}
.kw span{padding:5px 16px;background:#F7F4EE;border-color:#eadfd2}
.tiles{display:grid;grid-template-columns:repeat(6,1fr);gap:10px}
.tiles div{background:#F7F4EE;border-radius:18px;text-align:center;padding:16px 0 16px}
.tiles span{display:block;font-size:62px;line-height:1.15}
.tiles b{display:block;font-size:20px;font-weight:800;letter-spacing:-0.03em;white-space:nowrap;margin-top:4px}
.tiles small{display:block;font-size:17px;color:#8a8178;font-weight:600}
`, `${brand('left:64px;top:58px')}<div class="page" style="right:64px;top:74px;font-size:24px">${ci + 2} / ${N_TYPES}</div>
<h1 style="position:absolute;left:64px;top:162px;font-size:60px">${pill(c, c.ko, 58)} 타입 12가지</h1>
<p class="sub" style="position:absolute;left:64px;top:252px;font-size:26px">${c.el} 기운 · ${STEM[stems[0]]}·${STEM[stems[1]]}일에 태어난 사람은 <b style="color:#1F1B18">${c.ko}</b> + 그날의 동물</p>
${block(stems[0]).replace('class="blk"', 'class="blk" style="top:322px"')}${block(stems[1]).replace('class="blk"', 'class="blk" style="top:786px"')}
<div style="position:absolute;left:64px;right:64px;bottom:30px;display:flex;justify-content:space-between;font-size:24px;font-weight:800"><span style="color:#B8352A">app.inseol.com</span><span style="color:#a39a90">${ci < 4 ? '다음 색 →' : '내 타입 찾기 →'}</span></div>`));
});

out('ig-types-07-cta', doc(1080, 1350, `
.fade{position:absolute;left:0;right:0;bottom:0;height:420px;background:linear-gradient(to bottom,rgba(247,244,238,0) 0,#F7F4EE 45%)}
.cta{position:absolute;left:0;right:0;bottom:70px;text-align:center}
.cta .btn{font-size:36px;padding:20px 48px}
.cta .chips{justify-content:center;margin-top:22px;font-size:22px}
`, `${brand('left:64px;top:58px')}<div class="page" style="right:64px;top:74px;font-size:24px">${N_TYPES} / ${N_TYPES}</div>
<h1 style="position:absolute;left:64px;top:165px;font-size:76px">내 타입 <em>확인</em> →</h1>
<p class="sub" style="position:absolute;left:64px;top:282px;font-size:30px">생년월일만 넣으면 색·동물 타입과 한 줄 풀이,<br>MBTI로 치면 무엇에 가까운지까지 바로 나와요.</p>
${phone('left:250px;top:430px;width:580px;height:900px', 'assets/today-hero.png')}
<div class="fade"></div><div class="cta"><span class="btn">app.inseol.com</span><div class="chips">${PRIVACY}</div></div>`));

// ================= C. MBTI로 치면? carousel (1080x1350) =================
const PAIRS = [
  ['E', '드러내는 기운', '표현·재물 쪽 기운이 더 강하면', 'I', '안으로 모으는 기운', '배움·내 편 쪽 기운이 더 강하면'],
  ['S', '현실 감각', '흙·쇠 기운이 강한 편이면', 'N', '직관·상상', '나무·물 기운이 강한 편이면'],
  ['T', '판단·원칙', '쇠·책임의 기운이 강한 편이면', 'F', '공감·다정함', '불·보살핌의 기운이 강한 편이면'],
  ['J', '차곡차곡 바른 기운', '차곡차곡 쌓는 기운이 강한 편이면', 'P', '즉흥·변화', '즉흥·변화를 즐기는 기운이 강한 편이면'],
];
const NM = 5;
const pairCard = (p, top) => `<div class="pc" style="top:${top}px"><div class="side"><b>${p[0]}</b><h4>${p[1]}</h4><p>${p[2]}</p></div><div class="vs">vs</div><div class="side"><b>${p[3]}</b><h4>${p[4]}</h4><p>${p[5]}</p></div></div>`;
const PCSS = `
.pc{position:absolute;left:64px;width:952px;height:340px;background:#fff;border:2px solid #e8e1d6;border-radius:32px;display:flex;align-items:stretch;padding:36px 28px}
.side{flex:1;text-align:center;padding:0 10px}
.side b{display:block;font-family:'Noto Serif KR',serif;font-weight:900;font-size:120px;line-height:1.05;color:#B8352A}
.side h4{font-size:36px;font-weight:900;margin:14px 0 10px;letter-spacing:-0.02em}
.side p{font-size:24px;color:#5b534c;line-height:1.5}
.note2{position:absolute;left:64px;top:1080px;width:952px;background:#1F1B18;color:#F7F4EE;border-radius:28px;padding:30px 40px;font-size:29px;line-height:1.55}
.note2 b{color:#f0b7a8}
.appbox{background:#EFEAE3;border-radius:20px;padding:22px 30px;font-size:32px;font-weight:500}
.appbox b{color:#B8352A;font-weight:800}.appbox small{color:#8a8178;font-size:24px}.appbox .tri{font-size:22px;vertical-align:3px;margin-right:6px}
.vs{align-self:center;font-size:28px;font-weight:800;color:#a39a90;width:60px;text-align:center}
.foot{position:absolute;left:64px;right:64px;bottom:44px;display:flex;justify-content:space-between;font-size:24px;font-weight:800}
`;
const foot = (r) => `<div class="foot"><span style="color:#B8352A">app.inseol.com</span><span style="color:#a39a90">${r}</span></div>`;

out('ig-mbti-01-cover', doc(1080, 1350, `
.lt{position:absolute;left:64px;top:610px;width:952px;display:grid;grid-template-columns:repeat(4,1fr);gap:18px}
.lt div{background:#fff;border:2px solid #e8e1d6;border-radius:28px;text-align:center;padding:28px 0 24px}
.lt b{display:block;font-family:'Noto Serif KR',serif;font-weight:900;font-size:74px;line-height:1.1}
.lt b i{font-style:normal;color:#c9bfb2;font-weight:700;font-size:48px;margin:0 6px}
.lt small{display:block;font-size:21px;color:#6b635b;font-weight:700;margin-top:10px}
.note{position:absolute;left:64px;top:860px;width:952px;background:#1F1B18;color:#F7F4EE;border-radius:28px;padding:34px 40px;font-size:30px;line-height:1.55}
.note b{color:#f0b7a8}
${PCSS}`, `${brand('left:64px;top:58px')}<div class="page" style="right:64px;top:74px;font-size:24px">1 / ${NM}</div>
<h1 style="position:absolute;left:64px;top:170px;font-size:96px">내 사주,<br><em>MBTI</em>로 치면?</h1>
<p class="sub" style="position:absolute;left:64px;top:440px;font-size:32px">사주 여덟 글자 전체의 기운을 보고<br>가장 가까운 MBTI를 골라 줘요.</p>
<div class="lt">${PAIRS.map((p) => `<div><b>${p[0]}<i>/</i>${p[3]}</b><small>${p[0]}·${p[3]} 어느 쪽?</small></div>`).join('')}</div>
<div class="note">일주 하나로 정해지는 게 아니에요.<br><b>같은 일주라도 사주 전체가 다르면</b> 결과가 달라요.</div>
<div style="position:absolute;left:64px;top:1070px;width:952px"><div style="font-size:22px;color:#8a8178;font-weight:700;margin-bottom:12px">결과 화면에선 이렇게 보여요 (예시)</div><div class="appbox"><span class="tri">▶</span> MBTI로 치면 <b>ISTP</b>에 가까워요 <small>왜?</small></div></div>${foot('넘겨서 고르는 법 보기 →')}`));

out('ig-mbti-02-ei-sn', doc(1080, 1350, PCSS, `${brand('left:64px;top:58px')}<div class="page" style="right:64px;top:74px;font-size:24px">2 / ${NM}</div>
<h1 style="position:absolute;left:64px;top:165px;font-size:64px">네 글자는 <em>이렇게</em> 골라요 ①</h1>
<p class="sub" style="position:absolute;left:64px;top:262px;font-size:28px">내 사주에 어떤 기운이 더 많은지 견줘 봐요.</p>
${pairCard(PAIRS[0], 340)}${pairCard(PAIRS[1], 705)}<div class="note2">두 기운을 견줘 보고, <b>더 강한 쪽 글자</b>를 골라요.<br>사주 여덟 글자를 모두 따져서 계산해요.</div>${foot('다음 →')}`));

out('ig-mbti-03-tf-jp', doc(1080, 1350, PCSS, `${brand('left:64px;top:58px')}<div class="page" style="right:64px;top:74px;font-size:24px">3 / ${NM}</div>
<h1 style="position:absolute;left:64px;top:165px;font-size:64px">네 글자는 <em>이렇게</em> 골라요 ②</h1>
<p class="sub" style="position:absolute;left:64px;top:262px;font-size:28px">다른 사람들과 견줘 어느 쪽이 강한 편인지 봐요.</p>
${pairCard(PAIRS[2], 340)}${pairCard(PAIRS[3], 705)}<div style="position:absolute;left:64px;top:1080px;width:952px"><div style="font-size:22px;color:#8a8178;font-weight:700;margin-bottom:12px">네 글자를 모으면 (예시)</div><div class="appbox"><span class="tri">▶</span> MBTI로 치면 <b>ISTP</b>에 가까워요 <small>왜?</small></div></div>${foot('다음 →')}`));

out('ig-mbti-04-why', doc(1080, 1350, `
.fade{position:absolute;left:0;right:0;bottom:0;height:300px;background:linear-gradient(to bottom,rgba(247,244,238,0) 0,#F7F4EE 55%)}
.tag{position:absolute;right:70px;top:640px;background:#B8352A;color:#fff;font-weight:800;font-size:26px;padding:14px 22px;border-radius:18px;box-shadow:0 12px 30px rgba(184,53,42,.3);transform:rotate(3deg)}
${PCSS}`, `${brand('left:64px;top:58px')}<div class="page" style="right:64px;top:74px;font-size:24px">4 / ${NM}</div>
<h1 style="position:absolute;left:64px;top:165px;font-size:68px">'왜?'를 누르면<br><em>이유</em>까지 보여 줘요</h1>
<p class="sub" style="position:absolute;left:64px;top:350px;font-size:28px">글자마다 어떤 기운 때문인지 한 줄씩 풀어 줘요.</p>
${phone('left:220px;top:440px;width:640px;height:1000px', '../shot-hero-mbti-open.png')}
<div class="fade"></div>${foot('예시 화면 · 가상의 생년월일')}`));

out('ig-mbti-05-cta', doc(1080, 1350, `
.logo{position:absolute;left:50%;top:190px;width:230px;margin-left:-115px}
.c{position:absolute;left:0;right:0;text-align:center}
.c .btn{font-size:40px;padding:22px 56px}
.chips{justify-content:center;font-size:24px}
.mini{display:inline-flex;gap:14px;margin-top:8px}
.mini span{width:110px;height:130px;background:#fff;border:2px solid #e8e1d6;border-radius:22px;font-family:'Noto Serif KR',serif;font-weight:900;font-size:64px;display:flex;align-items:center;justify-content:center;color:#B8352A}
`, `<img class="logo" src="assets/inseol-logo-transparent-1024.png">
<h1 class="c" style="top:460px;font-size:76px">나는 MBTI로 치면<br><em>무엇</em>에 가까울까?</h1>
<div class="c" style="top:690px"><div class="mini"><span>?</span><span>?</span><span>?</span><span>?</span></div></div>
<p class="c sub" style="top:870px;font-size:30px">생년월일만 넣으면 색·동물 타입과 함께 바로 나와요.</p>
<div class="c" style="top:970px"><span class="btn">app.inseol.com</span></div>
<div class="c chips" style="top:1120px;display:flex">${PRIVACY}</div>
<p class="c" style="top:1262px;font-size:22px;color:#a39a90;font-weight:600">재미로 보는 비교예요 · 같은 일주라도 사주 전체에 따라 달라요</p>
<div class="page" style="right:64px;top:74px;font-size:24px">5 / ${NM}</div>`));

// ================= D. Stories (1080x1920) =================
const STORY = `.fade{position:absolute;left:0;right:0;bottom:0;height:640px;background:linear-gradient(to bottom,rgba(247,244,238,0) 0,#F7F4EE 40%)}
.cta{position:absolute;left:0;right:0;bottom:250px;text-align:center}
.cta .btn{font-size:36px;padding:20px 46px}
.cta small{display:block;margin-top:18px;font-size:26px;color:#6b635b;font-weight:600}`;

out('story-match', doc(1080, 1920, `${STORY}
.bub{position:absolute;left:60px;top:1170px;width:580px;background:#fff;border-radius:26px;box-shadow:0 24px 50px rgba(40,30,20,.22);overflow:hidden;transform:rotate(-2deg)}
.bub .hd{background:#FEE34A;padding:14px 22px;font-size:22px;font-weight:800;color:#3a2f00}
.bub .t{padding:18px 22px 6px;font-size:28px;font-weight:800;line-height:1.35}
.bub .d{padding:0 22px 16px;font-size:21px;color:#6b635b;line-height:1.5}
.bub .b{margin:0 18px 18px;background:#f2efe9;border-radius:14px;text-align:center;padding:14px;font-size:22px;font-weight:800}
`, `${brand('left:72px;top:230px')}
<h1 style="position:absolute;left:72px;top:345px;font-size:84px"><em>카톡</em>으로<br>궁합 초대해 보세요</h1>
<p class="sub" style="position:absolute;left:72px;top:570px;font-size:32px">링크를 받은 사람이 자기 생년월일만 넣으면<br>둘의 궁합을 쉬운 말로 풀어 줘요.</p>
${phone('left:330px;top:720px;width:680px;height:1000px', '../shot-match.png')}
<div class="fade"></div>
<div class="bub"><div class="hd">궁합 초대 메시지</div><div class="t">'흰 용'의 궁합 초대가 왔어요</div><div class="d">생년월일만 넣으면 우리 둘의 궁합을 쉬운 말로 풀어 줘요.</div><div class="b">우리 궁합 보기</div></div>
<div class="cta"><span class="btn">app.inseol.com → 궁합</span><small>초대 링크엔 생년월일 대신 일주만 담겨요</small></div>`));

out('story-2027', doc(1080, 1920, `${STORY}
.wm{position:absolute;right:92px;top:545px;font-family:'Noto Serif KR',serif;font-weight:900;font-size:64px;color:#B8352A;line-height:1;letter-spacing:.08em}
.sheep{position:absolute;right:80px;top:345px;font-size:170px;line-height:1.1}
`, `${brand('left:72px;top:230px')}<div class="sheep emo">🐑</div><div class="wm">丁未</div>
<h1 style="position:absolute;left:72px;top:345px;font-size:92px">2027 <em>정미년</em><br>신년운세</h1>
<p class="sub" style="position:absolute;left:72px;top:590px;font-size:34px"><b style="color:#B8352A">붉은 양의 해</b>, 은은한 불빛으로<br>정성을 다듬는 한 해</p>
${phone('left:200px;top:760px;width:680px;height:1000px', '../shot-2027.png')}
<div class="fade"></div>
<div class="cta"><span class="btn">app.inseol.com/2027/</span><small>무료 · 내 사주로 보는 2027년 12달 흐름까지</small></div>`));

out('story-today', doc(1080, 1920, `${STORY}
.card{position:absolute;left:90px;top:720px;width:900px;height:740px;overflow:hidden;border-radius:36px;box-shadow:0 30px 60px rgba(60,30,10,.18);background:#fff}
.card img{width:900px;display:block}
.hl{position:absolute;left:78px;top:1238px;width:924px;height:200px;border:6px solid #B8352A;border-radius:28px}
.hl b{position:absolute;right:26px;top:-30px;background:#B8352A;color:#fff;font-size:24px;font-weight:800;padding:6px 18px;border-radius:999px}
`, `${brand('left:72px;top:230px')}
<h1 style="position:absolute;left:72px;top:345px;font-size:92px">오늘의 나,<br><em>한 줄</em>로</h1>
<p class="sub" style="position:absolute;left:72px;top:590px;font-size:32px">결과 맨 위 카드에서 매일 바뀌는<br>오늘의 한 줄을 바로 봐요.</p>
<div class="card"><img src="assets/today-hero.png"></div>
<div class="hl"><b>매일 새로</b></div>
<div class="cta" style="bottom:250px"><span class="btn">app.inseol.com</span><small>가입 없이 · 무료 · 출생 정보는 내 폰 안에서만 계산</small></div>`));

// ================= E. English square (1080x1080) =================
out('en-animal', doc(1080, 1080, `
h1{font-family:'Noto Serif KR',serif;letter-spacing:-0.02em;line-height:1.12}
.em{display:flex;flex-wrap:wrap;gap:4px;width:470px;font-size:46px}
.chips{font-size:19px;flex-wrap:nowrap}.chips span{padding:7px 14px}
.btn{font-size:28px;padding:16px 30px}
.fade{position:absolute;left:560px;right:0;bottom:0;height:200px;background:linear-gradient(to bottom,rgba(247,244,238,0) 0,#F7F4EE 70%)}
`, `${brand('left:64px;top:60px', 'Saju · Zi Wei Dou Shu')}
<h1 style="position:absolute;left:64px;top:180px;width:520px;font-size:66px">Find your Korean <em>day pillar</em> animal</h1>
<p class="sub" style="position:absolute;left:64px;top:500px;width:480px;font-size:28px"><b style="color:#1F1B18">60 color-animal types</b> — your birth day's color and animal, explained in plain words.</p>
<div class="em emo" style="position:absolute;left:64px;top:660px">${EMOJI.map((e) => `<span>${e}</span>`).join('')}</div>
<div class="chips" style="position:absolute;left:64px;top:815px;width:530px"><span>free</span><span>no sign-up</span><span>runs on your phone</span></div>
<div style="position:absolute;left:64px;top:920px"><span class="btn">app.inseol.com/en/</span></div>
${phone('left:600px;top:120px;width:420px;height:1000px', '../shot-en-hero.png')}<div class="fade"></div>`, { lang: 'en' }));

console.log('ok', DM.map((d) => d.title.slice(0, 8)).join(' | '));

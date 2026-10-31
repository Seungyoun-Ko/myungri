// 결과 카드를 PNG 이미지로 저장·공유합니다 (기획서 8.3: 주소 대신 이미지로 공유).
// 이미지는 이 기기 안에서만 만들어지고 어디에도 올라가지 않습니다.
import { SEAL_SVG } from './brand';
import { toast } from './dom';
import { tr } from '../i18n';

const SERIF_FAMILY = 'Noto Serif KR';

/** 카드에 실제로 쓰인 글자만 담은 작은 글꼴을 Google Fonts에서 받아 이미지에 넣습니다. */
async function serifFontCss(text: string): Promise<string> {
  const chars = [...new Set(text.replace(/\s/g, ''))].join('');
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(SERIF_FAMILY)}:wght@700;900&text=${encodeURIComponent(chars)}`;
  const css = await (await fetch(url)).text();
  const urls = [...css.matchAll(/url\((https:[^)]+)\)/g)].map((m) => m[1]);
  let out = css;
  for (const u of urls) {
    const buf = await (await fetch(u)).arrayBuffer();
    let bin = '';
    new Uint8Array(buf).forEach((b) => (bin += String.fromCharCode(b)));
    out = out.replace(u, `data:font/woff2;base64,${btoa(bin)}`);
  }
  return out;
}

function frame(nodes: HTMLElement[], width: number, caption: string) {
  const wrap = document.createElement('div');
  wrap.className = 'export-frame';
  wrap.style.width = `${width}px`;
  wrap.innerHTML = `<div class="export-head">${SEAL_SVG}<div><b>${tr('인설명리', 'Inseol Saju')}</b><span>${caption}</span></div></div>`;
  for (const node of nodes) {
    const clone = node.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('[data-no-export]').forEach((el) => el.remove());
    wrap.append(clone);
  }
  const foot = document.createElement('div');
  foot.className = 'export-foot';
  foot.textContent = tr('app.inseol.com · 타고난 성향을 풀이한 참고용 내용이에요', 'app.inseol.com/en · for reflection, not prediction');
  wrap.append(foot);
  document.body.append(wrap);
  return wrap;
}

export async function saveAsImage(nodes: HTMLElement[], opts: { fileName: string; width: number; caption: string }) {
  toast(tr('이미지를 만들고 있어요…', 'Creating image…'), undefined, 2500);
  const wrap = frame(nodes, opts.width, opts.caption);
  try {
    await exportElement(wrap, opts.fileName);
  } finally {
    wrap.remove();
  }
}

/** 화면 밖에 그린 요소를 PNG로 만들어 공유(휴대폰)하거나 내려받습니다. */
async function exportElement(wrap: HTMLElement, fileName: string, pixelRatio = 2) {
  try {
    const { toBlob } = await import('html-to-image');
    let fontEmbedCSS: string | undefined;
    try {
      fontEmbedCSS = await serifFontCss(wrap.textContent ?? '');
    } catch {
      fontEmbedCSS = undefined; // 글꼴을 못 받으면 기기 글꼴로 그립니다.
    }
    const bg = getComputedStyle(document.body).backgroundColor;
    const blob = await toBlob(wrap, {
      pixelRatio,
      backgroundColor: bg,
      cacheBust: false,
      // 화면 밖에 둔 틀의 위치가 이미지에 따라오지 않게 고정합니다.
      style: { position: 'static', left: '0', top: '0' },
      ...(fontEmbedCSS ? { fontEmbedCSS } : { skipFonts: true }),
    });
    if (!blob) throw new Error('empty image');
    const file = new File([blob], fileName, { type: 'image/png' });
    const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
    if (nav.canShare?.({ files: [file] }) && window.matchMedia('(pointer: coarse)').matches) {
      try {
        await nav.share({ files: [file], title: tr('인설명리', 'Inseol Saju') });
        return;
      } catch (e) {
        if ((e as DOMException).name === 'AbortError') return;
      }
    }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    document.body.append(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 1000);
    toast(tr('이미지를 저장했어요.', 'Image saved.'));
  } catch {
    toast(tr('이미지를 만들지 못했어요. 잠시 뒤 다시 시도해 주세요.', "Couldn't create the image. Please try again in a moment."));
  }
}

export interface ShareCardData {
  /** 일주 타입 (예: 흰 용) */
  type: string;
  /** 일주 한자·읽기 (예: 庚辰 · 경진일주) */
  ilju: string;
  /** 한 줄 은유 */
  title: string;
  keywords: string[];
  /** 아래 작은 정보 (예: 필요한 기운: 쇠 · 행운의 색: 흰색) */
  facts: [string, string][];
  /** 'story' 9:16, 'square' 1:1 */
  shape: 'story' | 'square';
}

/** "나를 한 줄로" 공유 카드. 이름·생년월일은 넣지 않습니다. */
export async function saveShareCard(d: ShareCardData) {
  toast(tr('카드를 만들고 있어요…', 'Creating your card…'), undefined, 2500);
  const w = 360;
  const h = d.shape === 'story' ? 640 : 360;
  const card = document.createElement('div');
  card.className = `share-card ${d.shape}`;
  card.style.width = `${w}px`;
  card.style.height = `${h}px`;
  const esc = (t: string) => t.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
  card.innerHTML = `<div class="sc-head">${SEAL_SVG}<b>${tr('인설명리', 'Inseol Saju')}</b></div>
    <div class="sc-body">
      <p class="sc-label">${tr('나의 일주 타입', 'My day pillar type')}</p>
      <p class="sc-type">${esc(d.type)}</p>
      <p class="sc-ilju">${esc(d.ilju)}</p>
      <p class="sc-title">${esc(d.title)}</p>
      <p class="sc-tags">${d.keywords.map((k) => `<span>#${esc(k)}</span>`).join('')}</p>
      ${d.facts.length ? `<dl class="sc-facts">${d.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>` : ''}
    </div>
    <div class="sc-foot"><b>app.inseol.com${tr('', '/en')}</b><span>${tr('무료 · 회원가입 없이 · 참고용 풀이', 'Free · no sign-up · for reflection')}</span></div>`;
  document.body.append(card);
  try {
    await exportElement(card, `${tr('인설명리', 'inseol')}-${d.shape}.png`, 3);
  } finally {
    card.remove();
  }
}

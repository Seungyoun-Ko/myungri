// 결과 카드를 PNG 이미지로 저장·공유합니다 (기획서 8.3: 주소 대신 이미지로 공유).
// 이미지는 이 기기 안에서만 만들어지고 어디에도 올라가지 않습니다.
import { SEAL_SVG } from './brand';
import { toast } from './dom';

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
  wrap.innerHTML = `<div class="export-head">${SEAL_SVG}<div><b>인설명리</b><span>${caption}</span></div></div>`;
  for (const node of nodes) {
    const clone = node.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('[data-no-export]').forEach((el) => el.remove());
    wrap.append(clone);
  }
  const foot = document.createElement('div');
  foot.className = 'export-foot';
  foot.textContent = 'app.inseol.com · 타고난 성향을 풀이한 참고용 내용이에요';
  wrap.append(foot);
  document.body.append(wrap);
  return wrap;
}

export async function saveAsImage(nodes: HTMLElement[], opts: { fileName: string; width: number; caption: string }) {
  toast('이미지를 만들고 있어요…', undefined, 2500);
  const wrap = frame(nodes, opts.width, opts.caption);
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
      pixelRatio: 2,
      backgroundColor: bg,
      cacheBust: false,
      // 화면 밖에 둔 틀의 위치가 이미지에 따라오지 않게 고정합니다.
      style: { position: 'static', left: '0', top: '0' },
      ...(fontEmbedCSS ? { fontEmbedCSS } : { skipFonts: true }),
    });
    if (!blob) throw new Error('empty image');
    const file = new File([blob], opts.fileName, { type: 'image/png' });
    const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
    if (nav.canShare?.({ files: [file] }) && window.matchMedia('(pointer: coarse)').matches) {
      try {
        await nav.share({ files: [file], title: '인설명리' });
        return;
      } catch (e) {
        if ((e as DOMException).name === 'AbortError') return;
      }
    }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = opts.fileName;
    document.body.append(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 1000);
    toast('이미지를 저장했어요.');
  } catch {
    toast('이미지를 만들지 못했어요. 잠시 뒤 다시 시도해 주세요.');
  } finally {
    wrap.remove();
  }
}

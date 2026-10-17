// Google AdSense 설정과 광고 자리.
// - client와 광고 단위 ID(id)를 채우면 실제 광고가 나옵니다. 비어 있으면 아무것도 나오지 않습니다.
// - 미리보기: 주소 끝에 ?adpreview 를 붙이면(예: https://app.inseol.com/?adpreview) 광고 자리와 크기를 점선 상자로 보여 줍니다.
// - 원칙: 결과를 막지 않는 곳에만 둡니다. 입력 칸·명반 칸·탭 바로 옆에는 두지 않습니다.
// - 광고는 화면에 처음 보일 때 한 번만 요청합니다. 탭을 바꿔도 다시 요청하지 않습니다.

export const ADSENSE_CLIENT = 'ca-pub-7405539243575749';

// 애드센스 광고 단위 (같은 모양의 자리는 같은 단위를 함께 씁니다)
const UNIT_HORIZONTAL = '9108277711'; // 인설웹앱>가로형
const UNIT_SQUARE = '2542869365'; // 인설웹앱>정사각형
const UNIT_IN_ARTICLE = '2548764913'; // 콘텐츠 내 광고

export type AdShape = 'horizontal' | 'rectangle' | 'in-article';

export interface AdSlotDef {
  label: string;
  unit: string;
  shape: AdShape;
  /** 예상 크기 [가로, 세로] */
  mobile: [number, number];
  desktop: [number, number];
  /** AdSense 광고 단위 ID (data-ad-slot) */
  id: string;
}

export const AD_SLOTS = {
  resultTop: { label: '사주 원국 아래', unit: '디스플레이 · 가로형', shape: 'horizontal', mobile: [320, 100], desktop: [728, 90], id: UNIT_HORIZONTAL },
  sajuFlow: { label: '운 흐름(월운) 아래', unit: '디스플레이 · 가로형', shape: 'horizontal', mobile: [320, 100], desktop: [728, 90], id: UNIT_HORIZONTAL },
  sajuTong: { label: '사주 통변 아래', unit: '디스플레이 · 사각형', shape: 'rectangle', mobile: [300, 250], desktop: [336, 280], id: UNIT_SQUARE },
  jamiBottom: { label: '자미두수 통변 아래', unit: '디스플레이 · 사각형', shape: 'rectangle', mobile: [300, 250], desktop: [336, 280], id: UNIT_SQUARE },
  combinedBottom: { label: '종합 통변 아래', unit: '디스플레이 · 사각형', shape: 'rectangle', mobile: [300, 250], desktop: [336, 280], id: UNIT_SQUARE },
  calendar: { label: '달력 날짜 상세 아래', unit: '디스플레이 · 가로형', shape: 'horizontal', mobile: [320, 100], desktop: [728, 90], id: UNIT_HORIZONTAL },
  guideMid: { label: '공부 글 본문 중간', unit: '콘텐츠 내 광고', shape: 'in-article', mobile: [328, 250], desktop: [700, 280], id: UNIT_IN_ARTICLE },
  guideEnd: { label: '공부 글 끝', unit: '디스플레이 · 사각형', shape: 'rectangle', mobile: [300, 250], desktop: [336, 280], id: UNIT_SQUARE },
} satisfies Record<string, AdSlotDef>;

export type AdSlotName = keyof typeof AD_SLOTS;

export function adPreview(): boolean {
  try {
    return import.meta.env.VITE_AD_PREVIEW === '1' || new URLSearchParams(location.search).has('adpreview');
  } catch {
    return false;
  }
}

const sizeVars = (d: AdSlotDef) =>
  `--ad-w-m:${d.mobile[0]}px;--ad-h-m:${d.mobile[1]}px;--ad-w-d:${d.desktop[0]}px;--ad-h-d:${d.desktop[1]}px`;

/** 광고 자리 HTML. 설정도 미리보기도 아니면 빈 문자열. */
export function adSlot(name: AdSlotName): string {
  const d: AdSlotDef = AD_SLOTS[name];
  if (adPreview()) {
    return `<aside class="ad-slot" aria-label="광고 자리 미리보기">
      <div class="ad-label">광고</div>
      <div class="ad-box preview" style="${sizeVars(d)}">
        <b>${d.label}</b>
        <span>${d.unit}</span>
        <span>휴대폰 ${d.mobile[0]}×${d.mobile[1]} · PC ${d.desktop[0]}×${d.desktop[1]}</span>
        <code>${name}</code>
      </div>
    </aside>`;
  }
  if (!ADSENSE_CLIENT || !d.id) return '';
  const format =
    d.shape === 'in-article'
      ? 'data-ad-format="fluid" data-ad-layout="in-article"'
      : `data-ad-format="${d.shape}" data-full-width-responsive="true"`;
  return `<aside class="ad-slot" aria-label="광고">
    <div class="ad-label">광고</div>
    <div class="ad-box" style="${sizeVars(d)}">
      <ins class="adsbygoogle" style="display:block${d.shape === 'in-article' ? ';text-align:center' : ''}" data-ad-client="${ADSENSE_CLIENT}" data-ad-slot="${d.id}" ${format} data-ad-pending></ins>
    </div>
  </aside>`;
}

/** 화면에 보이는 광고만 한 번씩 요청합니다. 숨겨진 탭의 광고는 그 탭이 처음 열릴 때 요청합니다. */
export function activateAds(root: ParentNode = document) {
  if (!ADSENSE_CLIENT) return;
  root.querySelectorAll<HTMLElement>('ins.adsbygoogle[data-ad-pending]').forEach((ins) => {
    if (!ins.offsetParent || ins.getBoundingClientRect().width === 0) return;
    ins.removeAttribute('data-ad-pending');
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {
      /* 광고가 실패해도 결과는 막지 않습니다. */
    }
  });
}

/** 정적 페이지의 <div data-ad="이름"></div> 자리를 채웁니다. */
export function mountStaticAds(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-ad]').forEach((el) => {
    const name = el.dataset.ad as AdSlotName;
    if (name in AD_SLOTS) el.outerHTML = adSlot(name);
  });
  activateAds(root);
}

/**
 * ADSENSE_CLIENT가 있을 때만 AdSense 스크립트를 한 번 불러옵니다.
 * 주소에 ?client= 를 붙이지 않아 inseol.com(티스토리)에 켜 둔 자동 광고가 웹앱에 끼어들지 않습니다.
 * 직접 배치한 광고 자리는 각 <ins>의 data-ad-client로 그대로 나옵니다.
 */
export function loadAdSense() {
  if (!ADSENSE_CLIENT || adPreview() || document.querySelector('script[data-adsense]')) return;
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
  s.crossOrigin = 'anonymous';
  s.dataset.adsense = '';
  document.head.append(s);
}

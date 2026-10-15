// Google AdSense 설정. 승인 전에는 client를 비워 두면 광고 자리가 화면에 나타나지 않습니다.
// 승인 후: client에 'ca-pub-…', slots에 광고 단위 ID를 넣고 index.html의 AdSense 스크립트 주석을 풉니다.
export const ADSENSE = {
  client: '',
  slots: {
    resultTop: '',
    resultBottom: '',
    article: '',
  } as Record<string, string>,
};

/** 결과를 막지 않는 위치에만 광고를 넣습니다(입력 칸·명반 칸·탭 바로 옆 금지). */
export function adSlot(name: keyof typeof ADSENSE.slots | string) {
  const slot = ADSENSE.slots[name];
  if (!ADSENSE.client || !slot) return '';
  return `<div class="ad-slot"><ins class="adsbygoogle" style="display:block" data-ad-client="${ADSENSE.client}" data-ad-slot="${slot}" data-ad-format="auto" data-full-width-responsive="true"></ins></div>`;
}

export function fillAds(root: ParentNode) {
  if (!ADSENSE.client) return;
  root.querySelectorAll('ins.adsbygoogle:not([data-adsbygoogle-status])').forEach(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {
      /* 광고가 실패해도 결과는 막지 않습니다. */
    }
  });
}

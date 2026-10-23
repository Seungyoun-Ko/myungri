// 카카오톡 공유. SDK는 버튼을 누를 때 한 번만 불러옵니다(첫 화면 속도에 영향 없음).
// JavaScript 키는 원래 웹페이지에 공개되는 키이며, 카카오 개발자 콘솔에 등록한 도메인(app.inseol.com)에서만 작동합니다.
// 공유 메시지에는 이름·생년월일을 넣지 않습니다.
import { toast } from './dom';
import { tr } from '../i18n';

const KAKAO_JS_KEY = 'ba63da5ac62815c63252b12127861d70';
const SDK_URL = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js';
/** SDK 파일의 무결성 값(SRI). 파일이 바뀌면 브라우저가 실행을 막습니다. */
const SDK_INTEGRITY = 'sha384-DKYJZ8NLiK8MN4/C5P2dtSmLQ4KwPaoqAfyA/DfmEc1VDxu4yyC7wy6K1Hs90nka';
const SITE = 'https://app.inseol.com';

interface KakaoSdk {
  isInitialized(): boolean;
  init(key: string): void;
  Share: { sendDefault(settings: Record<string, unknown>): void };
}

let loading: Promise<KakaoSdk> | null = null;

function loadKakao(): Promise<KakaoSdk> {
  const w = window as unknown as { Kakao?: KakaoSdk };
  if (w.Kakao) return Promise.resolve(w.Kakao);
  return (loading ??= new Promise<KakaoSdk>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = SDK_URL;
    s.integrity = SDK_INTEGRITY;
    s.crossOrigin = 'anonymous';
    s.async = true;
    s.onload = () => (w.Kakao ? resolve(w.Kakao) : reject(new Error('Kakao SDK missing')));
    s.onerror = () => {
      loading = null;
      reject(new Error('Kakao SDK load failed'));
    };
    document.head.append(s);
  }));
}

export interface KakaoShare {
  title: string;
  description: string;
  /** 메시지 맨 위 그림 (공개된 이미지 주소) */
  imageUrl?: string;
  /** 메시지와 버튼을 눌렀을 때 열 주소 (app.inseol.com 아래) */
  url: string;
  buttons: { title: string; url: string }[];
}

/** 카카오톡으로 보내기. 실패하면 링크 복사로 대신합니다. */
export async function shareKakao(m: KakaoShare) {
  try {
    const Kakao = await loadKakao();
    if (!Kakao.isInitialized()) Kakao.init(KAKAO_JS_KEY);
    const link = (u: string) => ({ mobileWebUrl: u, webUrl: u });
    Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: m.title,
        description: m.description,
        imageUrl: m.imageUrl ?? `${SITE}/og.png`,
        imageWidth: 1200,
        imageHeight: 630,
        link: link(m.url),
      },
      buttons: m.buttons.slice(0, 2).map((b) => ({ title: b.title, link: link(b.url) })),
    });
  } catch {
    try {
      await navigator.clipboard.writeText(m.url);
      toast(tr('카카오톡을 열지 못해 링크를 복사했어요. 카톡 대화창에 붙여 넣어 주세요.', "Couldn't open KakaoTalk, so the link was copied instead."));
    } catch {
      window.prompt(tr('이 링크를 복사하세요', 'Copy this link'), m.url);
    }
  }
}

export const KAKAO_SITE = SITE;

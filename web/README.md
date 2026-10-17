# 인설명리 웹앱

사주팔자와 자미두수 명반을 브라우저 안에서 계산하는 정적 웹앱(PWA)입니다. 기획서: `인설명리_웹앱_기획서.md`.

## 실행

```bash
cd web
npm install
npm run dev      # 개발 서버 http://localhost:5173
npm test         # 기획서 7장 기준 사례 검사
npm run build    # dist/ 에 배포용 파일 생성
npm run preview  # 빌드 결과 미리 보기
```

## 구조

| 경로 | 내용 |
| --- | --- |
| `src/engine/birth.ts` | 음력 변환, 표준 자오선·서머타임·경도 보정, 절기 비교 시각 (기획서 4.1) |
| `src/engine/saju.ts` | 사주 기둥, 십신, 12운성, 비율, 합충, 강약, 용신, 격국, 대운·세운·월운 (4.2~4.5) |
| `src/engine/jamidusu.ts` | 명반, 14주성, 보좌·살성·잡성, 사화, 대한·유년 (5장) |
| `src/engine/tongbyeon*.ts` | 사주·자미두수·종합 통변 (6장) |
| `src/engine/calendar.ts` | 달력: 일진, 한국 음력, 절입 시각 |
| `src/ui/` | 화면 |
| `scripts/gen-guide.ts` | 검색 유입용 공부 글(`guide/`) 생성 |
| `tests/` | 기준 사례 자동 검사 |

## Android 앱과 대조가 필요한 부분

Android 원본 코드 없이 기획서만으로 만들었기 때문에 아래는 앱과 다를 수 있습니다. 앱에서 같은 입력으로 결과를 뽑아 대조해 주세요.

- 묘왕리함 표: iztro(MIT) 표를 바탕으로 태양 유궁만 앱 사례(함)에 맞춤
- 잡성 35개, 천괴·천월, 화성·영성 배치 규칙: 일반적인 표를 사용
- 강약 점수 공식: (비겁+인성 비율) − (식상+재성+관성 비율), 일간 제외
- 십신 비율: 일간을 뺀 7자리 기준
- 합충 반영: 합화 오행으로 바꾸고(일간 제외) 충은 힘을 절반으로
- 지장간: 申 = 戊壬庚
- 통변 문장: 기획서 규칙에 맞춰 새로 쓴 문장 (앱 원문 아님)

## 통변 문장 쓰는 법 (쉬운 말 / 용어로 보기)

통변은 두 가지로 보여 줍니다. 기본은 **쉬운 말**(예: `성실하게 모으는 돈(정재)`), 통변 카드의 **용어로 보기** 버튼을 누르면 용어만 보여 줍니다(예: `정재`).

- 전문 용어는 문장에 그대로 쓰지 말고 `src/engine/terms.ts`의 도우미로 감싸세요: `tenGod('정재')`, `yong('용신')`, `palace('관록궁', '일·직업')`, `sihwa('록')`, `term.대운`, `charName(글자)` 등.
- 조사는 `josa(낱말, '이', '가')`로 붙이면 화면에 낼 때 괄호 앞 낱말에 맞춰 정해집니다.
- 화면에 낼 때는 `renderTerms(문장, 보기방식)`을 거칩니다.
- `tests/plain-language.test.ts`가 무작위 300명의 통변에서 괄호 밖 전문 용어와 한자가 나오면 실패합니다.

## 앱 결과 대조

`tests/app-cases.json`에 Android 앱 화면의 값을 옮겨 적으면 `npm test`가 웹 결과와 비교합니다. 아는 항목만 채우면 되고 비운 항목은 검사하지 않습니다.

```json
{
  "name": "설명",
  "input": { "gender": "F", "calendar": "solar", "year": 1990, "month": 3, "day": 5, "hour": 14, "minute": 20, "cityId": "seoul" },
  "saju": {
    "pillars": { "hour": "丁未", "day": "...", "month": "...", "year": "..." },
    "strength": "신약",
    "yongsin": { "yong": "화", "hee": "목", "gi": "수", "gu": "금" },
    "geukguk": "편재격",
    "daeun": { "startAge": 6, "list": ["庚子", "辛丑"] },
    "elementRatios": [27.3, 9.1, 36.4, 0, 27.3]
  },
  "jamidusu": {
    "ming": "酉", "shen": "丑", "guk": "화6국",
    "palaces": { "酉": { "name": "명궁", "main": ["태양 함", "천량 득"] } },
    "sihwa": { "록": "천동", "권": "천기", "과": "문창", "기": "염정" }
  }
}
```

- 달력: `solar` / `lunar` / `lunarLeap`, 성별: `M` / `F`, 출생시간 모름: `"timeUnknown": true`
- 다른 값이 있으면 어느 항목이 어떻게 다른지 나옵니다. 예: `酉 주성과 밝기: expected ['천량 득', '태양 함'] to deeply equal ['천량 득', '태양 평']`

## 배포 (app.inseol.com, Cloudflare Pages)

inseol.com은 티스토리 블로그가 쓰고 있어 웹앱은 서브도메인 `app.inseol.com`에 올립니다. 티스토리 DNS 레코드는 건드리지 않습니다.

Cloudflare Pages 프로젝트 설정:

| 항목 | 값 |
| --- | --- |
| Production branch | `main` |
| Root directory | `web` |
| Build command | `npm run build` (자동 검사 → 공부 글 생성 → 타입 검사 → 빌드) |
| Build output directory | `dist` |

- Node 버전은 `web/.node-version`(22)로 고정
- 응답 헤더와 캐시 규칙: `public/_headers`
- `main`이 아닌 브랜치에 올리면 Cloudflare가 미리보기 주소를 따로 만듦
- Custom domain `app.inseol.com` 추가 후 DNS에 `CNAME app → <프로젝트>.pages.dev`

## AdSense

1. 블로그가 이미 inseol.com으로 승인됐고 같은 게시자 ID라면 루트의 ads.txt로 서브도메인도 인정됨. 다른 ID면 서브도메인에 `public/ads.txt`를 따로 두고 루트 ads.txt에 `subdomain=app.inseol.com` 추가
2. 승인되면 `public/ads.txt`를 만들고 `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0` 한 줄을 넣기
3. `index.html`의 AdSense 스크립트 주석을 풀고, `src/ads.ts`에 client ID와 광고 단위 ID 입력
4. AdSense "개인정보 보호 및 메시지"에서 EEA·영국 동의 메시지 설정

## 블로그 이전 (티스토리 inseol.com → 이 사이트)

티스토리 블로그 "인생설계"의 글을 같은 주소(`inseol.com/196` 등)로 옮겨 오는 중입니다.

- 원고: `content/blog/{글번호}.json` (제목·설명·태그·카테고리·날짜·본문 HTML·이미지 정보·편집 기록 `changes`)
- 이미지: `public/blog-img/{글번호}-{순서}.webp` (티스토리 이미지 주소는 2주마다 바뀌는 임시 주소라 내려받아 둠)
- 페이지 생성: `scripts/gen-blog.ts` → `blog/{글번호}.html`, `blog/index.html`
- 빌드 뒤 `scripts/flatten-blog.ts`가 `dist/blog/{글번호}.html`을 `dist/{글번호}.html`로 옮겨 `/196` 주소로 열리게 함
- 앱의 60일주 페이지(`/ilju/...`)는 같은 일주의 블로그 글로 연결됨

**지금은 검색 비노출 상태입니다.** `gen-blog.ts`의 `LIVE = false`라서 글마다 `noindex`가 붙습니다. 티스토리 원본과 중복으로 잡히지 않게 하려는 것입니다.

### inseol.com 주소를 이 사이트로 바꿀 때 할 일

1. 남은 카테고리 글도 모두 옮기기 (안 옮긴 글은 주소 전환 후 404가 됨)
2. `gen-blog.ts`에서 `LIVE = true`로 바꾸고, 사이트맵에 블로그 글 주소 추가
3. 티스토리 스킨에 있던 확인 코드를 새 사이트 `<head>`에 그대로 넣기
   - 네이버: `<meta name="naver-site-verification" content="e09c176a2600e06d734d80bb465ad1eeea65e62c">`
   - Bing: `<meta name="msvalidate.01" content="B996E832FF07058AEDB2EE767D004A6C">`
   - 구글 애널리틱스: `G-GY2XKRL933`
4. `ads.txt`를 사이트 맨 위(`/ads.txt`)에 두기 (지금은 티스토리가 제공 중)
5. 티스토리의 특수 주소 처리: `/category/...`, `/tag/...`, `/m/{번호}`(모바일 주소) → 새 주소로 넘기는 `_redirects`
6. 블로그의 계산 도구 4개(`/pages/...`): 오늘의 운세, 일주 궁합 테스트, 띠별 운세, 만세력 계산기 → 앱으로 연결하거나 옮기기
7. Cloudflare Pages에 `inseol.com` 사용자 지정 도메인 추가 → 카페24 DNS 변경
8. 전환이 끝나면 티스토리 글은 비공개로 돌리기 (중복 방지)

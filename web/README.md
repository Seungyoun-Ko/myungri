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
- 분류와 주소 넘기기: `content/blog/site.json`
  - `categories`: 블로그 분류 나무. `parent`로 단계를 만듭니다.
    - 이론공부 › 명리학 › 사주 입문 / 일간과 일주 / 오행과 십신 / 격국과 용신 / 합충과 신살 / 12운성과 운의 흐름
    - 이론공부 › 자미두수
    - 인설생각
  - 목록은 뉴스형(대표 이미지·분류·제목·요약·날짜), 최신 글 먼저, 한 쪽에 20편 (`/blog/`, `/blog/page-2`, `/blog/{분류}`, `/blog/{분류}-2`)
- 상단 주 메뉴는 '만세력 보기'(앱, 첫 화면)와 'Blog' 두 개
  - `assign`: 분류별 글 번호. 분류가 없는 글이 있으면 빌드가 멈춤
  - `redirects`: 내용이 겹쳐 합쳐진 옛 글 → 새 글 (빌드 때 `dist/_redirects`에 301로 들어감)
- 편집 내역: `content/blog/EDIT-REPORT.md`
- 건강정보·자기계발·분류 없음 글(19편)은 옮기지 않기로 함 (주소 전환 후에는 404 안내 페이지가 열림)

**지금은 검색 비노출 상태입니다.** `gen-blog.ts`의 `LIVE = false`라서 글마다 `noindex`가 붙습니다. 티스토리 원본과 중복으로 잡히지 않게 하려는 것입니다.

### inseol.com 주소를 이 사이트로 바꿀 때 할 일

1. (완료) 옮길 글 정리 — 건강정보·자기계발·분류 없음 19편은 옮기지 않음
2. `gen-blog.ts`에서 `LIVE = true`로 바꾸고, 사이트맵에 블로그 글 주소 추가
3. 티스토리 스킨에 있던 확인 코드를 새 사이트 `<head>`에 그대로 넣기
   - 네이버: `<meta name="naver-site-verification" content="e09c176a2600e06d734d80bb465ad1eeea65e62c">`
   - Bing: `<meta name="msvalidate.01" content="B996E832FF07058AEDB2EE767D004A6C">`
   - 구글 애널리틱스: `G-GY2XKRL933`
4. `ads.txt`를 사이트 맨 위(`/ads.txt`)에 두기 (지금은 티스토리가 제공 중)
5. 티스토리의 특수 주소 처리: `/category/...`, `/tag/...` → 새 분류 주소로 넘기는 `_redirects` (`/m/{번호}` 모바일 주소는 이미 처리됨)
6. 블로그의 계산 도구 4개(`/pages/...`): 오늘의 운세, 일주 궁합 테스트, 띠별 운세, 만세력 계산기 → 앱으로 연결하거나 옮기기
7. Cloudflare Pages에 `inseol.com` 사용자 지정 도메인 추가 → 카페24 DNS 변경
8. 전환이 끝나면 티스토리 글은 비공개로 돌리기 (중복 방지)

## 사주 풀이 (쉬운 말 · 풍성한 풀이)

사주 탭의 '풀이'와 운 흐름의 '한 해 운세'는 `src/engine/reading/`에서 만듭니다.

- `types.ts`: 문장 데이터의 모양
- 문장 데이터
  - `day-master-a.ts`, `day-master-b.ts`: 일간 10가지
  - `groups.ts`: 힘의 세기, 가장 많은/거의 없는 십신 무리
  - `elements.ts`: 오행 치우침, 필요한 기운 생활 정보, 격국
  - `love.ts`: 배우자 자리, 인연·재물의 양, 12운성, 합충, 매력
  - `fortune.ts`: 한 해·달마다 운
- `index.ts`: 계산 결과로 문장을 골라 7개 항목(나는 어떤 사람 / 성격 / 일과 적성 / 연애·결혼 / 재물 / 건강 / 사람 관계)과 한 해 운세(분야별 + 12개월)를 조합
  - `big.ts`, `month-detail.ts`, `flow.ts`: 10년 운·이번 달 풀이, 인생 흐름 그래프(10년 운마다 필요한 기운과 맞는 정도 -2~+2)
  - `jami-stars-a.ts`, `jami-stars-b.ts`, `jami-palaces.ts`, `jami.ts`: 자미두수 12자리 풀이(별 이름 대신 '왕의 별' 같은 별명), 대한·유년 '이 시기', 사주·자미두수 종합 풀이

**규칙**: 본문에는 전문 용어·한자·괄호를 쓰지 않습니다. 용어는 항목마다 '명리 근거 보기'에만 나옵니다. `tests/reading.test.ts`가 무작위 300명으로 용어·분량을 검사합니다.

## 영어 버전 (app.inseol.com/en/)

- 페이지: `en/index.html`(웹앱), `en/about.html`, `en/privacy.html`, `en/terms.html`. `<html lang="en">`이면 영어 화면이 됩니다(`src/i18n.ts`의 `tr('한국어', 'English')`).
- 풀이 문장: `src/engine/reading/en/*.ts`가 한국어 파일과 같은 키·구조의 영어판입니다. 조립은 `en/index.ts`(사주·한 해), `en/flow.ts`(10년·달·그래프), `en/jami.ts`(자미두수·종합). 계산 도우미는 `reading/shared.ts`를 함께 씁니다.
- 언어별로 풀이 묶음 하나만 내려받습니다(`src/readings-ko.ts` / `src/readings-en.ts`, `heavy.ts`의 `readingsReady`).
- 용어 영어 이름(십신, 12운성, 궁, 별 이름 등): `src/engine/en-labels.ts`.
- 검사: `tests/reading-en.test.ts` — 본문에 한글·한자·전문 용어·깨진 문장이 없는지, 분량이 충분한지.
- 한국어 문장을 고치면 같은 키의 영어 문장도 함께 고쳐 주세요.

## 해외 출생지

- `src/engine/cities.ts`의 해외 도시(`tz` 있음)는 브라우저의 시간대 자료(IANA)로 그 시각의 UTC 오프셋과 서머타임을 구합니다. 한국 도시는 예전처럼 한국 시각 규칙을 씁니다.
- 절기 비교는 실제 출생 순간(UTC+8), 시주·일주는 기본으로 도시 경도 기준 현지 태양시(끄면 현지 표준시)입니다.
- 서머타임 시작으로 없는 시각은 막고, 끝나서 두 번 있는 시각은 앞/뒤를 고르게 합니다. 검사: `tests/overseas.test.ts`.

## v1.1에서 더한 구조

- **모순 거르기**: `src/engine/reading/tags.ts`(문장 조각의 성향 태그)와 `conflict.ts`(거르개). 새 문장 조각을 더하면 태그도 함께 달아 주세요.
- **궁합**: `src/ui/match-view.ts`(화면, `#/match`), 문장은 `reading/match-a.ts`·`match-b.ts`(+ `en/`). 초대 링크는 `#/match?a=<천간>-<지지>`.
- **결과 링크**: `src/ui/share-link.ts` — 입력값을 `#/r/<코드>`에 담습니다(서버 미전송, 이름 제외).
- **공유 카드**: `src/ui/share-image.ts`의 `saveShareCard`.
- **자미두수 보강 문장**: `reading/jami-palace-stars.ts`(육친·생활 자리), `jami-extra2.ts`(건강·밝기·차성·사화 겹침), 조립 도우미 `jami-build.ts`.
- **신년운세 페이지**: `scripts/gen-newyear.ts`가 `2027/index.html`, `en/2027/index.html`을 만듭니다(`npm run pages`). 문장은 `reading/newyear-2027.ts`(+ `en/`).
- **입력 옵션**: `BirthInput.jasi`('next' 기본 / 'same' 야자시), `BirthInput.leapMode`('mid' 기본 / 'same' / 'next').

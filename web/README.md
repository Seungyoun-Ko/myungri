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

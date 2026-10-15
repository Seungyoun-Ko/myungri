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

## 배포 (inseol.com)

1. GitHub 저장소 Settings → Pages → Source: **GitHub Actions**
2. Custom domain: `inseol.com` (`public/CNAME`에 들어 있음), 도메인 DNS에 GitHub Pages A/AAAA 레코드 또는 CNAME 설정
3. `main`에 합치면 `.github/workflows/deploy-web.yml`이 테스트 → 빌드 → 배포

## AdSense

1. 사이트 공개 후 AdSense에 `inseol.com` 신청
2. 승인되면 `public/ads.txt`를 만들고 `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0` 한 줄을 넣기
3. `index.html`의 AdSense 스크립트 주석을 풀고, `src/ads.ts`에 client ID와 광고 단위 ID 입력
4. AdSense "개인정보 보호 및 메시지"에서 EEA·영국 동의 메시지 설정

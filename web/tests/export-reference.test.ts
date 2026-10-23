// Android 앱 업데이트용 기준 답안 만들기. 평소 npm test에서는 건너뜁니다.
// 실행: EXPORT_REF=1 npx vitest run tests/export-reference.test.ts
// 결과: docs/android/reference-cases.json (웹 v1.4.x, 계산 기준 CALCULATION_BASIS)
import { it } from 'vitest';
import { mkdirSync, writeFileSync } from 'node:fs';
import { normalizeBirth, type BirthInput } from '../src/engine/birth';
import { CALCULATION_BASIS, computeSaju } from '../src/engine/saju';
import { computeJamidusu } from '../src/engine/jamidusu';
import { ELEMENTS_KO } from '../src/engine/constants';
import { iljuTypeKo } from '../src/engine/ilju-type';
import { mbtiLike } from '../src/engine/mbti-like';

/** 같은 결과가 나오도록 고정 씨앗 난수 */
function rng(seed: number) {
  return () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
}

const KR = ['seoul', 'busan', 'daegu', 'gwangju', 'daejeon', 'jeju'];
const OVERSEAS = ['us-new-york', 'us-los-angeles', 'ca-toronto', 'gb-london', 'fr-paris', 'au-sydney', 'jp-tokyo', 'cn-shanghai'];

function cases(): { id: string; input: BirthInput }[] {
  const fixed: { id: string; input: BirthInput }[] = [
    { id: '기획서-1986-11-20-0510-남-서울', input: { gender: 'M', calendar: 'solar', year: 1986, month: 11, day: 20, hour: 5, minute: 10, cityId: 'seoul' } },
    { id: '한로-직전-2026-10-08-1528', input: { gender: 'F', calendar: 'solar', year: 2026, month: 10, day: 8, hour: 15, minute: 28, cityId: 'seoul' } },
    { id: '한로-직후-2026-10-08-1530', input: { gender: 'F', calendar: 'solar', year: 2026, month: 10, day: 8, hour: 15, minute: 30, cityId: 'seoul' } },
    { id: '입춘-직전-2026-02-04-0450-남', input: { gender: 'M', calendar: 'solar', year: 2026, month: 2, day: 4, hour: 4, minute: 50, cityId: 'seoul' } },
    { id: '입춘-직후-2026-02-04-0510-남', input: { gender: 'M', calendar: 'solar', year: 2026, month: 2, day: 4, hour: 5, minute: 10, cityId: 'seoul' } },
    { id: '시간모름-1986-11-20', input: { gender: 'M', calendar: 'solar', year: 1986, month: 11, day: 20, timeUnknown: true, cityId: 'seoul' } },
    { id: '음력윤달-1987-윤6-18', input: { gender: 'F', calendar: 'lunarLeap', year: 1987, month: 6, day: 18, hour: 9, minute: 0, cityId: 'seoul' } },
    { id: '자시-다음날(기본)-1990-05-15-2340', input: { gender: 'F', calendar: 'solar', year: 1990, month: 5, day: 15, hour: 23, minute: 40, cityId: 'seoul' } },
    { id: '자시-당일(야자시)-1990-05-15-2340', input: { gender: 'F', calendar: 'solar', year: 1990, month: 5, day: 15, hour: 23, minute: 40, cityId: 'seoul', jasi: 'same' } },
    { id: '서머타임-1988-07-01-1000', input: { gender: 'M', calendar: 'solar', year: 1988, month: 7, day: 1, hour: 10, minute: 0, cityId: 'seoul' } },
    { id: '해외-뉴욕-1985-11-03-2340', input: { gender: 'M', calendar: 'solar', year: 1985, month: 11, day: 3, hour: 23, minute: 40, cityId: 'us-new-york' } },
    { id: '해외-시드니-2000-01-10-1200', input: { gender: 'F', calendar: 'solar', year: 2000, month: 1, day: 10, hour: 12, minute: 0, cityId: 'au-sydney' } },
  ];
  const r = rng(20261023);
  const pick = <T,>(a: T[]) => a[Math.floor(r() * a.length)];
  const out = [...fixed];
  for (let i = 0; out.length < 300; i++) {
    const year = 1940 + Math.floor(r() * 71);
    const month = 1 + Math.floor(r() * 12);
    const day = 1 + Math.floor(r() * 28);
    const overseas = r() < 0.15;
    const unknown = r() < 0.08;
    const lunar = !overseas && r() < 0.15;
    const input: BirthInput = {
      gender: r() < 0.5 ? 'M' : 'F',
      calendar: lunar ? 'lunar' : 'solar',
      year,
      month,
      day,
      cityId: overseas ? pick(OVERSEAS) : pick(KR),
      ...(unknown ? { timeUnknown: true } : { hour: Math.floor(r() * 24), minute: Math.floor(r() * 60) }),
    };
    out.push({ id: `무작위-${String(i + 1).padStart(3, '0')}`, input });
  }
  return out;
}

const gz = (p: { stem: { hanja: string }; branch: { hanja: string } }) => p.stem.hanja + p.branch.hanja;

it.skipIf(!process.env.EXPORT_REF)('기준 답안 내보내기', () => {
  const rows = [];
  for (const c of cases()) {
    let birth;
    try {
      birth = normalizeBirth(c.input);
    } catch (e) {
      continue; // 서머타임으로 없는 시각 등은 건너뜀
    }
    const s = computeSaju(birth);
    const day = s.pillars.find((p) => p.key === 'day')!;
    let jamidusu = null;
    if (!birth.timeUnknown) {
      const ch = computeJamidusu(birth);
      jamidusu = {
        lunar: ch.lunar,
        ming: ch.palaces[ch.mingBranch].branchHanja,
        shen: ch.palaces[ch.shenBranch].branchHanja,
        shenPalace: ch.shenPalaceName,
        guk: ch.guk.name,
        forward: ch.forward,
        sihwa: Object.fromEntries(ch.sihwa.map((x) => [x.sihwa, x.star])),
        palaces: Object.fromEntries(
          ch.palaces.map((p) => [
            p.branchHanja,
            {
              name: p.name,
              ganzhi: p.ganzhi,
              daehan: `${p.daehan.start}-${p.daehan.end}`,
              main: p.stars.filter((x) => x.kind === 'main').map((x) => `${x.name}${x.brightness ? ' ' + x.brightness : ''}`),
              others: p.stars.filter((x) => x.kind !== 'main').map((x) => x.name),
            },
          ]),
        ),
      };
    }
    const m = mbtiLike(s);
    rows.push({
      id: c.id,
      input: c.input,
      saju: {
        pillars: Object.fromEntries(s.pillars.map((p) => [p.key, gz(p)])),
        uncertainPillars: s.uncertainPillars,
        strengthScore: s.strengthScore,
        strength: s.strengthText,
        yongsin: s.yongsin
          ? { yong: ELEMENTS_KO[s.yongsin.yong], hee: ELEMENTS_KO[s.yongsin.hee], gi: ELEMENTS_KO[s.yongsin.gi], gu: ELEMENTS_KO[s.yongsin.gu] }
          : null,
        geukguk: s.geukgukLabel,
        elementRatios: s.elementRatios,
        tenGodRatios: s.tenGodRatios,
        daeun: {
          forward: s.bigFortuneForward,
          list: s.bigFortunes.map((b) => ({ ganzhi: b.ganzhi, startAge: b.startAge, startYear: b.startYear })),
        },
      },
      jamidusu,
      extras: { iljuType: iljuTypeKo(day.stem.index, day.branch.index), mbtiLike: m?.code ?? null },
    });
  }
  const dir = new URL('../../docs/android/', import.meta.url);
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    new URL('reference-cases.json', dir),
    JSON.stringify(
      {
        _설명: '웹 인설명리 계산 결과(기준 답안). Android 앱이 같은 입력으로 같은 값을 내는지 대조하세요. 형식은 docs/android/APP_UPDATE_GUIDE.md 5장 참고.',
        basis: CALCULATION_BASIS,
        count: rows.length,
        cases: rows,
      },
      null,
      1,
    ),
  );
  console.log('cases', rows.length);
});

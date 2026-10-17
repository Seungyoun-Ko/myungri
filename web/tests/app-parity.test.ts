// Android 앱과 결과 대조. tests/app-cases.json에 앱 화면의 값을 옮겨 적으면 같은지 검사합니다.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { normalizeBirth, type BirthInput } from '../src/engine/birth';
import { computeSaju, type PillarKey } from '../src/engine/saju';
import { computeJamidusu } from '../src/engine/jamidusu';
import { ELEMENTS_KO } from '../src/engine/constants';

interface AppCase {
  name: string;
  input: BirthInput;
  saju?: {
    /** 예: { "hour": "丁巳", "day": "戊辰", "month": "己亥", "year": "丙寅" } */
    pillars?: Partial<Record<PillarKey, string>>;
    strength?: string;
    /** 예: { "yong": "화", "hee": "목", "gi": "수", "gu": "금" } */
    yongsin?: { yong?: string; hee?: string; gi?: string; gu?: string };
    geukguk?: string;
    /** 예: { "startAge": 6, "list": ["庚子", "辛丑"] } */
    daeun?: { startAge?: number; list?: string[] };
    /** 오행 비율(%) 목·화·토·금·수, 소수 첫째 자리 */
    elementRatios?: number[];
  };
  jamidusu?: {
    ming?: string;
    shen?: string;
    guk?: string;
    /** 지지 한자 → { 궁 이름, 주성 "이름 밝기" 목록 } */
    palaces?: Record<string, { name?: string; main?: string[] }>;
    /** 생년 사화: { "록": "천동", "권": "천기", "과": "문창", "기": "염정" } */
    sihwa?: Record<string, string>;
  };
}

const data = JSON.parse(readFileSync(new URL('./app-cases.json', import.meta.url), 'utf8')) as { cases: AppCase[] };

describe('Android 앱 결과 대조', () => {
  for (const c of data.cases) {
    it(c.name, () => {
      const birth = normalizeBirth(c.input);
      const s = computeSaju(birth);
      const ex = c.saju;
      if (ex?.pillars) {
        for (const [k, v] of Object.entries(ex.pillars)) {
          const p = s.pillars.find((x) => x.key === k);
          expect(p ? p.stem.hanja + p.branch.hanja : '(없음)', `${k} 기둥`).toBe(v);
        }
      }
      if (ex?.strength) expect(s.strengthText, '강약').toBe(ex.strength);
      if (ex?.geukguk) expect(s.geukgukLabel, '격국').toBe(ex.geukguk);
      if (ex?.yongsin && s.yongsin) {
        for (const [k, v] of Object.entries(ex.yongsin)) expect(ELEMENTS_KO[s.yongsin[k as keyof typeof s.yongsin]], k).toBe(v);
      }
      if (ex?.daeun?.startAge !== undefined) expect(s.bigFortunes[0]?.startAge, '대운 시작 나이').toBe(ex.daeun.startAge);
      if (ex?.daeun?.list) expect(s.bigFortunes.slice(0, ex.daeun.list.length).map((b) => b.ganzhi), '대운').toEqual(ex.daeun.list);
      if (ex?.elementRatios) expect(s.elementRatios, '오행 비율').toEqual(ex.elementRatios);

      const jx = c.jamidusu;
      if (jx) {
        const chart = computeJamidusu(birth);
        if (jx.ming) expect(chart.palaces[chart.mingBranch].branchHanja, '명궁').toBe(jx.ming);
        if (jx.shen) expect(chart.palaces[chart.shenBranch].branchHanja, '신궁').toBe(jx.shen);
        if (jx.guk) expect(chart.guk.name, '오행국').toBe(jx.guk);
        for (const [br, want] of Object.entries(jx.palaces ?? {})) {
          const p = chart.palaces.find((x) => x.branchHanja === br)!;
          if (want.name) expect(p.name, `${br} 궁 이름`).toBe(want.name);
          if (want.main) {
            const got = p.stars.filter((x) => x.kind === 'main').map((x) => `${x.name}${x.brightness ? ' ' + x.brightness : ''}`);
            expect([...got].sort(), `${br} 주성과 밝기`).toEqual([...want.main].sort());
          }
        }
        for (const [hw, star] of Object.entries(jx.sihwa ?? {})) {
          expect(chart.sihwa.find((x) => x.sihwa === hw)?.star, `화${hw}`).toBe(star);
        }
      }
    });
  }
});

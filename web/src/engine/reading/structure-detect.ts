// 사주 구조(관살혼잡, 식상생재 …) 감지. 십신 비율과 강약으로 정하며, 데이터 없는 계산만 합니다.
import type { SajuResult } from '../saju';
import type { StructureKey } from './types';
import { groupRatios } from './shared';

export const STRUCTURE_NAME_KO: Record<StructureKey, string> = {
  gwansalHonjap: '관살혼잡', jaedaSinyak: '재다신약', siksinJesal: '식신제살', sanggwanGyeongwan: '상관견관', gungeopJaengjae: '군겁쟁재',
  insuGwada: '인수과다', siksangSaengjae: '식상생재', salinSangsaeng: '살인상생', jaesaengGwan: '재생관', sanggwanPaein: '상관패인',
  siksangGwada: '식상과다', gwansalGwada: '관살과다', bigeopGwada: '비겁과다', jaegwanSsangmi: '재관쌍미',
};
export const STRUCTURE_NAME_EN: Record<StructureKey, string> = {
  gwansalHonjap: 'Mixed Officers', jaedaSinyak: 'Wealth Heavy, Self Weak', siksinJesal: 'Eating God Tames Killings', sanggwanGyeongwan: 'Hurting Officer Meets Officer',
  gungeopJaengjae: 'Rivals Compete for Wealth', insuGwada: 'Excess Resource', siksangSaengjae: 'Output Generates Wealth', salinSangsaeng: 'Killings Transformed by Resource',
  jaesaengGwan: 'Wealth Supports Officer', sanggwanPaein: 'Hurting Officer with Resource', siksangGwada: 'Excess Output', gwansalGwada: 'Excess Officers',
  bigeopGwada: 'Excess Companions', jaegwanSsangmi: 'Wealth and Officer in Harmony',
};

/** 해당하는 구조를 중요한 순서로 (최대 max개) */
export function detectStructures(r: SajuResult, max = 2): StructureKey[] {
  const tg = r.tenGodRatios;
  if (!tg || !r.strengthText) return [];
  const g = groupRatios(r);
  const weak = r.strengthText === '신약' || r.strengthText === '극약';
  const strong = r.strengthText === '신강' || r.strengthText === '극강';
  const out: StructureKey[] = [];
  const add = (cond: boolean, k: StructureKey) => cond && out.push(k);
  // 치우침이 큰 것(과다·혼잡)부터, 그다음 흐름이 이어지는 구조
  add(g['재성'] >= 35 && weak, 'jaedaSinyak');
  add(g['관성'] >= 40 && weak, 'gwansalGwada');
  add(g['식상'] >= 40 && weak, 'siksangGwada');
  add(g['인성'] >= 45, 'insuGwada');
  add(g['비겁'] >= 45 && g['재성'] < 5 && strong, 'bigeopGwada');
  add(g['비겁'] >= 40 && g['재성'] >= 5 && g['재성'] <= 20, 'gungeopJaengjae');
  add(tg['편관'] >= 10 && tg['정관'] >= 10, 'gwansalHonjap');
  add(tg['상관'] >= 15 && tg['정관'] >= 10, 'sanggwanGyeongwan');
  add(tg['식신'] >= 15 && tg['편관'] >= 15, 'siksinJesal');
  add(g['관성'] >= 20 && g['인성'] >= 20, 'salinSangsaeng');
  add(tg['상관'] >= 15 && g['인성'] >= 20, 'sanggwanPaein');
  add(g['식상'] >= 20 && g['재성'] >= 20 && !weak, 'siksangSaengjae');
  add(g['재성'] >= 20 && g['관성'] >= 20 && !weak, 'jaesaengGwan');
  add(tg['정재'] >= 10 && tg['정관'] >= 10 && !weak, 'jaegwanSsangmi');
  return out.slice(0, max);
}

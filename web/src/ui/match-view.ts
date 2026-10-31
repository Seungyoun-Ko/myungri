// 두 사람 궁합 (일간 궁합 + 일지 관계). 초대 링크에는 생년월일 없이 일주 번호만 담습니다: #/match?a=<천간>-<지지>
import { BRANCH_CHUNG, BRANCH_HAP, pairKey } from '../engine/saju';
import { BRANCHES_HANJA, STEMS_HANJA, STEMS_KO, BRANCHES_KO, branchIndex, stemIndex } from '../engine/constants';
import { toSolarDate, type CalendarType } from '../engine/birth';
import { dayPillars } from '../engine/calendar';
import { iljuTypeEn, iljuTypeKo } from '../engine/ilju-type';
import { ganzhiEn } from '../engine/en-labels';
import { R } from './readings';
import { EN, tr } from '../i18n';
import { $, esc, toast } from './dom';
import { KAKAO_SITE, shareKakao } from './kakao';

export interface DayPillarCode {
  stem: number;
  branch: number;
}

export const parseCode = (v: string | null): DayPillarCode | null => {
  const m = v?.match(/^(\d)-(\d{1,2})$/);
  if (!m) return null;
  const stem = Number(m[1]);
  const branch = Number(m[2]);
  return stem < 10 && branch < 12 && stem % 2 === branch % 2 ? { stem, branch } : null;
};

const typeName = (p: DayPillarCode) => (EN ? iljuTypeEn(p.stem, p.branch) : iljuTypeKo(p.stem, p.branch));
const iljuLabel = (p: DayPillarCode) =>
  `${STEMS_HANJA[p.stem]}${BRANCHES_HANJA[p.branch]} ${EN ? ganzhiEn(p.stem, p.branch) : `${STEMS_KO[p.stem]}${BRANCHES_KO[p.branch]}일주`}`;

function pillarOf(cal: CalendarType, y: number, m: number, d: number): DayPillarCode {
  const { solar } = toSolarDate({ gender: 'F', calendar: cal, year: y, month: m, day: d });
  const gz = dayPillars(solar.year, solar.month, solar.day).day;
  return { stem: stemIndex(gz[0]), branch: branchIndex(gz[1]) };
}

function dateForm(id: string, title: string) {
  return `<div class="field" data-person="${id}">
    <span class="label">${title}</span>
    <div class="segmented" data-cal="${id}" role="radiogroup">
      <button type="button" data-value="solar" aria-selected="true">${tr('양력', 'Solar')}</button>
      <button type="button" data-value="lunar" aria-selected="false">${tr('음력', 'Lunar')}</button>
    </div>
    <div class="row" style="margin-top:8px">
      <div class="unit"><input id="${id}-y" type="number" inputmode="numeric" min="1900" max="2050" placeholder="" aria-label="${tr('년', 'Year')}"><span>${tr('년', 'Y')}</span></div>
      <div class="unit"><input id="${id}-m" type="number" inputmode="numeric" min="1" max="12" placeholder="" aria-label="${tr('월', 'Month')}"><span>${tr('월', 'M')}</span></div>
      <div class="unit"><input id="${id}-d" type="number" inputmode="numeric" min="1" max="31" placeholder="" aria-label="${tr('일', 'Day')}"><span>${tr('일', 'D')}</span></div>
    </div>
  </div>`;
}

function resultHtml(a: DayPillarCode, b: DayPillarCode) {
  const key = a.stem <= b.stem ? `${a.stem}-${b.stem}` : `${b.stem}-${a.stem}`;
  const pair = R.match.pairs[key];
  const rel = a.branch === b.branch ? 'same' : BRANCH_CHUNG.has(pairKey(a.branch, b.branch)) ? 'chung' : BRANCH_HAP[pairKey(a.branch, b.branch)] !== undefined ? 'hap' : null;
  if (!pair) return '';
  return `<div class="card" style="margin-top:14px">
    <div class="hero-type" style="justify-content:center;text-align:center"><b>${esc(typeName(a))}</b> <span>×</span> <b>${esc(typeName(b))}</b></div>
    <div class="rd" style="margin-top:10px">
      <div class="rd-headline"><p>${esc(pair.title)}</p></div>
      <div class="rd-text"><p>${esc(pair.summary)}</p></div>
      <div class="rd-two">
        <div class="rd-box good"><h4>${tr('잘 맞는 점', 'Where you click')}</h4><p>${esc(pair.together)}</p></div>
        <div class="rd-box warn"><h4>${tr('부딪치기 쉬운 점', 'Where you clash')}</h4><p>${esc(pair.friction)}</p></div>
      </div>
      ${rel ? `<div class="rd-text"><p>${esc(R.match.branch[rel])}</p></div>` : ''}
      <div class="rd-box tip"><h4>${tr('둘이 함께 해 보면 좋은 것', 'Try this together')}</h4><ol>${pair.tips.map((t) => `<li>${esc(t)}</li>`).join('')}</ol></div>
      <details class="rd-basis"><summary>${tr('명리 근거 보기', 'Chart basis')}</summary><ul>
        <li>${esc(iljuLabel(a))} × ${esc(iljuLabel(b))}</li>
        <li>${tr('일간 궁합', 'Day Master pairing')}: ${STEMS_HANJA[a.stem]} · ${STEMS_HANJA[b.stem]}</li>
        ${rel ? `<li>${tr('일지 관계', 'Day branches')}: ${BRANCHES_HANJA[a.branch]}${BRANCHES_HANJA[b.branch]} ${rel === 'hap' ? tr('육합', 'combination') : rel === 'chung' ? tr('충', 'clash') : tr('같은 글자', 'same branch')}</li>` : ''}
      </ul></details>
    </div>
    <p class="disclaimer">${tr('두 사람의 타고난 기운을 비교한 참고용 풀이예요. 관계의 좋고 나쁨을 정하지 않아요.', 'A reflection on how two temperaments meet. It does not decide whether a relationship is good or bad.')}</p>
  </div>`;
}

export function inviteLink(p: DayPillarCode) {
  return `${location.origin}${location.pathname}#/match?a=${p.stem}-${p.branch}`;
}

/**
 * 궁합 화면. inviter: 초대 링크의 일주, mine: 지금 보고 있는 내 결과의 일주.
 */
export function renderMatch(root: HTMLElement, inviter: DayPillarCode | null, mine: DayPillarCode | null) {
  const first = inviter ?? mine;
  root.innerHTML = `<div class="layout" style="gap:14px"><section class="input-pane">
    <div class="hero"><h1>${tr('두 사람 궁합', 'Compatibility')}</h1>
      <p>${tr('두 사람이 태어난 날의 기운으로 서로 잘 맞는 점과 부딪치는 점을 쉬운 말로 풀어 드려요. 생년월일만 있으면 돼요.', 'See where two people click and where they clash, based on the energy of the day each was born. Birth dates are all you need.')}</p></div>
    <form class="card form" novalidate>
      ${first
        ? `<div class="field"><span class="label">${inviter ? tr('나를 초대한 사람', 'The person who invited you') : tr('나', 'You')}</span><p><b>${esc(typeName(first))}</b> <span class="small muted hanja">${esc(iljuLabel(first))}</span></p></div>`
        : dateForm('pa', tr('첫 번째 사람 생년월일', "First person's birth date"))}
      ${dateForm('pb', inviter ? tr('내 생년월일', 'Your birth date') : tr('상대 생년월일', "The other person's birth date"))}
      <p class="error" id="m-error" role="alert" hidden></p>
      <button class="btn block" type="submit">${tr('궁합 보기', 'See compatibility')}</button>
      <p class="small muted">${tr('생년월일은 이 브라우저 안에서만 계산해요. 초대 링크에는 생년월일이 아니라 일주만 들어가요.', 'Birth dates are calculated in your browser only. Invite links carry just a day pillar, never a birth date.')}</p>
    </form>
    ${mine ? `<div class="card"><h2 style="font-size:1rem">${tr('내 궁합 초대 링크', 'Invite someone')}</h2><p class="small muted">${tr('링크를 받은 사람이 자기 생년월일만 넣으면 둘의 궁합이 나와요.', 'Whoever opens the link just enters their birth date to see your match.')}</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">${EN ? '' : '<button type="button" class="btn small kakao" data-invite-kakao>카카오톡으로 초대</button>'}<button type="button" class="btn small${EN ? '' : ' ghost'}" data-invite>${tr('초대 링크 복사', 'Send invite link')}</button></div></div>` : ''}
  </section><section id="match-result"></section></div>`;

  const form = $<HTMLFormElement>('form', root);
  const cal: Record<string, CalendarType> = { pa: 'solar', pb: 'solar' };
  root.querySelectorAll<HTMLElement>('[data-cal]').forEach((g) =>
    g.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('button');
      if (!btn) return;
      g.querySelectorAll('button').forEach((x) => x.setAttribute('aria-selected', String(x === btn)));
      cal[g.dataset.cal!] = btn.dataset.value as CalendarType;
    }),
  );
  const read = (id: string) => {
    const n = (k: string) => Number(($(`#${id}-${k}`, form) as HTMLInputElement).value);
    return pillarOf(cal[id], n('y'), n('m'), n('d'));
  };
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const err = $('#m-error', form);
    try {
      const a = first ?? read('pa');
      const b = read('pb');
      err.hidden = true;
      const out = $('#match-result', root);
      out.innerHTML = resultHtml(a, b);
      // 넓은 화면은 입력 옆 오른쪽 칸에, 휴대폰은 아래에 보여 주고, 어느 쪽이든 결과 위치로 이동합니다.
      root.querySelector('.layout')?.classList.add('with-result');
      requestAnimationFrame(() => out.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    } catch {
      err.textContent = tr('생년월일(년·월·일)을 모두 정확히 입력해 주세요. 1900~2050년까지 볼 수 있어요.', 'Please fill in the full birth date (year, month, day), between 1900 and 2050.');
      err.hidden = false;
      err.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
  root.querySelector('[data-invite-kakao]')?.addEventListener('click', () => {
    const p = mine!;
    void shareKakao({
      title: `'${typeName(p)}'의 궁합 초대가 왔어요`,
      description: '생년월일만 넣으면 우리 둘의 궁합을 쉬운 말로 풀어 줘요. 생년월일은 서버로 보내지 않아요.',
      url: `${KAKAO_SITE}/#/match?a=${p.stem}-${p.branch}`,
      buttons: [{ title: '우리 궁합 보기', url: `${KAKAO_SITE}/#/match?a=${p.stem}-${p.branch}` }],
    });
  });
  root.querySelector('[data-invite]')?.addEventListener('click', async () => {
    const url = inviteLink(mine!);
    const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
    if (nav.share && window.matchMedia('(pointer: coarse)').matches) {
      try {
        await nav.share({ url, title: tr('우리 궁합 볼래?', 'Check our compatibility?') });
        return;
      } catch (e) {
        if ((e as DOMException).name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast(tr('초대 링크를 복사했어요.', 'Invite link copied.'));
    } catch {
      window.prompt(tr('이 링크를 복사하세요', 'Copy this link'), url);
    }
  });
}

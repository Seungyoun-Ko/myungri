// 입력 화면 (기획서 2.2)
import { CITIES, DEFAULT_CITY_ID } from '../engine/cities';
import { BirthInputError, type BirthInput, dstState, normalizeBirth, toSolarDate } from '../engine/birth';
import { $, $$, esc } from './dom';

const DEFAULT_INPUT: BirthInput = {
  name: '',
  gender: 'F',
  calendar: 'solar',
  year: 1990,
  month: 1,
  day: 1,
  hour: 12,
  minute: 0,
  timeUnknown: false,
  cityId: DEFAULT_CITY_ID,
  useLongitude: false,
  fold: 'first',
};

const seg = (name: string, value: string, options: [string, string][]) =>
  `<div class="segmented" role="radiogroup" data-seg="${name}">${options
    .map(([v, label]) => `<button type="button" role="radio" data-value="${v}" aria-selected="${v === value}" aria-checked="${v === value}">${label}</button>`)
    .join('')}</div>`;

export function renderInput(root: HTMLElement, initial: BirthInput | null, onSubmit: (input: BirthInput) => void) {
  const v = { ...DEFAULT_INPUT, ...(initial ?? {}) };
  const regions = [...new Set(CITIES.map((c) => c.region))];

  root.innerHTML = `
    <form class="card form" novalidate aria-label="출생 정보 입력">
      <div class="field">
        <label for="f-name">이름</label>
        <input id="f-name" type="text" maxlength="20" placeholder="이름 입력 (선택)" value="${esc(v.name)}" autocomplete="off">
      </div>
      <div class="field"><span class="label">성별</span>${seg('gender', v.gender, [['F', '여자'], ['M', '남자']])}</div>
      <div class="field"><span class="label">달력</span>${seg('calendar', v.calendar, [['solar', '양력'], ['lunar', '음력'], ['lunarLeap', '음력 윤달']])}</div>
      <div class="field">
        <span class="label">생년월일</span>
        <div class="row">
          <div class="unit"><input id="f-year" type="number" inputmode="numeric" min="1900" max="2050" value="${v.year}" aria-label="년"><span>년</span></div>
          <div class="unit"><input id="f-month" type="number" inputmode="numeric" min="1" max="12" value="${v.month}" aria-label="월"><span>월</span></div>
          <div class="unit"><input id="f-day" type="number" inputmode="numeric" min="1" max="31" value="${v.day}" aria-label="일"><span>일</span></div>
        </div>
      </div>
      <div class="field">
        <span class="label">출생시간</span>
        <div class="row two">
          <div class="unit"><input id="f-hour" type="number" inputmode="numeric" min="0" max="23" value="${v.hour ?? 12}" aria-label="시"><span>시</span></div>
          <div class="unit"><input id="f-minute" type="number" inputmode="numeric" min="0" max="59" value="${v.minute ?? 0}" aria-label="분"><span>분</span></div>
        </div>
        <label class="check"><input id="f-unknown" type="checkbox" ${v.timeUnknown ? 'checked' : ''}> 출생시간 모름</label>
      </div>
      <div class="field" id="fold-field" hidden>
        <span class="label">같은 시각이 두 번 있어요</span>
        <p class="small muted" style="margin-bottom:6px">서머타임이 끝나며 시계를 한 시간 되돌린 날이에요. 어느 쪽이었는지 골라 주세요.</p>
        ${seg('fold', v.fold ?? 'first', [['first', '앞 (서머타임)'], ['second', '뒤 (표준시)']])}
      </div>
      <div class="field">
        <label for="f-city">출생 지역</label>
        <select id="f-city">${regions
          .map((r) => `<optgroup label="${r}">${CITIES.filter((c) => c.region === r).map((c) => `<option value="${c.id}" ${c.id === v.cityId ? 'selected' : ''}>${c.name}</option>`).join('')}</optgroup>`)
          .join('')}</select>
        <label class="check"><input id="f-longitude" type="checkbox" ${v.useLongitude ? 'checked' : ''}> 지역 경도 보정 사용</label>
      </div>
      <p class="error" id="f-error" role="alert" hidden></p>
      <button class="btn block" type="submit">결과 보기</button>
      <p class="small muted">출생 정보는 이 브라우저 안에서만 계산해요. 서버로 보내지 않아요.</p>
    </form>`;

  const form = $<HTMLFormElement>('form', root);
  const state = { gender: v.gender, calendar: v.calendar, fold: v.fold ?? 'first' } as Pick<BirthInput, 'gender' | 'calendar' | 'fold'>;

  $$('[data-seg]', form).forEach((group) => {
    group.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('button');
      if (!btn) return;
      $$('button', group).forEach((b) => {
        b.setAttribute('aria-selected', String(b === btn));
        b.setAttribute('aria-checked', String(b === btn));
      });
      (state as Record<string, string>)[group.dataset.seg!] = btn.dataset.value!;
      refresh();
    });
  });

  const num = (id: string) => Number(($(`#${id}`, form) as HTMLInputElement).value);
  const unknown = $<HTMLInputElement>('#f-unknown', form);

  const collect = (): BirthInput => ({
    name: $<HTMLInputElement>('#f-name', form).value.trim(),
    gender: state.gender,
    calendar: state.calendar,
    year: num('f-year'),
    month: num('f-month'),
    day: num('f-day'),
    hour: unknown.checked ? undefined : num('f-hour'),
    minute: unknown.checked ? undefined : num('f-minute'),
    timeUnknown: unknown.checked,
    cityId: $<HTMLSelectElement>('#f-city', form).value,
    useLongitude: $<HTMLInputElement>('#f-longitude', form).checked,
    fold: state.fold,
  });

  function refresh() {
    $$<HTMLInputElement>('#f-hour, #f-minute', form).forEach((i) => (i.disabled = unknown.checked));
    // 서머타임 겹침 구간이면 앞/뒤 선택을 보여 줍니다.
    let inFold = false;
    if (!unknown.checked) {
      try {
        const inp = collect();
        const { solar } = toSolarDate(inp);
        inFold = dstState({ ...solar, hour: inp.hour ?? 0, minute: inp.minute ?? 0 }) === 'fold';
      } catch {
        inFold = false;
      }
    }
    $('#fold-field', form).hidden = !inFold;
  }

  form.addEventListener('input', refresh);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const err = $('#f-error', form);
    const input = collect();
    const bad = [input.year, input.month, input.day, input.hour ?? 0, input.minute ?? 0].some((n) => !Number.isInteger(n));
    if (bad) {
      err.textContent = '숫자를 정확히 입력해 주세요.';
      err.hidden = false;
      return;
    }
    if (!input.timeUnknown && (input.hour! < 0 || input.hour! > 23 || input.minute! < 0 || input.minute! > 59)) {
      err.textContent = '시간은 0시 0분부터 23시 59분까지 입력할 수 있어요.';
      err.hidden = false;
      return;
    }
    try {
      normalizeBirth(input);
    } catch (ex) {
      err.textContent = ex instanceof BirthInputError ? ex.message : '입력을 확인해 주세요.';
      err.hidden = false;
      return;
    }
    err.hidden = true;
    onSubmit(input);
  });
  refresh();
}

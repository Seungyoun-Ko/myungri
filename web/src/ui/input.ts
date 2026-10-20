// 입력 화면 (기획서 2.2)
import { CITIES, DEFAULT_CITY_ID, cityById } from '../engine/cities';
import { BirthInputError, type BirthErrorCode, type BirthInput, clockStateFor, normalizeBirth, toSolarDate } from '../engine/birth';
import { EN, tr } from '../i18n';
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
  cityId: EN ? 'us-new-york' : DEFAULT_CITY_ID,
  useLongitude: false,
  fold: 'first',
  solarTime: true,
};

const ERROR_EN: Record<BirthErrorCode, string> = {
  noDate: 'That date does not exist.',
  noLunar: 'That lunar date does not exist.',
  noLeap: 'That year has no such leap month, or the date does not exist.',
  range: 'Dates from January 1, 1900 to December 31, 2050 are supported.',
  dstGap: 'That time did not exist: clocks jumped forward an hour for daylight saving.',
  skipped1961: 'That time did not exist: Korea changed its standard time on August 10, 1961.',
  tzGap: 'That time did not exist in this place: clocks jumped forward for daylight saving.',
};

/** 도시 목록: 한국어 화면은 한국 도시 먼저, 영어 화면은 해외 도시 먼저 */
function cityOptions(selected: string) {
  const groups = new Map<string, typeof CITIES>();
  for (const c of CITIES) {
    const g = c.tz ? (EN ? c.regionEn! : `해외 · ${c.region}`) : EN ? 'South Korea' : c.region;
    groups.set(g, [...(groups.get(g) ?? []), c]);
  }
  const entries = [...groups.entries()];
  if (EN) entries.sort((a, b) => Number(a[0] === 'South Korea') - Number(b[0] === 'South Korea'));
  return entries
    .map(([g, cs]) => `<optgroup label="${g}">${cs.map((c) => `<option value="${c.id}" ${c.id === selected ? 'selected' : ''}>${EN ? c.en : c.name}</option>`).join('')}</optgroup>`)
    .join('');
}

const seg = (name: string, value: string, options: [string, string][]) =>
  `<div class="segmented" role="radiogroup" data-seg="${name}">${options
    .map(([v, label]) => `<button type="button" role="radio" data-value="${v}" aria-selected="${v === value}" aria-checked="${v === value}">${label}</button>`)
    .join('')}</div>`;

export function renderInput(root: HTMLElement, initial: BirthInput | null, onSubmit: (input: BirthInput) => void) {
  const v = { ...DEFAULT_INPUT, ...(initial ?? {}) };

  root.innerHTML = `
    <form class="card form" novalidate aria-label="${tr('출생 정보 입력', 'Enter birth details')}">
      <div class="field">
        <label for="f-name">${tr('이름', 'Name')}</label>
        <input id="f-name" type="text" maxlength="20" placeholder="${tr('이름 입력 (선택)', 'Name (optional)')}" value="${esc(v.name)}" autocomplete="off">
      </div>
      <div class="field"><span class="label">${tr('성별', 'Gender')}</span>${seg('gender', v.gender, [['F', tr('여자', 'Female')], ['M', tr('남자', 'Male')]])}</div>
      <div class="field"><span class="label">${tr('달력', 'Calendar')}</span>${seg('calendar', v.calendar, [['solar', tr('양력', 'Solar')], ['lunar', tr('음력', 'Lunar')], ['lunarLeap', tr('음력 윤달', 'Lunar leap')]])}</div>
      <div class="field">
        <span class="label">${tr('생년월일', 'Date of birth')}</span>
        <div class="row">
          <div class="unit"><input id="f-year" type="number" inputmode="numeric" min="1900" max="2050" value="${v.year}" aria-label="${tr('년', 'Year')}"><span>${tr('년', 'Y')}</span></div>
          <div class="unit"><input id="f-month" type="number" inputmode="numeric" min="1" max="12" value="${v.month}" aria-label="${tr('월', 'Month')}"><span>${tr('월', 'M')}</span></div>
          <div class="unit"><input id="f-day" type="number" inputmode="numeric" min="1" max="31" value="${v.day}" aria-label="${tr('일', 'Day')}"><span>${tr('일', 'D')}</span></div>
        </div>
      </div>
      <div class="field">
        <span class="label">${tr('출생시간', 'Time of birth (24h)')}</span>
        <div class="row two">
          <div class="unit"><input id="f-hour" type="number" inputmode="numeric" min="0" max="23" value="${v.hour ?? 12}" aria-label="${tr('시', 'Hour')}"><span>${tr('시', 'h')}</span></div>
          <div class="unit"><input id="f-minute" type="number" inputmode="numeric" min="0" max="59" value="${v.minute ?? 0}" aria-label="${tr('분', 'Minute')}"><span>${tr('분', 'min')}</span></div>
        </div>
        <label class="check"><input id="f-unknown" type="checkbox" ${v.timeUnknown ? 'checked' : ''}> ${tr('출생시간 모름', "I don't know my birth time")}</label>
      </div>
      <div class="field" id="fold-field" hidden>
        <span class="label">${tr('같은 시각이 두 번 있어요', 'This time happened twice')}</span>
        <p class="small muted" style="margin-bottom:6px">${tr('서머타임이 끝나며 시계를 한 시간 되돌린 날이에요. 어느 쪽이었는지 골라 주세요.', 'Clocks were set back an hour for the end of daylight saving that day. Which one was it?')}</p>
        ${seg('fold', v.fold ?? 'first', [['first', tr('앞 (서머타임)', 'First (daylight time)')], ['second', tr('뒤 (표준시)', 'Second (standard time)')]])}
      </div>
      <div class="field">
        <label for="f-city">${tr('출생 지역', 'Place of birth')}</label>
        <select id="f-city">${cityOptions(v.cityId ?? DEFAULT_CITY_ID)}</select>
        <label class="check" id="kr-longitude"><input id="f-longitude" type="checkbox" ${v.useLongitude ? 'checked' : ''}> ${tr('지역 경도 보정 사용', 'Apply local longitude correction')}</label>
        <label class="check" id="world-solar"><input id="f-solar" type="checkbox" ${v.solarTime !== false ? 'checked' : ''}> ${tr('현지 태양시로 보기 (권장)', 'Use local solar time (recommended)')}</label>
        <p class="small muted">${tr('목록에 없으면 같은 시간대의 가까운 도시를 고르세요.', 'Not listed? Pick a nearby city in the same time zone.')}</p>
      </div>
      <p class="error" id="f-error" role="alert" hidden></p>
      <button class="btn block" type="submit">${tr('결과 보기', 'See my chart')}</button>
      <p class="small muted">${tr('출생 정보는 이 브라우저 안에서만 계산해요. 서버로 보내지 않아요.', 'Your birth details are calculated right here in your browser and never sent to a server.')}</p>
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
    solarTime: $<HTMLInputElement>('#f-solar', form).checked,
  });

  function refresh() {
    $$<HTMLInputElement>('#f-hour, #f-minute', form).forEach((i) => (i.disabled = unknown.checked));
    // 서머타임 겹침 구간이면 앞/뒤 선택을 보여 줍니다.
    let inFold = false;
    if (!unknown.checked) {
      try {
        const inp = collect();
        const { solar } = toSolarDate(inp);
        inFold = clockStateFor(cityById(inp.cityId ?? DEFAULT_CITY_ID), { ...solar, hour: inp.hour ?? 0, minute: inp.minute ?? 0 }) === 'fold';
      } catch {
        inFold = false;
      }
    }
    $('#fold-field', form).hidden = !inFold;
    const overseas = !!cityById($<HTMLSelectElement>('#f-city', form).value).tz;
    $('#kr-longitude', form).hidden = overseas;
    $('#world-solar', form).hidden = !overseas;
  }

  form.addEventListener('input', refresh);
  form.addEventListener('change', refresh);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const err = $('#f-error', form);
    const input = collect();
    const bad = [input.year, input.month, input.day, input.hour ?? 0, input.minute ?? 0].some((n) => !Number.isInteger(n));
    if (bad) {
      err.textContent = tr('숫자를 정확히 입력해 주세요.', 'Please enter whole numbers.');
      err.hidden = false;
      return;
    }
    if (!input.timeUnknown && (input.hour! < 0 || input.hour! > 23 || input.minute! < 0 || input.minute! > 59)) {
      err.textContent = tr('시간은 0시 0분부터 23시 59분까지 입력할 수 있어요.', 'Enter a time from 0:00 to 23:59.');
      err.hidden = false;
      return;
    }
    try {
      normalizeBirth(input);
    } catch (ex) {
      err.textContent = ex instanceof BirthInputError ? (EN ? ERROR_EN[ex.code] : ex.message) : tr('입력을 확인해 주세요.', 'Please check your details.');
      err.hidden = false;
      return;
    }
    err.hidden = true;
    onSubmit(input);
  });
  refresh();
}

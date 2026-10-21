// 보관함 탭 (기획서 2.7)
import { archive, type ArchiveEntry } from '../archive';
import { esc, pad2, toast } from './dom';
import { EN, LOCALE, tr } from '../i18n';

const MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

let query = '';

export function renderArchive(root: HTMLElement, onOpen: (entry: ArchiveEntry) => void) {
  const all = archive.list();
  const list = all.filter((e) => !query || e.name.includes(query));
  const item = (e: ArchiveEntry) => {
    const b = e.snapshot.birth;
    const day = e.snapshot.saju.pillars.find((p) => p.key === 'day')!;
    const time = b.clock ? `${EN ? ',' : ''} ${pad2(b.clock.hour)}:${pad2(b.clock.minute)}` : tr(' 시간 모름', ', time unknown');
    const born = EN ? `${MONTH_ABBR[b.solar.month - 1]} ${b.solar.day}, ${b.solar.year}` : `${b.solar.year}.${pad2(b.solar.month)}.${pad2(b.solar.day)}`;
    const savedOn = EN ? new Date(e.savedAt).toLocaleDateString(LOCALE, { month: 'short', day: 'numeric', year: 'numeric' }) : new Date(e.savedAt).toLocaleDateString(LOCALE);
    return `<div class="archive-item" style="min-width:0">
      <div class="info" data-open="${e.id}" role="button" tabindex="0">
        <div class="nm">${esc(e.name)} <span class="hanja small muted">${day.stem.hanja}${day.branch.hanja}</span></div>
        <div class="sub">${b.input.gender === 'M' ? tr('남', 'Male') : tr('여', 'Female')} · ${tr('양력', 'Born')} ${born}${time} · ${tr('저장', 'saved')} ${savedOn}</div>
      </div>
      <button type="button" class="icon-btn pin" data-pin="${e.id}" aria-pressed="${e.pinned}" aria-label="${e.pinned ? tr('고정 해제', 'Unpin') : tr('고정', 'Pin')}">${e.pinned ? tr('고정됨', 'Pinned') : tr('고정', 'Pin')}</button>
      <button type="button" class="icon-btn" data-del="${e.id}">${tr('삭제', 'Delete')}</button>
    </div>`;
  };
  root.innerHTML = `<div class="card">
    <h2>${tr('보관함', 'Saved charts')}</h2>
    <p class="small muted" style="margin-bottom:12px">${tr('저장한 결과는 이 브라우저 안에만 보관돼요. 브라우저 데이터를 지우면 함께 지워져요.', 'Saved charts stay in this browser only. Clearing browser data removes them.')}</p>
    ${all.length ? `<input class="search" type="search" placeholder="${tr('이름 검색', 'Search by name')}" value="${esc(query)}" data-search aria-label="${tr('이름 검색', 'Search by name')}">` : ''}
    <div class="archive-list" style="margin-top:12px">
      ${list.length ? list.map(item).join('') : `<p class="notice">${all.length ? tr('검색 결과가 없어요.', 'No saved charts match that name.') : tr('아직 저장한 결과가 없어요. 결과 화면에서 저장을 눌러 보세요.', 'Nothing saved yet. Tap Save on a chart to keep it here.')}</p>`}
    </div>
  </div>`;

  const rerender = () => renderArchive(root, onOpen);
  root.onclick = (ev) => {
    const t = ev.target as HTMLElement;
    const open = t.closest<HTMLElement>('[data-open]');
    if (open) return onOpen(archive.get(open.dataset.open!)!);
    const pin = t.closest<HTMLElement>('[data-pin]');
    if (pin) {
      const e = archive.get(pin.dataset.pin!)!;
      archive.update(e.id, { pinned: !e.pinned });
      return rerender();
    }
    const del = t.closest<HTMLElement>('[data-del]');
    if (del) {
      const gone = archive.remove(del.dataset.del!);
      rerender();
      if (gone) toast(tr(`${gone.name}을(를) 삭제했어요.`, `Deleted ${gone.name}.`), { label: tr('되돌리기', 'Undo'), run: () => { archive.restore(gone); rerender(); } });
    }
  };
  root.onkeydown = (ev) => {
    const open = (ev.target as HTMLElement).closest<HTMLElement>('[data-open]');
    if (open && (ev.key === 'Enter' || ev.key === ' ')) {
      ev.preventDefault();
      onOpen(archive.get(open.dataset.open!)!);
    }
  };
  root.oninput = (ev) => {
    const t = ev.target as HTMLInputElement;
    if (!t.matches('[data-search]')) return;
    query = t.value.trim();
    rerender();
    const s = root.querySelector<HTMLInputElement>('[data-search]')!;
    s.focus();
    s.setSelectionRange(s.value.length, s.value.length);
  };
}

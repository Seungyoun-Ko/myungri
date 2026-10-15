// 보관함 탭 (기획서 2.7)
import { archive, type ArchiveEntry } from '../archive';
import { esc, pad2, toast } from './dom';

let query = '';

export function renderArchive(root: HTMLElement, onOpen: (entry: ArchiveEntry) => void) {
  const all = archive.list();
  const list = all.filter((e) => !query || e.name.includes(query));
  const item = (e: ArchiveEntry) => {
    const b = e.snapshot.birth;
    const day = e.snapshot.saju.pillars.find((p) => p.key === 'day')!;
    const time = b.clock ? ` ${pad2(b.clock.hour)}:${pad2(b.clock.minute)}` : ' 시간 모름';
    return `<div class="archive-item">
      <div class="info" data-open="${e.id}" role="button" tabindex="0">
        <div class="nm">${esc(e.name)} <span class="hanja small muted">${day.stem.hanja}${day.branch.hanja}</span></div>
        <div class="sub">${b.input.gender === 'M' ? '남' : '여'} · 양력 ${b.solar.year}.${pad2(b.solar.month)}.${pad2(b.solar.day)}${time} · 저장 ${new Date(e.savedAt).toLocaleDateString('ko-KR')}</div>
      </div>
      <button type="button" class="icon-btn pin" data-pin="${e.id}" aria-pressed="${e.pinned}" aria-label="${e.pinned ? '고정 해제' : '고정'}">${e.pinned ? '고정됨' : '고정'}</button>
      <button type="button" class="icon-btn" data-del="${e.id}" aria-label="삭제">삭제</button>
    </div>`;
  };
  root.innerHTML = `<div class="card">
    <h2>보관함</h2>
    <p class="small muted" style="margin-bottom:12px">저장한 결과는 이 브라우저 안에만 보관돼요. 브라우저 데이터를 지우면 함께 지워져요.</p>
    ${all.length ? `<input class="search" type="search" placeholder="이름 검색" value="${esc(query)}" data-search aria-label="이름 검색">` : ''}
    <div class="archive-list" style="margin-top:12px">
      ${list.length ? list.map(item).join('') : `<p class="notice">${all.length ? '검색 결과가 없어요.' : '아직 저장한 결과가 없어요. 결과 화면에서 저장을 눌러 보세요.'}</p>`}
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
      if (gone) toast(`${gone.name}을(를) 삭제했어요.`, { label: '되돌리기', run: () => { archive.restore(gone); rerender(); } });
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

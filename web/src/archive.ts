// 보관함: 브라우저 안(localStorage)에만 저장합니다. 서버로 보내지 않습니다.
import type { BirthInput, NormalizedBirth } from './engine/birth';
import type { SajuResult } from './engine/saju';
import type { JamidusuChart } from './engine/jamidusu';

export interface Snapshot {
  birth: NormalizedBirth;
  saju: SajuResult;
  chart: JamidusuChart | null;
}

export interface ArchiveEntry {
  id: string;
  name: string;
  input: BirthInput;
  savedAt: number;
  basis: string;
  pinned: boolean;
  snapshot: Snapshot;
}

const KEY = 'inseol.archive.v1';

function read(): ArchiveEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ArchiveEntry[]) : [];
  } catch {
    return [];
  }
}

function write(list: ArchiveEntry[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
    return true;
  } catch {
    return false;
  }
}

export const archive = {
  list(): ArchiveEntry[] {
    return read().sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.savedAt - a.savedAt);
  },
  get(id: string) {
    return read().find((e) => e.id === id) ?? null;
  },
  save(entry: Omit<ArchiveEntry, 'id' | 'savedAt' | 'pinned'>): ArchiveEntry | null {
    const e: ArchiveEntry = { ...entry, id: crypto.randomUUID?.() ?? String(Date.now()), savedAt: Date.now(), pinned: false };
    return write([e, ...read()]) ? e : null;
  },
  update(id: string, patch: Partial<ArchiveEntry>) {
    write(read().map((e) => (e.id === id ? { ...e, ...patch } : e)));
  },
  remove(id: string): ArchiveEntry | null {
    const all = read();
    const gone = all.find((e) => e.id === id) ?? null;
    write(all.filter((e) => e.id !== id));
    return gone;
  },
  restore(entry: ArchiveEntry) {
    write([entry, ...read().filter((e) => e.id !== entry.id)]);
  },
};

/* Single gateway to localStorage. Everything tolerates missing/corrupt/blocked
   storage — the site must stay fully usable in private mode. */

const KEY = 'ddia2:progress:v1';
export const PROGRESS_EVENT = 'ddia2:progress';

export type ChapterProgress = {
  completed?: string; // ISO date when marked complete
  quiz?: { best: number; total: number; attempts: number };
  flashcards?: { known: string[] };
  assignments?: { revealed: string[] };
};

export type ProgressMap = Record<string, ChapterProgress>;

export function getAll(): ProgressMap {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as ProgressMap) : {};
  } catch {
    return {};
  }
}

export function getChapter(slug: string): ChapterProgress {
  return getAll()[slug] ?? {};
}

export function patchChapter(slug: string, patch: Partial<ChapterProgress>): void {
  try {
    const all = getAll();
    all[slug] = { ...all[slug], ...patch };
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* storage unavailable — behave as session-only */
  }
  window.dispatchEvent(new CustomEvent(PROGRESS_EVENT));
}

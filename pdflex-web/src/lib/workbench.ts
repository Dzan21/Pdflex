// src/lib/workbench.ts
const KEY = "pdflex:workbench:fileIds";

export type Workbench = {
  get(): string[];
  set(ids: string[]): void;
  add(id: string): string[];
  remove(id: string): string[];
  clear(): void;
};

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function write(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify([...new Set(ids)]));
  } catch {}
}

export const workbench: Workbench = {
  get: () => read(),
  set: (ids) => (write(ids), ids),
  add: (id) => {
    const next = [...new Set([...read(), id])];
    write(next);
    return next;
  },
  remove: (id) => {
    const next = read().filter((x) => x !== id);
    write(next);
    return next;
  },
  clear: () => write([]),
};
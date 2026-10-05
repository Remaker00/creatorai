/**
 * Helpers that make the mock services behave like a network API.
 * Everything in this file disappears once services call a real backend.
 */

export function simulateLatency(minMs = 250, maxMs = 550): Promise<void> {
  const ms = minMs + Math.random() * (maxMs - minMs);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let idCounter = 0;
export function createId(prefix: string): string {
  idCounter += 1;
  return `${prefix}_${Date.now().toString(36)}${idCounter}`;
}

export function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

export function clone<T>(value: T): T {
  return structuredClone(value);
}

/** Small localStorage-backed table, standing in for server persistence. */
export function persisted<T>(key: string, seed: () => T) {
  const storageKey = `creatorai:${key}`;
  let cache: T | null = null;

  function read(): T {
    if (cache) return cache;
    try {
      const raw = typeof window === "undefined" ? null : window.localStorage.getItem(storageKey);
      cache = raw ? (JSON.parse(raw) as T) : seed();
    } catch {
      cache = seed();
    }
    return cache;
  }

  function write(next: T): T {
    cache = next;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // Storage unavailable (private mode, quota) — keep the in-memory copy.
    }
    return next;
  }

  return { read, write };
}

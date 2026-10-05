"use client";

import { useCallback, useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY } from "./theme-config";

export type Theme = "light" | "dark";

function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const readTheme = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

/** `theme` is null during SSR/hydration, since only the browser knows the stored choice. */
export function useTheme(): { theme: Theme | null; setTheme: (theme: Theme) => void } {
  const theme = useSyncExternalStore(subscribe, readTheme, () => null);
  const setTheme = useCallback((next: Theme) => {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage blocked — the choice still applies for this page view.
    }
  }, []);
  return { theme, setTheme };
}

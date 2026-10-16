"use client";

import { useCallback, useSyncExternalStore } from "react";
import { readConsent } from "@/lib/consent";

/**
 * A per-game best score kept in this browser's localStorage. Storage can be
 * blocked (private windows, settings), so every access is guarded and the
 * score simply isn't remembered then. Reads go through useSyncExternalStore,
 * so the server and first client render agree (0) with no hydration mismatch.
 *
 * Scores are saved only after the visitor accepts optional storage in the
 * cookie banner (see lib/consent.ts).
 */
const EVENT = "streamui:best-score";

function read(key: string) {
  try {
    return Number(localStorage.getItem(key)) || 0;
  } catch {
    return 0;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useBestScore(game: string) {
  const key = `streamui:${game}-best`;
  const best = useSyncExternalStore(subscribe, () => read(key), () => 0);

  /** Saves `score` if it beats the stored best. */
  const submit = useCallback(
    (score: number) => {
      try {
        if (readConsent() !== "all" || score <= read(key)) return;
        localStorage.setItem(key, String(score));
        window.dispatchEvent(new Event(EVENT));
      } catch {
        // Storage unavailable: nothing to remember.
      }
    },
    [key],
  );

  return [best, submit] as const;
}

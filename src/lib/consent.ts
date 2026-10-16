"use client";

import { useSyncExternalStore } from "react";
import { CONSENT_KEY } from "./consent-key";

/**
 * The visitor's storage choice. Nothing optional is stored before an answer:
 *
 *   "all"        let Google Analytics (when configured) set its cookies,
 *                and remember Labs best scores on this device
 *   "essential"  remember only this choice; GA stays cookieless
 *   null         not asked yet: show the banner, save nothing optional
 *
 * Kept in localStorage. When storage is blocked the choice lives in memory
 * for the visit, so the banner still closes.
 */
export type Consent = "all" | "essential";

export { CONSENT_KEY };
const EVENT = "streamui:consent";
/** Keys removed when a visitor picks "essential". */
const OPTIONAL_PREFIX = "streamui:";

let memory: Consent | null = null;

export function readConsent(): Consent | null {
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    return value === "all" || value === "essential" ? value : memory;
  } catch {
    return memory;
  }
}

export function setConsent(choice: Consent | null) {
  memory = choice;
  try {
    if (choice === null) localStorage.removeItem(CONSENT_KEY);
    else localStorage.setItem(CONSENT_KEY, choice);
    if (choice === "essential") {
      // Drop anything optional saved earlier, like best scores.
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith(OPTIONAL_PREFIX) && key !== CONSENT_KEY) localStorage.removeItem(key);
      }
    }
  } catch {
    // Storage unavailable: the in-memory choice covers this visit.
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/**
 * The current choice. `undefined` on the server and during hydration, so
 * nothing consent-dependent renders until the browser's value is known.
 */
export function useConsent(): Consent | null | undefined {
  return useSyncExternalStore(subscribe, readConsent, () => undefined);
}

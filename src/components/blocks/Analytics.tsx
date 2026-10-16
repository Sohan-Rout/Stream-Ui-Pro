"use client";

import { useEffect } from "react";
import { useConsent } from "@/lib/consent";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Deletes Google Analytics' first-party cookies (_ga, _ga_<id>). */
function clearGaCookies() {
  const host = location.hostname;
  // GA sets its cookies on the top-level domain, so try that and the host.
  const domains = ["", host, `.${host.split(".").slice(-2).join(".")}`];
  for (const name of document.cookie.split(";").map((c) => c.split("=")[0].trim())) {
    if (name !== "_ga" && !name.startsWith("_ga_")) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain ? `; domain=${domain}` : ""}`;
    }
  }
}

/**
 * Passes the cookie banner's answer to Google's Consent Mode. The tag itself
 * is in the page head (GoogleTag.tsx) and starts with consent denied.
 *
 *   Accept          analytics_storage granted: GA may set its cookies
 *   Essential only  denied again, and existing GA cookies are deleted
 *
 * Ad storage, ad user data, and ad personalization stay denied always.
 */
export function Analytics() {
  const consent = useConsent();

  useEffect(() => {
    // undefined: still hydrating, so the head script's default stands.
    if (consent === undefined) return;
    window.gtag?.("consent", "update", { analytics_storage: consent === "all" ? "granted" : "denied" });
    if (consent === "essential") clearGaCookies();
  }, [consent]);

  return null;
}

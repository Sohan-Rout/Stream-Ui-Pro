"use client";

import { useEffect } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { useConsent } from "@/lib/consent";

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
 * Google Analytics 4, only after the visitor accepts the cookie banner.
 *
 * Before an answer, or with "Essential only", the Google tag never loads and
 * sets no cookies. Withdrawing consent later turns the already-loaded tag off
 * (GA's documented `ga-disable-<id>` flag) and deletes its cookies.
 */
export function Analytics({ gaId }: { gaId: string }) {
  const consent = useConsent();
  const allowed = consent === "all";

  useEffect(() => {
    window[`ga-disable-${gaId}`] = !allowed;
    if (consent === "essential") clearGaCookies();
  }, [gaId, allowed, consent]);

  return allowed ? <GoogleAnalytics gaId={gaId} /> : null;
}

import { CONSENT_KEY } from "@/lib/consent-key";

/**
 * Google's tag (gtag.js) in the page <head>, with Consent Mode v2.
 *
 * It's plain HTML, not loaded after hydration, so Google's tag checker finds
 * it. Before the snippet configures GA, it sets every consent type to
 * "denied": GA then sets no cookies and sends only cookieless pings. A
 * returning visitor who already accepted starts as "granted", read straight
 * from localStorage so their first page view counts normally. The cookie
 * banner updates consent afterwards (see Analytics.tsx).
 */
export function googleTagSnippet(gaId: string) {
  return [
    "window.dataLayer=window.dataLayer||[];",
    "function gtag(){dataLayer.push(arguments);}",
    "var granted=false;",
    `try{granted=localStorage.getItem(${JSON.stringify(CONSENT_KEY)})==="all"}catch(e){}`,
    "gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',",
    "analytics_storage:granted?'granted':'denied'});",
    "gtag('js',new Date());",
    `gtag('config',${JSON.stringify(gaId)});`,
  ].join("");
}

export function GoogleTag({ gaId }: { gaId: string }) {
  return (
    <>
      <script id="google-tag-consent" dangerouslySetInnerHTML={{ __html: googleTagSnippet(gaId) }} />
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
    </>
  );
}

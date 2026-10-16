import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { indexSeo } from "@/lib/seo-copy";
import { CONSENT_KEY } from "@/lib/consent";
import { LegalPage } from "@/components/legal/LegalPage";
import { ConsentControls } from "@/components/legal/ConsentControls";

export const metadata: Metadata = pageMetadata({ ...indexSeo.cookies, path: "/legal/cookies" });

const gaItems = [
  {
    name: "_ga",
    kind: "Analytics",
    purpose: "Google Analytics: tells one visit from another, so we can count visitors. Set only if you accept.",
    kept: "Up to 2 years, or until you pick Essential only",
  },
  {
    name: "_ga_<id>",
    kind: "Analytics",
    purpose: "Google Analytics: keeps track of the current session. Set only if you accept.",
    kept: "Up to 2 years, or until you pick Essential only",
  },
];

const storageItems = [
  {
    name: CONSENT_KEY,
    kind: "Essential",
    purpose: "Remembers your answer to the cookie banner, so it doesn't ask on every page.",
    kept: "Until you change it or clear site data",
  },
  {
    name: "streamui:<game>-best",
    kind: "Optional",
    purpose: "Your best score in each Labs game (Snake and Flappy). Saved only if you accept.",
    kept: "Until you pick Essential only or clear site data",
  },
];

const badge = {
  Essential: "bg-blue",
  Optional: "bg-pink",
  Analytics: "bg-orange",
} as const;

export default function CookiesPage() {
  const analytics = Boolean(siteConfig.analytics.gaId);
  const items = [
    ...(analytics ? gaItems.map((i) => ({ ...i, type: "Cookie" })) : []),
    ...storageItems.map((i) => ({ ...i, type: "Local storage" })),
  ];
  return (
    <LegalPage
      eyebrow="Cookies"
      title="Cookie policy"
      intro={
        <p>
          {analytics
            ? "stream/ui shows no ads and sets no cookies until you agree. If you accept, Google Analytics sets two cookies to tell visits apart; before that it counts visits without cookies. Everything else is local storage on your device."
            : "stream/ui sets no cookies at all: no analytics, no ads, no tracking pixels. The only things this site keeps are two small items in your browser's local storage, listed below."}
        </p>
      }
    >
      <h2>Your choice</h2>
      <p>
        Change it here at any time, or use <strong>Cookie settings</strong> in the footer to see the
        banner again. Choosing Essential only also deletes any best scores already saved
        {analytics ? " and deletes the Google Analytics cookies." : "."}
      </p>
      <ConsentControls />

      <h2>What&apos;s stored</h2>
      <div className="overflow-x-auto border-2 border-ink">
        <table className="w-full min-w-2xl border-collapse text-left text-sm">
          <thead className="bg-paper-sunken font-mono text-xs tracking-widest uppercase">
            <tr>
              <th scope="col" className="border-b-2 border-ink p-3">Name</th>
              <th scope="col" className="border-b-2 border-ink p-3">Type</th>
              <th scope="col" className="border-b-2 border-ink p-3">Stored as</th>
              <th scope="col" className="border-b-2 border-ink p-3">Purpose</th>
              <th scope="col" className="border-b-2 border-ink p-3">Kept</th>
            </tr>
          </thead>
          <tbody className="bg-paper-raised">
            {items.map((item) => (
              <tr key={item.name} className="border-t-2 border-ink align-top first:border-t-0">
                <td className="p-3 font-mono text-xs break-all">{item.name}</td>
                <td className="p-3">
                  <span
                    className={`border-2 border-ink px-1.5 py-0.5 text-xs font-semibold text-on-bright ${badge[item.kind as keyof typeof badge]}`}
                  >
                    {item.kind}
                  </span>
                </td>
                <td className="p-3 text-ink-muted">{item.type}</td>
                <td className="p-3 text-ink-muted">{item.purpose}</td>
                <td className="p-3 text-ink-muted">{item.kept}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Local storage stays in your browser. It isn&apos;t sent with requests the way cookies are,
        and we never read it on a server.
      </p>

      <h2>Third parties</h2>
      <p>
        {analytics
          ? "The only third-party script is the Google tag for Analytics. It runs on every page in Consent Mode and sets its cookies only after you accept. "
          : "No third-party scripts run on this site, so none of them can set cookies here. "}
        Pages you reach through links, like GitHub or a UPI app, follow their own cookie policies. More detail
        is in the <Link href="/legal/privacy">privacy policy</Link>.
      </p>

      <h2>Contact</h2>
      <p>
        Questions? Open an issue on <a href={`${siteConfig.githubUrl}/issues`}>GitHub</a>.
      </p>
    </LegalPage>
  );
}

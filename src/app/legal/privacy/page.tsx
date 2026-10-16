import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { indexSeo } from "@/lib/seo-copy";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = pageMetadata({ ...indexSeo.privacy, path: "/legal/privacy" });

export default function PrivacyPage() {
  const analytics = Boolean(siteConfig.analytics.gaId);
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Privacy policy"
      intro={
        <p>
          The short version: stream/ui has no accounts and no ads.{" "}
          {analytics
            ? "If you accept the cookie banner, Google Analytics counts your visit; otherwise nothing is measured. We never sell your data."
            : "There are no analytics or ad trackers, we don't collect personal data, and we don't sell or share anything."}
        </p>
      }
    >
      <h2>Who we are</h2>
      <p>
        stream/ui is an open-source project run by {siteConfig.author}. This policy covers the
        website at {new URL(siteConfig.url).host}. The <code>{siteConfig.packageName}</code> package
        runs in your own app and sends nothing to us.
      </p>

      <h2>What we collect</h2>
      <p>
        There are no sign-ups or forms.{" "}
        {analytics ? "Analytics runs only with your consent (see below)." : "There are no analytics scripts."}
      </p>
      <p>
        Like every website, our host receives standard request details when you load a page: your
        IP address, browser type, the page you asked for, and when. The site is hosted on{" "}
        <a href="https://vercel.com/legal/privacy-policy">Vercel</a>, which keeps these logs for a
        short time to run and protect the service. We don&apos;t use them to profile anyone.
      </p>

      {analytics && (
        <>
          <h2>Google Analytics</h2>
          <p>
            If you click <strong>Accept</strong> on the cookie banner, we load{" "}
            <a href="https://policies.google.com/privacy">Google Analytics 4</a> to understand how
            the site is used: which pages are visited, roughly where visitors come from (country and
            referring site), and the type of device and browser. GA4 doesn&apos;t log or store IP
            addresses. Google processes this data as our service provider and sets the cookies
            listed in the <Link href="/legal/cookies">cookie policy</Link>.
          </p>
          <p>
            If you choose <strong>Essential only</strong>, or don&apos;t answer, the Google tag never
            loads. You can withdraw consent at any time under <strong>Cookie settings</strong>; we
            then switch Analytics off and delete its cookies. You can also use Google&apos;s{" "}
            <a href="https://tools.google.com/dlpage/gaoptout">opt-out add-on</a>.
          </p>
        </>
      )}

      <h2>Your browser&apos;s storage</h2>
      <p>
        {analytics ? "Apart from Google Analytics, we set no cookies." : "We set no cookies."} With
        your permission, the site saves Labs game best scores in your browser&apos;s local storage,
        and it always remembers your answer to the cookie banner. That data stays on your device and
        never reaches us. The{" "}
        <Link href="/legal/cookies">cookie policy</Link> lists every item.
      </p>

      <h2>Third parties</h2>
      <ul>
        <li>
          <strong>Fonts</strong> are served from our own domain, so loading a page makes no request
          to Google.
        </li>
        {analytics && (
          <li>
            <strong>Google Analytics</strong> loads from Google&apos;s servers, and only after you
            accept.
          </li>
        )}
        <li>
          <strong>The sponsor page</strong> loads its UPI QR code from{" "}
          <a href="https://cloudinary.com/privacy">Cloudinary</a>, which receives the usual request
          details for that image.
        </li>
        <li>
          <strong>Links</strong> to GitHub, npm, GitHub Sponsors, or a UPI app take you to services
          with their own privacy policies. Payments are handled entirely by those services; we never
          see card or bank details.
        </li>
      </ul>

      <h2>Your rights</h2>
      <p>
        We don&apos;t hold personal data that identifies you, so there is usually nothing for us to
        access, correct, or delete.{" "}
        {analytics && "Analytics data is aggregated and kept for Google Analytics' standard retention period."} You can clear the site&apos;s local storage at any time from your browser settings,
        or pick &ldquo;Essential only&rdquo; under <strong>Cookie settings</strong> in the footer.
      </p>

      <h2>Children</h2>
      <p>The site is a developer resource and isn&apos;t aimed at children under 13.</p>

      <h2>Changes and contact</h2>
      <p>
        If this policy changes, the date at the top changes with it. Questions? Open an issue on{" "}
        <a href={`${siteConfig.githubUrl}/issues`}>GitHub</a>.
      </p>
    </LegalPage>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { indexSeo } from "@/lib/seo-copy";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = pageMetadata({ ...indexSeo.terms, path: "/legal/terms" });

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="Terms of use"
      intro={
        <p>
          stream/ui is free and open source. These terms explain what you can do with it and what
          we can and can&apos;t promise. By using the site, you agree to them.
        </p>
      }
    >
      <h2>The code is yours to use</h2>
      <p>
        The <code>{siteConfig.packageName}</code> package and the code on this site, including
        component examples, sections, icons, and Labs experiments, are released under the{" "}
        <a href={`${siteConfig.githubUrl}/blob/main/packages/react/LICENSE`}>MIT license</a>. You may use, copy,
        modify, and ship them in personal and commercial projects. Keep the license notice when you
        redistribute the package.
      </p>
      <p>
        Icons come from <a href="https://lucide.dev/license">Lucide</a> and{" "}
        <a href="https://github.com/react-icons/react-icons#licenses">React Icons</a> and keep their
        own licenses. Brand logos belong to their owners. The stream/ui name and logo identify this
        project, so please don&apos;t use them in a way that suggests we endorse your work.
      </p>

      <h2>Using the site</h2>
      <p>
        Please don&apos;t try to break, overload, or misuse the site or its hosting. Demo audio
        in the music player examples is generated in your browser and is free to use.
      </p>

      <h2>Sponsorships</h2>
      <p>
        Sponsoring through <Link href="/sponsor">GitHub Sponsors or UPI</Link> is a voluntary
        contribution to the project. It doesn&apos;t buy a product, a support contract, or
        priority for feature requests. Payments are processed by those services under their terms,
        and refunds follow their policies.
      </p>

      <h2>No warranty</h2>
      <p>
        Everything here is provided &ldquo;as is&rdquo;, without warranty of any kind. We work hard
        on accessibility and correctness, but you are responsible for testing stream/ui in your own
        product before relying on it.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent the law allows, the authors and contributors aren&apos;t liable for
        any damages arising from your use of the site or the code. The MIT license&apos;s own
        warranty and liability terms apply to the package.
      </p>

      <h2>Changes and contact</h2>
      <p>
        We may update these terms; the date at the top shows the latest version. Questions? Open an
        issue on <a href={`${siteConfig.githubUrl}/issues`}>GitHub</a>.
      </p>
    </LegalPage>
  );
}

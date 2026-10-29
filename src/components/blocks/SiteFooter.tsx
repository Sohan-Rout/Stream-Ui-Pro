import { SiGithub } from "react-icons/si";
import { Heart, ShoppingBag } from "lucide-react";
import { IntentLink as Link } from "@/components/ui/IntentLink";
import { siteConfig } from "@/lib/site";
import { templates } from "@/lib/templates";
import { Section } from "@/components/ui/Section";
import { Logo } from "./Logo";
import { CookieSettingsButton } from "./CookieBanner";

const legal = [
  { label: "Privacy", href: "/legal/privacy" },
  { label: "Terms", href: "/legal/terms" },
  { label: "Cookies", href: "/legal/cookies" },
];

const smallLink = "cursor-pointer underline-offset-4 hover:text-ink hover:underline";

/** Cached so the static shell can prerender (Cache Components forbids raw `new Date()`). */
async function CopyrightYear() {
  "use cache";
  return new Date().getFullYear();
}

export function SiteFooter() {
  return (
    <footer>
      <Section railClassName="overflow-hidden" joints={false}>
        <div className="grid grid-cols-1 gap-0.5 bg-ink sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4 bg-paper p-6 sm:p-10">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-ink-muted">
              Neo-brutalist components, sections, and icons for React and
              Tailwind v4, plus Pro templates: whole sites, ready to ship.
            </p>
          </div>
          <nav aria-label="Footer" className="bg-paper p-6 sm:p-10">
            <p className="font-mono text-xs font-semibold tracking-widest text-ink-muted uppercase">
              Library
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-semibold underline-offset-4 hover:underline hover:decoration-2"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Pro templates" className="bg-paper p-6 sm:p-10">
            <p className="font-mono text-xs font-semibold tracking-widest text-ink-muted uppercase">
              Pro
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              <li>
                <Link
                  href="/templates"
                  className="inline-flex items-center gap-2 font-semibold underline-offset-4 hover:underline hover:decoration-2"
                >
                  <ShoppingBag aria-hidden className="size-4 text-pink" /> All templates
                </Link>
              </li>
              {templates.map((t) => (
                <li key={t.slug}>
                  <Link href={`/templates/${t.slug}`} className="font-semibold underline-offset-4 hover:underline hover:decoration-2">
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="bg-paper p-6 sm:p-10">
            <p className="font-mono text-xs font-semibold tracking-widest text-ink-muted uppercase">
              Elsewhere
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              <li>
                <a
                  href={siteConfig.githubUrl}
                  className="inline-flex items-center gap-2 font-semibold underline-offset-4 hover:underline hover:decoration-2"
                >
                  <SiGithub aria-hidden className="size-4" /> GitHub
                </a>
              </li>
              <li>
                <Link
                  href="/sponsor"
                  className="inline-flex items-center gap-2 font-semibold underline-offset-4 hover:underline hover:decoration-2"
                >
                  <Heart aria-hidden className="size-4 text-pink" /> Sponsor
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t-2 border-ink px-4 pt-6 sm:px-8">
          <p
            aria-hidden
            className="text-center text-6xl leading-none font-display tracking-tighter select-none sm:text-9xl"
          >
            stream<span className="text-pink">/</span>ui
          </p>
        </div>
        <div className="flex flex-col gap-2 border-t-2 border-ink px-6 py-4 font-mono text-xs text-ink-muted sm:flex-row sm:justify-between sm:px-10">
          <span>
            © <CopyrightYear /> stream/ui
          </span>
          <nav aria-label="Legal">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {legal.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={smallLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <CookieSettingsButton className={smallLink} />
              </li>
            </ul>
          </nav>
        </div>
      </Section>
    </footer>
  );
}

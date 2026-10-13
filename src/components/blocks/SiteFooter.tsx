import { SiGithub } from "react-icons/si";
import { siteConfig } from "@/lib/site";
import { Section } from "@/components/ui/Section";
import { Logo } from "./Logo";

/** Cached so the static shell can prerender (Cache Components forbids raw `new Date()`). */
async function CopyrightYear() {
  "use cache";
  return new Date().getFullYear();
}

export function SiteFooter() {
  return (
    <footer>
      <Section railClassName="overflow-hidden" joints={false}>
        <div className="grid grid-cols-1 gap-0.5 bg-ink md:grid-cols-3">
          <div className="flex flex-col gap-4 bg-paper p-6 sm:p-10">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-ink-muted">
              Loud, typed, accessible UI for React. Built with Next.js, Bun, and
              Tailwind v4.
            </p>
          </div>
          <nav aria-label="Footer" className="bg-paper p-6 sm:p-10">
            <p className="font-mono text-xs font-semibold tracking-widest text-ink-muted uppercase">
              Library
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="font-semibold underline-offset-4 hover:underline hover:decoration-2"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="bg-paper p-6 sm:p-10">
            <p className="font-mono text-xs font-semibold tracking-widest text-ink-muted uppercase">
              Elsewhere
            </p>
            <a
              href={siteConfig.githubUrl}
              className="mt-4 inline-flex items-center gap-2 font-semibold underline-offset-4 hover:underline hover:decoration-2"
            >
              <SiGithub aria-hidden className="size-4" /> GitHub
            </a>
          </div>
        </div>
        <div className="border-t-2 border-ink px-4 pt-6 sm:px-8">
          <p
            aria-hidden
            className="text-center text-6xl leading-none font-black tracking-tighter select-none sm:text-9xl"
          >
            stream<span className="text-pink">/</span>ui
          </p>
        </div>
        <div className="flex flex-col gap-2 border-t-2 border-ink px-6 py-4 font-mono text-xs text-ink-muted sm:flex-row sm:justify-between sm:px-10">
          <span>
            © <CopyrightYear /> stream/ui
          </span>
          <span>Made loud on purpose.</span>
        </div>
      </Section>
    </footer>
  );
}

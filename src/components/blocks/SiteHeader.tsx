import { SiGithub } from "react-icons/si";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { Rail } from "@/components/ui/Section";
import { buttonStyles } from "@/components/ui/Button";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper bg-hatch">
      <Rail className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" aria-label="stream/ui home" className="shrink-0">
          <Logo />
        </a>

        <nav aria-label="Primary" className="hidden h-full md:block">
          <ul className="flex h-full border-l-2 border-ink">
            {siteConfig.nav.map((item) => (
              <li key={item.href} className="h-full border-r-2 border-ink">
                <a
                  href={item.href}
                  className="flex h-full items-center px-5 text-sm font-semibold transition-colors duration-150 hover:bg-yellow hover:text-on-bright"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={siteConfig.githubUrl}
            aria-label="stream/ui on GitHub"
            className={buttonStyles({ variant: "secondary", size: "icon", className: "size-10" })}
          >
            <SiGithub aria-hidden />
          </a>
          <a
            href="#components"
            className={buttonStyles({ size: "sm", className: "hidden h-10 sm:inline-flex" })}
          >
            Get started <ArrowRight aria-hidden />
          </a>
          <MobileMenu items={siteConfig.nav} />
        </div>
      </Rail>
    </header>
  );
}

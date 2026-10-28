import { IntentLink as Link } from "@/components/ui/IntentLink";
import { ArrowRight, Heart } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { Rail } from "@/components/ui/Section";
import { buttonStyles } from "@streamuilib/react";
import { GitHubButton } from "./GitHubButton";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { components } from "@/registry/components";
import { sections } from "@/registry/sections";
import { labs } from "@/registry/labs";
import { LUCIDE_ICON_COUNT } from "@/lib/icon-count.generated";

/** How many of each the mobile menu lists beside its links, from the registries. */
const NAV_COUNTS: Record<string, string> = {
  "/components": String(components.length),
  "/sections": String(sections.length),
  "/icons": `${(LUCIDE_ICON_COUNT / 1000).toFixed(1)}k`,
  "/labs": String(labs.length),
};
import { NavLinks } from "./NavLinks";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper bg-hatch">
      <Rail className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="stream/ui home" className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Primary" className="hidden h-full lg:block">
          <NavLinks items={siteConfig.nav} />
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/sponsor"
            aria-label="Sponsor stream/ui"
            className={buttonStyles({ variant: "pink", size: "icon", className: "size-10" })}
          >
            <Heart aria-hidden />
          </Link>
          <GitHubButton />
          <Link
            href="/components"
            className={buttonStyles({ size: "sm", className: "hidden h-10 sm:inline-flex lg:hidden xl:inline-flex" })}
          >
            Get started <ArrowRight aria-hidden />
          </Link>
          <MobileMenu items={siteConfig.nav.map((item) => ({ ...item, count: NAV_COUNTS[item.href] }))} />
        </div>
      </Rail>
    </header>
  );
}

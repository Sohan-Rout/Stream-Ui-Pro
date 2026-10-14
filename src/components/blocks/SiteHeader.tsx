import Link from "next/link";
import { SiGithub } from "react-icons/si";
import { ArrowRight, Heart } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { Rail } from "@/components/ui/Section";
import { buttonStyles } from "@streamui/react";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper bg-hatch">
      <Rail className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="stream/ui home" className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Primary" className="hidden h-full md:block">
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
          <a
            href={siteConfig.githubUrl}
            aria-label="stream/ui on GitHub"
            className={buttonStyles({ variant: "secondary", size: "icon", className: "size-10" })}
          >
            <SiGithub aria-hidden />
          </a>
          <Link
            href="/components"
            className={buttonStyles({ size: "sm", className: "hidden h-10 sm:inline-flex" })}
          >
            Get started <ArrowRight aria-hidden />
          </Link>
          <MobileMenu items={siteConfig.nav} />
        </div>
      </Rail>
    </header>
  );
}

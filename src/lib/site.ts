import { env } from "./env";
import { homeSeo } from "./seo-copy";

export const siteConfig = {
  name: "stream/ui",
  /** Canonical origin. Set NEXT_PUBLIC_SITE_URL to override (see .env.example). */
  url: env.siteUrl,
  title: homeSeo.title,
  description: homeSeo.description,
  author: "Sohan Rout",
  githubUrl: "https://github.com/Sohan-Rout/Stream-Ui-Pro",
  packageName: "@streamui/react",
  installCommand: "bun add @streamui/react",
  nav: [
    { label: "Components", href: "/components" },
    { label: "Sections", href: "/sections" },
    { label: "Icons", href: "/icons" },
    { label: "Labs", href: "/labs" },
  ],
  /**
   * Crowdfunding links, from FUNDING_* environment variables. Unset ones are
   * hidden; the sponsor page and footer only show configured platforms.
   */
  funding: env.funding,
} as const;

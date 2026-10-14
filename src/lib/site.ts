import { env } from "./env";

export const siteConfig = {
  name: "stream/ui",
  /** Canonical origin. Set NEXT_PUBLIC_SITE_URL to override (see .env.example). */
  url: env.siteUrl,
  title: "stream/ui — React components with hard edges",
  description:
    "Neo-brutalist React components, page sections, and animated icons for Tailwind CSS v4. Accessible, typed, and published on npm as @streamui/react.",
  author: "Sohan Rout",
  githubUrl: "https://github.com/Sohan-Rout/Vibe-coded-lib",
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

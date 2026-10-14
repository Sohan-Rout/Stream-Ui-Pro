export const siteConfig = {
  name: "stream/ui",
  /** Canonical origin. Override with NEXT_PUBLIC_SITE_URL for preview deploys. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://streamui.org",
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
   * Crowdfunding links. Leave a value empty to hide that platform; the
   * sponsor page and footer only show the ones that are filled in.
   */
  funding: {
    /** Razorpay Payment Page or payment link, e.g. https://razorpay.me/@yourname */
    razorpay: "",
    /** Open Collective page, e.g. https://opencollective.com/streamui */
    openCollective: "",
    /** Ko-fi page, e.g. https://ko-fi.com/yourname */
    kofi: "",
  },
} as const;

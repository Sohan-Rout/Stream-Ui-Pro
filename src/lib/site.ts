export const siteConfig = {
  name: "stream/ui",
  githubUrl: "https://github.com",
  installCommand: "bun add @streamui/react",
  nav: [
    { label: "Components", href: "/components" },
    { label: "Sections", href: "/sections" },
    { label: "Icons", href: "/icons" },
    { label: "Labs", href: "/labs" },
  ],
} as const;

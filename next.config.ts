import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Comic designs live inside their categories.
  async redirects() {
    return [
      { source: "/components/comic-badge", destination: "/components/badge/comic", permanent: true },
      { source: "/components/comic-button", destination: "/components/button/comic", permanent: true },
      { source: "/components/comic-card", destination: "/components/card/comic", permanent: true },
      { source: "/components/comic-alert", destination: "/components/alert/comic", permanent: true },
      ...["input", "textarea", "select", "checkbox", "radio-group", "switch", "slider"].map((slug) => ({
        source: `/components/comic-${slug}`,
        destination: `/components/${slug}/comic`,
        permanent: true,
      })),
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { brand } from "@/lib/og";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.title,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "browser",
    background_color: brand.paper,
    theme_color: brand.paper,
    icons: [{ src: "/icon", sizes: "512x512", type: "image/png" }],
  };
}

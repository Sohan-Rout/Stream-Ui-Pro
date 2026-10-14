import type { Metadata } from "next";
import { siteConfig } from "./site";

/** Absolute URL on the canonical origin, for sitemaps and structured data. */
export function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}

/**
 * Per-page metadata. Next merges metadata shallowly, so a page that only set
 * `title` would inherit the root Open Graph title; this sets every field that
 * should follow the page.
 */
export function pageMetadata({
  title,
  description,
  path,
  keywords,
}: {
  /** Page title; omit on the home page to use the site title. */
  title?: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  const socialTitle = title ? `${title} · ${siteConfig.name}` : siteConfig.title;
  return {
    ...(title && { title }),
    description,
    ...(keywords && { keywords }),
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: "en_US",
      url: path,
      title: socialTitle,
      description,
    },
    twitter: { card: "summary_large_image", title: socialTitle, description },
  };
}

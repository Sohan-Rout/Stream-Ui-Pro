import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { Archivo_Black, Space_Grotesk, Space_Mono } from "next/font/google";
import { SiteHeader } from "@/components/blocks/SiteHeader";
import { SiteFooter } from "@/components/blocks/SiteFooter";
import { CookieBanner } from "@/components/blocks/CookieBanner";
import { Analytics } from "@/components/blocks/Analytics";
import { siteConfig } from "@/lib/site";
import { homeSeo } from "@/lib/seo-copy";
import "./globals.css";

// Neo-brutalist type: a heavy grotesk for display, a quirky grotesk for
// body copy, and a monospace for labels and code.
const display = Archivo_Black({
  variable: "--font-archivo-black",
  weight: "400",
  subsets: ["latin"],
});

const body = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const mono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.title, template: "%s · stream/ui" },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: homeSeo.keywords,
  authors: [{ name: siteConfig.author, url: siteConfig.githubUrl }],
  creator: siteConfig.author,
  category: "technology",
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "en_US",
    url: "/",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: { card: "summary_large_image", title: siteConfig.title, description: siteConfig.description },
  robots: { index: true, follow: true, googleBot: { "max-image-preview": "large", "max-snippet": -1 } },
};

export const viewport: Viewport = { themeColor: "#fafaf7", colorScheme: "light" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-hatch font-sans">
        <SiteHeader />
        <main className="flex flex-1 flex-col">{children}</main>
        <SiteFooter />
        {/* usePathname can suspend on dynamic routes under Cache Components. */}
        <Suspense fallback={null}>
          <CookieBanner analytics={Boolean(siteConfig.analytics.gaId)} />
        </Suspense>
        {siteConfig.analytics.gaId && <Analytics gaId={siteConfig.analytics.gaId} />}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { homeSeo } from "@/lib/seo-copy";
import { JsonLd } from "@/components/seo/JsonLd";
import { Hero } from "@/components/blocks/Hero";
import { SpecStrip } from "@/components/blocks/SpecStrip";
import { Pillars } from "@/components/blocks/Pillars";
import { ClassicComicSection } from "@/components/blocks/ClassicComicSection";
import { SectionsShowcase } from "@/components/blocks/SectionsShowcase";
import { IconShowcase } from "@/components/blocks/IconShowcase";
import { LabsShowcase } from "@/components/blocks/LabsShowcase";
import { CallToAction } from "@/components/blocks/CallToAction";

export const metadata: Metadata = pageMetadata({ description: homeSeo.description, path: "/", keywords: homeSeo.keywords });

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description,
    },
    {
      "@type": "SoftwareSourceCode",
      name: siteConfig.packageName,
      description: siteConfig.description,
      url: siteConfig.url,
      codeRepository: siteConfig.githubUrl,
      programmingLanguage: ["TypeScript", "React"],
      runtimePlatform: "Web browser",
      license: "https://opensource.org/licenses/MIT",
      author: { "@type": "Person", name: siteConfig.author, url: siteConfig.githubUrl },
    },
  ],
};

export default function Home() {
  return (
    <>
      <JsonLd data={structuredData} />
      <Hero />
      <SpecStrip />
      <Pillars />
      <ClassicComicSection />
      <SectionsShowcase />
      <IconShowcase />
      <LabsShowcase />
      <CallToAction />
    </>
  );
}

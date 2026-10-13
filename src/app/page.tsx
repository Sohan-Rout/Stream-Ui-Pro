import { SiteHeader } from "@/components/blocks/SiteHeader";
import { Hero } from "@/components/blocks/Hero";
import { Marquee } from "@/components/blocks/Marquee";
import { Pillars } from "@/components/blocks/Pillars";
import { ComponentShowcase } from "@/components/blocks/ComponentShowcase";
import { SectionsShowcase } from "@/components/blocks/SectionsShowcase";
import { IconShowcase } from "@/components/blocks/IconShowcase";
import { LabsShowcase } from "@/components/blocks/LabsShowcase";
import { CallToAction } from "@/components/blocks/CallToAction";
import { SiteFooter } from "@/components/blocks/SiteFooter";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Marquee />
        <Pillars />
        <ComponentShowcase />
        <SectionsShowcase />
        <IconShowcase />
        <LabsShowcase />
        <CallToAction />
      </main>
      <SiteFooter />
    </>
  );
}

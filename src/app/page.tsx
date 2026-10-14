import { Hero } from "@/components/blocks/Hero";
import { SpecStrip } from "@/components/blocks/SpecStrip";
import { Pillars } from "@/components/blocks/Pillars";
import { ComponentShowcase } from "@/components/blocks/ComponentShowcase";
import { SectionsShowcase } from "@/components/blocks/SectionsShowcase";
import { IconShowcase } from "@/components/blocks/IconShowcase";
import { LabsShowcase } from "@/components/blocks/LabsShowcase";
import { CallToAction } from "@/components/blocks/CallToAction";

export default function Home() {
  return (
    <>
      <Hero />
      <SpecStrip />
      <Pillars />
      <ComponentShowcase />
      <SectionsShowcase />
      <IconShowcase />
      <LabsShowcase />
      <CallToAction />
    </>
  );
}

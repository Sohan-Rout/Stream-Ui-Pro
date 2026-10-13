import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconExplorer } from "./IconExplorer";

export function IconShowcase() {
  return (
    <Section id="icons" aria-labelledby="icons-title">
      <SectionHeading
        index="03"
        eyebrow="Icons"
        title={<span id="icons-title">One grid, one stroke weight.</span>}
        description="Drawn on a 24px grid at a 1.75 stroke. Search the set and click any icon to copy its JSX."
      />
      <IconExplorer />
    </Section>
  );
}

import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconExplorer } from "./IconExplorer";

export function IconShowcase() {
  return (
    <Section id="icons" aria-labelledby="icons-title">
      <SectionHeading
        index="03"
        eyebrow="Icons"
        title={<span id="icons-title">One stroke to rule them.</span>}
        description="A 24px grid, consistent 1.75 stroke, and sizes that snap to the type scale. Click any glyph to copy its JSX."
      />
      <IconExplorer />
    </Section>
  );
}

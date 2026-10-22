import { IntentLink as Link } from "@/components/ui/IntentLink";
import { ArrowRight } from "lucide-react";
import { buttonStyles } from "@streamuilib/react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconExplorer } from "./IconExplorer";

export function IconShowcase() {
  return (
    <Section id="icons" aria-labelledby="icons-title">
      <SectionHeading
        index="03"
        eyebrow="Icons"
        title={<span id="icons-title">Icons that move. Logos you know.</span>}
        description="2,000+ line icons on one grid and stroke, with seven CSS animations, plus 3,400+ brand logos. Pick an animation, then click anything to copy its JSX."
        action={
          <Link href="/icons" className={buttonStyles({ variant: "secondary" })}>
            Browse all icons <ArrowRight aria-hidden />
          </Link>
        }
      />
      <IconExplorer />
    </Section>
  );
}

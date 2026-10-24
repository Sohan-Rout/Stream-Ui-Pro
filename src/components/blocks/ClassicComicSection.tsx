import { ArrowUpRight } from "lucide-react";
import { buttonStyles } from "@streamuilib/react";
import { IntentLink as Link } from "@/components/ui/IntentLink";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ClassicComicShowcase } from "./ClassicComicShowcase";

export function ClassicComicSection() {
  return (
    <Section id="components" aria-labelledby="components-title">
      <SectionHeading
        index="01"
        eyebrow="Classic or Comic"
        title={<span id="components-title">One component, two personalities.</span>}
        description="Flip the switch. Each specimen is the real component, live: hover, press, and tab through it. Same API in both designs, so you can swap without a refactor."
        action={
          <Link href="/components" className={buttonStyles({ variant: "secondary" })}>
            All components <ArrowUpRight aria-hidden />
          </Link>
        }
      />
      <ClassicComicShowcase />
    </Section>
  );
}

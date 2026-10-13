import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { ShapeRollerLab } from "@/components/demos/ShapeRollerLab";
import { MagneticLab } from "@/components/demos/MagneticLab";
import { WobbleLab } from "@/components/demos/WobbleLab";

function Experiment({
  code,
  name,
  hint,
  children,
  className,
}: {
  code: string;
  name: string;
  hint: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <li className={cn("flex flex-col bg-paper", className)}>
      <div className="flex items-center justify-between gap-3 border-b-2 border-ink px-5 py-3">
        <span className="font-mono text-xs font-bold">{code}</span>
        <Badge tone="paper">experimental</Badge>
      </div>
      <div className="flex flex-1 items-center justify-center bg-violet-soft p-6">
        {children}
      </div>
      <div className="border-t-2 border-ink px-5 py-4">
        <h3 className="font-display text-lg tracking-tight">{name}</h3>
        <p className="text-sm text-ink-muted">{hint}</p>
      </div>
    </li>
  );
}

export function LabsShowcase() {
  return (
    <Section id="labs" aria-labelledby="labs-title">
      <SectionHeading
        index="04"
        eyebrow="Labs"
        title={<span id="labs-title">Experiments in progress.</span>}
        description="Interaction prototypes that haven't graduated into the main library. Their APIs can change between releases."
      />
      <ul className="grid grid-cols-1 gap-0.5 bg-ink sm:grid-cols-2 lg:grid-cols-3">
        <Experiment code="lab/shape-roller" name="Shape roller" hint="Randomizes shape, color, and rotation on each roll.">
          <ShapeRollerLab />
        </Experiment>
        <Experiment code="lab/magnetic" name="Magnetic button" hint="The button drifts toward the cursor within its area.">
          <MagneticLab />
        </Experiment>
        <Experiment
          code="lab/wobble"
          name="Wobble type"
          hint="Staggered CSS transitions on hover. No JavaScript."
          className="sm:col-span-2 lg:col-span-1"
        >
          <WobbleLab />
        </Experiment>
      </ul>
    </Section>
  );
}

import type { ReactNode } from "react";
import { TriangleAlert } from "lucide-react";
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
      <div className="flex items-center justify-between gap-3 border-b-2 border-dashed border-ink-faint px-5 py-3">
        <span className="font-mono text-xs font-semibold">{code}</span>
        <Badge tone="orange">unstable</Badge>
      </div>
      <div className="flex flex-1 items-center justify-center p-6">{children}</div>
      <div className="border-t-2 border-ink px-5 py-4">
        <h3 className="text-lg font-black tracking-tight">{name}</h3>
        <p className="text-sm text-ink-muted">{hint}</p>
      </div>
    </li>
  );
}

export function LabsShowcase() {
  return (
    <Section id="labs" aria-labelledby="labs-title">
      <div aria-hidden className="h-5 border-b-2 border-ink bg-tape" />
      <SectionHeading
        index="04"
        eyebrow="Labs"
        title={<span id="labs-title">Random stuff. Handle with gloves.</span>}
        description="Experiments that aren't ready for the main drawers. Some graduate, some explode. Poke them."
        action={
          <p className="inline-flex items-center gap-2 border-2 border-ink bg-yellow px-3 py-1.5 font-mono text-xs font-semibold text-on-bright">
            <TriangleAlert aria-hidden className="size-4" /> APIs may change without notice
          </p>
        }
      />
      <ul className="grid grid-cols-1 gap-0.5 bg-ink sm:grid-cols-2 lg:grid-cols-3">
        <Experiment code="EXP-001" name="Shape roller" hint="Every roll is a new mood board.">
          <ShapeRollerLab />
        </Experiment>
        <Experiment code="EXP-002" name="Magnetic button" hint="Move your cursor near it. It wants to be clicked.">
          <MagneticLab />
        </Experiment>
        <Experiment
          code="EXP-003"
          name="Wobble type"
          hint="Hover the word. Staggered transitions, zero JS."
          className="sm:col-span-2 lg:col-span-1"
        >
          <WobbleLab />
        </Experiment>
      </ul>
    </Section>
  );
}

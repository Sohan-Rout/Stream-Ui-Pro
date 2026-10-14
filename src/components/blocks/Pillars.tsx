import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, Blocks, FlaskConical, PanelsTopLeft, Shapes } from "lucide-react";
import Link from "next/link";
import { cn } from "@streamui/react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Pillar = {
  title: string;
  href: string;
  blurb: string;
  examples: string;
  icon: LucideIcon;
  /** Static class strings so Tailwind can see them. */
  tile: string;
  hover: string;
};

const pillars: Pillar[] = [
  {
    title: "Components",
    href: "/components",
    blurb: "Buttons, inputs, tabs, and dialogs with keyboard support and focus states included.",
    examples: "Button · Input · Tabs · Switch",
    icon: Blocks,
    tile: "bg-lime",
    hover: "hover:bg-lime-soft",
  },
  {
    title: "Sections",
    href: "/sections",
    blurb: "Heroes, pricing tables, FAQs, and footers composed from the same components.",
    examples: "Hero · Pricing · FAQ · Footer",
    icon: PanelsTopLeft,
    tile: "bg-pink",
    hover: "hover:bg-pink-soft",
  },
  {
    title: "Icons",
    href: "/icons",
    blurb: "A 24px set at one stroke weight, so icons sit evenly next to text at every size.",
    examples: "Search · copy as JSX",
    icon: Shapes,
    tile: "bg-blue",
    hover: "hover:bg-blue-soft",
  },
  {
    title: "Labs",
    href: "/labs",
    blurb: "Interaction experiments that haven't been promoted to the main library yet.",
    examples: "APIs may change",
    icon: FlaskConical,
    tile: "bg-violet",
    hover: "hover:bg-violet-soft",
  },
];

export function Pillars() {
  return (
    <Section aria-labelledby="pillars-title">
      <SectionHeading
        index="00"
        eyebrow="What's included"
        title={<span id="pillars-title">Four parts, one design language.</span>}
        description="Plain React and Tailwind in your own repo. No runtime package and no theme provider."
      />
      <ul className="grid grid-cols-1 gap-0.5 bg-ink sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map((p) => (
          <li key={p.title} className="bg-paper">
            <Link
              href={p.href}
              className={cn(
                "group flex h-full flex-col gap-6 p-6 transition-colors duration-150 sm:p-8",
                p.hover,
              )}
            >
              <span
                className={cn(
                  "grid size-12 place-items-center border-2 border-ink text-on-bright shadow-brutal-sm",
                  p.tile,
                )}
              >
                <p.icon aria-hidden className="size-5.5" strokeWidth={2} />
              </span>
              <div className="flex flex-1 flex-col gap-2">
                <h3 className="font-display text-xl tracking-tight">{p.title}</h3>
                <p className="leading-relaxed text-ink-muted">{p.blurb}</p>
              </div>
              <div className="flex items-center justify-between gap-3 border-t-2 border-dashed border-ink-faint pt-4">
                <span className="font-mono text-xs text-ink-muted">{p.examples}</span>
                <ArrowUpRight
                  aria-hidden
                  className="size-4.5 shrink-0 transition-[translate] duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}

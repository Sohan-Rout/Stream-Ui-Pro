import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, Blocks, FlaskConical, PanelsTopLeft, Shapes } from "lucide-react";
import { cn } from "@/lib/cn";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Pillar = {
  title: string;
  href: string;
  stat: string;
  blurb: string;
  icon: LucideIcon;
  /** Static class strings so Tailwind can see them. */
  tile: string;
  hover: string;
};

const pillars: Pillar[] = [
  {
    title: "Components",
    href: "#components",
    stat: "48 primitives",
    blurb: "Buttons, inputs, tabs, dialogs. Every state designed, every prop typed.",
    icon: Blocks,
    tile: "bg-yellow",
    hover: "hover:bg-yellow",
  },
  {
    title: "Sections",
    href: "#sections",
    stat: "24 blocks",
    blurb: "Heroes, pricing, FAQs, footers. Full page sections you drop in and tune.",
    icon: PanelsTopLeft,
    tile: "bg-blue",
    hover: "hover:bg-blue",
  },
  {
    title: "Icons",
    href: "#icons",
    stat: "1,600+ glyphs",
    blurb: "One stroke, one grid, every size. Click to copy, tree-shaken on import.",
    icon: Shapes,
    tile: "bg-pink",
    hover: "hover:bg-pink",
  },
  {
    title: "Labs",
    href: "#labs",
    stat: "∞ experiments",
    blurb: "Random stuff we built at 2am. Unstable, delightful, may explode.",
    icon: FlaskConical,
    tile: "bg-green",
    hover: "hover:bg-green",
  },
];

export function Pillars() {
  return (
    <Section aria-labelledby="pillars-title">
      <SectionHeading
        index="00"
        eyebrow="What's in the box"
        title={<span id="pillars-title">Four drawers. Zero filler.</span>}
        description="Everything is plain React and Tailwind in your own repo. No runtime, no lock-in, no theme provider to wrestle."
      />
      <ul className="grid grid-cols-1 gap-0.5 bg-ink sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map((p, i) => (
          <li key={p.title} className="bg-paper">
            <a
              href={p.href}
              className={cn(
                "group flex h-full flex-col gap-5 p-6 transition-colors duration-150 hover:text-on-bright sm:p-8",
                p.hover,
              )}
            >
              <div className="flex items-start justify-between">
                <span
                  className={cn(
                    "grid size-14 place-items-center border-2 border-ink text-on-bright shadow-brutal transition-[translate,box-shadow] duration-150 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:shadow-brutal-lg motion-reduce:transition-none",
                    p.tile,
                  )}
                >
                  <p.icon aria-hidden className="size-6" strokeWidth={2.25} />
                </span>
                <span className="font-mono text-xs text-ink-muted group-hover:text-on-bright">
                  0{i + 1}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <h3 className="text-2xl font-display tracking-tight">{p.title}</h3>
                <p className="font-mono text-xs font-semibold uppercase">{p.stat}</p>
                <p className="leading-relaxed text-ink-muted group-hover:text-on-bright">
                  {p.blurb}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-bold underline decoration-2 underline-offset-4">
                Explore <ArrowUpRight aria-hidden className="size-4" />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}

import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, Blocks, FlaskConical, PanelsTopLeft, Shapes } from "lucide-react";
import { IntentLink as Link } from "@/components/ui/IntentLink";
import { cn } from "@streamuilib/react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { componentGroups } from "@/registry/components";
import { sections } from "@/registry/sections";
import { labs } from "@/registry/labs";
import { LUCIDE_ICON_COUNT } from "@/lib/icon-count.generated";

type Pillar = {
  title: string;
  href: string;
  blurb: string;
  examples: string;
  count: string;
  icon: LucideIcon;
  /** Static class strings so Tailwind can see them. */
  tile: string;
  hover: string;
};

const pillars: Pillar[] = [
  {
    title: "Components",
    href: "/components",
    blurb: "Every component in two designs: Classic brutal and Comic book. Keyboard support and focus states included.",
    examples: "Classic · Comic",
    count: `${componentGroups.length}×2`,
    icon: Blocks,
    tile: "bg-lime",
    hover: "hover:bg-lime-soft",
  },
  {
    title: "Sections",
    href: "/sections",
    blurb: "Playable heroes, bonkable pricing, and footers with a punchline, composed from the same components.",
    examples: "Hero · Pricing · Footer",
    count: String(sections.reduce((n, s) => n + s.variants.length, 0)),
    icon: PanelsTopLeft,
    tile: "bg-pink",
    hover: "hover:bg-pink-soft",
  },
  {
    title: "Icons",
    href: "/icons",
    blurb: "Lucide icons, brand marks, and animated emoji faces. Search, then copy as JSX or SVG.",
    examples: "Search · copy as JSX",
    count: `${(LUCIDE_ICON_COUNT / 1000).toFixed(1)}k`,
    icon: Shapes,
    tile: "bg-blue",
    hover: "hover:bg-blue-soft",
  },
  {
    title: "Labs",
    href: "/labs",
    blurb: "3D toys, mini games that fit in a card, and the Critter Club: mascots that blink, spook, and type.",
    examples: "Toys · Games · Critters",
    count: String(labs.length),
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
        title={<span id="pillars-title">Four parts, one loud design language.</span>}
        description="Install one package or copy the source into your repo. Plain React and Tailwind, with no theme provider."
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
              <div className="flex items-start justify-between gap-3">
                <span
                  className={cn(
                    "grid size-12 place-items-center border-2 border-ink text-on-bright shadow-brutal-sm",
                    p.tile,
                  )}
                >
                  <p.icon aria-hidden className="size-5.5" strokeWidth={2} />
                </span>
                <span className="font-display text-3xl tracking-tight tabular-nums">{p.count}</span>
              </div>
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

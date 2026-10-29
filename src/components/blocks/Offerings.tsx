import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Blocks, FlaskConical, PanelsTopLeft, Shapes } from "lucide-react";
import { IntentLink as Link } from "@/components/ui/IntentLink";
import { buttonStyles, cn } from "@streamuilib/react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { componentGroups } from "@/registry/components";
import { sections } from "@/registry/sections";
import { labs } from "@/registry/labs";
import { templates } from "@/lib/templates";
import { LUCIDE_ICON_COUNT } from "@/lib/icon-count.generated";

type Part = {
  title: string;
  href: string;
  blurb: string;
  count: string;
  icon: LucideIcon;
  /** Static class strings so Tailwind can see them. */
  tile: string;
  hover: string;
};

const parts: Part[] = [
  {
    title: "Components",
    href: "/components",
    blurb: "Every component in a Classic and a Comic design, with keyboard support and focus states.",
    count: `${componentGroups.length}×2`,
    icon: Blocks,
    tile: "bg-lime",
    hover: "hover:bg-lime-soft",
  },
  {
    title: "Sections",
    href: "/sections",
    blurb: "Playable heroes, bonkable pricing, and footers with a punchline.",
    count: String(sections.reduce((n, s) => n + s.variants.length, 0)),
    icon: PanelsTopLeft,
    tile: "bg-pink",
    hover: "hover:bg-pink-soft",
  },
  {
    title: "Icons",
    href: "/icons",
    blurb: "Lucide icons, brand marks, and animated emoji. Copy as JSX or SVG.",
    count: `${(LUCIDE_ICON_COUNT / 1000).toFixed(1)}k`,
    icon: Shapes,
    tile: "bg-blue",
    hover: "hover:bg-blue-soft",
  },
  {
    title: "Labs",
    href: "/labs",
    blurb: "3D toys, mini games, and critters that blink, spook, and type.",
    count: String(labs.length),
    icon: FlaskConical,
    tile: "bg-violet",
    hover: "hover:bg-violet-soft",
  },
];

/** The cheapest template, for "from $N". */
const from = Math.min(...templates.map((t) => t.price));
const featured = templates[0];

/**
 * The two ways in, side by side: the free library (its four parts) and the
 * paid templates (whole sites built from it).
 */
export function Offerings() {
  return (
    <Section aria-labelledby="offerings-title">
      <SectionHeading
        index="00"
        eyebrow="Two ways to build"
        title={<span id="offerings-title">Build it yourself, or start from a whole site.</span>}
        description="The library is free and MIT licensed: install one package or copy the source. Pro templates are complete Next.js sites made from it."
      />
      <div className="grid grid-cols-1 gap-0.5 bg-ink lg:grid-cols-2">
        {/* The free library */}
        <div className="flex flex-col bg-paper">
          <div className="flex items-center justify-between gap-3 border-b-2 border-ink px-5 py-3 sm:px-8">
            <span className="font-mono text-xs font-bold">@streamuilib/react</span>
            <span className="border-2 border-ink bg-lime px-1.5 font-mono text-xs font-bold text-on-bright">Free · MIT</span>
          </div>
          <div className="px-5 pt-8 pb-6 sm:px-8">
            <h3 className="font-display text-2xl tracking-tight">The library</h3>
            <p className="mt-2 max-w-md leading-relaxed text-ink-muted">Pieces for your own pages, in plain React and Tailwind, with no theme provider.</p>
          </div>
          <ul className="grid flex-1 grid-cols-1 gap-0.5 border-t-2 border-ink bg-ink sm:grid-cols-2">
            {parts.map((p) => (
              <li key={p.title} className="bg-paper">
                <Link href={p.href} className={cn("group flex h-full flex-col gap-4 p-5 transition-colors duration-150 sm:p-6", p.hover)}>
                  <div className="flex items-center justify-between gap-3">
                    <span className={cn("grid size-10 place-items-center border-2 border-ink text-on-bright shadow-brutal-sm", p.tile)}>
                      <p.icon aria-hidden className="size-5" strokeWidth={2} />
                    </span>
                    <span className="font-display text-2xl tracking-tight tabular-nums">{p.count}</span>
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <span className="flex items-center gap-1.5 font-display text-lg tracking-tight">
                      {p.title}
                      <ArrowUpRight
                        aria-hidden
                        className="size-4 transition-[translate] duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                      />
                    </span>
                    <span className="text-sm leading-relaxed text-ink-muted">{p.blurb}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* The paid templates */}
        <div className="flex flex-col bg-orange-soft bg-dots">
          <div className="flex items-center justify-between gap-3 border-b-2 border-ink bg-paper px-5 py-3 sm:px-8">
            <span className="font-mono text-xs font-bold">stream/ui Pro</span>
            <span className="border-2 border-ink bg-orange px-1.5 font-mono text-xs font-bold text-on-bright">From ${from}</span>
          </div>
          <div className="px-5 pt-8 pb-6 sm:px-8">
            <h3 className="font-display text-2xl tracking-tight">Pro templates</h3>
            <p className="mt-2 max-w-md leading-relaxed text-ink-muted">
              Whole landing pages, hero to footer. Buy once, get the full source, use it in unlimited projects.
            </p>
          </div>
          <div className="flex flex-1 flex-col gap-6 px-5 pb-8 sm:px-8">
            <Link href={`/templates/${featured.slug}`} className="group block border-2 border-ink bg-paper shadow-brutal transition-[translate,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg motion-reduce:transition-none">
              <span aria-hidden className="flex items-center gap-1.5 border-b-2 border-ink bg-paper-raised px-3 py-1.5">
                <span className="size-2 rounded-full border-2 border-ink bg-pink" />
                <span className="size-2 rounded-full border-2 border-ink bg-orange" />
                <span className="size-2 rounded-full border-2 border-ink bg-lime" />
                <span className="ml-2 truncate font-mono text-xs text-ink-muted">template/{featured.slug}</span>
              </span>
              <Image src={featured.shots[0].src} alt={featured.shots[0].alt} placeholder="blur" sizes="(min-width: 1152px) 520px, (min-width: 1024px) 45vw, 100vw" className="block h-auto w-full" />
              <span className="flex items-baseline justify-between gap-3 border-t-2 border-ink px-4 py-3">
                <span className="font-display text-lg tracking-tight">{featured.name}</span>
                <span className="font-mono text-xs font-bold">${featured.price} · one-time</span>
              </span>
            </Link>
            <div className="mt-auto flex flex-wrap gap-3">
              <Link href="/templates" className={buttonStyles({ variant: "pink" })}>
                Browse templates <ArrowRight aria-hidden />
              </Link>
              <a href={`/templates/${featured.slug}/preview`} target="_blank" className={buttonStyles({ variant: "secondary" })}>
                Live preview <ArrowUpRight aria-hidden />
              </a>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

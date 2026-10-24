import type { ReactNode } from "react";
import { ArrowUpRight, Gamepad2, PawPrint, SlidersHorizontal, type LucideIcon } from "lucide-react";
import { cn } from "@streamuilib/react";
import { IntentLink as Link } from "@/components/ui/IntentLink";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhenVisible } from "@/components/ui/WhenVisible";
import { Live } from "@/components/docs/Live";
import { getLab, labCategories, labs, type LabCategory } from "@/registry/labs";

const LOOK: Record<LabCategory, { icon: LucideIcon; tone: string }> = {
  component: { icon: SlidersHorizontal, tone: "bg-lime" },
  game: { icon: Gamepad2, tone: "bg-pink" },
  critter: { icon: PawPrint, tone: "bg-orange" },
};

function Experiment({ slug, hint, className, stage }: { slug: string; hint: string; className?: string; stage: string }) {
  const lab = getLab(slug);
  if (!lab) throw new Error(`home: no lab ${slug}`);
  return (
    <li className={cn("group relative flex flex-col bg-paper", className)}>
      <div className="flex items-center justify-between gap-3 border-b-2 border-ink px-5 py-3">
        <span className="font-mono text-xs font-bold">lab/{lab.slug}</span>
        <span className="font-mono text-xs text-ink-muted">{labCategories.find((c) => c.id === lab.category)?.name}</span>
      </div>
      <WhenVisible className={cn("flex min-h-80 flex-1 items-center justify-center overflow-hidden p-6", stage)}>
        <Live file={lab.file} preview />
      </WhenVisible>
      <div className="flex items-end justify-between gap-3 border-t-2 border-ink px-5 py-4">
        <div>
          <h3 className="font-display text-lg tracking-tight">
            <Link href={`/labs/${lab.slug}`} className="hover:underline hover:decoration-2 hover:underline-offset-4">
              {lab.name}
            </Link>
          </h3>
          <p className="text-sm text-ink-muted">{hint}</p>
        </div>
        <ArrowUpRight aria-hidden className="size-4.5 shrink-0" />
      </div>
    </li>
  );
}

function CategoryLink({ id, children }: { id: LabCategory; children?: ReactNode }) {
  const c = labCategories.find((x) => x.id === id)!;
  const n = labs.filter((l) => l.category === id).length;
  const { icon: Icon, tone } = LOOK[id];
  return (
    <li className="bg-paper">
      <Link href={`/labs#${c.hash}`} className="group flex h-full items-center gap-4 p-5 transition-colors duration-150 hover:bg-paper-raised sm:p-6">
        <span className={cn("grid size-11 shrink-0 place-items-center border-2 border-ink text-on-bright shadow-brutal-sm", tone)}>
          <Icon aria-hidden className="size-5" />
        </span>
        <span className="flex flex-1 flex-col">
          <span className="flex items-center gap-2 font-display text-lg tracking-tight">
            {c.name}
            <span className="border-2 border-ink bg-paper-raised px-1.5 font-mono text-xs font-bold">{n}</span>
          </span>
          <span className="text-sm text-ink-muted">{children}</span>
        </span>
        <ArrowUpRight
          aria-hidden
          className="size-4.5 shrink-0 transition-[translate] duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
        />
      </Link>
    </li>
  );
}

export function LabsShowcase() {
  return (
    <Section id="labs" aria-labelledby="labs-title">
      <SectionHeading
        index="04"
        eyebrow="Labs"
        title={<span id="labs-title">Toys, games, and the Critter Club.</span>}
        description="The playground: 3D toys you can poke, mini games for empty states, and cute critters with expressions. All plain React and CSS, all copyable."
      />
      <ul className="grid grid-cols-1 gap-0.5 bg-ink lg:grid-cols-5">
        <Experiment slug="radio" hint="A 3D 90s radio. Power it on and tune the dial." className="lg:col-span-3" stage="bg-blue-soft bg-dots" />
        <Experiment slug="bear" hint="Grab the mallet and bonk. Cute squeaks." className="lg:col-span-2" stage="bg-pink-soft bg-dots" />
      </ul>
      <ul className="grid grid-cols-1 gap-0.5 border-t-2 border-ink bg-ink md:grid-cols-3">
        <CategoryLink id="component">Toys and interactions</CategoryLink>
        <CategoryLink id="game">Playable in a card</CategoryLink>
        <CategoryLink id="critter">Mascots that react</CategoryLink>
      </ul>
    </Section>
  );
}

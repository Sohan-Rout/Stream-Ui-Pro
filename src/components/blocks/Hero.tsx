import { ArrowRight, MousePointerClick } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { IntentLink as Link } from "@/components/ui/IntentLink";
import { siteConfig } from "@/lib/site";
import { Section } from "@/components/ui/Section";
import { Badge, buttonStyles, ComicBadge } from "@streamuilib/react";
import { InstallTabs } from "./InstallTabs";
import { installOptions, shadcnBrowse } from "@/registry/shadcn";
import { componentGroups } from "@/registry/components";
import { CritterStage } from "./CritterStage";
import pkg from "../../../packages/react/package.json";

/** "0.6.0" → "v0.6". */
const version = `v${pkg.version.split(".").slice(0, 2).join(".")}`;

export function Hero() {
  return (
    <Section id="top" railClassName="grid grid-cols-1 lg:grid-cols-12">
      {/* Pitch */}
      <div className="flex flex-col justify-center gap-8 px-5 py-14 sm:px-10 sm:py-20 lg:col-span-7 lg:border-r-2 lg:border-ink">
        <Badge tone="paper" className="self-start">
          <span aria-hidden className="size-2 rounded-full bg-lime ring-2 ring-ink" />
          {version} · {componentGroups.length} components × 2 designs
        </Badge>

        <h1 className="text-5xl leading-[0.95] font-display tracking-tighter text-balance sm:text-7xl">
          Components with{" "}
          <span className="relative inline-block">
            <span className="inline-block -rotate-2 border-2 border-ink bg-lime px-2 text-on-bright shadow-brutal">character</span>
            <span aria-hidden className="absolute -top-16 -right-12 hidden sm:block">
              <ComicBadge shape="burst" tone="pink" size="sm" tilt={14}>
                Pow!
              </ComicBadge>
            </span>
          </span>
          .
        </h1>

        <p className="max-w-xl text-lg leading-relaxed text-pretty text-ink-muted">
          Neobrutalism components for React and Tailwind, each in a Classic and a Comic design. Plus playful
          page sections, 2,000+ icons, mini games, and critters that blink back. Accessible, typed, and yours to
          copy.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link href="/components" className={buttonStyles({ size: "lg" })}>
            Browse components <ArrowRight aria-hidden />
          </Link>
          <a href={siteConfig.githubUrl} className={buttonStyles({ variant: "secondary", size: "lg" })}>
            <SiGithub aria-hidden /> Star on GitHub
          </a>
        </div>

        <InstallTabs options={installOptions(shadcnBrowse())} className="self-start" />
      </div>

      {/* The critters, live */}
      <div className="relative flex flex-col items-center justify-center overflow-hidden border-t-2 border-ink bg-violet-soft bg-dots px-4 pt-14 pb-10 lg:col-span-5 lg:border-t-0">
        <p className="absolute top-3 left-4 font-mono text-xs text-ink-muted">fig. 01 — the critter club</p>
        <CritterStage />
        <Link
          href="/labs#critters"
          className="mt-2 inline-flex items-center gap-2 border-2 border-ink bg-paper-raised px-3 py-1.5 font-mono text-xs font-bold uppercase shadow-brutal-sm transition-[translate,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal motion-reduce:transition-none"
        >
          <MousePointerClick aria-hidden className="size-4" /> Tap them · meet the club
        </Link>
      </div>
    </Section>
  );
}

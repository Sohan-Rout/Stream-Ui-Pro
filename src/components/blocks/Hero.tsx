import { ArrowRight, Check, Music, Sparkles } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { IntentLink as Link } from "@/components/ui/IntentLink";
import { siteConfig } from "@/lib/site";
import { Section } from "@/components/ui/Section";
import { Badge, buttonStyles } from "@streamuilib/react";
import { InstallTabs } from "./InstallTabs";
import { installOptions, shadcnBrowse } from "@/registry/shadcn";
import { HeroSwitchCard } from "./HeroSwitchCard";

export function Hero() {
  return (
    <Section id="top" railClassName="grid grid-cols-1 lg:grid-cols-5">
      {/* Pitch */}
      <div className="flex flex-col justify-center gap-8 px-5 py-14 sm:px-10 sm:py-20 lg:col-span-3 lg:border-r-2 lg:border-ink">
        <Badge tone="paper" className="self-start">
          <span aria-hidden className="size-2 rounded-full bg-lime ring-2 ring-ink" />
          v0.1 · public beta
        </Badge>

        <h1 className="text-5xl leading-none font-display tracking-tighter text-balance sm:text-7xl">
          UI that doesn&apos;t{" "}
          <span className="inline-block -rotate-2 border-2 border-ink bg-lime px-2 text-on-bright shadow-brutal">
            whisper
          </span>
          .
        </h1>

        <p className="max-w-lg text-lg leading-relaxed text-pretty text-ink-muted">
          Components, full page sections, a crisp icon set, and a labs drawer
          full of weird experiments. Typed, accessible, and loud by default.
          Copy it in, make it yours.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link href="/components" className={buttonStyles({ size: "lg" })}>
            Browse components <ArrowRight aria-hidden />
          </Link>
          <a
            href={siteConfig.githubUrl}
            className={buttonStyles({ variant: "secondary", size: "lg" })}
          >
            <SiGithub aria-hidden /> Star on GitHub
          </a>
        </div>

        <InstallTabs options={installOptions(shadcnBrowse())} className="self-start" />
      </div>

      {/* Specimen board */}
      <div className="relative flex flex-col justify-center gap-6 overflow-hidden border-t-2 border-ink bg-lime-soft bg-dots px-5 py-14 sm:px-10 lg:col-span-2 lg:border-t-0">
        <p className="absolute top-3 left-4 font-mono text-xs text-ink-muted">
          fig. 01 — specimens
        </p>

        <div
          aria-hidden
          className="absolute top-8 right-6 z-10 hidden size-20 sm:grid rotate-12 place-items-center rounded-full border-2 border-ink bg-pink text-center font-mono text-xs leading-tight font-bold text-on-bright shadow-brutal"
        >
          100%
          <br />
          typed
        </div>

        <div className="-rotate-1 border-2 border-ink bg-paper-raised p-4 shadow-brutal-lg sm:mr-10">
          <div className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center border-2 border-ink bg-lime text-on-bright">
              <Check aria-hidden className="size-5" strokeWidth={3} />
            </span>
            <div className="min-w-0">
              <p className="font-bold">Deploy succeeded</p>
              <p className="text-sm text-ink-muted">
                stream-ui-docs is live on production.
              </p>
            </div>
            <span className="ml-auto font-mono text-xs text-ink-muted">2s</span>
          </div>
        </div>

        <HeroSwitchCard />

        <div className="-rotate-1 border-2 border-ink bg-blue p-4 text-on-bright shadow-brutal sm:mr-6">
          <div className="flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center border-2 border-ink bg-paper-raised text-on-bright">
              <Music aria-hidden className="size-4.5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-xs text-on-bright/70">now streaming</p>
              <p className="truncate font-bold">lofi beats to ship UI to</p>
            </div>
          </div>
          <div className="mt-4 h-3 border-2 border-ink bg-paper-raised">
            <div className="h-full w-3/5 bg-lime" />
          </div>
          <div className="mt-1.5 flex justify-between font-mono text-xs text-on-bright/70">
            <span>2:14</span>
            <span>3:41</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge tone="lime">
            <Sparkles aria-hidden /> new
          </Badge>
          <Badge tone="blue">beta</Badge>
          <Badge tone="violet">stable</Badge>
          <Badge tone="orange">labs</Badge>
        </div>
      </div>
    </Section>
  );
}

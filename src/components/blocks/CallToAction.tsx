import { ArrowRight } from "lucide-react";
import { IntentLink as Link } from "@/components/ui/IntentLink";
import { Section } from "@/components/ui/Section";
import { buttonStyles } from "@streamuilib/react";
import { InstallTabs } from "./InstallTabs";
import { installOptions, shadcnBrowse } from "@/registry/shadcn";

export function CallToAction() {
  return (
    <Section aria-labelledby="cta-title" railClassName="bg-pink text-on-bright">
      <div className="flex flex-col items-start gap-8 px-5 py-16 sm:px-10 sm:py-20 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <p className="flex items-center gap-3 font-mono text-xs font-bold tracking-widest uppercase">
            06 <span aria-hidden className="h-0.5 w-8 bg-on-bright" /> Get started
          </p>
          <h2
            id="cta-title"
            className="mt-5 font-display text-4xl leading-tight tracking-tight text-balance sm:text-5xl"
          >
            Pick a personality. Ship it today.
          </h2>
          <p className="mt-4 text-lg leading-relaxed">
            Add one component in Classic or Comic, see how it fits your
            codebase, then bring in a hero, a game, or a critter. Or start
            from a whole site with a Pro template.
          </p>
        </div>
        <div className="flex max-w-full flex-col items-start gap-5">
          <InstallTabs options={installOptions(shadcnBrowse())} />
          <div className="flex flex-wrap gap-3">
            <Link href="/components" className={buttonStyles({ variant: "secondary", size: "lg" })}>
              Browse components <ArrowRight aria-hidden />
            </Link>
            <Link href="/templates" className={buttonStyles({ variant: "secondary", size: "lg" })}>
              Pro templates <ArrowRight aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}

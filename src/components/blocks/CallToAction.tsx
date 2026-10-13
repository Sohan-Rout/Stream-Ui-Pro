import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { Section } from "@/components/ui/Section";
import { buttonStyles } from "@/components/ui/Button";
import { InstallCommand } from "./InstallCommand";

export function CallToAction() {
  return (
    <Section aria-labelledby="cta-title" railClassName="bg-yellow text-on-bright">
      <div className="flex flex-col items-start gap-8 px-5 py-16 sm:px-10 sm:py-24 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-xs font-semibold tracking-widest uppercase">
            <span className="border-2 border-ink bg-paper-raised px-1.5 py-0.5 text-ink">05</span> Your move
          </p>
          <h2
            id="cta-title"
            className="mt-4 text-5xl leading-none font-black tracking-tighter text-balance sm:text-7xl"
          >
            Stop shipping beige.
          </h2>
        </div>
        <div className="flex max-w-full flex-col items-start gap-5">
          <a
            href="#components"
            className={buttonStyles({ variant: "pink", size: "lg" })}
          >
            Start building <ArrowRight aria-hidden />
          </a>
          <InstallCommand command={siteConfig.installCommand} />
        </div>
      </div>
    </Section>
  );
}

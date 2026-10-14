import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { Section } from "@/components/ui/Section";
import { buttonStyles } from "@/components/ui/Button";
import { InstallCommand } from "./InstallCommand";

export function CallToAction() {
  return (
    <Section aria-labelledby="cta-title" railClassName="bg-pink text-on-bright">
      <div className="flex flex-col items-start gap-8 px-5 py-16 sm:px-10 sm:py-20 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <p className="flex items-center gap-3 font-mono text-xs font-bold tracking-widest uppercase">
            05 <span aria-hidden className="h-0.5 w-8 bg-on-bright" /> Get started
          </p>
          <h2
            id="cta-title"
            className="mt-5 font-display text-4xl leading-tight tracking-tight text-balance sm:text-5xl"
          >
            Start with one component.
          </h2>
          <p className="mt-4 text-lg leading-relaxed">
            Add the button, see how it fits your codebase, then pull in more
            as you need them.
          </p>
        </div>
        <div className="flex max-w-full flex-col items-start gap-5">
          <InstallCommand command={siteConfig.installCommand} />
          <Link href="/components" className={buttonStyles({ variant: "secondary", size: "lg" })}>
            Browse components <ArrowRight aria-hidden />
          </Link>
        </div>
      </div>
    </Section>
  );
}

import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { indexSeo } from "@/lib/seo-copy";
import { templates } from "@/lib/templates";
import { Section } from "@/components/ui/Section";
import { Fragment } from "react";
import { TemplateCard, TemplateDivider } from "@/components/blocks/ProTemplates";

export const metadata: Metadata = pageMetadata({ ...indexSeo.templates, path: "/templates" });

export default function TemplatesPage() {
  return (
    <>
      <Section railClassName="px-5 py-14 sm:px-10 sm:py-20">
        <p className="flex items-center gap-3 font-mono text-xs font-bold tracking-widest uppercase">
          Templates <span aria-hidden className="h-0.5 w-8 bg-ink" />
          <span className="text-ink-muted">stream/ui Pro</span>
        </p>
        <h1 className="mt-5 max-w-3xl font-display text-4xl leading-tight tracking-tight text-balance sm:text-5xl">
          Next.js landing page templates, built and ready to ship.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">
          Complete, responsive sites in the neobrutalism style, made with stream/ui. Buy once, get the full source code, and use it in
          unlimited personal and client projects.
        </p>
      </Section>
      <Section aria-label="Templates">
        {templates.map((t, i) => (
          <Fragment key={t.slug}>
            {i > 0 && <TemplateDivider />}
            <TemplateCard t={t} headingAs="h2" />
          </Fragment>
        ))}
        <p className="border-t-2 border-ink px-5 py-4 font-mono text-xs text-ink-muted sm:px-8">
          More templates on the way. The component library itself stays free and open source.
        </p>
      </Section>
    </>
  );
}

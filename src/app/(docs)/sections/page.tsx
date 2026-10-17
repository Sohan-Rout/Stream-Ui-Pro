import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { indexSeo } from "@/lib/seo-copy";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@streamuilib/react";
import { DocHeader } from "@/components/docs/DocHeader";
import { SectionThumb, ThumbFrame } from "@/components/blocks/SectionThumbs";
import { LiveThumb } from "@/components/docs/LiveThumb";
import { sections, type SectionDoc } from "@/registry/sections";

function FirstVariant({ section }: { section: SectionDoc }) {
  const Live = section.variants[0].Component;
  return <Live headingAs="h3" />;
}

export const metadata: Metadata = pageMetadata({ ...indexSeo.sections, path: "/sections" });

export default function SectionsIndex() {
  return (
    <div className="flex flex-col gap-10">
      <DocHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Sections" }]}
        title="Landing page sections"
        description="Neobrutalism landing page sections for React, composed from the same components. They size themselves to their container, so they fit a full page or a narrow column."
        meta={<Badge tone="paper">{sections.length} sections</Badge>}
      />
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((s) => (
          <li key={s.slug} className="group relative flex flex-col border-2 border-ink bg-blue-soft p-5 shadow-brutal transition-[translate,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg motion-reduce:transition-none">
            {s.variants.length > 1 ? (
              // Several designs: show the first one live, since a sketch can't stand for all of them.
              <LiveThumb>
                <FirstVariant section={s} />
              </LiveThumb>
            ) : (
              <ThumbFrame>
                <SectionThumb slug={s.slug} />
              </ThumbFrame>
            )}
            <div className="mt-5 flex items-center justify-between gap-3">
              <h2 className="font-display text-xl tracking-tight">
                <Link href={`/sections/${s.slug}`} className="after:absolute after:inset-0">
                  {s.name}
                </Link>
              </h2>
              <ArrowUpRight aria-hidden className="size-4.5 shrink-0" />
            </div>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">{s.description}</p>
            {s.variants.length > 1 && (
              <Badge tone="paper" className="mt-4 self-start">
                {s.variants.length} variants
              </Badge>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

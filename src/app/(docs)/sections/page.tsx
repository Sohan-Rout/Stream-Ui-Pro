import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@streamui/react";
import { DocHeader } from "@/components/docs/DocHeader";
import { SectionThumb, ThumbFrame } from "@/components/blocks/SectionThumbs";
import { sections } from "@/registry/sections";

export const metadata: Metadata = pageMetadata({
  title: "Sections",
  description:
    "Ready-made page sections built with stream/ui: hero, features, pricing, testimonials, FAQ, and footer. Responsive with container queries.",
  path: "/sections",
});

export default function SectionsIndex() {
  return (
    <div className="flex flex-col gap-10">
      <DocHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Sections" }]}
        title="Sections"
        description="Full page sections composed from the same components. They size themselves to their container, so they fit a full page or a narrow column."
        meta={<Badge tone="paper">{sections.length} sections</Badge>}
      />
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((s) => (
          <li key={s.slug} className="group relative flex flex-col border-2 border-ink bg-blue-soft p-5 shadow-brutal transition-[translate,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg motion-reduce:transition-none">
            <ThumbFrame>
              <SectionThumb slug={s.slug} />
            </ThumbFrame>
            <div className="mt-5 flex items-center justify-between gap-3">
              <h2 className="font-display text-xl tracking-tight">
                <Link href={`/sections/${s.slug}`} className="after:absolute after:inset-0">
                  {s.name}
                </Link>
              </h2>
              <ArrowUpRight aria-hidden className="size-4.5 shrink-0" />
            </div>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">{s.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Layers, LayoutTemplate, Terminal } from "lucide-react";
import { cn } from "@streamuilib/react";
import { pageMetadata } from "@/lib/seo";
import { indexSeo } from "@/lib/seo-copy";
import { DocHeader } from "@/components/docs/DocHeader";
import { LiveThumb } from "@/components/docs/LiveThumb";
import { sections, type SectionDoc } from "@/registry/sections";

export const metadata: Metadata = pageMetadata({ ...indexSeo.sections, path: "/sections" });

/** One soft tint per card, so the grid reads as a set of distinct sections. */
const TINTS = ["bg-lime-soft", "bg-pink-soft", "bg-blue-soft", "bg-violet-soft", "bg-orange-soft"];

function FirstVariant({ section }: { section: SectionDoc }) {
  const Live = section.variants[0].Component;
  return <Live headingAs="h3" />;
}

export default function SectionsIndex() {
  const designs = sections.reduce((n, s) => n + s.variants.length, 0);
  const stats = [
    { icon: LayoutTemplate, label: `${sections.length} sections` },
    { icon: Layers, label: `${designs} designs` },
    { icon: Terminal, label: "Install with shadcn" },
  ];

  return (
    <div className="flex flex-col gap-10">
      <DocHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Sections" }]}
        title="Landing page sections"
        description="Neobrutalism landing page sections for React, composed from the same components. They size themselves to their container, so they fit a full page or a narrow column."
      />

      <ul aria-label="At a glance" className="grid grid-cols-1 gap-0.5 border-2 border-ink bg-ink shadow-brutal sm:grid-cols-3">
        {stats.map((s) => (
          <li key={s.label} className="flex items-center gap-3 bg-paper-raised px-5 py-4">
            <span aria-hidden className="grid size-8 shrink-0 place-items-center border-2 border-ink bg-lime text-on-bright">
              <s.icon className="size-4" />
            </span>
            <span className="font-bold">{s.label}</span>
          </li>
        ))}
      </ul>

      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((s, i) => (
          <li
            key={s.slug}
            className={cn(
              "group relative flex flex-col border-2 border-ink p-4 shadow-brutal transition-[translate,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg motion-reduce:transition-none sm:p-5",
              TINTS[i % TINTS.length],
            )}
          >
            {/* A small browser window around the live preview. */}
            <div aria-hidden className="flex items-center gap-1.5 border-2 border-b-0 border-ink bg-paper-raised px-3 py-1.5">
              <span className="size-2 rounded-full border-2 border-ink bg-pink" />
              <span className="size-2 rounded-full border-2 border-ink bg-orange" />
              <span className="size-2 rounded-full border-2 border-ink bg-lime" />
              <span className="ml-2 truncate font-mono text-xs text-ink-muted">{s.slug}.tsx</span>
            </div>
            <LiveThumb>
              <FirstVariant section={s} />
            </LiveThumb>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="font-mono text-xs font-bold text-ink-muted">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="font-display text-xl tracking-tight">
                <Link href={`/sections/${s.slug}`} className="after:absolute after:inset-0">
                  {s.name}
                </Link>
              </h2>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{s.description}</p>

            <div className="mt-auto flex items-center justify-between gap-3 pt-5">
              <span className="border-2 border-ink bg-paper-raised px-2 py-0.5 font-mono text-xs font-bold">
                {s.variants.length} {s.variants.length === 1 ? "design" : "designs"}
              </span>
              <span
                aria-hidden
                className="inline-flex items-center gap-1.5 border-2 border-ink bg-lime px-2.5 py-1 font-mono text-xs font-bold text-on-bright shadow-brutal-sm"
              >
                Open
                <ArrowRight className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none" />
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

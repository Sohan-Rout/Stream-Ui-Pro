import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@streamui/react";
import { DocHeader } from "@/components/docs/DocHeader";
import { labs } from "@/registry/labs";

export const metadata: Metadata = {
  title: "Labs",
  description: "Interaction experiments that haven't graduated into the main library.",
};

export default function LabsIndex() {
  return (
    <div className="flex flex-col gap-10">
      <DocHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Labs" }]}
        title="Labs"
        description="Interaction prototypes that haven't graduated into the main library. Their APIs can change between releases."
        meta={<Badge tone="orange">experimental</Badge>}
      />
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {labs.map((l) => (
          <li key={l.slug} className="flex flex-col border-2 border-ink bg-paper-raised shadow-brutal">
            <div className="flex flex-1 items-center justify-center border-b-2 border-ink bg-violet-soft p-6">
              <l.Component />
            </div>
            <div className="flex flex-col gap-1 p-5">
              <Link
                href={`/labs/${l.slug}`}
                className="flex items-center justify-between gap-3 font-display text-xl tracking-tight underline-offset-4 hover:underline"
              >
                {l.name}
                <ArrowUpRight aria-hidden className="size-4.5 shrink-0" />
              </Link>
              <p className="text-sm leading-relaxed text-ink-muted">{l.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

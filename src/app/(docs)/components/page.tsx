import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { DocHeader } from "@/components/docs/DocHeader";
import { components } from "@/registry/components";

export const metadata: Metadata = {
  title: "Components",
  description: "Accessible React primitives with every state styled.",
};

export default function ComponentsIndex() {
  return (
    <div className="flex flex-col gap-10">
      <DocHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Components" }]}
        title="Components"
        description="Accessible primitives with every state styled. Each one is a single file you own: copy it in, then change anything."
        meta={<Badge tone="paper">{components.length} components</Badge>}
      />
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {components.map((c) => {
          const Preview = c.examples[0].Component;
          return (
            <li key={c.slug} className="group relative flex flex-col border-2 border-ink bg-paper-raised shadow-brutal transition-[translate,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg motion-reduce:transition-none">
              <div className="flex min-h-44 items-center justify-center overflow-hidden border-b-2 border-ink bg-paper bg-dots p-6">
                {/* Live but inert: the whole card is the link. */}
                <div inert className="pointer-events-none">
                  <Preview />
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-2 p-5">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-display text-xl tracking-tight">
                    <Link href={`/components/${c.slug}`} className="after:absolute after:inset-0">
                      {c.name}
                    </Link>
                  </h2>
                  <ArrowUpRight aria-hidden className="size-4.5 shrink-0" />
                </div>
                <p className="text-sm leading-relaxed text-ink-muted">{c.description}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

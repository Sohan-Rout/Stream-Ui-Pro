import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { indexSeo } from "@/lib/seo-copy";
import { IntentLink as Link } from "@/components/ui/IntentLink";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@streamuilib/react";
import { DocHeader } from "@/components/docs/DocHeader";
import { labs } from "@/registry/labs";
import { InfiniteGrid } from "@/components/docs/InfiniteGrid";
import { Live } from "@/components/docs/Live";

export const metadata: Metadata = pageMetadata({ ...indexSeo.labs, path: "/labs" });

export default function LabsIndex() {
  return (
    <div className="flex flex-col gap-10">
      <DocHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Labs" }]}
        title="UI experiments"
        description="Creative UI experiments in React and CSS that haven't graduated into the main library yet. Their APIs can change between releases."
        meta={<Badge tone="orange">experimental</Badge>}
      />
      {/* Six games up front; each one's code loads only when its card appears. */}
      <InfiniteGrid batch={6} noun="experiments" className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {labs.map((l) => (
          <li
            key={l.slug}
            className="flex flex-col border-2 border-ink bg-paper-raised shadow-brutal [contain-intrinsic-size:auto_520px] [content-visibility:auto]"
          >
            <div className="flex flex-1 items-center justify-center border-b-2 border-ink bg-violet-soft p-6">
              <Live file={l.file} />
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
      </InfiniteGrid>
    </div>
  );
}

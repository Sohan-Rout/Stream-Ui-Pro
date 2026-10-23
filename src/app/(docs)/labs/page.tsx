import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { indexSeo } from "@/lib/seo-copy";
import { IntentLink as Link } from "@/components/ui/IntentLink";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@streamuilib/react";
import { DocHeader } from "@/components/docs/DocHeader";
import { labCategories, labs, type LabDoc } from "@/registry/labs";
import { LabCatalog } from "@/components/docs/LabCatalog";
import { Live } from "@/components/docs/Live";

export const metadata: Metadata = pageMetadata({ ...indexSeo.labs, path: "/labs" });

/** One lab's card: its live preview over its name and description. */
function LabCard({ lab: l }: { lab: LabDoc }) {
  return (
    <li className="flex flex-col border-2 border-ink bg-paper-raised shadow-brutal [contain-intrinsic-size:auto_520px] [content-visibility:auto]">
      <div className="flex flex-1 items-center justify-center border-b-2 border-ink bg-violet-soft p-6">
        <Live file={l.file} />
      </div>
      <div className="flex flex-col gap-1 p-5">
        <Link href={`/labs/${l.slug}`} className="flex items-center justify-between gap-3 font-display text-xl tracking-tight underline-offset-4 hover:underline">
          {l.name}
          <ArrowUpRight aria-hidden className="size-4.5 shrink-0" />
        </Link>
        <p className="text-sm leading-relaxed text-ink-muted">{l.description}</p>
      </div>
    </li>
  );
}

export default function LabsIndex() {
  return (
    <div className="flex flex-col gap-10">
      <DocHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Labs" }]}
        title="UI experiments"
        description="Creative UI experiments in React and CSS that haven't graduated into the main library yet. Their APIs can change between releases."
        meta={<Badge tone="orange">experimental</Badge>}
      />
      <LabCatalog
        groups={labCategories.map((c) => ({
          ...c,
          cards: labs.filter((l) => l.category === c.id).map((l) => <LabCard key={l.slug} lab={l} />),
        }))}
      />
    </div>
  );
}

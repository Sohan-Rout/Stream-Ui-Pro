import Link from "next/link";
import { Badge } from "@streamuilib/react";
import { readSource } from "@/lib/source";
import { components } from "@/registry/components";
import type { SectionVariant } from "@/registry/sections";
import { DocSection } from "./DocHeader";
import { CodeBlock } from "./CodeBlock";
import { InstallCommand } from "@/components/blocks/InstallCommand";
import { shadcnAdd } from "@/registry/shadcn";
import { OpenInV0 } from "./OpenInV0";

/** "Built with" badges, linking to each component's page. */
export function BuiltWith({ uses }: { uses: string[] }) {
  return (
    <>
      <span className="font-mono text-xs text-ink-muted">Built with</span>
      {uses.map((u) => {
        const c = components.find((c) => c.name === u);
        return c ? (
          <Link key={u} href={`/components/${c.slug}`} className="rounded-full focus-visible:outline-offset-2">
            <Badge tone="paper" className="hover:bg-lime-soft">{u}</Badge>
          </Link>
        ) : (
          <Badge key={u} tone="paper">{u}</Badge>
        );
      })}
    </>
  );
}

/** Preview, notes, and source for one section design: the body of its page. */
export function SectionDocBody({ variant, item }: { variant: SectionVariant; item: string }) {
  const Live = variant.Component;
  return (
    <>
      <DocSection title="Install" id="install">
        <p className="max-w-2xl leading-relaxed text-ink-muted">
          Copy it into a shadcn/ui project with the shadcn CLI, which brings the theme and anything else it
          needs, or open it in v0 to remix it. Or copy the source below.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <InstallCommand command={shadcnAdd(item)} />
          <OpenInV0 item={item} />
        </div>
      </DocSection>

      <DocSection title="Preview" id="preview">
        <div className="border-2 border-ink shadow-brutal-lg">
          <div className="flex items-center gap-1.5 border-b-2 border-ink bg-paper-sunken px-3 py-2">
            <span aria-hidden className="size-2.5 rounded-full border-2 border-ink bg-pink" />
            <span aria-hidden className="size-2.5 rounded-full border-2 border-ink bg-orange" />
            <span aria-hidden className="size-2.5 rounded-full border-2 border-ink bg-lime" />
            <span className="ml-3 font-mono text-xs text-ink-muted">{variant.file.split("/").pop()}</span>
          </div>
          {/* The page already has its h1, so the preview's headline drops a level. */}
          <Live headingAs="h3" />
        </div>
      </DocSection>

      <DocSection title="Notes" id="notes">
        <ul className="flex flex-col gap-3">
          {variant.notes.map((n) => (
            <li key={n} className="flex gap-3 leading-relaxed">
              <span aria-hidden className="mt-2 size-2 shrink-0 bg-blue ring-2 ring-ink" />
              {n}
            </li>
          ))}
        </ul>
      </DocSection>

      <DocSection title="Source" id="source">
        <CodeBlock code={readSource(variant.file)} filename={variant.file} collapsible />
      </DocSection>
    </>
  );
}

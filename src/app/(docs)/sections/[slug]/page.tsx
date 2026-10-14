import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readSource } from "@/lib/source";
import { Badge } from "@/components/ui/Badge";
import { DocHeader, DocSection } from "@/components/docs/DocHeader";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { PrevNext } from "@/components/docs/PrevNext";
import { components } from "@/registry/components";
import { getSection, sections } from "@/registry/sections";
import { neighbors } from "@/registry/nav";

export function generateStaticParams() {
  return sections.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/sections/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const doc = getSection(slug);
  return doc ? { title: `${doc.name} section`, description: doc.description } : {};
}

export default async function SectionPage({ params }: PageProps<"/sections/[slug]">) {
  const { slug } = await params;
  const doc = getSection(slug);
  if (!doc) notFound();

  const { prev, next } = neighbors(sections, sections.indexOf(doc), "/sections");
  const Live = doc.Component;

  return (
    <article className="flex flex-col gap-14">
      <DocHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Sections", href: "/sections" }, { label: doc.name }]}
        title={doc.name}
        description={doc.description}
        meta={
          <>
            <span className="font-mono text-xs text-ink-muted">Built with</span>
            {doc.uses.map((u) => {
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
        }
      />

      <DocSection title="Preview" id="preview">
        <div className="border-2 border-ink shadow-brutal-lg">
          <div className="flex items-center gap-1.5 border-b-2 border-ink bg-paper-sunken px-3 py-2">
            <span aria-hidden className="size-2.5 rounded-full border-2 border-ink bg-pink" />
            <span aria-hidden className="size-2.5 rounded-full border-2 border-ink bg-orange" />
            <span aria-hidden className="size-2.5 rounded-full border-2 border-ink bg-lime" />
            <span className="ml-3 font-mono text-xs text-ink-muted">{doc.file.split("/").pop()}</span>
          </div>
          <Live />
        </div>
      </DocSection>

      <DocSection title="Notes" id="notes">
        <ul className="flex flex-col gap-3">
          {doc.notes.map((n) => (
            <li key={n} className="flex gap-3 leading-relaxed">
              <span aria-hidden className="mt-2 size-2 shrink-0 bg-blue ring-2 ring-ink" />
              {n}
            </li>
          ))}
        </ul>
      </DocSection>

      <DocSection title="Source" id="source">
        <CodeBlock code={readSource(doc.file)} filename={doc.file} collapsible />
      </DocSection>

      <PrevNext prev={prev} next={next} />
    </article>
  );
}

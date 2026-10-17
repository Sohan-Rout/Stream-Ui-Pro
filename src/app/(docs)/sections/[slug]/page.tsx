import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { sectionSeo } from "@/lib/seo-copy";
import { readSource } from "@/lib/source";
import { Badge } from "@streamuilib/react";
import { DocHeader, DocSection } from "@/components/docs/DocHeader";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { PrevNext } from "@/components/docs/PrevNext";
import { components } from "@/registry/components";
import { getSection, sections, type SectionVariant } from "@/registry/sections";
import { neighbors } from "@/registry/nav";

export function generateStaticParams() {
  return sections.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/sections/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const doc = getSection(slug);
  if (!doc) return {};
  return pageMetadata({ ...sectionSeo(doc), path: `/sections/${doc.slug}` });
}

/** "Built with" badges, linking to each component's page. */
function BuiltWith({ uses }: { uses: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
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
    </div>
  );
}

/** The live section in a window frame. */
function Preview({ variant, headingAs }: { variant: SectionVariant; headingAs: "h2" | "h3" }) {
  const Live = variant.Component;
  return (
    <div className="border-2 border-ink shadow-brutal-lg">
      <div className="flex items-center gap-1.5 border-b-2 border-ink bg-paper-sunken px-3 py-2">
        <span aria-hidden className="size-2.5 rounded-full border-2 border-ink bg-pink" />
        <span aria-hidden className="size-2.5 rounded-full border-2 border-ink bg-orange" />
        <span aria-hidden className="size-2.5 rounded-full border-2 border-ink bg-lime" />
        <span className="ml-3 font-mono text-xs text-ink-muted">{variant.file.split("/").pop()}</span>
      </div>
      {/* The page already has its h1, so the preview's headline drops a level. */}
      <Live headingAs={headingAs} />
    </div>
  );
}

function Notes({ notes }: { notes: string[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {notes.map((n) => (
        <li key={n} className="flex gap-3 leading-relaxed">
          <span aria-hidden className="mt-2 size-2 shrink-0 bg-blue ring-2 ring-ink" />
          {n}
        </li>
      ))}
    </ul>
  );
}

export default async function SectionPage({ params }: PageProps<"/sections/[slug]">) {
  const { slug } = await params;
  const doc = getSection(slug);
  if (!doc) notFound();

  const { prev, next } = neighbors(sections, sections.indexOf(doc), "/sections");
  const [only, ...more] = doc.variants;
  const many = more.length > 0;

  return (
    <article className="flex flex-col gap-14">
      <DocHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Sections", href: "/sections" }, { label: doc.name }]}
        title={doc.name}
        description={doc.description}
        meta={many ? <Badge tone="paper">{doc.variants.length} variants</Badge> : <BuiltWith uses={only.uses} />}
      />

      {many ? (
        <>
          <nav aria-label={`${doc.name} variants`}>
            <ol className="flex flex-wrap gap-3">
              {doc.variants.map((v, i) => (
                <li key={v.id}>
                  <a
                    href={`#${v.id}`}
                    className="flex items-center gap-2 border-2 border-ink bg-paper-raised px-3 py-1.5 text-sm font-semibold shadow-brutal-sm transition-[translate,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-lime hover:shadow-brutal"
                  >
                    <span className="font-mono text-xs text-ink-muted">{String(i + 1).padStart(2, "0")}</span>
                    {v.name}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {doc.variants.map((v, i) => (
            <section key={v.id} id={v.id} aria-labelledby={`${v.id}-title`} className="flex scroll-mt-20 flex-col gap-6 border-t-2 border-ink pt-10">
              <div className="flex flex-col gap-3">
                <p className="font-mono text-xs font-bold tracking-widest text-ink-muted uppercase">
                  Variant {String(i + 1).padStart(2, "0")}
                </p>
                <h2 id={`${v.id}-title`} className="font-display text-3xl tracking-tight">
                  {v.name}
                </h2>
                <p className="max-w-2xl leading-relaxed text-ink-muted">{v.description}</p>
                <BuiltWith uses={v.uses} />
              </div>
              <Preview variant={v} headingAs="h3" />
              <Notes notes={v.notes} />
              <CodeBlock code={readSource(v.file)} filename={v.file} collapsible />
            </section>
          ))}
        </>
      ) : (
        <>
          <DocSection title="Preview" id="preview">
            <Preview variant={only} headingAs="h2" />
          </DocSection>

          <DocSection title="Notes" id="notes">
            <Notes notes={only.notes} />
          </DocSection>

          <DocSection title="Source" id="source">
            <CodeBlock code={readSource(only.file)} filename={only.file} collapsible />
          </DocSection>
        </>
      )}

      <PrevNext prev={prev} next={next} />
    </article>
  );
}

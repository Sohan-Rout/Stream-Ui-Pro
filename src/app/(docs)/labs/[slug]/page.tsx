import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { labSeo } from "@/lib/seo-copy";
import { readSource } from "@/lib/source";
import { Badge } from "@streamuilib/react";
import { DocHeader, DocSection } from "@/components/docs/DocHeader";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { PrevNext } from "@/components/docs/PrevNext";
import { getLab, labs } from "@/registry/labs";
import { neighbors } from "@/registry/nav";

export function generateStaticParams() {
  return labs.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: PageProps<"/labs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const doc = getLab(slug);
  if (!doc) return {};
  return pageMetadata({ ...labSeo(doc), path: `/labs/${doc.slug}` });
}

export default async function LabPage({ params }: PageProps<"/labs/[slug]">) {
  const { slug } = await params;
  const doc = getLab(slug);
  if (!doc) notFound();

  const { prev, next } = neighbors(labs, labs.indexOf(doc), "/labs");
  const Live = doc.Component;

  return (
    <article className="flex flex-col gap-14">
      <DocHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Labs", href: "/labs" }, { label: doc.name }]}
        title={doc.name}
        description={doc.description}
        meta={<Badge tone="orange">experimental</Badge>}
      />

      <DocSection title="Try it" id="preview">
        <div className="flex min-h-80 items-center justify-center border-2 border-ink bg-violet-soft p-8 shadow-brutal-lg sm:p-12">
          <div className="w-full max-w-md">
            <Live />
          </div>
        </div>
      </DocSection>

      <DocSection title="How it works" id="notes">
        <ul className="flex flex-col gap-3">
          {doc.notes.map((n) => (
            <li key={n} className="flex gap-3 leading-relaxed">
              <span aria-hidden className="mt-2 size-2 shrink-0 bg-violet ring-2 ring-ink" />
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

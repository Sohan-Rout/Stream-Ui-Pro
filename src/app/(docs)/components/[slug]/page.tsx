import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { componentSeo } from "@/lib/seo-copy";
import { siteConfig } from "@/lib/site";
import { readSource } from "@/lib/source";
import { Badge } from "@streamui/react";
import { DocHeader, DocSection } from "@/components/docs/DocHeader";
import { Example } from "@/components/docs/Example";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { PropsTable } from "@/components/docs/PropsTable";
import { PrevNext } from "@/components/docs/PrevNext";
import { InstallCommand } from "@/components/blocks/InstallCommand";
import { components, getComponent } from "@/registry/components";
import { neighbors } from "@/registry/nav";

export function generateStaticParams() {
  return components.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/components/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const doc = getComponent(slug);
  if (!doc) return {};
  return pageMetadata({ ...componentSeo(doc), path: `/components/${doc.slug}` });
}

export default async function ComponentPage({ params }: PageProps<"/components/[slug]">) {
  const { slug } = await params;
  const doc = getComponent(slug);
  if (!doc) notFound();

  const index = components.indexOf(doc);
  const { prev, next } = neighbors(components, index, "/components");

  return (
    <article className="flex flex-col gap-14">
      <DocHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Components", href: "/components" }, { label: doc.name }]}
        title={doc.name}
        description={doc.description}
        meta={
          <>
            <Badge tone={doc.status === "stable" ? "lime" : "blue"}>{doc.status}</Badge>
            <Badge tone="paper">{doc.file.split("/").pop()}</Badge>
          </>
        }
      />

      <DocSection title="Examples" id="examples">
        <div className="flex flex-col gap-12">
          {doc.examples.map((e) => (
            <Example key={e.file} {...e} />
          ))}
        </div>
      </DocSection>

      <DocSection title="Installation" id="installation">
        <InstallCommand command={siteConfig.installCommand} className="self-start" />
        <CodeBlock code={doc.usage} filename="usage.tsx" />
      </DocSection>

      <DocSection title="API" id="api">
        <div className="flex flex-col gap-6">
          {doc.props.map((t, i) => (
            <PropsTable key={i} rows={t.rows} caption={t.caption} />
          ))}
        </div>
      </DocSection>

      <DocSection title="Accessibility" id="accessibility">
        <ul className="flex flex-col gap-3">
          {doc.accessibility.map((a) => (
            <li key={a} className="flex gap-3 leading-relaxed">
              <span aria-hidden className="mt-2 size-2 shrink-0 bg-lime ring-2 ring-ink" />
              {a}
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

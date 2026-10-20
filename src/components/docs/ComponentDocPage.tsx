import { readSource } from "@/lib/source";
import { Badge } from "@streamuilib/react";
import { DocHeader, DocSection } from "@/components/docs/DocHeader";
import { Example } from "@/components/docs/Example";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { PropsTable } from "@/components/docs/PropsTable";
import { PrevNext } from "@/components/docs/PrevNext";
import { InstallTabs } from "@/components/blocks/InstallTabs";
import { OpenInV0 } from "@/components/docs/OpenInV0";
import { installOptions, shadcnAdd, shadcnName } from "@/registry/shadcn";
import type { ComponentDoc } from "@/registry/components";

type Link = { label: string; href: string };

/** One component's page: header, examples, install, API, accessibility, source. */
export function ComponentDocPage({
  doc,
  crumbs,
  prev,
  next,
}: {
  doc: ComponentDoc;
  crumbs: { label: string; href?: string }[];
  prev?: Link;
  next?: Link;
}) {
  return (
    <article className="flex flex-col gap-14">
      <DocHeader
        crumbs={crumbs}
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
        <div className="flex flex-wrap items-end gap-3">
          <InstallTabs options={installOptions(shadcnAdd(shadcnName.component(doc.slug)))} />
          <OpenInV0 item={shadcnName.component(doc.slug)} />
        </div>
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

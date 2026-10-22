import type { Metadata } from "next";
import { IntentLink as Link } from "@/components/ui/IntentLink";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@streamuilib/react";
import { pageMetadata } from "@/lib/seo";
import { sectionSeo } from "@/lib/seo-copy";
import { DocHeader } from "@/components/docs/DocHeader";
import { PrevNext } from "@/components/docs/PrevNext";
import { LiveThumb } from "@/components/docs/LiveThumb";
import { BuiltWith, SectionDocBody } from "@/components/docs/SectionParts";
import { getSection, sections } from "@/registry/sections";
import { shadcnName } from "@/registry/shadcn";
import { neighbors } from "@/registry/nav";
import { Live } from "@/components/docs/Live";

/**
 * Everything on this page belongs to one URL's slug, so there's no shared
 * shell to show instantly. Every page is prerendered at build time, so
 * navigation waits only for a ready-made page. (Partial Prefetching's
 * dev insight "URL data outside of Suspense" otherwise flags this route.)
 */
export const instant = false;

export function generateStaticParams() {
  return sections.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/sections/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const doc = getSection(slug);
  if (!doc) return {};
  return pageMetadata({ ...sectionSeo(doc), path: `/sections/${doc.slug}` });
}

/**
 * A section page. With one design it documents that design directly; with
 * several it's a grid of live thumbnails, each opening its own page at
 * /sections/<slug>/<variant>.
 */
export default async function SectionPage({ params }: PageProps<"/sections/[slug]">) {
  const { slug } = await params;
  const doc = getSection(slug);
  if (!doc) notFound();

  const { prev, next } = neighbors(sections, sections.indexOf(doc), "/sections");
  const [first, ...rest] = doc.variants;
  const many = rest.length > 0;

  return (
    <article className="flex flex-col gap-14">
      <DocHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Sections", href: "/sections" }, { label: doc.name }]}
        title={doc.name}
        description={doc.description}
        meta={many ? <Badge tone="paper">{doc.variants.length} variants</Badge> : <BuiltWith uses={first.uses} />}
      />

      {many ? (
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {doc.variants.map((v) => {
            return (
              <li
                key={v.id}
                className="group relative flex flex-col border-2 border-ink bg-paper-raised p-4 shadow-brutal transition-[translate,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg motion-reduce:transition-none"
              >
                <LiveThumb>
                  <Live file={v.file} headingAs="h3" />
                </LiveThumb>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <h2 className="font-display text-xl tracking-tight">
                    <Link href={`/sections/${doc.slug}/${v.id}`} className="after:absolute after:inset-0">
                      {v.name}
                    </Link>
                  </h2>
                  <ArrowUpRight aria-hidden className="size-4.5 shrink-0" />
                </div>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">{v.description}</p>
              </li>
            );
          })}
        </ul>
      ) : (
        <SectionDocBody variant={first} item={shadcnName.section(doc, first)} />
      )}

      <PrevNext prev={prev} next={next} />
    </article>
  );
}

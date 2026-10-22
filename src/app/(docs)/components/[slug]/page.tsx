import type { Metadata } from "next";
import { IntentLink as Link } from "@/components/ui/IntentLink";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@streamuilib/react";
import { pageMetadata } from "@/lib/seo";
import { componentGroupSeo, componentSeo } from "@/lib/seo-copy";
import { DocHeader } from "@/components/docs/DocHeader";
import { PrevNext } from "@/components/docs/PrevNext";
import { ComponentDocPage } from "@/components/docs/ComponentDocPage";
import { componentEntries } from "@/registry/components";
import { indexPreviews } from "@/registry/previews";
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
  return componentEntries.map((e) => ({ slug: e.slug }));
}

const entryFor = (slug: string) => componentEntries.find((e) => e.slug === slug);

export async function generateMetadata({ params }: PageProps<"/components/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const entry = entryFor(slug);
  if (!entry) return {};
  const copy = entry.kind === "group" ? componentGroupSeo(entry.group) : componentSeo(entry.doc);
  return pageMetadata({ ...copy, path: `/components/${entry.slug}` });
}

/**
 * A component's page, or, for a broad category like Badges, a grid of its
 * designs, each opening its own page at /components/<slug>/<variant>.
 */
export default async function ComponentPage({ params }: PageProps<"/components/[slug]">) {
  const { slug } = await params;
  const entry = entryFor(slug);
  if (!entry) notFound();
  const { prev, next } = neighbors(componentEntries, componentEntries.indexOf(entry), "/components");

  if (entry.kind === "doc") {
    const crumbs = [{ label: "Home", href: "/" }, { label: "Components", href: "/components" }, { label: entry.doc.name }];
    return <ComponentDocPage doc={entry.doc} crumbs={crumbs} prev={prev} next={next} />;
  }

  const g = entry.group;
  return (
    <article className="flex flex-col gap-14">
      <DocHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Components", href: "/components" }, { label: g.name }]}
        title={g.name}
        description={g.description}
        meta={<Badge tone="paper">{g.variants.length} variants</Badge>}
      />
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {g.variants.map((v) => {
          const Preview = indexPreviews[v.doc.slug];
          return (
            <li
              key={v.id}
              className="group relative flex flex-col border-2 border-ink bg-paper-raised shadow-brutal transition-[translate,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg motion-reduce:transition-none"
            >
              <div className="flex h-72 items-center justify-center overflow-hidden border-b-2 border-ink bg-paper bg-dots p-6">
                {/* Live but inert: the whole card is the link. */}
                <div inert className="pointer-events-none flex w-full justify-center">
                  {Preview ? <Preview /> : <Live file={v.doc.examples[0].file} />}
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-2 p-5">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-display text-xl tracking-tight">
                    <Link href={`/components/${g.slug}/${v.id}`} className="after:absolute after:inset-0">
                      {v.name}
                    </Link>
                  </h2>
                  <ArrowUpRight aria-hidden className="size-4.5 shrink-0" />
                </div>
                <p className="text-sm leading-relaxed text-ink-muted">{v.description}</p>
              </div>
            </li>
          );
        })}
      </ul>
      <PrevNext prev={prev} next={next} />
    </article>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { variantSeo } from "@/lib/seo-copy";
import { DocHeader } from "@/components/docs/DocHeader";
import { PrevNext } from "@/components/docs/PrevNext";
import { BuiltWith, SectionDocBody } from "@/components/docs/SectionParts";
import { getSectionVariant, sections } from "@/registry/sections";
import { shadcnName } from "@/registry/shadcn";
import { neighbors } from "@/registry/nav";

/** One page per design, for sections that have more than one. */
/**
 * Everything on this page belongs to one URL's slug, so there's no shared
 * shell to show instantly. Every page is prerendered at build time, so
 * navigation waits only for a ready-made page. (Partial Prefetching's
 * dev insight "URL data outside of Suspense" otherwise flags this route.)
 */
export const instant = false;

export function generateStaticParams() {
  return sections
    .filter((s) => s.variants.length > 1)
    .flatMap((s) => s.variants.map((v) => ({ slug: s.slug, variant: v.id })));
}

export async function generateMetadata({ params }: PageProps<"/sections/[slug]/[variant]">): Promise<Metadata> {
  const { slug, variant } = await params;
  const found = getSectionVariant(slug, variant);
  if (!found) return {};
  return pageMetadata({ ...variantSeo(found.section, found.variant), path: `/sections/${slug}/${variant}` });
}

export default async function SectionVariantPage({ params }: PageProps<"/sections/[slug]/[variant]">) {
  const { slug, variant } = await params;
  const found = getSectionVariant(slug, variant);
  if (!found) notFound();
  const { section, variant: v } = found;

  // Prev/next step through this section's designs.
  const list = section.variants.map((x) => ({ slug: x.id, name: x.name }));
  const { prev, next } = neighbors(list, section.variants.indexOf(v), `/sections/${section.slug}`);

  return (
    <article className="flex flex-col gap-14">
      <DocHeader
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Sections", href: "/sections" },
          { label: section.name, href: `/sections/${section.slug}` },
          { label: v.name },
        ]}
        title={`${v.name} ${section.name.toLowerCase()}`}
        description={v.description}
        meta={<BuiltWith uses={v.uses} />}
      />
      <SectionDocBody variant={v} item={shadcnName.section(section, v)} />
      <PrevNext prev={prev} next={next} />
    </article>
  );
}

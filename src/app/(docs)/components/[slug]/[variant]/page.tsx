import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { componentSeo } from "@/lib/seo-copy";
import { ComponentDocPage } from "@/components/docs/ComponentDocPage";
import { componentGroups, getComponentGroup } from "@/registry/components";

/** See the note in ../page.tsx: every page is prerendered, there's no shared shell. */
export const instant = false;

export function generateStaticParams() {
  return componentGroups.flatMap((g) => g.variants.map((v) => ({ slug: g.slug, variant: v.id })));
}

function find(slug: string, id: string) {
  const group = getComponentGroup(slug);
  const index = group?.variants.findIndex((v) => v.id === id) ?? -1;
  return group && index >= 0 ? { group, index, variant: group.variants[index] } : undefined;
}

export async function generateMetadata({ params }: PageProps<"/components/[slug]/[variant]">): Promise<Metadata> {
  const { slug, variant } = await params;
  const hit = find(slug, variant);
  if (!hit) return {};
  return pageMetadata({ ...componentSeo(hit.variant.doc), path: `/components/${slug}/${variant}` });
}

/** One design inside a component group, e.g. /components/badge/comic. Prev/next walk the group's designs. */
export default async function ComponentVariantPage({ params }: PageProps<"/components/[slug]/[variant]">) {
  const { slug, variant } = await params;
  const hit = find(slug, variant);
  if (!hit) notFound();
  const { group, index } = hit;
  const link = (i: number) => {
    const v = group.variants[i];
    return v && { label: `${v.name} ${group.name.toLowerCase()}`, href: `/components/${group.slug}/${v.id}` };
  };
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Components", href: "/components" },
    { label: group.name, href: `/components/${group.slug}` },
    { label: hit.variant.name },
  ];
  return <ComponentDocPage doc={hit.variant.doc} crumbs={crumbs} prev={link(index - 1)} next={link(index + 1)} />;
}

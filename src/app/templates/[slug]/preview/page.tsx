import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { getTemplate, templates } from "@/lib/templates";
import { TemplatePreview } from "@/components/blocks/TemplatePreview";

/** Every preview is prerendered at build time; nothing here waits on the request. */
export const instant = false;

export function generateStaticParams() {
  return templates.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/templates/[slug]/preview">): Promise<Metadata> {
  const { slug } = await params;
  const t = getTemplate(slug);
  if (!t) return {};
  return pageMetadata({ title: `${t.name} live preview`, description: t.tagline, path: `/templates/${t.slug}/preview` });
}

export default async function TemplatePreviewPage({ params }: PageProps<"/templates/[slug]/preview">) {
  const { slug } = await params;
  const t = getTemplate(slug);
  if (!t) notFound();
  return <TemplatePreview name={t.name} demoUrl={t.demoUrl} checkoutUrl={t.checkoutUrl} price={t.price} />;
}

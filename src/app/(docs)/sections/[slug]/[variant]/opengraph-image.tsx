import { ogContentType, ogSize, renderOgImage } from "@/lib/og";
import { getSectionVariant, sections } from "@/registry/sections";

export function generateStaticParams() {
  return sections
    .filter((s) => s.variants.length > 1)
    .flatMap((s) => s.variants.map((v) => ({ slug: s.slug, variant: v.id })));
}

export const alt = "Neobrutalism landing page section from stream/ui";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string; variant: string }> }) {
  const { slug, variant } = await params;
  const found = getSectionVariant(slug, variant);
  return renderOgImage({
    eyebrow: found ? `${found.section.name} section` : "Section",
    title: found ? `${found.variant.name} ${found.section.name.toLowerCase()}` : "stream/ui",
    description: found?.variant.description ?? "Neo-brutalist React components for Tailwind CSS v4.",
    accent: "pink",
    art: { kind: "section", variant: found ? `${found.section.slug}/${found.variant.id}` : undefined },
  });
}

import { ogContentType, ogSize, renderOgImage } from "@/lib/og";
import { getSection, sections } from "@/registry/sections";

export function generateStaticParams() {
  return sections.map((d) => ({ slug: d.slug }));
}

export const alt = "Neobrutalism landing page section from stream/ui";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getSection(slug);
  return renderOgImage({
    eyebrow: "Section",
    title: doc?.name ?? "stream/ui",
    description: doc?.description ?? "Neo-brutalist React components for Tailwind CSS v4.",
    accent: "pink",
    art: { kind: "section" },
  });
}

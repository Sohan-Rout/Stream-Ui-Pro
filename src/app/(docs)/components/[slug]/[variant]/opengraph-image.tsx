import { ogContentType, ogSize, renderOgImage } from "@/lib/og";
import { componentGroups, getComponentGroup } from "@/registry/components";

export function generateStaticParams() {
  return componentGroups.flatMap((g) => g.variants.map((v) => ({ slug: g.slug, variant: v.id })));
}

export const alt = "Neobrutalism React component from stream/ui";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string; variant: string }> }) {
  const { slug, variant } = await params;
  const doc = getComponentGroup(slug)?.variants.find((v) => v.id === variant)?.doc;
  return renderOgImage({
    eyebrow: "Component",
    title: doc?.name ?? "stream/ui",
    description: doc?.description ?? "Neo-brutalist React components for Tailwind CSS v4.",
    accent: "lime",
    art: { kind: "component", name: doc?.name ?? "Component" },
  });
}

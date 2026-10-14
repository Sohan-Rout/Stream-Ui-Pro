import { ogContentType, ogSize, renderOgImage } from "@/lib/og";
import { getComponent, components } from "@/registry/components";

export function generateStaticParams() {
  return components.map((d) => ({ slug: d.slug }));
}

export const alt = "stream/ui documentation page";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getComponent(slug);
  return renderOgImage({
    eyebrow: "Component",
    title: doc?.name ?? "stream/ui",
    description: doc?.description ?? "Neo-brutalist React components for Tailwind CSS v4.",
    accent: "lime",
    art: { kind: "component", name: doc?.name ?? "Component" },
  });
}

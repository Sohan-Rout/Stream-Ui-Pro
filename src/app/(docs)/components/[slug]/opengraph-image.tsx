import { ogContentType, ogSize, renderOgImage } from "@/lib/og";
import { componentEntries } from "@/registry/components";

export function generateStaticParams() {
  return componentEntries.map((e) => ({ slug: e.slug }));
}

export const alt = "Neobrutalism React component from stream/ui";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = componentEntries.find((e) => e.slug === slug);
  return renderOgImage({
    eyebrow: "Component",
    title: doc?.name ?? "stream/ui",
    description: doc?.description ?? "Neo-brutalist React components for Tailwind CSS v4.",
    accent: "lime",
    art: { kind: "component", name: doc?.name ?? "Component" },
  });
}

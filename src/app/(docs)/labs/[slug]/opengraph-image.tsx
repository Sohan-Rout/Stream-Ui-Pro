import { ogContentType, ogSize, renderOgImage } from "@/lib/og";
import { getLab, labs } from "@/registry/labs";

export function generateStaticParams() {
  return labs.map((d) => ({ slug: d.slug }));
}

export const alt = "stream/ui documentation page";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getLab(slug);
  return renderOgImage({
    eyebrow: "Labs",
    title: doc?.name ?? "stream/ui",
    description: doc?.description ?? "Neo-brutalist React components for Tailwind CSS v4.",
    accent: "violet",
  });
}

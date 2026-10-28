import { ogContentType, ogSize, renderOgImage } from "@/lib/og";
import { getTemplate, templates } from "@/lib/templates";

export function generateStaticParams() {
  return templates.map((t) => ({ slug: t.slug }));
}

export const alt = "A stream/ui Pro template, live";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = getTemplate(slug);
  return renderOgImage({
    eyebrow: "Pro template",
    title: t?.name ?? "stream/ui",
    description: t?.tagline ?? "Complete Next.js sites built with stream/ui.",
    accent: "orange",
    art: { kind: "section" },
  });
}

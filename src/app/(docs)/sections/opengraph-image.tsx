import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "Page sections · stream/ui";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "Library",
    title: "Page sections",
    description: "Hero, features, pricing, testimonials, FAQ, and footer, built from the same parts.",
    accent: "pink",
    art: { kind: "section" },
  });
}

import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "Next.js landing page templates · stream/ui";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "stream/ui Pro",
    title: "Templates",
    description: "Complete Next.js landing pages in different design styles. Full source, one-time price.",
    accent: "orange",
    art: { kind: "section" },
  });
}

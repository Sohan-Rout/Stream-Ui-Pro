import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "2,000+ animated icons for React · stream/ui";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "Library",
    title: "Icons",
    description: "Search 2,000+ icons, set size and stroke, add animations, and copy the JSX.",
    accent: "blue",
    art: { kind: "icons" },
  });
}

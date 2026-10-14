import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "stream/ui, a neobrutalism UI library for React and Tailwind CSS: UI that doesn't whisper.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "React · Tailwind v4",
    title: "UI that doesn't whisper.",
    highlight: "whisper",
    art: { kind: "home" },
    description: "Neo-brutalist components, page sections, and animated icons. Accessible and typed.",
  });
}

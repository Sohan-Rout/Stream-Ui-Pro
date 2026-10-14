import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "stream/ui: UI that doesn't whisper. Neo-brutalist React components for Tailwind CSS v4.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "React · Tailwind v4",
    title: "UI that doesn't whisper.",
    highlight: "whisper",
    description: "Neo-brutalist components, page sections, and animated icons. Accessible and typed.",
  });
}

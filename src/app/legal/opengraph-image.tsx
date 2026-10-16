import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "stream/ui legal: privacy, terms, and cookies";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "Legal",
    title: "Privacy, terms, and cookies.",
    description: "No tracking, no ads, no analytics. Plain-language policies for stream/ui.",
    accent: "blue",
    art: { kind: "home" },
  });
}

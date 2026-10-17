import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "stream/ui terms of use";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "Legal",
    title: "Terms of use",
    description: "MIT-licensed code, voluntary sponsorships, and no warranty.",
    accent: "lime",
    art: { kind: "legal", doc: "terms" },
  });
}

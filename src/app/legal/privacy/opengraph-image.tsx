import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "stream/ui privacy policy";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "Legal",
    title: "Privacy policy",
    description: "No accounts, no ads. Analytics cookies only with your consent.",
    accent: "blue",
    art: { kind: "legal", doc: "privacy" },
  });
}

import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "stream/ui cookie policy";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "Legal",
    title: "Cookie policy",
    description: "Every cookie and storage item the site may use, and how to change your choice.",
    accent: "orange",
    art: { kind: "legal", doc: "cookies" },
  });
}

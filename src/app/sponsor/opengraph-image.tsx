import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "Sponsor stream/ui";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "Sponsor",
    title: "Keep stream/ui free and growing.",
    description: "Fund new components, fixes, and docs through GitHub Sponsors or UPI.",
    accent: "pink",
    art: { kind: "sponsor" },
  });
}

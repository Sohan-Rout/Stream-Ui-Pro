import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "Creative React UI experiments · stream/ui";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "Experimental",
    title: "Labs",
    description: "Interaction experiments: a 3D dice roller, a magnetic button, and more.",
    accent: "violet",
    art: { kind: "lab" },
  });
}

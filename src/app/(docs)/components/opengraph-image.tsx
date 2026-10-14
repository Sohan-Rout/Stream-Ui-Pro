import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "Neobrutalism React components · stream/ui";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "Library",
    title: "Components",
    description: "Accessible primitives with every state styled: buttons, inputs, tabs, switches, and more.",
    accent: "lime",
    art: { kind: "component", name: "Button" },
  });
}

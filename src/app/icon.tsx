import { renderIcon } from "@/lib/og";

/** The navbar's "S/" tile: 32px for browser tabs, 192 and 512 for installs. */
export function generateImageMetadata() {
  return [32, 192, 512].map((px) => ({
    id: String(px),
    size: { width: px, height: px },
    contentType: "image/png",
  }));
}

export default async function Icon({ id }: { id: Promise<string> }) {
  return renderIcon(Number(await id));
}

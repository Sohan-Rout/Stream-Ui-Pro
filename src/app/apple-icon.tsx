import { renderIcon } from "@/lib/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** iOS shows icons on an opaque square, so the tile sits on paper. */
export default function AppleIcon() {
  return renderIcon(size.width, { opaque: true });
}

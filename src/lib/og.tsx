import { ImageResponse } from "next/og";
import { siteConfig } from "./site";

/** Theme tokens as hex: the image renderer doesn't understand oklch(). */
export const brand = {
  paper: "#fafaf7",
  raised: "#ffffff",
  ink: "#0e0f14",
  muted: "#505258",
  lime: "#bdf952",
  pink: "#ff70b3",
  blue: "#70ccee",
  violet: "#c0a2f5",
  orange: "#ff9e53",
} as const;

export type OgAccent = "lime" | "pink" | "blue" | "violet" | "orange";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

type Font = { name: string; data: ArrayBuffer; weight: 400; style: "normal" };

/**
 * Fetches a TTF from Google Fonts, subset to `text`. The image renderer can't
 * read the woff2 files next/font serves, and Google returns TTF to non-browser
 * clients. Cached, and returns null offline so the build falls back to the
 * default font instead of failing.
 */
async function googleFont(family: string, text: string): Promise<ArrayBuffer | null> {
  "use cache";
  try {
    const query = `family=${family.replace(/ /g, "+")}&text=${encodeURIComponent(text)}`;
    const css = await fetch(`https://fonts.googleapis.com/css2?${query}`).then((r) => r.text());
    const src = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    return src ? await fetch(src).then((r) => r.arrayBuffer()) : null;
  } catch {
    return null;
  }
}

export async function brandFonts(text: string): Promise<Font[]> {
  const [display, mono] = await Promise.all([
    googleFont("Archivo Black", text),
    googleFont("Space Mono", text),
  ]);
  const fonts: Font[] = [];
  if (display) fonts.push({ name: "Archivo Black", data: display, weight: 400, style: "normal" });
  if (mono) fonts.push({ name: "Space Mono", data: mono, weight: 400, style: "normal" });
  return fonts;
}

const host = new URL(siteConfig.url).host;

/** The 1200×630 share card used for every page. */
export async function renderOgImage({
  eyebrow,
  title,
  description,
  accent = "lime",
  highlight,
}: {
  eyebrow: string;
  title: string;
  description: string;
  accent?: OgAccent;
  /** A word in the title to set in an accent box, like the home hero. */
  highlight?: string;
}) {
  const [before, after] = highlight ? title.split(highlight) : [title, undefined];
  const fonts = await brandFonts(`${eyebrow}${title}${description}${host}${siteConfig.packageName}stream/uiS/`);
  const titleSize = title.length > 30 ? 76 : 96;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 44,
          backgroundColor: brand.paper,
          backgroundImage: `repeating-linear-gradient(-45deg, rgba(14,15,20,0.09) 0 2px, transparent 2px 18px)`,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "48px 56px",
            backgroundColor: brand.paper,
            border: `6px solid ${brand.ink}`,
            boxShadow: `14px 14px 0 ${brand.ink}`,
            color: brand.ink,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 64,
                  height: 64,
                  backgroundColor: brand.lime,
                  border: `4px solid ${brand.ink}`,
                  boxShadow: `5px 5px 0 ${brand.ink}`,
                  fontFamily: "Archivo Black",
                  fontSize: 26,
                }}
              >
                S/
              </div>
              <div style={{ display: "flex", fontFamily: "Archivo Black", fontSize: 36 }}>stream/ui</div>
            </div>
            <div
              style={{
                display: "flex",
                padding: "8px 22px",
                backgroundColor: brand[accent],
                border: `4px solid ${brand.ink}`,
                borderRadius: 999,
                fontFamily: "Space Mono",
                fontSize: 24,
                textTransform: "uppercase",
              }}
            >
              {eyebrow}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                fontFamily: "Archivo Black",
                fontSize: titleSize,
                lineHeight: 1.05,
                letterSpacing: -2,
              }}
            >
              {before && <span>{before}</span>}
              {highlight && (
                <span
                  style={{
                    display: "flex",
                    padding: "0 16px",
                    margin: "0 4px",
                    backgroundColor: brand.lime,
                    border: `5px solid ${brand.ink}`,
                    boxShadow: `8px 8px 0 ${brand.ink}`,
                  }}
                >
                  {highlight}
                </span>
              )}
              {after && <span>{after}</span>}
            </div>
            <div style={{ display: "flex", maxWidth: 940, fontFamily: "Space Mono", fontSize: 26, lineHeight: 1.45, color: brand.muted }}>
              {description}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Space Mono", fontSize: 22 }}>
            <span>{host}</span>
            <span>{siteConfig.packageName}</span>
          </div>
        </div>
      </div>
    ),
    { ...ogSize, fonts },
  );
}

/** Square brand mark for favicons and home-screen icons. */
export async function renderIcon(size: number) {
  const fonts = await brandFonts("S/");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: brand.lime,
          border: `${Math.round(size * 0.07)}px solid ${brand.ink}`,
          fontFamily: "Archivo Black",
          fontSize: Math.round(size * 0.46),
          color: brand.ink,
          letterSpacing: -Math.round(size * 0.02),
        }}
      >
        S/
      </div>
    ),
    { width: size, height: size, fonts },
  );
}

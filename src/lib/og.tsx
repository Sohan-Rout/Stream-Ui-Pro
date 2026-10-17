import { ImageResponse } from "next/og";
import { siteConfig } from "./site";
import { brand } from "./brand";

export { brand };

export type OgAccent = "lime" | "pink" | "blue" | "violet" | "orange";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

type Font = { name: string; data: ArrayBuffer; weight: 400 | 700; style: "normal" };

/**
 * Fetches a TTF from Google Fonts, subset to `text`. The image renderer can't
 * read the woff2 files next/font serves, and Google returns TTF to non-browser
 * clients. Cached, and returns null offline so the build falls back to the
 * default font instead of failing.
 */
async function googleFont(family: string, weight: 400 | 700, text: string): Promise<ArrayBuffer | null> {
  "use cache";
  try {
    const query = `family=${family.replace(/ /g, "+")}:wght@${weight}&text=${encodeURIComponent(text)}`;
    const css = await fetch(`https://fonts.googleapis.com/css2?${query}`).then((r) => r.text());
    const src = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    return src ? await fetch(src).then((r) => r.arrayBuffer()) : null;
  } catch {
    return null;
  }
}

/** Archivo Black for display, Space Mono regular and bold for labels (as on the site). */
export async function brandFonts(text: string): Promise<Font[]> {
  const specs = [
    ["Archivo Black", 400],
    ["Space Mono", 400],
    ["Space Mono", 700],
  ] as const;
  const loaded = await Promise.all(specs.map(([family, weight]) => googleFont(family, weight, text)));
  return specs.flatMap(([name, weight], i) => {
    const data = loaded[i];
    return data ? [{ name, data, weight, style: "normal" as const }] : [];
  });
}

const host = new URL(siteConfig.url).host;

/* ------------------------------------------------------------------ */
/* Logo tile: the navbar mark, scaled                                  */
/* ------------------------------------------------------------------ */

/**
 * The navbar's "S/" tile at any size: lime square, ink border, hard shadow,
 * Space Mono Bold. Proportions follow the 32px original (2px border, 2px
 * shadow, 14px type).
 */
function LogoTile({ size }: { size: number }) {
  const unit = size / 32;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        backgroundColor: brand.lime,
        border: `${Math.max(1, Math.round(2 * unit))}px solid ${brand.ink}`,
        boxShadow: `${Math.round(2 * unit)}px ${Math.round(2 * unit)}px 0 ${brand.ink}`,
        fontFamily: "Space Mono",
        fontWeight: 700,
        fontSize: Math.round(14 * unit),
        color: brand.ink,
      }}
    >
      S/
    </div>
  );
}

/** Square favicon / home-screen icon: the logo tile with room for its shadow. */
export async function renderIcon(size: number, { opaque = false } = {}) {
  const fonts = await brandFonts("S/");
  // Leave a margin so the hard shadow isn't clipped; iOS needs an opaque square.
  const tile = Math.round(size * (opaque ? 0.72 : 0.875));
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: opaque ? "center" : "flex-start",
          justifyContent: opaque ? "center" : "flex-start",
          backgroundColor: opaque ? brand.paper : "transparent",
        }}
      >
        <LogoTile size={tile} />
      </div>
    ),
    { width: size, height: size, fonts },
  );
}

/* ------------------------------------------------------------------ */
/* Per-page artwork                                                    */
/* ------------------------------------------------------------------ */

export type OgArt =
  | { kind: "home" }
  | { kind: "component"; name: string }
  | { kind: "section" }
  | { kind: "lab"; game?: "dice" | "tictactoe" | "memory" | "snake" | "flappy" | "tetris" }
  | { kind: "icons" }
  | { kind: "sponsor" };

const hard = (px: number) => `${px}px ${px}px 0 ${brand.ink}`;

function Sticker({ text, color, rotate }: { text: string; color: string; rotate: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 150,
        height: 150,
        borderRadius: 999,
        backgroundColor: color,
        border: `5px solid ${brand.ink}`,
        boxShadow: hard(7),
        transform: `rotate(${rotate}deg)`,
        fontFamily: "Space Mono",
        fontWeight: 700,
        fontSize: 26,
        textAlign: "center",
        lineHeight: 1.15,
        padding: 16,
      }}
    >
      {text}
    </div>
  );
}

function Art({ art, accent }: { art: OgArt; accent: string }) {
  switch (art.kind) {
    case "home":
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 30 }}>
          <Sticker text={"100% typed"} color={brand.pink} rotate={10} />
          <div
            style={{
              display: "flex",
              padding: "18px 30px",
              backgroundColor: brand.lime,
              border: `5px solid ${brand.ink}`,
              boxShadow: hard(9),
              transform: "rotate(-3deg)",
              fontFamily: "Space Mono",
              fontWeight: 700,
              fontSize: 22,
              whiteSpace: "nowrap",
            }}
          >
            Browse components →
          </div>
        </div>
      );

    case "component":
      return (
        <div
          style={{
            display: "flex",
            padding: "26px 34px",
            backgroundColor: brand.raised,
            border: `5px solid ${brand.ink}`,
            boxShadow: hard(12),
            transform: "rotate(-4deg)",
            fontFamily: "Space Mono",
            fontWeight: 700,
            fontSize: art.name.length > 10 ? 30 : 38,
          }}
        >
          <span style={{ color: brand.muted }}>{"<"}</span>
          <span style={{ backgroundColor: accent, padding: "0 6px" }}>{art.name.replace(/\s/g, "")}</span>
          <span style={{ color: brand.muted }}>{" />"}</span>
        </div>
      );

    case "section":
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 300,
            backgroundColor: brand.raised,
            border: `5px solid ${brand.ink}`,
            boxShadow: hard(12),
            transform: "rotate(3deg)",
          }}
        >
          <div style={{ display: "flex", gap: 8, padding: "10px 12px", borderBottom: `5px solid ${brand.ink}` }}>
            {[brand.pink, brand.orange, brand.lime].map((c) => (
              <div key={c} style={{ display: "flex", width: 16, height: 16, borderRadius: 99, backgroundColor: c, border: `3px solid ${brand.ink}` }} />
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 22 }}>
            <div style={{ display: "flex", width: "80%", height: 16, backgroundColor: brand.ink }} />
            <div style={{ display: "flex", width: "55%", height: 16, backgroundColor: brand.ink }} />
            <div style={{ display: "flex", width: "70%", height: 12, backgroundColor: brand.faint }} />
            <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
              <div style={{ display: "flex", width: 90, height: 34, backgroundColor: accent, border: `4px solid ${brand.ink}` }} />
              <div style={{ display: "flex", width: 70, height: 34, border: `4px solid ${brand.ink}` }} />
            </div>
          </div>
        </div>
      );

    case "lab": {
      if (art.game === "tictactoe") {
        const marks = ["X", "O", "", "", "X", "O", "", "", "X"];
        return (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              width: 228,
              backgroundColor: brand.ink,
              border: `5px solid ${brand.ink}`,
              boxShadow: hard(12),
              transform: "rotate(-5deg)",
              gap: 5,
            }}
          >
            {marks.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 69.3,
                  height: 69.3,
                  backgroundColor: i % 4 === 0 ? brand.lime : brand.raised,
                }}
              >
                {m === "X" && (
                  <div style={{ display: "flex", position: "relative", width: 40, height: 40 }}>
                    <div style={{ position: "absolute", left: 16, top: -4, width: 8, height: 48, backgroundColor: brand.ink, transform: "rotate(45deg)" }} />
                    <div style={{ position: "absolute", left: 16, top: -4, width: 8, height: 48, backgroundColor: brand.ink, transform: "rotate(-45deg)" }} />
                  </div>
                )}
                {m === "O" && (
                  <div style={{ display: "flex", width: 38, height: 38, borderRadius: 99, border: `8px solid ${brand.ink}` }} />
                )}
              </div>
            ))}
          </div>
        );
      }
      if (art.game === "flappy") {
        return (
          <div
            style={{
              display: "flex",
              position: "relative",
              width: 250,
              height: 250,
              backgroundColor: brand.blueSoft,
              border: `5px solid ${brand.ink}`,
              boxShadow: hard(12),
              transform: "rotate(3deg)",
              overflow: "hidden",
            }}
          >
            {/* Two pipes with a gap, and the bird flying through it. */}
            {[
              { left: 150, top: -10, height: 80 },
              { left: 150, top: 170, height: 90 },
            ].map((p, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: p.left,
                  top: p.top,
                  width: 56,
                  height: p.height,
                  backgroundColor: brand.pink,
                  border: `4px solid ${brand.ink}`,
                  boxShadow: hard(5),
                }}
              />
            ))}
            <div style={{ position: "absolute", left: 0, top: 206, width: 250, height: 44, backgroundColor: brand.lime, borderTop: `4px solid ${brand.ink}` }} />
            <div
              style={{
                display: "flex",
                position: "absolute",
                left: 70,
                top: 104,
                width: 46,
                height: 46,
                backgroundColor: brand.orange,
                border: `4px solid ${brand.ink}`,
                boxShadow: hard(4),
                borderRadius: 6,
                transform: "rotate(-14deg)",
              }}
            >
              <div style={{ position: "absolute", left: 24, top: 8, width: 14, height: 14, borderRadius: 99, backgroundColor: brand.raised, border: `3px solid ${brand.ink}` }} />
              <div style={{ position: "absolute", left: 2, top: 20, width: 20, height: 12, backgroundColor: brand.violet, border: `3px solid ${brand.ink}` }} />
            </div>
          </div>
        );
      }
      if (art.game === "tetris") {
        // A well with a few locked pieces and one falling in.
        const unit = 34;
        const blocks: [number, number, string][] = [
          [0, 6, brand.blue], [1, 6, brand.blue], [2, 6, brand.blue], [3, 6, brand.blue],
          [4, 6, brand.orange], [5, 6, brand.orange], [4, 5, brand.orange], [5, 5, brand.orange],
          [0, 5, brand.pink], [1, 5, brand.pink], [1, 4, brand.pink], [2, 4, brand.pink],
          [6, 6, brand.lime], [6, 5, brand.lime], [5, 4, brand.lime],
          [2, 1, brand.violet], [3, 1, brand.violet], [4, 1, brand.violet], [3, 2, brand.violet],
        ];
        return (
          <div
            style={{
              display: "flex",
              position: "relative",
              width: 7 * unit,
              height: 7 * unit,
              backgroundColor: brand.sunken,
              border: `5px solid ${brand.ink}`,
              boxShadow: hard(12),
              transform: "rotate(3deg)",
            }}
          >
            {blocks.map(([x, y, color], i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: x * unit,
                  top: y * unit,
                  width: unit,
                  height: unit,
                  backgroundColor: color,
                  border: `3px solid ${brand.ink}`,
                }}
              />
            ))}
          </div>
        );
      }
      if (art.game === "snake") {
        // A snake winding toward its food on a pixel grid.
        const cells = 8;
        const unit = 30;
        const body = [
          [1, 5], [2, 5], [3, 5], [4, 5], [4, 4], [4, 3], [5, 3], [6, 3],
        ];
        const tones = [brand.violet, brand.blue];
        return (
          <div
            style={{
              display: "flex",
              position: "relative",
              width: cells * unit,
              height: cells * unit,
              backgroundColor: brand.sunken,
              border: `5px solid ${brand.ink}`,
              boxShadow: hard(12),
              transform: "rotate(-4deg)",
            }}
          >
            {body.map(([x, y], i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: x * unit,
                  top: y * unit,
                  width: unit,
                  height: unit,
                  backgroundColor: i === body.length - 1 ? brand.pink : tones[i % 2],
                  border: `3px solid ${brand.ink}`,
                }}
              />
            ))}
            <div
              style={{
                position: "absolute",
                left: 6 * unit + 6,
                top: 1 * unit + 6,
                width: unit - 12,
                height: unit - 12,
                backgroundColor: brand.orange,
                border: `3px solid ${brand.ink}`,
              }}
            />
          </div>
        );
      }
      if (art.game === "memory") {
        const cards = [brand.pink, brand.sunken, brand.lime, brand.sunken];
        return (
          <div style={{ display: "flex", flexWrap: "wrap", width: 252, gap: 16, transform: "rotate(4deg)" }}>
            {cards.map((bg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 118,
                  height: 118,
                  backgroundColor: bg,
                  border: `5px solid ${brand.ink}`,
                  boxShadow: hard(7),
                  fontFamily: "Space Mono",
                  fontWeight: 700,
                  fontSize: 30,
                }}
              >
                {bg === brand.sunken ? (
                  "S/"
                ) : (
                  <div style={{ display: "flex", width: 44, height: 44, borderRadius: 99, backgroundColor: brand.raised, border: `6px solid ${brand.ink}` }} />
                )}
              </div>
            ))}
          </div>
        );
      }
      // Five pips, like the dice lab.
      const pips = [0, 2, 4, 6, 8];
      return (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            width: 200,
            height: 200,
            padding: 22,
            backgroundColor: brand.raised,
            border: `6px solid ${brand.ink}`,
            boxShadow: hard(12),
            transform: "rotate(-8deg)",
          }}
        >
          {Array.from({ length: 9 }, (_, i) => (
            <div key={i} style={{ display: "flex", width: "33.33%", height: "33.33%", alignItems: "center", justifyContent: "center" }}>
              {pips.includes(i) && (
                <div
                  style={{
                    display: "flex",
                    width: i === 4 ? 36 : 28,
                    height: i === 4 ? 36 : 28,
                    borderRadius: 99,
                    backgroundColor: i === 4 ? brand.pink : brand.ink,
                    ...(i === 4 && { border: `4px solid ${brand.ink}` }),
                  }}
                />
              )}
            </div>
          ))}
        </div>
      );
    }

    case "icons": {
      const tiles = [brand.lime, brand.raised, brand.pink, brand.raised, brand.blue, brand.raised, brand.violet, brand.raised, brand.orange];
      return (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            width: 264,
            border: `5px solid ${brand.ink}`,
            boxShadow: hard(12),
            transform: "rotate(4deg)",
            backgroundColor: brand.raised,
          }}
        >
          {tiles.map((bg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 84.6,
                height: 84.6,
                backgroundColor: bg,
                ...(i % 3 !== 2 && { borderRight: `3px solid ${brand.ink}` }),
                ...(i < 6 && { borderBottom: `3px solid ${brand.ink}` }),
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: 30,
                  height: 30,
                  border: `5px solid ${brand.ink}`,
                  borderRadius: i % 2 === 0 ? 99 : i % 3 === 0 ? 0 : 6,
                  ...(i === 4 && { transform: "rotate(45deg)" }),
                }}
              />
            </div>
          ))}
        </div>
      );
    }

    case "sponsor":
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 28 }}>
          <Sticker text={"Thank you!"} color={brand.pink} rotate={-8} />
          <div
            style={{
              display: "flex",
              padding: "16px 28px",
              backgroundColor: brand.lime,
              border: `5px solid ${brand.ink}`,
              boxShadow: hard(9),
              transform: "rotate(3deg)",
              fontFamily: "Space Mono",
              fontWeight: 700,
              fontSize: 26,
            }}
          >
            Sponsor ♥
          </div>
        </div>
      );
  }
}

/* ------------------------------------------------------------------ */
/* Share card                                                          */
/* ------------------------------------------------------------------ */

const W = ogSize.width;
const H = ogSize.height;
const RAIL = 64; // page margin, like the site's hatched gutters
const HEAD = 116; // header band height
const FOOT = 96; // footer strip height
const LINE = 5;

/** Hollow square where a rail meets a rule, like the site's section joints. */
function Joint({ x, y }: { x: number; y: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x - 11,
        top: y - 11,
        width: 22,
        height: 22,
        backgroundColor: brand.paper,
        border: `${LINE}px solid ${brand.ink}`,
      }}
    />
  );
}

function Rule({ y }: { y: number }) {
  return <div style={{ position: "absolute", left: 0, top: y - LINE / 2, width: W, height: LINE, backgroundColor: brand.ink }} />;
}

/**
 * The 1200×630 share card for every page. Mirrors the site's layout:
 * hatched margins, ink rails, ruled header and footer bands with joint
 * squares, the logo tile, and a piece of artwork for the page type.
 */
export async function renderOgImage({
  eyebrow,
  title,
  description,
  accent = "lime",
  highlight,
  art,
}: {
  eyebrow: string;
  title: string;
  description: string;
  accent?: OgAccent;
  /** A word in the title to set in an accent box, like the home hero. */
  highlight?: string;
  art: OgArt;
}) {
  const [before, after] = highlight ? title.split(highlight) : [title, undefined];
  const tag = art.kind === "component" ? art.name : "";
  const fonts = await brandFonts(
    `${eyebrow}${title}${description}${host}${siteConfig.packageName}${tag}stream/uiS/<>→♥100% typedThank you!Browse componentsSponsorTailwindReactNext.js ready·`,
  );
  const titleSize = title.length <= 14 ? 104 : title.length <= 26 ? 84 : 66;
  const color = brand[accent];
  const footer = ["Tailwind ready", "React ready", "Next.js ready"];

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: brand.paper,
          backgroundImage: `repeating-linear-gradient(-45deg, ${brand.faint} 0 2px, transparent 2px 16px)`,
          color: brand.ink,
        }}
      >
        {/* The railed column */}
        <div
          style={{
            position: "absolute",
            left: RAIL,
            top: 0,
            width: W - RAIL * 2,
            height: H,
            display: "flex",
            flexDirection: "column",
            backgroundColor: brand.paper,
            borderLeft: `${LINE}px solid ${brand.ink}`,
            borderRight: `${LINE}px solid ${brand.ink}`,
          }}
        >
          {/* Header band */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: HEAD, padding: "0 44px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <LogoTile size={58} />
              <div style={{ display: "flex", fontFamily: "Archivo Black", fontSize: 34 }}>
                stream<span style={{ color: brand.muted }}>/</span>ui
              </div>
            </div>
            <div
              style={{
                display: "flex",
                padding: "8px 22px",
                backgroundColor: color,
                border: `4px solid ${brand.ink}`,
                borderRadius: 999,
                boxShadow: hard(4),
                fontFamily: "Space Mono",
                fontWeight: 700,
                fontSize: 22,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              {eyebrow}
            </div>
          </div>

          {/* Body */}
          <div
            style={{
              display: "flex",
              flex: 1,
              alignItems: "center",
              justifyContent: "space-between",
              gap: 40,
              padding: "0 44px",
              marginTop: LINE / 2,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 22, width: 640 }}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  fontFamily: "Archivo Black",
                  fontSize: titleSize,
                  lineHeight: 1.02,
                  letterSpacing: -2,
                }}
              >
                {before && <span>{before}</span>}
                {highlight && (
                  <span
                    style={{
                      display: "flex",
                      padding: "0 14px",
                      margin: "6px 6px 6px 0",
                      backgroundColor: color,
                      border: `5px solid ${brand.ink}`,
                      boxShadow: hard(8),
                      transform: "rotate(-2deg)",
                    }}
                  >
                    {highlight}
                  </span>
                )}
                {after && <span>{after}</span>}
              </div>
              <div style={{ display: "flex", fontFamily: "Space Mono", fontSize: 24, lineHeight: 1.45, color: brand.muted }}>
                {description}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", width: 320 }}>
              <Art art={art} accent={color} />
            </div>
          </div>

          {/* Footer strip, like the site's "ready" strip */}
          <div style={{ display: "flex", height: FOOT, marginTop: LINE / 2 }}>
            {footer.map((label, i) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  flex: 1,
                  alignItems: "center",
                  gap: 14,
                  padding: "0 30px",
                  ...(i > 0 && { borderLeft: `${LINE}px solid ${brand.ink}` }),
                  fontFamily: "Space Mono",
                  fontWeight: 700,
                  fontSize: 22,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 28,
                    height: 28,
                    backgroundColor: brand.lime,
                    border: `4px solid ${brand.ink}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      width: 8,
                      height: 14,
                      borderRight: `4px solid ${brand.ink}`,
                      borderBottom: `4px solid ${brand.ink}`,
                      transform: "translateY(-2px) rotate(45deg)",
                    }}
                  />
                </div>
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Full-bleed rules and joints, drawn over the column */}
        <Rule y={HEAD} />
        <Rule y={H - FOOT} />
        <Joint x={RAIL + LINE / 2} y={HEAD} />
        <Joint x={W - RAIL - LINE / 2} y={HEAD} />
        <Joint x={RAIL + LINE / 2} y={H - FOOT} />
        <Joint x={W - RAIL - LINE / 2} y={H - FOOT} />

        {/* Host and package, quiet, in the margins' footer band */}
        <div
          style={{
            position: "absolute",
            right: RAIL + 30,
            top: HEAD + 18,
            display: "flex",
            fontFamily: "Space Mono",
            fontSize: 18,
            color: brand.muted,
          }}
        >
          {`${host} · ${siteConfig.packageName}`}
        </div>
      </div>
    ),
    { ...ogSize, fonts },
  );
}

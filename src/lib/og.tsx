import { ImageResponse } from "next/og";
import { siteConfig } from "./site";
import { brand } from "./brand";

export { brand };

export type OgAccent = "lime" | "pink" | "blue" | "violet" | "orange";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

type Font = { name: string; data: ArrayBuffer; weight: 400 | 700; style: "normal" };

/**
 * Fetches a font's TTF from Google Fonts. The image renderer can't read the
 * woff2 files next/font serves, and Google returns TTF to non-browser
 * clients. Whole fonts, not per-image subsets: one request per font serves
 * every image in the build, instead of hundreds that get throttled.
 * Retries a few times; throws on failure so a miss is never cached.
 */
async function fetchGoogleFont(family: string, weight: 400 | 700): Promise<ArrayBuffer> {
  "use cache";
  const query = `family=${family.replace(/ /g, "+")}:wght@${weight}`;
  let lastError: unknown;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(`https://fonts.googleapis.com/css2?${query}`);
      if (!res.ok) throw new Error(`Google Fonts CSS ${res.status}`);
      const src = (await res.text()).match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
      if (!src) throw new Error("No TTF in the Google Fonts CSS");
      const font = await fetch(src);
      if (!font.ok) throw new Error(`Font file ${font.status}`);
      return await font.arrayBuffer();
    } catch (error) {
      lastError = error;
      await new Promise((r) => setTimeout(r, 400 * attempt));
    }
  }
  throw lastError;
}

async function googleFont(family: string, weight: 400 | 700): Promise<ArrayBuffer | null> {
  try {
    return await fetchGoogleFont(family, weight);
  } catch (error) {
    console.warn(`[og] Couldn't load ${family} ${weight}; using the default font.`, error);
    return null;
  }
}

/** Archivo Black for display, Space Mono regular and bold for labels (as on the site). */
export async function brandFonts(): Promise<Font[]> {
  const specs = [
    ["Archivo Black", 400],
    ["Space Mono", 400],
    ["Space Mono", 700],
  ] as const;
  const loaded = await Promise.all(specs.map(([family, weight]) => googleFont(family, weight)));
  return specs.flatMap(([name, weight], i) => {
    const data = loaded[i];
    return data ? [{ name, data, weight, style: "normal" as const }] : [];
  });
}

/**
 * ImageResponse options for these fonts. An empty `fonts` list makes the
 * renderer throw ("No fonts are loaded"), so with none loaded it's left out
 * and the built-in default font draws the text instead of failing the build.
 */
const withFonts = (fonts: Font[]) => (fonts.length > 0 ? { fonts } : {});

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
  const fonts = await brandFonts();
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
    { width: size, height: size, ...withFonts(fonts) },
  );
}

/* ------------------------------------------------------------------ */
/* Per-page artwork                                                    */
/* ------------------------------------------------------------------ */

export type OgArt =
  | { kind: "home" }
  | { kind: "component"; name: string }
  | { kind: "section"; variant?: string }
  | { kind: "lab"; game?: "dice" | "tictactoe" | "memory" | "snake" | "flappy" | "tetris" | "maze" | "jumper" | "pinball" | "runner" | "whack" }
  | { kind: "icons" }
  | { kind: "sponsor" }
  | { kind: "legal"; doc: "privacy" | "terms" | "cookies" };

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

const bar = (width: number | string, height: number, color: string) => (
  <div style={{ display: "flex", width, height, backgroundColor: color }} />
);

/** What's inside the section window: a sketch of the layout, per variant. */
function SectionBody({ variant, accent }: { variant?: string; accent: string }) {
  if (variant === "hero/maze") {
    const corridor = (flip: boolean) => (
      <div style={{ display: "flex", alignItems: "center", gap: 10, height: 36, padding: "0 12px", flexDirection: flip ? "row-reverse" : "row", backgroundColor: brand.paper, borderTop: `4px solid ${brand.ink}`, borderBottom: `4px solid ${brand.ink}` }}>
        {[brand.orange, brand.blue, brand.pink].map((c) => (
          <div key={c} style={{ display: "flex", width: 18, height: 18, borderTopLeftRadius: 9, borderTopRightRadius: 9, backgroundColor: c, border: `2px solid ${brand.ink}` }} />
        ))}
        <div style={{ display: "flex", width: 22, height: 22, borderRadius: 11, backgroundColor: brand.lime, border: `3px solid ${brand.ink}`, borderRightColor: flip ? brand.ink : "transparent", borderLeftColor: flip ? "transparent" : brand.ink }} />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ display: "flex", width: 6, height: 6, backgroundColor: brand.ink, marginLeft: flip ? 0 : 8, marginRight: flip ? 8 : 0 }} />
        ))}
      </div>
    );
    return (
      <div style={{ display: "flex", flexDirection: "column", height: 180, backgroundColor: brand.violetSoft }}>
        {corridor(false)}
        <div style={{ display: "flex", flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <div style={{ display: "flex", fontFamily: "Space Mono", fontWeight: 700, fontSize: 14, color: brand.pink }}>READY!</div>
          {bar(150, 12, brand.ink)}
          {bar(100, 12, brand.lime)}
        </div>
        {corridor(true)}
      </div>
    );
  }
  if (variant === "features/grid" || variant === "features/levels") {
    // A 3×2 board of feature tiles: plain cells, or numbered level tiles.
    const tones = [brand.lime, brand.pink, brand.blue, brand.violet, brand.orange, brand.lime];
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: 14, backgroundColor: variant === "features/levels" ? brand.blueSoft : brand.paper }}>
        {tones.map((c, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: 5, width: 80, padding: 7, backgroundColor: brand.raised, border: `3px solid ${brand.ink}` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 26, height: 22, backgroundColor: c, border: `2px solid ${brand.ink}`, fontFamily: "Space Mono", fontWeight: 700, fontSize: 10 }}>
              {variant === "features/levels" ? `1-${i + 1}` : ""}
            </div>
            {bar("85%", 6, brand.ink)}
            {bar("60%", 5, brand.faint)}
          </div>
        ))}
      </div>
    );
  }
  if (variant === "features/bento") {
    return (
      <div style={{ display: "flex", gap: 8, padding: 14, height: 180, backgroundColor: brand.paper }}>
        <div style={{ display: "flex", width: 120, backgroundColor: brand.lime, border: `3px solid ${brand.ink}` }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
          <div style={{ display: "flex", flex: 1, backgroundColor: brand.pinkSoft, border: `3px solid ${brand.ink}` }} />
          <div style={{ display: "flex", gap: 8, flex: 1 }}>
            <div style={{ display: "flex", flex: 1, backgroundColor: brand.blueSoft, border: `3px solid ${brand.ink}` }} />
            <div style={{ display: "flex", flex: 1, backgroundColor: brand.violetSoft, border: `3px solid ${brand.ink}` }} />
          </div>
        </div>
      </div>
    );
  }
  if (variant === "features/maze") {
    // The corridor: chomper, a dot trail ahead, three bots behind, rooms below.
    return (
      <div style={{ display: "flex", flexDirection: "column", height: 180, backgroundColor: brand.violetSoft }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, height: 44, padding: "0 12px", backgroundColor: brand.paper, borderTop: `4px solid ${brand.ink}`, borderBottom: `4px solid ${brand.ink}` }}>
          {[brand.orange, brand.blue, brand.pink].map((c) => (
            <div key={c} style={{ display: "flex", width: 22, height: 22, borderTopLeftRadius: 11, borderTopRightRadius: 11, backgroundColor: c, border: `2px solid ${brand.ink}` }} />
          ))}
          <div style={{ display: "flex", width: 26, height: 26, borderRadius: 13, backgroundColor: brand.lime, border: `3px solid ${brand.ink}`, borderRightColor: "transparent" }} />
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ display: "flex", width: 7, height: 7, backgroundColor: brand.ink, marginLeft: 8 }} />
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, padding: 10 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ display: "flex", flex: 1, height: 90, backgroundColor: brand.raised, border: `3px solid ${brand.ink}` }} />
          ))}
        </div>
      </div>
    );
  }
  if (variant === "pricing/whack") {
    // Three signs held up by moles over their holes, the middle one gold and crowned.
    return (
      <div style={{ display: "flex", gap: 10, alignItems: "flex-end", height: 180, padding: "12px 14px 0", backgroundColor: brand.limeSoft }}>
        {[brand.violet, brand.lime, brand.violet].map((fur, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", width: 82, height: i === 1 ? 160 : 140 }}>
            <div style={{ display: "flex", width: 46, height: 30, backgroundColor: fur, border: `4px solid ${brand.ink}`, borderBottomWidth: 0, borderRadius: "23px 23px 0 0" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 6, width: 78, height: i === 1 ? 92 : 74, padding: 7, backgroundColor: brand.raised, border: `4px solid ${brand.ink}` }}>
              <div style={{ display: "flex", width: 34, height: 8, backgroundColor: brand.ink }} />
              <div style={{ display: "flex", width: 42, height: 18, backgroundColor: brand.ink }} />
            </div>
            <div style={{ display: "flex", position: "absolute", left: -2, bottom: 0, width: 86, height: 20, borderRadius: "0 0 43px 43px", backgroundColor: brand.orange, border: `4px solid ${brand.ink}`, borderTopWidth: 0 }} />
          </div>
        ))}
      </div>
    );
  }
  if (variant === "pricing/bold") {
    // Three full-color plan cards, the middle one lifted.
    return (
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", height: 180, padding: "22px 16px", backgroundColor: brand.paper }}>
        {[brand.orange, brand.lime, brand.pink].map((c, i) => (
          <div key={c} style={{ display: "flex", flexDirection: "column", gap: 8, width: 78, height: 120, marginTop: i === 1 ? 0 : 14, padding: 9, backgroundColor: c, border: `4px solid ${brand.ink}`, boxShadow: hard(6), ...(i === 1 && { transform: "rotate(-3deg)" }) }}>
            <div style={{ display: "flex", width: 34, height: 9, backgroundColor: brand.ink }} />
            <div style={{ display: "flex", width: 44, height: 20, backgroundColor: brand.ink }} />
            <div style={{ display: "flex", width: "100%", height: 4, backgroundColor: brand.ink }} />
            <div style={{ display: "flex", width: "100%", height: 16, marginTop: "auto", backgroundColor: brand.ink }} />
          </div>
        ))}
      </div>
    );
  }
  if (variant === "hero/dino") {
    // Sky, a row of letter tiles, the dino mid-jump over a pink cactus, and the ground.
    return (
      <div style={{ display: "flex", position: "relative", height: 180, backgroundColor: brand.blueSoft }}>
        <div style={{ display: "flex", gap: 5, position: "absolute", left: 64, top: 26 }}>
          {[brand.lime, brand.pink, brand.blue, brand.violet, brand.orange, brand.lime].map((c, i) => (
            <div key={i} style={{ display: "flex", width: 22, height: 22, backgroundColor: c, border: `3px solid ${brand.ink}` }} />
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, position: "absolute", left: 84, top: 64, width: 132 }}>
          {bar("90%", 10, brand.ink)}
          <div style={{ display: "flex", gap: 6 }}>
            <div style={{ display: "flex", width: 44, height: 14, backgroundColor: brand.lime, border: `3px solid ${brand.ink}` }} />
            <div style={{ display: "flex", width: 44, height: 14, backgroundColor: brand.raised, border: `3px solid ${brand.ink}` }} />
          </div>
        </div>
        <div style={{ display: "flex", position: "absolute", left: 28, top: 100, width: 24, height: 26, backgroundColor: brand.lime, border: `3px solid ${brand.ink}` }} />
        <div style={{ display: "flex", position: "absolute", left: 40, top: 88, width: 22, height: 16, backgroundColor: brand.lime, border: `3px solid ${brand.ink}` }} />
        <div style={{ display: "flex", position: "absolute", left: 210, top: 118, width: 16, height: 34, backgroundColor: brand.pink, border: `3px solid ${brand.ink}` }} />
        <div style={{ display: "flex", position: "absolute", left: 0, right: 0, bottom: 0, height: 28, backgroundColor: brand.orange, borderTop: `6px solid ${brand.lime}`, boxShadow: `inset 0 3px 0 ${brand.ink}` }} />
      </div>
    );
  }
  if (variant === "hero/flappy") {
    // Pipes, the bird between them, a card, and the ground.
    return (
      <div style={{ display: "flex", position: "relative", height: 180, backgroundColor: brand.blueSoft }}>
        {[[30, 44, 70], [220, 70, 40]].map(([x, top, bottom], i) => (
          <div key={i} style={{ display: "flex", position: "absolute", left: x, top: 0, bottom: 28 }}>
            <div style={{ display: "flex", position: "absolute", left: 0, top: 0, width: 34, height: top, backgroundColor: brand.pink, border: `3px solid ${brand.ink}` }} />
            <div style={{ display: "flex", position: "absolute", left: 0, bottom: 0, width: 34, height: bottom, backgroundColor: brand.pink, border: `3px solid ${brand.ink}` }} />
          </div>
        ))}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, position: "absolute", left: 82, top: 44, width: 132 }}>
          {bar("100%", 14, brand.ink)}
          {bar("70%", 14, brand.ink)}
          <div style={{ display: "flex", width: 44, height: 16, backgroundColor: brand.lime, border: `3px solid ${brand.ink}` }} />
        </div>
        <div style={{ display: "flex", position: "absolute", left: 70, top: 112, width: 26, height: 24, borderRadius: 4, backgroundColor: brand.orange, border: `3px solid ${brand.ink}` }} />
        <div style={{ display: "flex", position: "absolute", left: 0, right: 0, bottom: 0, height: 28, backgroundColor: brand.lime, borderTop: `3px solid ${brand.ink}` }} />
      </div>
    );
  }
  if (variant === "hero/platformer") {
    // Sky, a block row with a coin, a pipe, and brick ground.
    const t = 26;
    return (
      <div style={{ display: "flex", position: "relative", height: 180, backgroundColor: brand.blueSoft }}>
        <div style={{ display: "flex", position: "absolute", left: 18, top: 16, width: 70, height: 20, backgroundColor: brand.raised, border: `3px solid ${brand.ink}` }} />
        <div style={{ display: "flex", position: "absolute", left: 92, top: 30 }}>
          {[brand.orange, brand.lime, brand.orange, brand.lime, brand.orange].map((c, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: t, height: t, marginLeft: i ? -3 : 0, backgroundColor: c, border: `3px solid ${brand.ink}`, fontFamily: "Archivo Black", fontSize: 16 }}>
              {c === brand.lime ? "!" : ""}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", position: "absolute", left: 117, top: 2, width: 16, height: 22, borderRadius: 99, backgroundColor: brand.orange, border: `3px solid ${brand.ink}` }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "absolute", right: 24, bottom: 40 }}>
          <div style={{ display: "flex", width: 54, height: 18, backgroundColor: brand.lime, border: `3px solid ${brand.ink}` }} />
          <div style={{ display: "flex", width: 42, height: 40, marginTop: -3, backgroundColor: brand.lime, border: `3px solid ${brand.ink}` }} />
        </div>
        <div style={{ display: "flex", position: "absolute", left: 60, bottom: 40, width: 24, height: 24, backgroundColor: brand.lime, border: `3px solid ${brand.ink}` }} />
        <div style={{ display: "flex", position: "absolute", left: 0, right: 0, bottom: 28, height: 12, backgroundColor: brand.lime, borderTop: `3px solid ${brand.ink}`, borderBottom: `3px solid ${brand.ink}` }} />
        <div style={{ display: "flex", position: "absolute", left: 0, right: 0, bottom: 0, height: 28, backgroundColor: brand.orange }} />
      </div>
    );
  }
  if (variant === "hero/blocks") {
    // The headline as letter tiles over a block stack.
    const tones = [brand.lime, brand.pink, brand.blue, brand.violet, brand.orange];
    const u = 18;
    return (
      <div style={{ display: "flex", position: "relative", height: 180, backgroundColor: brand.sunken }}>
        {Array.from({ length: 16 }, (_, x) => (
          <div key={x} style={{ display: "flex", position: "absolute", left: x * u, top: 9 * u, width: u, height: u, backgroundColor: tones[x % 5], border: `3px solid ${brand.ink}` }} />
        ))}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, position: "absolute", left: 0, right: 0, top: 26 }}>
          {[["B", "L", "O", "C", "K"], ["B", "Y"]].map((row, r) => (
            <div key={r} style={{ display: "flex", gap: 4 }}>
              {row.map((ch, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    backgroundColor: tones[(r * 5 + i) % 5],
                    border: `4px solid ${brand.ink}`,
                    fontFamily: "Archivo Black",
                    fontSize: 24,
                  }}
                >
                  {ch}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (variant === "hero/pixel") {
    const u = 18;
    const block = (x: number, y: number, color: string, key: string) => (
      <div key={key} style={{ display: "flex", position: "absolute", left: x * u, top: y * u, width: u, height: u, backgroundColor: color, border: `3px solid ${brand.ink}` }} />
    );
    return (
      <div style={{ display: "flex", position: "relative", height: 180, backgroundColor: brand.sunken }}>
        {/* A T falling on the left, an L on the right, and the locked stack below. */}
        {[[1, 1], [2, 1], [3, 1], [2, 2]].map(([x, y]) => block(x, y, brand.violet, `t${x}${y}`))}
        {[[13, 2], [13, 3], [13, 4], [14, 4]].map(([x, y]) => block(x, y, brand.pink, `l${x}${y}`))}
        {Array.from({ length: 16 }, (_, x) => block(x, 9, [brand.blue, brand.lime, brand.orange, brand.pink][x % 4], `f${x}`))}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, position: "absolute", left: 70, top: 34, width: 150, padding: 12, backgroundColor: brand.paper, border: `4px solid ${brand.ink}`, boxShadow: hard(5) }}>
          {bar("85%", 12, brand.ink)}
          {bar("60%", 12, brand.ink)}
          <div style={{ display: "flex", width: "100%", height: 26, border: `3px solid ${brand.ink}`, backgroundColor: brand.raised }} />
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 22 }}>
      {bar("80%", 16, brand.ink)}
      {bar("55%", 16, brand.ink)}
      {bar("70%", 12, brand.faint)}
      <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
        <div style={{ display: "flex", width: 90, height: 34, backgroundColor: accent, border: `4px solid ${brand.ink}` }} />
        <div style={{ display: "flex", width: 70, height: 34, border: `4px solid ${brand.ink}` }} />
      </div>
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
          <SectionBody variant={art.variant} accent={accent} />
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
      if (art.game === "pinball") {
        // A table corner: bumpers, a flipper, and the ball.
        return (
          <div style={{ display: "flex", position: "relative", width: 220, height: 280, backgroundColor: brand.paper, border: `5px solid ${brand.ink}`, boxShadow: hard(12), transform: "rotate(-3deg)", overflow: "hidden" }}>
            {[
              [60, 70, brand.pink],
              [140, 70, brand.blue],
              [100, 135, brand.lime],
            ].map(([x, y, c], i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "absolute", left: (x as number) - 26, top: (y as number) - 26, width: 52, height: 52, borderRadius: 99, backgroundColor: c as string, border: `4px solid ${brand.ink}`, boxShadow: hard(5) }}>
                <div style={{ display: "flex", width: 20, height: 20, borderRadius: 99, backgroundColor: brand.raised, border: `3px solid ${brand.ink}` }} />
              </div>
            ))}
            <div style={{ display: "flex", position: "absolute", left: 40, top: 228, width: 70, height: 18, borderRadius: 9, backgroundColor: brand.lime, border: `4px solid ${brand.ink}`, transform: "rotate(22deg)" }} />
            <div style={{ display: "flex", position: "absolute", left: 112, top: 228, width: 70, height: 18, borderRadius: 9, backgroundColor: brand.lime, border: `4px solid ${brand.ink}`, transform: "rotate(-22deg)" }} />
            <div style={{ display: "flex", position: "absolute", left: 150, top: 178, width: 22, height: 22, borderRadius: 99, backgroundColor: brand.raised, border: `4px solid ${brand.ink}` }} />
          </div>
        );
      }
      if (art.game === "maze") {
        // A corner of maze, a dot trail, the chomper, and a bot.
        const u = 34;
        const walls: [number, number][] = [[1, 1], [2, 1], [4, 1], [5, 1], [1, 3], [3, 3], [5, 3], [1, 5], [2, 5], [4, 5], [5, 5]];
        return (
          <div style={{ display: "flex", position: "relative", width: 7 * u, height: 7 * u, backgroundColor: brand.sunken, border: `5px solid ${brand.ink}`, boxShadow: hard(12), transform: "rotate(-3deg)" }}>
            {walls.map(([x, y], i) => (
              <div key={i} style={{ display: "flex", position: "absolute", left: x * u, top: y * u, width: u, height: u, backgroundColor: brand.violetSoft, border: `3px solid ${brand.ink}` }} />
            ))}
            {[1, 2, 3, 4].map((x) => (
              <div key={x} style={{ display: "flex", position: "absolute", left: x * u + u / 2 - 4, top: 2 * u + u / 2 - 4, width: 8, height: 8, backgroundColor: brand.ink }} />
            ))}
            <div style={{ display: "flex", position: "absolute", left: 5 * u + 6, top: 4 * u + u / 2 - 7, width: 14, height: 14, borderRadius: 99, backgroundColor: brand.pink, border: `3px solid ${brand.ink}` }} />
            <div style={{ display: "flex", position: "absolute", left: 0, top: 2 * u, width: u, height: u, borderRadius: 99, backgroundColor: brand.lime, border: `4px solid ${brand.ink}`, borderRightColor: "transparent" }} />
            <div style={{ display: "flex", position: "absolute", left: 5 * u, top: 2 * u, width: u - 4, height: u - 4, borderTopLeftRadius: 99, borderTopRightRadius: 99, backgroundColor: brand.blue, border: `3px solid ${brand.ink}` }} />
          </div>
        );
      }
      if (art.game === "jumper") {
        // Sky, a block row, the mascot mid-jump, a walker, and the ground.
        return (
          <div style={{ display: "flex", position: "relative", width: 260, height: 230, backgroundColor: brand.blueSoft, border: `5px solid ${brand.ink}`, boxShadow: hard(12), transform: "rotate(3deg)", overflow: "hidden" }}>
            <div style={{ display: "flex", position: "absolute", left: 30, top: 24, width: 66, height: 22, borderRadius: 11, backgroundColor: brand.raised, border: `3px solid ${brand.ink}` }} />
            {[brand.orange, brand.lime, brand.orange].map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "absolute", left: 100 + i * 31, top: 64, width: 34, height: 34, backgroundColor: c, border: `3px solid ${brand.ink}`, fontFamily: "Space Mono", fontWeight: 700, fontSize: 20 }}>
                {c === brand.lime ? "!" : ""}
              </div>
            ))}
            <div style={{ display: "flex", position: "absolute", left: 120, top: 112, width: 32, height: 36, backgroundColor: brand.lime, border: `4px solid ${brand.ink}`, boxShadow: hard(3) }} />
            <div style={{ display: "flex", position: "absolute", left: 200, top: 150, width: 34, height: 28, borderRadius: 12, backgroundColor: brand.pink, border: `4px solid ${brand.ink}` }} />
            <div style={{ display: "flex", position: "absolute", left: 0, top: 178, width: 260, height: 12, backgroundColor: brand.lime, borderTop: `4px solid ${brand.ink}`, borderBottom: `3px solid ${brand.ink}` }} />
            <div style={{ display: "flex", position: "absolute", left: 0, top: 190, width: 260, height: 40, backgroundColor: brand.orange }} />
          </div>
        );
      }
      if (art.game === "whack") {
        // A 3×3 field of holes: two moles up (one gold), one bomb.
        const up: Record<number, string> = { 1: brand.violet, 3: brand.lime, 8: brand.ink };
        return (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, width: 250, padding: 14, backgroundColor: brand.limeSoft, border: `5px solid ${brand.ink}`, boxShadow: hard(12), transform: "rotate(3deg)" }}>
            {Array.from({ length: 9 }, (_, i) => (
              <div key={i} style={{ display: "flex", position: "relative", width: 64, height: 64 }}>
                {up[i] && (
                  <div style={{ display: "flex", position: "absolute", left: 14, top: 6, width: 36, height: 40, backgroundColor: up[i], border: `4px solid ${brand.ink}`, borderRadius: i === 8 ? 20 : "18px 18px 0 0" }} />
                )}
                <div style={{ display: "flex", position: "absolute", left: 4, bottom: 4, width: 56, height: 18, borderRadius: 28, backgroundColor: brand.ink }} />
                <div style={{ display: "flex", position: "absolute", left: 2, bottom: 0, width: 60, height: 10, borderRadius: "0 0 30px 30px", backgroundColor: brand.orange, border: `3px solid ${brand.ink}`, borderTopWidth: 0 }} />
              </div>
            ))}
          </div>
        );
      }
      if (art.game === "runner") {
        // Sky and sun, a mountain, the dino mid-jump over a pink cactus, and the ground.
        const px = (x: number, y: number, w: number, h: number, color: string, extra: Record<string, string | number> = {}) => (
          <div style={{ display: "flex", position: "absolute", left: x, top: y, width: w, height: h, backgroundColor: color, ...extra }} />
        );
        return (
          <div style={{ display: "flex", position: "relative", width: 300, height: 230, backgroundColor: brand.blueSoft, border: `5px solid ${brand.ink}`, boxShadow: hard(12), transform: "rotate(-2deg)", overflow: "hidden" }}>
            {px(222, 22, 46, 46, brand.orange, { borderRadius: 23, border: `4px solid ${brand.ink}` })}
            {px(24, 30, 70, 22, brand.raised, { borderRadius: 11, border: `3px solid ${brand.ink}` })}
            {px(150, 70, 0, 0, "transparent", { borderLeft: "70px solid transparent", borderRight: "70px solid transparent", borderBottom: `100px solid ${brand.ink}` })}
            {px(156, 76, 0, 0, "transparent", { borderLeft: "64px solid transparent", borderRight: "64px solid transparent", borderBottom: `94px solid ${brand.violetSoft}` })}
            {/* The dino: tail, body, head, eye, legs. */}
            {px(36, 104, 26, 12, brand.lime, { border: `3px solid ${brand.ink}`, transform: "rotate(-25deg)" })}
            {px(58, 92, 40, 40, brand.lime, { border: `4px solid ${brand.ink}`, boxShadow: hard(4) })}
            {px(80, 68, 44, 30, brand.lime, { border: `4px solid ${brand.ink}`, boxShadow: hard(4) })}
            {px(104, 74, 10, 10, brand.raised, { border: `3px solid ${brand.ink}` })}
            {px(92, 88, 8, 4, brand.pink)}
            {px(64, 132, 10, 14, brand.ink)}
            {px(84, 128, 10, 14, brand.ink)}
            {/* A cactus. */}
            {px(196, 128, 22, 52, brand.pink, { border: `4px solid ${brand.ink}`, boxShadow: hard(3) })}
            {px(182, 140, 12, 22, brand.pink, { border: `3px solid ${brand.ink}` })}
            {px(0, 178, 300, 12, brand.lime, { borderTop: `4px solid ${brand.ink}`, borderBottom: `3px solid ${brand.ink}` })}
            {px(0, 190, 300, 40, brand.orange)}
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

    case "legal": {
      // A policy document, with a badge for which one: a lock, a cookie, or the license.
      const lines = [150, 120, 140, 100, 130];
      const badge =
        art.doc === "cookies" ? (
          <div
            style={{
              display: "flex",
              position: "relative",
              width: 130,
              height: 130,
              borderRadius: 999,
              backgroundColor: brand.orange,
              border: `5px solid ${brand.ink}`,
              boxShadow: hard(7),
            }}
          >
            {[
              [28, 30], [70, 22], [52, 62], [22, 78], [84, 74],
            ].map(([x, y], i) => (
              <div key={i} style={{ position: "absolute", left: x, top: y, width: 16, height: 16, borderRadius: 4, backgroundColor: brand.ink }} />
            ))}
          </div>
        ) : art.doc === "privacy" ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                width: 70,
                height: 56,
                borderTopLeftRadius: 40,
                borderTopRightRadius: 40,
                border: `10px solid ${brand.ink}`,
                borderBottom: "none",
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 118,
                height: 92,
                backgroundColor: brand.blue,
                border: `5px solid ${brand.ink}`,
                boxShadow: hard(7),
              }}
            >
              <div style={{ display: "flex", width: 18, height: 34, borderRadius: 9, backgroundColor: brand.ink }} />
            </div>
          </div>
        ) : (
          <Sticker text="MIT" color={brand.lime} rotate={10} />
        );
      return (
        <div style={{ display: "flex", position: "relative", width: 300, height: 270 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              position: "absolute",
              left: 0,
              top: 10,
              width: 200,
              height: 240,
              padding: 22,
              backgroundColor: brand.raised,
              border: `5px solid ${brand.ink}`,
              boxShadow: hard(12),
              transform: "rotate(-4deg)",
            }}
          >
            <div style={{ display: "flex", width: 120, height: 18, backgroundColor: accent }} />
            {lines.map((w, i) => (
              <div key={i} style={{ display: "flex", width: w, height: 10, backgroundColor: brand.faint }} />
            ))}
          </div>
          <div style={{ display: "flex", position: "absolute", right: 0, bottom: 0 }}>{badge}</div>
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
  const fonts = await brandFonts();
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
    { ...ogSize, ...withFonts(fonts) },
  );
}

/** Where scripts/build-brand-icons.ts writes the brand logos (one SVG per slug, plus index.json). */
export const BRAND_DIR = "/brand-icons";

/** A brand logo drawn as a mask, so it takes the current text color like a line icon. */
export function BrandGlyph({ slug, size }: { slug: string; size: number }) {
  const url = `url(${BRAND_DIR}/${slug}.svg)`;
  return (
    <span
      aria-hidden
      className="block shrink-0 bg-current"
      style={{
        width: size,
        height: size,
        maskImage: url,
        WebkitMaskImage: url,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}

import type { ComponentProps, CSSProperties } from "react";
import { cn } from "./cn";
import type { Tone } from "./tones";

export type CubeVariant = "solid" | "lined" | "beveled";
export type CubeSize = "sm" | "md" | "lg";
export type CubeSpin = "none" | "loop" | "hover";
type FaceTone = Tone | "paper";

export type CubeProps = Omit<ComponentProps<"span">, "children"> & {
  /**
   * - `solid`: every face a full bright color
   * - `lined`: paper faces with a bright top, and one side hatched with ink lines
   * - `beveled`: raised faces with popped-out edges, like a 3D key
   */
  variant?: CubeVariant;
  size?: CubeSize;
  /** The main color. `solid` and `beveled` start from it and cycle the other brights round the faces. */
  tone?: Tone;
  /** Turn the cube: on a loop, on hover (or focus of its parent), or not at all. */
  spin?: CubeSpin;
  /** Accessible name. Without one the cube is decorative and hidden. */
  label?: string;
};

const PX: Record<CubeSize, number> = { sm: 56, md: 96, lg: 144 };
const BRIGHTS: Tone[] = ["lime", "pink", "blue", "violet", "orange"];

/** Faces in order: front, right, back, left, top, bottom, as transforms from the cube's center. */
const FACES = [
  "translateZ(calc(var(--sui-cube) / 2))",
  "rotateY(90deg) translateZ(calc(var(--sui-cube) / 2))",
  "rotateY(180deg) translateZ(calc(var(--sui-cube) / 2))",
  "rotateY(-90deg) translateZ(calc(var(--sui-cube) / 2))",
  "rotateX(90deg) translateZ(calc(var(--sui-cube) / 2))",
  "rotateX(-90deg) translateZ(calc(var(--sui-cube) / 2))",
];

const fill = (t: FaceTone) => (t === "paper" ? "var(--paper-raised)" : `var(--${t})`);

/** What each face shows, per variant. */
function faceStyle(variant: CubeVariant, i: number, tone: Tone): CSSProperties {
  const order = [tone, ...BRIGHTS.filter((b) => b !== tone)];
  if (variant === "lined") {
    // Paper faces, the top in the tone, and the right side (and its opposite) hatched.
    if (i === 4) return { background: fill(tone) };
    if (i === 1 || i === 3) {
      return {
        backgroundColor: "var(--paper-raised)",
        backgroundImage: "repeating-linear-gradient(-45deg, var(--ink) 0 2.5px, transparent 2.5px 9px)",
      };
    }
    return { background: "var(--paper-raised)" };
  }
  const color = fill(order[i % order.length]);
  if (variant === "beveled") {
    // Light catches the top-left edges and the bottom-right ones fall into shadow.
    return {
      background: color,
      boxShadow:
        "inset 0.4em 0.4em 0 color-mix(in oklab, white 50%, transparent), inset -0.4em -0.4em 0 color-mix(in oklab, var(--ink) 28%, transparent)",
    };
  }
  return { background: color };
}

/**
 * A 3D cube in CSS: six real faces in a preserve-3d scene, turned to show
 * three of them. Pure CSS, no JavaScript. Decorative unless you give it a
 * `label`; spinning stops for reduced motion.
 */
export function Cube({
  variant = "solid",
  size = "md",
  tone = "lime",
  spin = "none",
  label,
  className,
  style,
  ...props
}: CubeProps) {
  const px = PX[size];
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      data-spin={spin === "none" ? undefined : spin}
      className={cn("sui-cube inline-grid shrink-0 place-items-center", className)}
      style={{ "--sui-cube": `${px}px`, width: px * 1.7, height: px * 1.7, fontSize: px / 6, ...style } as CSSProperties}
      {...props}
    >
      <span className="sui-cube-scene relative block" style={{ width: px, height: px }}>
        {FACES.map((transform, i) => (
          <span
            key={i}
            className="absolute inset-0 block border-[3px] border-ink"
            style={{ transform, backfaceVisibility: "hidden", ...faceStyle(variant, i, tone) }}
          >
            {/* Beveled faces carry a raised key in the middle, edged the same way. */}
            {variant === "beveled" && (
              <span
                className="absolute inset-[22%] block border-[3px] border-ink"
                style={{
                  boxShadow:
                    "inset 0.3em 0.3em 0 color-mix(in oklab, white 55%, transparent), inset -0.3em -0.3em 0 color-mix(in oklab, var(--ink) 30%, transparent), 0.25em 0.25em 0 color-mix(in oklab, var(--ink) 40%, transparent)",
                }}
              />
            )}
          </span>
        ))}
      </span>
    </span>
  );
}

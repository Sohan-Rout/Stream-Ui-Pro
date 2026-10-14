/** The bright accents every toned component accepts. */
export type Tone = "lime" | "pink" | "blue" | "violet" | "orange";

/** Static class strings so Tailwind can see them. */
export const toneBg: Record<Tone, string> = {
  lime: "bg-lime",
  pink: "bg-pink",
  blue: "bg-blue",
  violet: "bg-violet",
  orange: "bg-orange",
};

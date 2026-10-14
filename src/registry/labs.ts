import type { ComponentType } from "react";
import { ShapeRollerLab } from "@/components/demos/ShapeRollerLab";
import { MagneticLab } from "@/components/demos/MagneticLab";
import { WobbleLab } from "@/components/demos/WobbleLab";

export type LabDoc = {
  slug: string;
  name: string;
  description: string;
  file: string;
  Component: ComponentType;
  notes: string[];
};

export const labs: LabDoc[] = [
  {
    slug: "shape-roller",
    name: "Shape roller",
    description: "Randomizes shape, color, and rotation on each roll.",
    file: "src/components/demos/ShapeRollerLab.tsx",
    Component: ShapeRollerLab,
    notes: [
      "The first render is fixed and randomness only runs on click, so server and client markup match.",
      "Re-keying the shape replays its wiggle animation on every roll.",
    ],
  },
  {
    slug: "magnetic",
    name: "Magnetic button",
    description: "The button drifts toward the cursor within its area.",
    file: "src/components/demos/MagneticLab.tsx",
    Component: MagneticLab,
    notes: [
      "Only reacts to mouse pointers; touch and pen are ignored.",
      "Does nothing when the user prefers reduced motion.",
    ],
  },
  {
    slug: "wobble",
    name: "Wobble type",
    description: "Staggered CSS transitions on hover. No JavaScript.",
    file: "src/components/demos/WobbleLab.tsx",
    Component: WobbleLab,
    notes: ["Each letter gets its own transition-delay, which creates the wave.", "The word keeps a single aria-label so it reads as one word."],
  },
];

export function getLab(slug: string) {
  return labs.find((l) => l.slug === slug);
}

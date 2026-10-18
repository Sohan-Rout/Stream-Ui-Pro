import type { ComponentType } from "react";
import type { SectionSlug } from "@/components/blocks/SectionThumbs";
import { PixelPromptHeroSection } from "@/components/sections/PixelPromptHeroSection";
import { BlocksHeroSection } from "@/components/sections/BlocksHeroSection";
import { PlatformerHeroSection } from "@/components/sections/PlatformerHeroSection";
import { FlappyHeroSection } from "@/components/sections/FlappyHeroSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { MazeFeaturesSection } from "@/components/sections/MazeFeaturesSection";
import { BentoFeaturesSection } from "@/components/sections/BentoFeaturesSection";
import { LevelsFeaturesSection } from "@/components/sections/LevelsFeaturesSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { FooterSection } from "@/components/sections/FooterSection";

/** One design of a section. Heroes take `headingAs` so docs previews can demote their h1. */
export type SectionVariant = {
  /** URL fragment on the section page, like /sections/hero#prompt. */
  id: string;
  name: string;
  description: string;
  file: string;
  Component: ComponentType<{ headingAs?: "h1" | "h2" | "h3" }>;
  uses: string[];
  notes: string[];
};

export type SectionDoc = {
  slug: SectionSlug;
  name: string;
  description: string;
  /** The first variant is the default, shown on index cards. */
  variants: [SectionVariant, ...SectionVariant[]];
};

export const sections: SectionDoc[] = [
  {
    slug: "hero",
    name: "Hero",
    description: "The top of a landing page: a headline, a pitch, and a first action, in four playful layouts.",
    variants: [
      {
        id: "pixel",
        name: "Pixel prompt",
        description: "The prompt box in an arcade screen over a pixel grid, with tetrominoes falling onto a locked stack.",
        file: "src/components/sections/PixelPromptHeroSection.tsx",
        Component: PixelPromptHeroSection,
        uses: ["lucide-react"],
        notes: [
          "Pieces fall one grid cell per tick (CSS steps), so the motion reads like a game, not a slide. They're decorative and hold still for reduced motion.",
          "Self-contained: the shapes, keyframes, and grid size live in the file, so it copies into any project.",
          "Enter sends, Shift+Enter adds a line, and the example chips fill the box. It's a plain GET form: point its action at your app and read the prompt parameter.",
        ],
      },
      {
        id: "blocks",
        name: "Falling blocks",
        description: "A centered headline built from letter tiles that drop into place, over a grid of falling tetrominoes.",
        file: "src/components/sections/BlocksHeroSection.tsx",
        Component: BlocksHeroSection,
        uses: ["lucide-react"],
        notes: [
          "Each letter is its own tile and drops in a few steps, one after another, like pieces landing. Screen readers get the plain headline text instead.",
          "Edit LINES to change the headline; words wrap between each other, never mid-word. Tiles grow with the container.",
          "No JavaScript: it's a server component, and every animation is CSS that holds still for reduced motion.",
        ],
      },
      {
        id: "platformer",
        name: "Platformer",
        description: "A retro platformer scene: a HUD, bonus blocks that pop coins, pipes, clouds, and a bouncing pixel mascot.",
        file: "src/components/sections/PlatformerHeroSection.tsx",
        Component: PlatformerHeroSection,
        uses: ["lucide-react"],
        notes: [
          "Bonus blocks are real buttons: click or press Enter to pop a coin and add to the HUD, once per block. The count is announced to screen readers.",
          "The mascot is an original sprite drawn from a text grid in SPRITE; swap the letters to draw your own.",
          "The bounce, coin pops, and block bumps are decorative and hold still for reduced motion.",
        ],
      },
      {
        id: "flappy",
        name: "Flappy",
        description: "A sky of endlessly scrolling pipes and a bobbing, flapping bird over a big outlined headline.",
        file: "src/components/sections/FlappyHeroSection.tsx",
        Component: FlappyHeroSection,
        uses: ["lucide-react"],
        notes: [
          "The pipe track is drawn twice side by side and slides one copy's width, so the loop never jumps. Edit GAPS to change where the openings fall.",
          "There's no card behind the text: a thick white outline (text stroke painted under the fill) keeps it readable as the pipes pass behind.",
          "No JavaScript: a server component, with CSS animation that holds still for reduced motion.",
        ],
      },
    ],
  },
  {
    slug: "features",
    name: "Features",
    description: "Six features, laid out four ways: a ruled grid, an arcade maze, a bento board, and a level select.",
    variants: [
      {
        id: "grid",
        name: "Grid",
        description: "Six features in a ruled grid, each with a toned icon tile.",
        file: "src/components/sections/FeaturesSection.tsx",
        Component: FeaturesSection,
        uses: ["lucide-react"],
        notes: ["One, two, or three columns depending on the container width.", "Keep feature copy to one sentence so rows stay even."],
      },
      {
        id: "maze",
        name: "Maze",
        description: "A corridor where a chomper eats a dot trail with three bots on its tail, over features set in maze rooms.",
        file: "src/components/sections/MazeFeaturesSection.tsx",
        Component: MazeFeaturesSection,
        uses: ["lucide-react"],
        notes: [
          "The dots behind the chomper disappear as it runs: a strip grows at the same pace as it moves. CSS only, still for reduced motion.",
          "The violet gaps between cards read as maze walls; each card wears a bot as its icon and a +10 pellet.",
          "Original characters, in the spirit of arcade maze games.",
        ],
      },
      {
        id: "bento",
        name: "Bento",
        description: "One big lead tile and five smaller ones in soft tints, on an asymmetric bento grid.",
        file: "src/components/sections/BentoFeaturesSection.tsx",
        Component: BentoFeaturesSection,
        uses: ["lucide-react"],
        notes: [
          "Put your strongest feature first: it gets the big lime tile.",
          "Four columns from 48rem, two from 36rem, one below; rows share a height so the board stays even.",
        ],
      },
      {
        id: "levels",
        name: "Level select",
        description: "Features as arcade level tiles numbered 1-1 to 1-6, with pixel bevels, star ratings, and a start marker.",
        file: "src/components/sections/LevelsFeaturesSection.tsx",
        Component: LevelsFeaturesSection,
        uses: ["lucide-react"],
        notes: [
          "Stars are labeled for screen readers (\"2 of 3 stars\"); use them for maturity, adoption, or anything you rate.",
          "Tiles lift on hover; drop the Start marker if no feature is the obvious first step.",
        ],
      },
    ],
  },
  {
    slug: "pricing",
    name: "Pricing",
    description: "Three plans with a monthly/yearly switch and a highlighted tier.",
    variants: [
      {
        id: "default",
        name: "Pricing",
        description: "Three plans with a monthly/yearly switch and a highlighted tier.",
        file: "src/components/sections/PricingSection.tsx",
        Component: PricingSection,
        uses: ["Button", "Badge"],
        notes: ["The billing switch is a pressed-button group, announced as a toggle.", "Prices live in one array; edit plans there."],
      },
    ],
  },
  {
    slug: "testimonials",
    name: "Testimonials",
    description: "Three customer quotes with names and roles.",
    variants: [
      {
        id: "default",
        name: "Testimonials",
        description: "Three customer quotes with names and roles.",
        file: "src/components/sections/TestimonialsSection.tsx",
        Component: TestimonialsSection,
        uses: ["Avatar"],
        notes: ["Each quote is a figure with blockquote and figcaption.", "Replace the sample quotes with real ones before shipping."],
      },
    ],
  },
  {
    slug: "faq",
    name: "FAQ",
    description: "An accordion of common questions next to a contact line.",
    variants: [
      {
        id: "default",
        name: "FAQ",
        description: "An accordion of common questions next to a contact line.",
        file: "src/components/sections/FaqSection.tsx",
        Component: FaqSection,
        uses: ["lucide-react"],
        notes: ["Built on native <details>, so it works without JavaScript.", "The first item starts open."],
      },
    ],
  },
  {
    slug: "footer",
    name: "Footer",
    description: "A newsletter signup and three columns of links.",
    variants: [
      {
        id: "default",
        name: "Footer",
        description: "A newsletter signup and three columns of links.",
        file: "src/components/sections/FooterSection.tsx",
        Component: FooterSection,
        uses: ["Input", "Button"],
        notes: ["Each link column is its own labelled nav landmark.", "Point the form action at your email provider."],
      },
    ],
  },
];

export function getSection(slug: string) {
  return sections.find((s) => s.slug === slug);
}

/** A design with its own page: only sections with more than one have them. */
export function getSectionVariant(slug: string, id: string) {
  const section = getSection(slug);
  if (!section || section.variants.length < 2) return undefined;
  const variant = section.variants.find((v) => v.id === id);
  return variant && { section, variant };
}

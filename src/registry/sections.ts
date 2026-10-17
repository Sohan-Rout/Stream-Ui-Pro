import type { ComponentType } from "react";
import type { SectionSlug } from "@/components/blocks/SectionThumbs";
import { HeroSection } from "@/components/sections/HeroSection";
import { PromptHeroSection } from "@/components/sections/PromptHeroSection";
import { PixelPromptHeroSection } from "@/components/sections/PixelPromptHeroSection";
import { BlocksHeroSection } from "@/components/sections/BlocksHeroSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
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
    description: "The top of a landing page: a headline, a pitch, and a first action, in four layouts.",
    variants: [
      {
        id: "split",
        name: "Split",
        description: "A split hero with a pitch, two calls to action, and a product glimpse.",
        file: "src/components/sections/HeroSection.tsx",
        Component: HeroSection,
        uses: ["Button", "Badge"],
        notes: ["Stacks on narrow containers; splits into two columns from 48rem.", "Swap the chart card for a screenshot or illustration."],
      },
      {
        id: "prompt",
        name: "Prompt box",
        description: "A centered headline over a large prompt box with example chips, for AI and generator products.",
        file: "src/components/sections/PromptHeroSection.tsx",
        Component: PromptHeroSection,
        uses: ["Button", "Badge", "lucide-react"],
        notes: [
          "Enter sends and Shift+Enter adds a line; the send button stays disabled until there is text.",
          "Example chips fill the box and move focus to it, so people can edit before sending.",
          "It's a plain GET form: point its action at your app and read the prompt parameter.",
        ],
      },
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
          "Same prompt behavior as the Prompt box hero: Enter sends, Shift+Enter adds a line, chips fill the box.",
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
    ],
  },
  {
    slug: "features",
    name: "Features",
    description: "Six features in a ruled grid, each with a toned icon tile.",
    variants: [
      {
        id: "default",
        name: "Features",
        description: "Six features in a ruled grid, each with a toned icon tile.",
        file: "src/components/sections/FeaturesSection.tsx",
        Component: FeaturesSection,
        uses: ["lucide-react"],
        notes: ["One, two, or three columns depending on the container width.", "Keep feature copy to one sentence so rows stay even."],
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

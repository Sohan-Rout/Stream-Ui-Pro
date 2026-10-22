import type { SectionSlug } from "@/components/blocks/SectionThumbs";

/** One design of a section. Heroes take `headingAs` so docs previews can demote their h1. */
export type SectionVariant = {
  /** URL fragment on the section page, like /sections/hero#prompt. */
  id: string;
  name: string;
  description: string;
  file: string;
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
    description: "The top of a landing page: a headline, a pitch, and a first action, in eight playful layouts.",
    variants: [
      {
        id: "pixel",
        name: "Pixel prompt",
        description: "The prompt box in an arcade screen over a pixel grid, with tetrominoes falling onto a locked stack.",
        file: "src/components/sections/PixelPromptHeroSection.tsx",
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
        uses: ["lucide-react"],
        notes: [
          "Bonus blocks are real buttons: click or press Enter to pop a coin and add to the HUD, once per block. The count is announced to screen readers.",
          "The mascot is an original sprite drawn from a text grid in SPRITE; swap the letters to draw your own.",
          "The bounce, coin pops, and block bumps are decorative and hold still for reduced motion.",
        ],
      },
      {
        id: "maze",
        name: "Maze",
        description: "An arcade start screen: corridors where a chomper eats a dot trail with bots on its tail, around a READY! headline.",
        file: "src/components/sections/MazeHeroSection.tsx",
        uses: ["lucide-react"],
        notes: [
          "The two corridors run opposite ways, half a lap apart, and the dots vanish behind each chomper. CSS only; it holds still for reduced motion.",
          "Swap the score bar numbers for your own (or drop it); READY! and the power pellets blink in place.",
          "Pairs with the Maze features section. Original characters, in the spirit of arcade maze games.",
        ],
      },
      {
        id: "flappy",
        name: "Flappy",
        description: "A sky of endlessly scrolling pipes and a bobbing, flapping bird over a big outlined headline.",
        file: "src/components/sections/FlappyHeroSection.tsx",
        uses: ["lucide-react"],
        notes: [
          "The pipe track is drawn twice side by side and slides one copy's width, so the loop never jumps. Edit GAPS to change where the openings fall.",
          "There's no card behind the text: a thick white outline (text stroke painted under the fill) keeps it readable as the pipes pass behind.",
          "No JavaScript: a server component, with CSS animation that holds still for reduced motion.",
        ],
      },
      {
        id: "dino",
        name: "Dino runner",
        description: "The Dino Runner scene as a backdrop: a dino on autopilot jumps cacti and ducks flyers behind a letter-tile headline.",
        file: "src/components/sections/DinoHeroSection.tsx",
        uses: ["lucide-react"],
        notes: [
          "The background is the real runner from Labs and the 404 page, played by a perfect autopilot (tested over two-minute runs) and held at a calm top speed.",
          "The headline is letter tiles that drop in one after another; the subheading keeps a white outline under a hard pink shadow so it reads over the scene.",
          "The canvas renders at the section's size, shows more scenery on wide screens, pauses off screen, and is a still frame for reduced motion.",
        ],
      },
      {
        id: "comic",
        name: "Comic cover",
        description: "The hero as a comic-book cover: a sunburst of speed lines, a masthead, a KA-BOOM! starburst headline, and the pitch in a speech bubble.",
        file: "src/components/sections/ComicHeroSection.tsx",
        uses: ["lucide-react"],
        notes: [
          "It has its own vintage print palette (newsprint paper, golden yellow, brick red) instead of the library brights, set as custom properties on the section so it's one place to retune.",
          "The rays are one repeating conic gradient that turns slowly, with a halftone layer over it; no images.",
          "The headline is real text in ink with a brick-red offset shadow, and the punchline sits on an SVG starburst.",
          "No JavaScript: a server component. Everything pops in once and the rays turn; all of it holds still for reduced motion.",
        ],
      },
      {
        id: "jungle",
        name: "Jungle run",
        description: "A monkey sprints through a parallax jungle and leaps for bananas, under a sky-high headline.",
        file: "src/components/sections/JungleHeroSection.tsx",
        uses: ["lucide-react"],
        notes: [
          "Hills, palms, and the ground scroll at their own speeds: each layer is drawn twice side by side and slides one copy's width, so the loop never jumps.",
          "The leap and the banana share one cycle, so the monkey always peaks as the banana reaches it, and a +1 pops.",
          "It has its own jungle palette as custom properties on the section. No JavaScript: a server component, and all motion holds still for reduced motion.",
        ],
      },
    ],
  },
  {
    slug: "features",
    name: "Features",
    description: "Six features, laid out five ways: a ruled grid, an arcade maze, a bento board, a level select, and flappy pipes.",
    variants: [
      {
        id: "grid",
        name: "Grid",
        description: "Six features in a ruled grid, each with a toned icon tile.",
        file: "src/components/sections/FeaturesSection.tsx",
        uses: ["lucide-react"],
        notes: ["One, two, or three columns depending on the container width.", "Keep feature copy to one sentence so rows stay even."],
      },
      {
        id: "maze",
        name: "Maze",
        description: "A corridor where a chomper eats a dot trail with three bots on its tail, over features set in maze rooms.",
        file: "src/components/sections/MazeFeaturesSection.tsx",
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
        uses: ["lucide-react"],
        notes: [
          "Stars are labeled for screen readers (\"2 of 3 stars\"); use them for maturity, adoption, or anything you rate.",
          "Tiles lift on hover; drop the Start marker if no feature is the obvious first step.",
        ],
      },
      {
        id: "flappy",
        name: "Flappy pipes",
        description: "Features on pink pipe cards: three hang from above, three stand on scrolling grass, and the bird flaps through the gap.",
        file: "src/components/sections/FlappyFeaturesSection.tsx",
        uses: ["lucide-react"],
        notes: [
          "Each card is a pipe: the cap holds the icon and title, the body holds the description. Top pipes hang down, bottom pipes stand up.",
          "The bird flies the width of the section through the gap between the rows, bobbing and flapping; clouds drift and the grass scrolls. CSS only.",
          "Pairs with the Flappy hero: same pipes, bird, and grass. Everything holds still for reduced motion.",
        ],
      },
    ],
  },
  {
    slug: "pricing",
    name: "Pricing",
    description: "Three plans with a monthly/yearly switch, three ways: a ruled classic table, bold color-block cards, and whack-a-mole signs.",
    variants: [
      {
        id: "classic",
        name: "Classic",
        description: "Three plans in a ruled table with a monthly/yearly switch and a highlighted tier.",
        file: "src/components/sections/PricingSection.tsx",
        uses: ["Button", "Badge"],
        notes: ["The billing switch is a pressed-button group, announced as a toggle.", "Prices live in one array; edit plans there."],
      },
      {
        id: "bold",
        name: "Color blocks",
        description: "Three full-color plan cards (orange, lime, pink) with thick borders and hard shadows; the featured one lifts and tilts.",
        file: "src/components/sections/BoldPricingSection.tsx",
        uses: ["lucide-react"],
        notes: [
          "Each plan is one bright from the theme with ink text on top. Change a card's tone in the plans array.",
          "The featured plan lifts, tilts a degree, and wears a Most popular sticker; on small screens the cards stack flat.",
          "The billing switch is a pressed-button group, announced as a toggle. Hover lifts are off for reduced motion.",
        ],
      },
      {
        id: "whack",
        name: "Whack-a-mole",
        description: "Each plan is a sign held up by a mole popping out of its hole on a grass field; the featured one gets the crowned gold mole.",
        file: "src/components/sections/WhackPricingSection.tsx",
        uses: ["lucide-react"],
        notes: [
          "The signs pop out of their holes one after another, nudge up on hover, and hold still for reduced motion.",
          "Each mole's head is a button: bonk it and it squashes with X eyes and a +1. The section counts your bonks next to the eyebrow.",
          "Pairs with the Whack-a-Mole lab: same violet moles and crowned gold mole. The billing switch is a pressed-button group.",
        ],
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
        uses: ["lucide-react"],
        notes: ["Built on native <details>, so it works without JavaScript.", "The first item starts open."],
      },
    ],
  },
  {
    slug: "footer",
    name: "Footer",
    description: "A newsletter signup and three columns of links, two ways: a ruled classic grid and the last page of a comic.",
    variants: [
      {
        id: "classic",
        name: "Classic",
        description: "A newsletter signup and three columns of links in a ruled grid.",
        file: "src/components/sections/FooterSection.tsx",
        uses: ["Input", "Button"],
        notes: ["Each link column is its own labelled nav landmark.", "Point the form action at your email provider."],
      },
      {
        id: "comic",
        name: "Comic",
        description: "The last page of a comic: a \"The end?\" signup panel, a brand panel with a starburst, and link columns as tilted panels.",
        file: "src/components/sections/ComicFooterSection.tsx",
        uses: ["Comic Input", "lucide-react"],
        notes: [
          "Shares the Comic cover hero's vintage print palette (newsprint, golden yellow, brick red), so the two bookend a page.",
          "Each link column is its own labelled nav landmark under a caption box; the signup uses ComicInput with a real <label>.",
          "No JavaScript and no motion: a server component. Point the form action at your email provider.",
        ],
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

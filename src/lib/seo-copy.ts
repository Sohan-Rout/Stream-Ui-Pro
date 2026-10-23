/**
 * Search copy for every page: titles, meta descriptions, and keywords.
 *
 * Google ranks on the <title>, the description shown in results, and the
 * page's own copy; the keywords tag mostly matters to Bing. Each page leads
 * with one target phrase:
 *
 *   home        neobrutalism UI library (React, Tailwind)
 *   components  neobrutalism React components, + "<name> component"
 *   sections    neobrutalism landing page sections, + "<name> section"
 *   icons       animated icons for React
 *   labs        creative React / CSS experiments, + one phrase per lab
 *
 * "Neobrutalism" is the common spelling; "neo-brutalism", "neo-brutalist",
 * and "neubrutalism" appear as variants. Keep titles ≤ 60 characters with
 * the " · stream/ui" suffix, and descriptions ≤ 160 (tests enforce both).
 */

export type SeoCopy = { title: string; description: string; keywords: string[] };

const base = ["neobrutalism", "neo-brutalism", "neubrutalism", "React", "Tailwind CSS"];

export const homeSeo: SeoCopy = {
  title: "stream/ui — Neobrutalism UI Library for React",
  description:
    "Neobrutalism UI library for React and Tailwind CSS v4: accessible components, landing page sections, 2,000+ animated icons, and creative UI labs.",
  keywords: [
    ...base,
    "neobrutalism UI",
    "neobrutalism UI library",
    "neo-brutalist design",
    "brutalist UI",
    "React UI library",
    "Tailwind component library",
    "animated icons",
    "open source UI components",
    "shadcn registry",
    "neobrutalism shadcn",
  ],
};

export const indexSeo = {
  components: {
    title: "Neobrutalism React Components",
    description:
      "Neobrutalism React components for Tailwind CSS v4: buttons, inputs, tabs, switches, badges, and animated icons. Accessible, typed, and free to use.",
    keywords: [...base, "neobrutalism components", "React components", "Tailwind components", "brutalist buttons"],
  },
  sections: {
    title: "Neobrutalism Landing Page Sections",
    description:
      "Neobrutalism landing page sections for React and Tailwind: hero, features, pricing, testimonials, FAQ, and footer. Responsive and ready to copy.",
    keywords: [...base, "landing page sections", "neobrutalism templates", "React page sections", "Tailwind sections"],
  },
  icons: {
    title: "Animated Icons and Brand Logos for React",
    description:
      "Search 2,000+ animated icons and 3,400+ brand logos for React. Animate icons with draw, spin, or bounce, then copy the JSX or SVG. Free and open source.",
    keywords: ["animated icons", "React animated icons", "brand icons", "brand logos SVG", "icon animation", "Lucide icons", "React icons"],
  },
  labs: {
    title: "Creative React UI Experiments",
    description:
      "Creative React UI experiments and CSS animations: a 3D dice roller, a magnetic button, wobble text, and a shape generator, with full source code.",
    keywords: ["React UI experiments", "CSS animations", "creative coding", "React interactions", "3D CSS", "neobrutalism"],
  },
  sponsor: {
    title: "Sponsor",
    description:
      "stream/ui is a free, MIT-licensed neobrutalism UI library. Sponsor it on GitHub Sponsors or by UPI through Razorpay to fund new components and docs.",
    keywords: ["sponsor open source", "stream/ui", "neobrutalism UI library"],
  },
  privacy: {
    title: "Privacy Policy",
    description:
      "How stream/ui handles your data: no accounts or ads, and Google Analytics cookies only with consent. What our host logs, the third parties, your choices.",
    keywords: ["stream/ui privacy policy", "privacy"],
  },
  terms: {
    title: "Terms of Use",
    description:
      "Terms for using the stream/ui website and the MIT-licensed @streamuilib/react package: licensing, sponsorships, warranties, and liability.",
    keywords: ["stream/ui terms of use", "MIT license"],
  },
  cookies: {
    title: "Cookie Policy",
    description:
      "Every cookie and storage item stream/ui may use, from Google Analytics (only after you accept) to Labs best scores, and how to change your choice.",
    keywords: ["stream/ui cookie policy", "cookies", "local storage"],
  },
} satisfies Record<string, SeoCopy>;

/** Components whose name doesn't read well after "Neobrutalism". */
const componentOverrides: Record<string, SeoCopy> = {
  "comic-alert": {
    title: "Comic Alert Component for React: Uh-oh!",
    description:
      "Comic-book alerts for React and Tailwind CSS: speech bubbles pointing at starbursts, shouty titles, and sound effects, with accessible alert roles.",
    keywords: ["comic alert React", "speech bubble alert", "animated alert", "neobrutalism alert", "playful notification"],
  },
  "comic-card": {
    title: "Comic Card Component for React: Panels",
    description:
      "Comic-book panel cards for React and Tailwind CSS: skewed panels with halftone dots, narration captions, and starburst sound effects. Copy it.",
    keywords: ["comic card React", "comic panel UI", "neobrutalism card", "halftone card", "playful card component"],
  },
  "comic-button": {
    title: "Comic Button Component for React: POW!",
    description:
      "Comic-book buttons for React and Tailwind CSS: panel, speech bubble, ribbon, and starburst shapes with halftone dots that pop a POW! when clicked.",
    keywords: ["comic button React", "animated button", "starburst button", "neobrutalism button", "playful button component"],
  },
  "comic-badge": {
    title: "Comic Badge Component for React: Starbursts",
    description:
      "Comic-book badges for React and Tailwind CSS: starburst, scalloped seal, splat, blob, speech bubble, and ribbon shapes with ink outlines and hard shadows.",
    keywords: ["starburst badge", "comic badge React", "sticker badge", "sale badge component", "neobrutalism badge", "speech bubble badge"],
  },
  cube: {
    title: "3D CSS Cube Component for React",
    description:
      "A 3D cube for React and Tailwind CSS in pure CSS: solid bright faces, a lined side, or beveled faces with popped-out edges. Spins on loop or hover.",
    keywords: ["3D cube CSS", "CSS cube React", "3D cube component", "neobrutalism cube", "CSS 3D transform"],
  },
  battery: {
    title: "Battery Indicator Component for React",
    description:
      "A neobrutalism battery indicator for React and Tailwind CSS: a fill that changes color as it drains, charging and low states, and segments.",
    keywords: ["battery indicator React", "battery component", "battery level UI", "neobrutalism battery", "React meter component"],
  },
  "animated-icon": {
    title: "Animated Icon Component for React",
    description:
      "Animate any SVG icon in React: draw, spin, bounce, wiggle, pulse, shake, or pop on hover, on a loop, or once. Pure CSS, reduced-motion safe.",
    keywords: ["animated icon", "React animated icon", "SVG icon animation", "animated Lucide icons", "CSS icon animation"],
  },
};

/** A component category page, like Badges: a grid of its designs. */
export function componentGroupSeo(group: { slug: string; name: string }): SeoCopy {
  if (group.slug === "button") {
    return {
      title: "Neobrutalism Button Components for React",
      description:
        "Neobrutalism buttons for React and Tailwind CSS in two designs: classic brutal buttons with hard shadows, and comic-book buttons that pop a POW! on click.",
      keywords: [...base, "neobrutalism button", "React button component", "comic button", "Tailwind button", "animated button"],
    };
  }
  if (group.slug === "card") {
    return {
      title: "Neobrutalism Card Components for React",
      description:
        "Neobrutalism cards for React and Tailwind CSS in two designs: classic brutal cards with hard shadows, and comic panels with captions and sound effects.",
      keywords: [...base, "neobrutalism card", "React card component", "comic card", "Tailwind card", "comic panel"],
    };
  }
  if (group.slug === "alert") {
    return {
      title: "Neobrutalism Alert Components for React",
      description:
        "Neobrutalism alerts for React and Tailwind CSS in two designs: classic brutal message boxes, and comic speech bubbles with starbursts that pop in.",
      keywords: [...base, "neobrutalism alert", "React alert component", "comic alert", "Tailwind alert", "notification UI"],
    };
  }
  if (group.slug === "badge") {
    return {
      title: "Neobrutalism Badge Components for React",
      description:
        "Neobrutalism badges for React and Tailwind CSS in two designs: classic pill labels in six tones, and comic starbursts, seals, splats, and speech bubbles.",
      keywords: [...base, "neobrutalism badge", "React badge component", "starburst badge", "comic badge", "Tailwind badge"],
    };
  }
  const lower = group.name.toLowerCase();
  return {
    title: `Neobrutalism ${group.name} for React`,
    description: `Neobrutalism ${lower} for React and Tailwind CSS in two designs: classic brutal ${lower} with hard shadows, and comic-book ${lower}.`,
    keywords: [...base, `neobrutalism ${lower}`, `React ${lower}`],
  };
}

export function componentSeo(doc: { slug: string; name: string; description?: string }): SeoCopy {
  const override = componentOverrides[doc.slug];
  if (override) return override;
  const lower = doc.name.toLowerCase();
  // The comic designs: "Comic Switch Component for React", led by what it looks like.
  if (doc.slug.startsWith("comic-") && doc.description) {
    const kind = lower.replace(/^comic /, "");
    return {
      title: `${doc.name} Component for React`,
      description: `${doc.description} A comic-book ${kind} for React and Tailwind CSS.`,
      keywords: [...base, `comic ${kind} React`, `comic book ${kind}`, `neobrutalism ${kind}`, `playful ${kind} component`],
    };
  }
  return {
    title: `Neobrutalism ${doc.name} Component for React`,
    description: `A neobrutalism ${lower} component for React and Tailwind CSS v4: hard borders, offset shadows, every state styled, and accessible by default.`,
    keywords: [...base, `neobrutalism ${lower}`, `React ${lower} component`, `Tailwind ${lower}`, `brutalist ${lower}`],
  };
}

/** Sections whose page covers more than the generic copy says. */
const sectionOverrides: Record<string, SeoCopy> = {
  hero: {
    title: "Neobrutalism Hero Sections for React",
    description:
      "Neobrutalism hero sections for React and Tailwind CSS: a pixel AI prompt, Tetris-style falling blocks, a retro platformer, and flappy pipes. Copy them.",
    keywords: [...base, "neobrutalism hero section", "hero section", "AI prompt hero", "prompt box UI", "React hero"],
  },
};

export function sectionSeo(doc: { slug: string; name: string }): SeoCopy {
  if (sectionOverrides[doc.slug]) return sectionOverrides[doc.slug];
  const label = doc.slug === "faq" ? "FAQ" : doc.name.toLowerCase();
  return {
    title: `Neobrutalism ${doc.name} Section for React`,
    description: `A neobrutalism ${label} section for React and Tailwind CSS: responsive, accessible, and built from stream/ui components. Copy it into your landing page.`,
    keywords: [...base, `neobrutalism ${label} section`, `${label} section`, "landing page section", `React ${label}`],
  };
}

/** Copy for a section variant's own page, like /sections/hero/prompt. */
const variantCopy: Record<string, SeoCopy> = {
  "features/grid": {
    title: "Neobrutalism Feature Grid Section for React",
    description:
      "A neobrutalism feature grid for React and Tailwind CSS: six features in a ruled grid with toned icon tiles. Responsive and accessible. Copy it.",
    keywords: [...base, "feature grid", "features section", "neobrutalism features section", "React features"],
  },
  "features/maze": {
    title: "Arcade Maze Features Section for React",
    description:
      "An arcade maze features section for React and Tailwind CSS: a chomper eats a dot trail chased by bots, over features set in maze rooms. CSS only.",
    keywords: [...base, "arcade features section", "retro game landing page", "maze animation", "features section"],
  },
  "features/bento": {
    title: "Neobrutalism Bento Grid Features for React",
    description:
      "A neobrutalism bento grid features section for React and Tailwind CSS: one big lead tile and five smaller ones in soft tints. Copy the code.",
    keywords: [...base, "bento grid", "bento features", "features section", "React bento grid"],
  },
  "features/flappy": {
    title: "Flappy Bird Style Features Section for React",
    description:
      "A playful features section for React and Tailwind CSS: features on pink pipe cards with a bird flapping through the gap. CSS only. Copy it.",
    keywords: [...base, "flappy features section", "game features section", "animated features section", "playful landing page"],
  },
  "features/levels": {
    title: "Level Select Features Section for React",
    description:
      "A level select features section for React and Tailwind CSS: arcade level tiles with pixel bevels, star ratings, and a start marker. Copy it.",
    keywords: [...base, "level select UI", "game features section", "pixel art features", "features section"],
  },
  "hero/pixel": {
    title: "Pixel Art AI Prompt Hero for React",
    description:
      "A pixel art AI prompt hero for React and Tailwind CSS: an arcade-style prompt box over falling Tetris blocks, with Enter to send. Copy the code.",
    keywords: [...base, "pixel art hero", "retro hero section", "AI prompt hero", "8-bit UI", "tetris animation"],
  },
  "hero/blocks": {
    title: "Tetris-Style Hero Section for React",
    description:
      "A neobrutalism hero for React and Tailwind CSS: a headline of letter tiles that drop into place over falling Tetris-style blocks. CSS only. Copy it.",
    keywords: [...base, "tetris hero section", "pixel hero section", "animated hero", "retro landing page", "CSS animation"],
  },
  "hero/platformer": {
    title: "Retro Platformer Hero Section for React",
    description:
      "A neobrutalism retro platformer hero for React and Tailwind CSS: bonus blocks that pop coins, a live HUD, pipes, clouds, and a pixel mascot.",
    keywords: [...base, "platformer hero section", "8-bit hero", "retro game landing page", "pixel art hero", "game UI"],
  },
  "hero/maze": {
    title: "Arcade Maze Hero Section for React",
    description:
      "An arcade maze hero for React and Tailwind CSS: corridors where a chomper eats a dot trail chased by bots, around a READY! headline. CSS only.",
    keywords: [...base, "arcade hero section", "retro game hero", "maze animation", "game landing page", "React hero"],
  },
  "hero/flappy": {
    title: "Flappy Hero Section with Scrolling Pipes",
    description:
      "A neobrutalism hero for React and Tailwind CSS: endlessly scrolling pipes, a flapping bird, and a big outlined headline. CSS only. Copy the code.",
    keywords: [...base, "flappy hero section", "animated hero section", "game landing page", "CSS animation", "React hero"],
  },
  "pricing/classic": {
    title: "Neobrutalism Pricing Table for React",
    description:
      "A neobrutalism pricing section for React and Tailwind CSS: three plans in a ruled table, a monthly/yearly switch, and a highlighted tier.",
    keywords: [...base, "pricing table", "pricing section", "React pricing component", "SaaS pricing page"],
  },
  "pricing/bold": {
    title: "Color Block Pricing Cards for React",
    description:
      "Bold neobrutalism pricing cards for React and Tailwind CSS: full-color orange, lime, and pink plans, thick borders, hard shadows, and a billing switch.",
    keywords: [...base, "pricing cards", "colorful pricing section", "neobrutalism pricing", "SaaS pricing page", "React pricing"],
  },
  "pricing/whack": {
    title: "Whack-a-Mole Pricing Section for React",
    description:
      "A playful neobrutalism pricing section for React and Tailwind CSS: plans held up by moles popping out of holes, a crowned gold mole, and a billing switch.",
    keywords: [...base, "playful pricing section", "game pricing page", "animated pricing cards", "React pricing", "whack a mole"],
  },
  "footer/classic": {
    title: "Neobrutalism Newsletter Footer for React",
    description:
      "A neobrutalism footer for React and Tailwind CSS: a newsletter signup and three labelled columns of links in a ruled grid. Responsive and accessible.",
    keywords: [...base, "footer section", "website footer", "newsletter footer", "React footer"],
  },
  "footer/comic": {
    title: "Comic Book Footer Section for React",
    description:
      "A comic-book footer for React and Tailwind CSS: a \"The end?\" newsletter panel, a brand panel with a starburst, and link columns as comic panels.",
    keywords: [...base, "comic footer", "playful footer section", "newsletter footer", "React footer"],
  },
  "footer/bold": {
    title: "Colorful Dark Footer Section for React",
    description:
      "A bold footer for React and Tailwind CSS: bright lime, pink, and blue on dark ink, a newsletter signup, link columns, and a giant multicolor wordmark.",
    keywords: [...base, "dark footer", "colorful footer section", "newsletter footer", "React footer"],
  },
  "hero/jungle": {
    title: "Jungle Runner Hero Section for React",
    description:
      "A playful hero for React and Tailwind CSS: a monkey runs through a parallax jungle and leaps for bananas, under a big headline. CSS only, no JavaScript.",
    keywords: [...base, "jungle hero section", "game landing page", "parallax hero", "animated hero section", "React hero"],
  },
  "hero/comic": {
    title: "Comic Book Hero Section for React",
    description:
      "A comic-book cover hero for React and Tailwind CSS: speed-line sunburst, halftone dots, a KA-BOOM! starburst headline, and a speech bubble pitch.",
    keywords: [...base, "comic hero section", "comic book landing page", "playful hero", "animated hero section", "React hero"],
  },
  "hero/dino": {
    title: "Dino Runner Hero Section for React",
    description:
      "A neobrutalism hero for React and Tailwind CSS: a dino runs and jumps cacti on canvas behind a letter-tile headline and shadowed subheading.",
    keywords: [...base, "dino game hero", "animated canvas hero", "game landing page", "endless runner hero", "React hero"],
  },
};

export function variantSeo(section: { slug: string; name: string }, variant: { id: string; name: string }): SeoCopy {
  return (
    variantCopy[`${section.slug}/${variant.id}`] ?? {
      title: `Neobrutalism ${variant.name} ${section.name} for React`,
      description: `A neobrutalism ${variant.name.toLowerCase()} ${section.name.toLowerCase()} section for React and Tailwind CSS: responsive, accessible, and ready to copy into your landing page.`,
      keywords: [...base, `${variant.name.toLowerCase()} ${section.name.toLowerCase()} section`, "landing page section"],
    }
  );
}

/** Each lab targets what people search for when building that effect. */
const labCopy: Record<string, SeoCopy> = {
  dice: {
    title: "3D Dice Roller in React and CSS",
    description:
      "A 3D dice roller built with React and CSS transforms: a preserve-3d cube that tumbles and lands on a random face. Accessible, with full source code.",
    keywords: ["3D dice roller", "dice roll animation", "React dice", "CSS 3D cube", "random dice React"],
  },
  magnetic: {
    title: "Magnetic Button Effect in React",
    description:
      "A magnetic button effect in React: the button drifts toward the cursor and springs back. Mouse-only, respects reduced motion, full source code.",
    keywords: ["magnetic button", "magnetic hover effect", "React cursor effect", "button hover animation"],
  },
  wobble: {
    title: "Wobble Text Hover Animation in CSS",
    description:
      "A wobble text hover animation in pure CSS: staggered transitions make each letter wave. No JavaScript, screen-reader friendly, full source code.",
    keywords: ["wobble text", "text hover animation", "CSS letter animation", "staggered animation"],
  },
  "tic-tac-toe": {
    title: "Tic-Tac-Toe Game in React with Unbeatable AI",
    description:
      "A tic-tac-toe game in React with an unbeatable minimax AI, an easy mode, and two-player play. Keyboard accessible, with full source code.",
    keywords: ["tic-tac-toe React", "tic tac toe game", "minimax algorithm", "unbeatable tic-tac-toe AI", "React game"],
  },
  memory: {
    title: "Memory Card Game in React and CSS",
    description:
      "A memory match card game in React with 3D CSS card flips, an unbiased shuffle, move counting, and screen-reader announcements. Full source code.",
    keywords: ["memory card game", "memory match React", "card flip animation", "CSS 3D flip", "React game"],
  },
  flappy: {
    title: "Flappy Bird Game in React and Canvas",
    description:
      "A neo-brutalist Flappy Bird clone in React with a 60fps canvas, tested physics, and keyboard and touch controls. With the full source code.",
    keywords: ["flappy bird React", "flappy bird clone", "canvas game React", "React game", "HTML5 game"],
  },
  maze: {
    title: "Maze Chase Game in React: Dots and Bots",
    description:
      "An arcade maze chase game in React: eat the dots, dodge three bots with different chase rules, and flip them with power pellets. Full source code.",
    keywords: ["maze game React", "arcade maze game", "arcade game React", "browser maze game", "React game"],
  },
  jumper: {
    title: "Platformer Game in React: Run, Jump, Stomp",
    description:
      "A retro side-scrolling platformer in React and canvas: coyote time, a jump buffer, coin blocks, walkers, pits, and a flag. Full source code.",
    keywords: ["platformer game React", "retro platformer", "side scroller React", "canvas game React", "React game"],
  },
  pinball: {
    title: "Pinball Game in React and Canvas",
    description:
      "Neobrutalism pinball in React and canvas: rollover lanes, drop targets, a score multiplier, ball save, and flippers that pass on their swing. Source included.",
    keywords: ["pinball game React", "canvas pinball", "pinball physics JavaScript", "React game", "browser pinball"],
  },
  hammer: {
    title: "Hammer Cursor Animation in React and CSS",
    description:
      "A neobrutalism mallet cursor in React: click to swing it from the handle and drive nails into a plank, with bursts, sound, and keyboard support.",
    keywords: ["hammer cursor", "custom cursor React", "CSS swing animation", "mallet animation", "React UI experiment"],
  },
  radio: {
    title: "Retro 3D Radio in React and CSS",
    description:
      "A 90s boombox in pure CSS 3D for React: tilt it, power it on, and tune four synthesized chiptune stations out of the static. Keyboard friendly.",
    keywords: ["retro radio React", "CSS 3D boombox", "Web Audio radio", "90s radio UI", "React UI experiment"],
  },
  "screen-buddy": {
    title: "Cute 3D Device Mascot in React and CSS",
    description:
      "A cute 3D device mascot for React: a rounded cube with a glowing bezel whose screen eyes blink and change mood, or show any icon or SVG.",
    keywords: ["cute mascot React", "CSS 3D device", "emoji screen animation", "animated mascot component", "React UI experiment"],
  },
  ghost: {
    title: "3D Arcade Ghost Animation in React and CSS",
    description:
      "A cute 3D arcade-style ghost for React: it floats with a rippling hem, follows the pointer with its eyes, and turns blue when you tap it.",
    keywords: ["arcade ghost animation", "3D ghost CSS", "cute ghost React", "eyes follow cursor", "React UI experiment"],
  },
  bear: {
    title: "Bonk the Bear: Hammer Cursor Game in React",
    description:
      "A playful React game: your cursor is a mallet, and bonking the cartoon bear's head gives X-eyes, dizzy stars, and a bump. Keyboard and touch friendly.",
    keywords: ["hammer cursor game", "bonk game React", "custom cursor React", "cartoon bear animation", "React UI experiment"],
  },
  "whack-a-mole": {
    title: "Whack-a-Mole Game in React",
    description:
      "A neobrutalism whack-a-mole game in React: moles that speed up, gold moles, bombs, and a combo multiplier. Mouse, touch, and keyboard, source included.",
    keywords: ["whack a mole React", "React whack-a-mole game", "browser whack a mole", "neobrutalism game", "React game"],
  },
  runner: {
    title: "Dino Runner Game in React and Canvas",
    description:
      "A neobrutalism endless runner in React and canvas: jump cacti, duck flyers, parallax scenery, and rising speed. Keyboard and touch, source included.",
    keywords: ["dino game React", "endless runner React", "canvas runner game", "browser dino game", "React game"],
  },
  tetris: {
    title: "Tetris Game in React: Neobrutalism Blocks",
    description:
      "A Tetris game in React with neobrutalism blocks: ghost piece, next-piece preview, wall kicks, and classic scoring. Keyboard and touch, full source.",
    keywords: ["tetris React", "React tetris game", "tetris clone", "browser tetris", "neobrutalism game", "React game"],
  },
  snake: {
    title: "Snake Game in React: Classic, Funky, Pixel",
    description:
      "A snake game in React with three styles: classic, funky, and pixelated. Keyboard, swipe, and on-screen controls, with the full source code.",
    keywords: ["snake game React", "React snake game", "pixel art game", "browser snake game", "React game"],
  },
  "shape-roller": {
    title: "Random Shape Generator in React",
    description:
      "A random shape generator in React: each roll picks a new shape, color, and rotation in a neobrutalism style. Hydration-safe, with full source code.",
    keywords: ["random shape generator", "React randomizer", "neobrutalism shapes", "generative UI"],
  },
};

export function labSeo(doc: { slug: string; name: string; description: string }): SeoCopy {
  return (
    labCopy[doc.slug] ?? {
      title: `${doc.name}: React UI Experiment`,
      description: doc.description,
      keywords: ["React UI experiment", "CSS animation"],
    }
  );
}

/** Appended to page titles by the template in app/layout.tsx. */
export const titleSuffix = " · stream/ui";

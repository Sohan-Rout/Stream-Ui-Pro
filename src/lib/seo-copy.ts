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
    title: "2,000+ Animated Icons for React",
    description:
      "Search 2,000+ animated icons for React. Add draw, spin, bounce, and wiggle animations, set size and stroke, and copy the JSX. Free and open source.",
    keywords: ["animated icons", "React animated icons", "animated SVG icons", "icon animation", "Lucide icons", "React icons"],
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
      "stream/ui is a free, MIT-licensed neobrutalism UI library. Sponsor it through Razorpay, Open Collective, or Ko-fi to fund new components and docs.",
    keywords: ["sponsor open source", "stream/ui", "neobrutalism UI library"],
  },
} satisfies Record<string, SeoCopy>;

/** Components whose name doesn't read well after "Neobrutalism". */
const componentOverrides: Record<string, SeoCopy> = {
  "animated-icon": {
    title: "Animated Icon Component for React",
    description:
      "Animate any SVG icon in React: draw, spin, bounce, wiggle, pulse, shake, or pop on hover, on a loop, or once. Pure CSS, reduced-motion safe.",
    keywords: ["animated icon", "React animated icon", "SVG icon animation", "animated Lucide icons", "CSS icon animation"],
  },
};

export function componentSeo(doc: { slug: string; name: string }): SeoCopy {
  const override = componentOverrides[doc.slug];
  if (override) return override;
  const lower = doc.name.toLowerCase();
  return {
    title: `Neobrutalism ${doc.name} Component for React`,
    description: `A neobrutalism ${lower} component for React and Tailwind CSS v4: hard borders, offset shadows, every state styled, and accessible by default.`,
    keywords: [...base, `neobrutalism ${lower}`, `React ${lower} component`, `Tailwind ${lower}`, `brutalist ${lower}`],
  };
}

export function sectionSeo(doc: { slug: string; name: string }): SeoCopy {
  const label = doc.slug === "faq" ? "FAQ" : doc.name.toLowerCase();
  return {
    title: `Neobrutalism ${doc.name} Section for React`,
    description: `A neobrutalism ${label} section for React and Tailwind CSS: responsive, accessible, and built from stream/ui components. Copy it into your landing page.`,
    keywords: [...base, `neobrutalism ${label} section`, `${label} section`, "landing page section", `React ${label}`],
  };
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

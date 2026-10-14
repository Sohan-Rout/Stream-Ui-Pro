import type { ComponentType } from "react";
import type { PropRow } from "@/components/docs/PropsTable";

import ButtonVariants from "@/examples/button/variants";
import ButtonSizes from "@/examples/button/sizes";
import ButtonWithIcons from "@/examples/button/with-icons";
import ButtonAsLink from "@/examples/button/as-link";
import BadgeTones from "@/examples/badge/tones";
import BadgeWithIcon from "@/examples/badge/with-icon";
import SwitchBasic from "@/examples/switch/basic";
import SwitchControlled from "@/examples/switch/controlled";
import InputBasic from "@/examples/input/basic";
import InputWithIcon from "@/examples/input/with-icon";
import InputStates from "@/examples/input/states";
import CheckboxBasic from "@/examples/checkbox/basic";
import CheckboxGroup from "@/examples/checkbox/group";
import TabsBasic from "@/examples/tabs/basic";
import ProgressTones from "@/examples/progress/tones";
import ProgressInteractive from "@/examples/progress/interactive";
import AvatarSizes from "@/examples/avatar/sizes";
import AvatarGroupExample from "@/examples/avatar/group";

export type ExampleEntry = {
  title: string;
  description?: string;
  file: string;
  Component: ComponentType;
};

export type ComponentDoc = {
  slug: string;
  name: string;
  description: string;
  status: "stable" | "beta";
  /** Source of the primitive itself, shown on its page. */
  file: string;
  usage: string;
  examples: ExampleEntry[];
  props: { caption?: string; rows: PropRow[] }[];
  accessibility: string[];
};

const ex = (slug: string, name: string) => `src/examples/${slug}/${name}.tsx`;

export const components: ComponentDoc[] = [
  {
    slug: "button",
    name: "Button",
    description:
      "The primary way to trigger an action. Lifts on hover and sinks into its shadow on press. Also available as a class helper for links.",
    status: "stable",
    file: "src/components/ui/Button.tsx",
    usage: `import { Button } from "@/components/ui/Button";

<Button variant="primary" size="md">Save changes</Button>`,
    examples: [
      { title: "Variants", file: ex("button", "variants"), Component: ButtonVariants },
      { title: "Sizes", description: "Icon buttons need an aria-label.", file: ex("button", "sizes"), Component: ButtonSizes },
      { title: "With icons", description: "Icons size themselves; mark them aria-hidden.", file: ex("button", "with-icons"), Component: ButtonWithIcons },
      {
        title: "As a link",
        description: "Navigation should be a link, not a button. buttonStyles() gives a link the same look.",
        file: ex("button", "as-link"),
        Component: ButtonAsLink,
      },
    ],
    props: [
      {
        caption: "Button",
        rows: [
          { name: "variant", type: '"primary" | "secondary" | "blue" | "pink"', default: '"primary"', description: "Fill color." },
          { name: "size", type: '"sm" | "md" | "lg" | "icon"', default: '"md"', description: "Height and padding. icon is a square for a single glyph." },
          { name: "type", type: '"button" | "submit" | "reset"', default: '"button"', description: "Defaults to button so it never submits a form by accident." },
          { name: "className", type: "string", description: "Merged last, so it can override any default class." },
          { name: "...props", type: 'ComponentProps<"button">', description: "Every native button attribute." },
        ],
      },
      {
        caption: "buttonStyles(options)",
        rows: [
          { name: "variant", type: "ButtonVariant", default: '"primary"', description: "Same as Button." },
          { name: "size", type: "ButtonSize", default: '"md"', description: "Same as Button." },
          { name: "className", type: "string", description: "Extra classes merged last." },
        ],
      },
    ],
    accessibility: [
      "Renders a native <button>, so Enter and Space work and it is announced as a button.",
      "Focus shows a 3px blue ring; hover and press are motion only and are removed under reduced motion.",
      "Disabled buttons drop out of pointer interaction and render at 50% opacity.",
    ],
  },
  {
    slug: "badge",
    name: "Badge",
    description: "A compact label for status, category, or counts.",
    status: "stable",
    file: "src/components/ui/Badge.tsx",
    usage: `import { Badge } from "@/components/ui/Badge";

<Badge tone="lime">stable</Badge>`,
    examples: [
      { title: "Tones", file: ex("badge", "tones"), Component: BadgeTones },
      { title: "With icon or dot", file: ex("badge", "with-icon"), Component: BadgeWithIcon },
    ],
    props: [
      {
        rows: [
          { name: "tone", type: '"lime" | "pink" | "blue" | "violet" | "orange" | "paper"', default: '"lime"', description: "Fill color." },
          { name: "className", type: "string", description: "Merged last." },
          { name: "...props", type: 'ComponentProps<"span">', description: "Every native span attribute." },
        ],
      },
    ],
    accessibility: [
      "Color is never the only signal: the badge text carries the meaning.",
      "Decorative icons and dots inside a badge should be aria-hidden.",
    ],
  },
  {
    slug: "switch",
    name: "Switch",
    description: "An on/off toggle for settings that apply immediately. Works controlled or uncontrolled.",
    status: "stable",
    file: "src/components/ui/Switch.tsx",
    usage: `import { Switch } from "@/components/ui/Switch";

<span id="alerts">Email alerts</span>
<Switch aria-labelledby="alerts" defaultChecked />`,
    examples: [
      { title: "Basic", file: ex("switch", "basic"), Component: SwitchBasic },
      { title: "Controlled", description: "Pass checked and onCheckedChange to own the state.", file: ex("switch", "controlled"), Component: SwitchControlled },
    ],
    props: [
      {
        rows: [
          { name: "checked", type: "boolean", description: "Controlled state. Omit to let the switch manage itself." },
          { name: "defaultChecked", type: "boolean", default: "false", description: "Initial state when uncontrolled." },
          { name: "onCheckedChange", type: "(checked: boolean) => void", description: "Called with the new state on every toggle." },
          { name: "disabled", type: "boolean", default: "false", description: "Blocks interaction." },
          { name: "...props", type: 'ComponentProps<"button">', description: "Native button attributes, e.g. aria-labelledby." },
        ],
      },
    ],
    accessibility: [
      'Uses role="switch" with aria-checked, so screen readers announce "on" or "off".',
      "Needs an accessible name: aria-labelledby pointing at visible text, or aria-label.",
      "Space and Enter toggle it, like a native button.",
    ],
  },
  {
    slug: "input",
    name: "Input",
    description: "A single-line text field with an optional leading icon and an invalid state.",
    status: "stable",
    file: "src/components/ui/Input.tsx",
    usage: `import { Input } from "@/components/ui/Input";

<label htmlFor="email">Email</label>
<Input id="email" type="email" />`,
    examples: [
      { title: "Basic", file: ex("input", "basic"), Component: InputBasic },
      { title: "With icon", file: ex("input", "with-icon"), Component: InputWithIcon },
      { title: "Invalid and disabled", file: ex("input", "states"), Component: InputStates },
    ],
    props: [
      {
        rows: [
          { name: "icon", type: "ReactNode", description: "Leading icon. Rendered aria-hidden." },
          { name: "invalid", type: "boolean", default: "false", description: "Sets aria-invalid and tints the field pink." },
          { name: "frameClassName", type: "string", description: "Classes for the outer frame (border, width)." },
          { name: "className", type: "string", description: "Classes for the <input> element itself." },
          { name: "...props", type: 'ComponentProps<"input">', description: "Every native input attribute." },
        ],
      },
    ],
    accessibility: [
      "Always pair with a <label>; use sr-only on it when the design has no visible label.",
      "When invalid, link the error message with aria-describedby so it is read on focus.",
      "The frame shows the focus ring, since the input itself has no visible outline.",
    ],
  },
  {
    slug: "checkbox",
    name: "Checkbox",
    description: "A native checkbox with a hard-edged face. Fully compatible with forms.",
    status: "stable",
    file: "src/components/ui/Checkbox.tsx",
    usage: `import { Checkbox } from "@/components/ui/Checkbox";

<Checkbox name="terms" label="I agree to the terms" />`,
    examples: [
      { title: "Basic", file: ex("checkbox", "basic"), Component: CheckboxBasic },
      { title: "Group", description: "Wrap related options in a fieldset with a legend.", file: ex("checkbox", "group"), Component: CheckboxGroup },
    ],
    props: [
      {
        rows: [
          { name: "label", type: "ReactNode", description: "Visible label. The whole row is clickable." },
          { name: "checked / defaultChecked", type: "boolean", description: "Controlled or uncontrolled state, like a native input." },
          { name: "onChange", type: "ChangeEventHandler<HTMLInputElement>", description: "Native change handler." },
          { name: "className", type: "string", description: "Classes for the outer <label>." },
          { name: "...props", type: 'Omit<ComponentProps<"input">, "type">', description: "Native input attributes such as name and value." },
        ],
      },
    ],
    accessibility: [
      "The real <input> stays in the DOM, visually hidden, so keyboard and assistive tech work natively.",
      "The visible box mirrors the input's focus ring through peer-focus-visible.",
    ],
  },
  {
    slug: "tabs",
    name: "Tabs",
    description: "Switch between related panels of content without leaving the page.",
    status: "beta",
    file: "src/components/ui/Tabs.tsx",
    usage: `import { Tabs } from "@/components/ui/Tabs";

<Tabs
  label="Project"
  items={[
    { id: "overview", label: "Overview", content: <p>…</p> },
    { id: "activity", label: "Activity", content: <p>…</p> },
  ]}
/>`,
    examples: [{ title: "Basic", description: "Use the arrow keys, Home, and End to move between tabs.", file: ex("tabs", "basic"), Component: TabsBasic }],
    props: [
      {
        rows: [
          { name: "items", type: "{ id: string; label: ReactNode; content: ReactNode }[]", description: "Tabs in order. id must be unique." },
          { name: "label", type: "string", description: "Accessible name for the tab list. Required." },
          { name: "defaultIndex", type: "number", default: "0", description: "Tab selected on first render." },
          { name: "className", type: "string", description: "Classes for the wrapper." },
        ],
      },
    ],
    accessibility: [
      "Follows the WAI-ARIA tabs pattern: tablist, tab, and tabpanel roles wired with ids.",
      "Only the selected tab is in the tab order; arrow keys move and select.",
      "Panels are focusable so their content can be reached right after the tab list.",
    ],
  },
  {
    slug: "progress",
    name: "Progress",
    description: "Shows how far along a task or quota is.",
    status: "stable",
    file: "src/components/ui/Progress.tsx",
    usage: `import { Progress } from "@/components/ui/Progress";

<Progress value={60} aria-label="Upload" />`,
    examples: [
      { title: "Tones", file: ex("progress", "tones"), Component: ProgressTones },
      { title: "Steps", description: "Use max for anything that isn't a percentage.", file: ex("progress", "interactive"), Component: ProgressInteractive },
    ],
    props: [
      {
        rows: [
          { name: "value", type: "number", description: "Current value. Clamped between 0 and max." },
          { name: "max", type: "number", default: "100", description: "Value that means complete." },
          { name: "tone", type: '"lime" | "pink" | "blue" | "violet" | "orange"', default: '"pink"', description: "Fill color." },
          { name: "...props", type: 'ComponentProps<"div">', description: "Native attributes; pass aria-label or aria-labelledby." },
        ],
      },
    ],
    accessibility: [
      'Uses role="progressbar" with aria-valuenow, aria-valuemin, and aria-valuemax.',
      "Give it a name with aria-label or aria-labelledby.",
      "The fill animates width only when motion is allowed.",
    ],
  },
  {
    slug: "avatar",
    name: "Avatar",
    description: "Initials in a toned circle, plus a group that overlaps them.",
    status: "beta",
    file: "src/components/ui/Avatar.tsx",
    usage: `import { Avatar, AvatarGroup } from "@/components/ui/Avatar";

<Avatar initials="AL" name="Ada Lovelace" />`,
    examples: [
      { title: "Sizes", file: ex("avatar", "sizes"), Component: AvatarSizes },
      { title: "Group", file: ex("avatar", "group"), Component: AvatarGroupExample },
    ],
    props: [
      {
        caption: "Avatar",
        rows: [
          { name: "initials", type: "string", description: "One or two characters." },
          { name: "name", type: "string", description: "Full name, announced instead of the initials." },
          { name: "tone", type: 'Tone | "paper"', default: '"lime"', description: "Fill color." },
          { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Diameter." },
        ],
      },
      {
        caption: "AvatarGroup",
        rows: [{ name: "...props", type: 'ComponentProps<"div">', description: 'Renders role="group"; give it an aria-label.' }],
      },
    ],
    accessibility: [
      'With a name, the avatar is role="img" and reads the full name instead of the initials.',
      'AvatarGroup is a role="group", so an aria-label describes the whole stack.',
    ],
  },
];

export function getComponent(slug: string) {
  return components.find((c) => c.slug === slug);
}

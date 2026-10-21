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
import BatteryLevels from "@/examples/battery/levels";
import ComicBadgeShapes from "@/examples/comic-badge/shapes";
import ComicButtonShapes from "@/examples/comic-button/shapes";
import ComicCardBasic from "@/examples/comic-card/basic";
import ComicAlertTones from "@/examples/comic-alert/tones";
import ComicAlertActions from "@/examples/comic-alert/actions";
import ComicCardTones from "@/examples/comic-card/tones";
import ComicButtonSizes from "@/examples/comic-button/sizes";
import ComicBadgeTonesSizes from "@/examples/comic-badge/tones-sizes";
import ComicBadgeAnimated from "@/examples/comic-badge/animated";
import BatterySegments from "@/examples/battery/segments";
import BatteryInteractive from "@/examples/battery/interactive";
import AvatarSizes from "@/examples/avatar/sizes";
import AvatarGroupExample from "@/examples/avatar/group";
import AnimatedIconAnimations from "@/examples/animated-icon/animations";
import AnimatedIconTriggers from "@/examples/animated-icon/triggers";
import AnimatedIconInButton from "@/examples/animated-icon/in-button";
import CardBasic from "@/examples/card/basic";
import CardTones from "@/examples/card/tones";
import AlertTones from "@/examples/alert/tones";
import AlertWithAction from "@/examples/alert/with-action";
import TextareaBasic from "@/examples/textarea/basic";
import TextareaStates from "@/examples/textarea/states";
import SelectBasic from "@/examples/select/basic";
import SelectStates from "@/examples/select/states";
import RadioGroupBasic from "@/examples/radio-group/basic";
import RadioGroupHorizontal from "@/examples/radio-group/horizontal";
import AccordionBasic from "@/examples/accordion/basic";
import AccordionExclusive from "@/examples/accordion/exclusive";
import DialogBasic from "@/examples/dialog/basic";
import DialogForm from "@/examples/dialog/form";
import TooltipBasic from "@/examples/tooltip/basic";
import SkeletonBasic from "@/examples/skeleton/basic";
import SkeletonCard from "@/examples/skeleton/card";
import SliderBasic from "@/examples/slider/basic";
import SliderTones from "@/examples/slider/tones";
import AudioPlayerFull from "@/examples/audio-player/full";
import AudioPlayerMini from "@/examples/audio-player/mini";
import AudioPlayerHeadless from "@/examples/audio-player/headless";
import TrackListBasic from "@/examples/track-list/basic";
import EqualizerBasic from "@/examples/equalizer/basic";
import ComicTabsBasic from "@/examples/comic-tabs/basic";
import ComicAccordionBasic from "@/examples/comic-accordion/basic";
import ComicAccordionExclusive from "@/examples/comic-accordion/exclusive";
import ComicDialogBasic from "@/examples/comic-dialog/basic";
import ComicDialogForm from "@/examples/comic-dialog/form";
import ComicTooltipBasic from "@/examples/comic-tooltip/basic";
import ComicInputBasic from "@/examples/comic-input/basic";
import ComicInputStates from "@/examples/comic-input/states";
import ComicTextareaBasic from "@/examples/comic-textarea/basic";
import ComicTextareaStates from "@/examples/comic-textarea/states";
import ComicSelectBasic from "@/examples/comic-select/basic";
import ComicSelectStates from "@/examples/comic-select/states";
import ComicCheckboxBasic from "@/examples/comic-checkbox/basic";
import ComicCheckboxGroup from "@/examples/comic-checkbox/group";
import ComicRadioGroupBasic from "@/examples/comic-radio-group/basic";
import ComicRadioGroupHorizontal from "@/examples/comic-radio-group/horizontal";
import ComicSwitchBasic from "@/examples/comic-switch/basic";
import ComicSwitchControlled from "@/examples/comic-switch/controlled";
import ComicSliderBasic from "@/examples/comic-slider/basic";
import ComicSliderTones from "@/examples/comic-slider/tones";

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

const entries: ComponentDoc[] = [
  {
    slug: "button",
    name: "Button",
    description:
      "The primary way to trigger an action. Lifts on hover and sinks into its shadow on press. Also available as a class helper for links.",
    status: "stable",
    file: "packages/react/src/Button.tsx",
    usage: `import { Button } from "@streamuilib/react";

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
    file: "packages/react/src/Badge.tsx",
    usage: `import { Badge } from "@streamuilib/react";

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
    file: "packages/react/src/Switch.tsx",
    usage: `import { Switch } from "@streamuilib/react";

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
    file: "packages/react/src/Input.tsx",
    usage: `import { Input } from "@streamuilib/react";

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
    file: "packages/react/src/Checkbox.tsx",
    usage: `import { Checkbox } from "@streamuilib/react";

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
    file: "packages/react/src/Tabs.tsx",
    usage: `import { Tabs } from "@streamuilib/react";

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
    file: "packages/react/src/Progress.tsx",
    usage: `import { Progress } from "@streamuilib/react";

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
    slug: "comic-alert",
    name: "Comic Alert",
    description: "A comic-book alert: a speech bubble pointing at a starburst, with a shouty title and a stamped sound effect.",
    status: "beta",
    file: "packages/react/src/ComicAlert.tsx",
    usage: `import { ComicAlert } from "@streamuilib/react";

<ComicAlert tone="success" title="Changes saved">Your profile is up to date.</ComicAlert>`,
    examples: [
      { title: "Tones", description: "Each tone has its icon, colors, and sound effect: HEY!, YES!, UH-OH!, YIKES! Warnings and errors shake the burst.", file: ex("comic-alert", "tones"), Component: ComicAlertTones },
      { title: "Actions, icons, and sound effects", description: "Add actions, swap the icon, set your own sound effect or turn it off. Replay remounts it to see the pop-in again.", file: ex("comic-alert", "actions"), Component: ComicAlertActions },
    ],
    props: [
      {
        rows: [
          { name: "tone", type: '"info" | "success" | "warning" | "danger"', default: '"info"', description: "Colors, icon, sound effect, and urgency." },
          { name: "title", type: "ReactNode", description: "The shouty heading in the bubble." },
          { name: "icon", type: "ReactNode | null", description: "Replaces the tone's icon in the starburst; null drops the starburst and tail." },
          { name: "action", type: "ReactNode", description: "Buttons or links under the message." },
          { name: "sfx", type: "ReactNode | false", default: "by tone", description: "The stamped sound effect; false for none." },
          { name: "...props", type: 'Omit<ComponentProps<"div">, "title">', description: "Native attributes; pass role to override the default." },
        ],
      },
    ],
    accessibility: [
      'Warnings and errors use role="alert" so they\'re announced right away; info and success use role="status", the same as Alert.',
      "The starburst, tail, and sound effect are decorative and hidden; the title and message are the content.",
      "The pop-in and shake stop when the user prefers reduced motion.",
    ],
  },
  {
    slug: "comic-card",
    name: "Comic Card",
    description: "A comic-book panel: a skewed card with halftone dots, a narration caption, and a starburst sound effect.",
    status: "beta",
    file: "packages/react/src/ComicCard.tsx",
    usage: `import { CardDescription, CardTitle, ComicCard } from "@streamuilib/react";

<ComicCard caption="Meanwhile…" sfx="Kapow!">
  <CardTitle>Deploys ship in seconds</CardTitle>
  <CardDescription>Every pull request gets a live URL.</CardDescription>
</ComicCard>`,
    examples: [
      { title: "Captions and sound effects", description: "Hover a panel: it lifts and its sound effect jumps. CardTitle and CardDescription work inside.", file: ex("comic-card", "basic"), Component: ComicCardBasic },
      { title: "Tones", file: ex("comic-card", "tones"), Component: ComicCardTones },
    ],
    props: [
      {
        rows: [
          { name: "tone", type: '"paper" | "lime" | "pink" | "blue" | "violet" | "orange"', default: '"paper"', description: "Panel fill (a soft tint); the caption uses the matching bright." },
          { name: "caption", type: "ReactNode", description: "A narration box stuck over the top-left corner." },
          { name: "sfx", type: "ReactNode", description: "A starburst sound effect stuck on the top-right corner. Keep it to a word." },
          { name: "halftone", type: "boolean", default: "true", description: "Print-style halftone dots over the fill." },
          { name: "tilt", type: "number", default: "-1", description: "Rotation in degrees. 0 keeps it level." },
          { name: "...props", type: 'ComponentProps<"div">', description: "Native attributes; children go inside the panel." },
        ],
      },
    ],
    accessibility: [
      "The panel shape is decorative and hidden; the caption, sound effect, and contents are plain text in reading order.",
      "Use CardTitle with the heading level that fits your page (as=\"h2\" and so on).",
      "The hover lift and burst animation stop when the user prefers reduced motion.",
    ],
  },
  {
    slug: "comic-button",
    name: "Comic Button",
    description: "A comic-book button that lifts, slams into its shadow, and pops a POW! when you click it.",
    status: "beta",
    file: "packages/react/src/ComicButton.tsx",
    usage: `import { ComicButton } from "@streamuilib/react";

<ComicButton onClick={save}>Get started</ComicButton>`,
    examples: [
      { title: "Shapes", description: "A skewed panel (the default, for any label), a speech bubble, a ribbon, and round burst, splat, and blob shapes for one-word calls.", file: ex("comic-button", "shapes"), Component: ComicButtonShapes },
      { title: "Sizes, icons, and options", description: "Set your own pop word, turn the pop or the halftone dots off, or disable it.", file: ex("comic-button", "sizes"), Component: ComicButtonSizes },
    ],
    props: [
      {
        rows: [
          { name: "shape", type: '"panel" | "bubble" | "ribbon" | "burst" | "seal" | "splat" | "blob"', default: '"panel"', description: "The outline. panel, bubble, and ribbon grow with their label; the round ones are fixed-size for a word or two." },
          { name: "tone", type: '"lime" | "pink" | "blue" | "violet" | "orange" | "paper"', default: '"lime"', description: "Fill color." },
          { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Button and label size." },
          { name: "tilt", type: "number", default: "-2", description: "Rotation in degrees. 0 keeps it level." },
          { name: "pop", type: "string | string[] | false", default: '["POW!", "BAM!", "ZAP!", "WHAM!", "BOOM!"]', description: "The sound effect that pops out on click; a list cycles. false turns it off." },
          { name: "halftone", type: "boolean", default: "true", description: "Print-style halftone dots over the fill." },
          { name: "...props", type: 'ComponentProps<"button">', description: "Native button attributes, including onClick, type, and disabled." },
        ],
      },
    ],
    accessibility: [
      "It's a real <button> (type=\"button\" by default) with a visible focus ring, so Tab, Enter, and Space work.",
      "The shape and the POW! pop are decorative and hidden from screen readers; the label is the accessible name.",
      "The lift, press, and pop stop when the user prefers reduced motion.",
    ],
  },
  {
    slug: "comic-badge",
    name: "Comic Badge",
    description: "A comic-book sticker for short labels: a burst, seal, splat, blob, speech bubble, or ribbon.",
    status: "beta",
    file: "packages/react/src/ComicBadge.tsx",
    usage: `import { ComicBadge } from "@streamuilib/react";

<ComicBadge shape="burst">New!</ComicBadge>`,
    examples: [
      { title: "Shapes", description: "Six outlines, each with an ink stroke and a hard shadow that follow the shape.", file: ex("comic-badge", "shapes"), Component: ComicBadgeShapes },
      { title: "Tones and sizes", file: ex("comic-badge", "tones-sizes"), Component: ComicBadgeTonesSizes },
      { title: "Animated", description: "spin turns only the shape, so the text stays level; wiggle and pulse move the whole badge.", file: ex("comic-badge", "animated"), Component: ComicBadgeAnimated },
    ],
    props: [
      {
        rows: [
          { name: "shape", type: '"burst" | "seal" | "splat" | "blob" | "bubble" | "ribbon"', default: '"burst"', description: "The outline. burst, seal, splat, and blob are round and fixed-size; bubble and ribbon grow with their text." },
          { name: "tone", type: '"lime" | "pink" | "blue" | "violet" | "orange" | "paper"', default: '"lime"', description: "Fill color, the same tones as Badge." },
          { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Badge and text size." },
          { name: "tilt", type: "number", default: "-6", description: "Rotation in degrees, for a stuck-on-by-hand look. 0 keeps it level." },
          { name: "animate", type: '"none" | "spin" | "wiggle" | "pulse"', default: '"none"', description: "A looping animation. Stops for reduced motion." },
          { name: "...props", type: 'ComponentProps<"span">', description: "Native attributes." },
        ],
      },
    ],
    accessibility: [
      "It's plain inline text, so screen readers read the label; the shape is decorative and hidden.",
      "Keep labels short: round shapes fit a word or two (use <br /> for a second line).",
      "Looping animations stop when the user prefers reduced motion.",
    ],
  },
  {
    slug: "battery",
    name: "Battery",
    description: "A battery level that changes color as it drains, with charging and low states.",
    status: "beta",
    file: "packages/react/src/Battery.tsx",
    usage: `import { Battery } from "@streamuilib/react";

<Battery value={72} charging />`,
    examples: [
      { title: "Levels", description: 'With tone="auto" (the default) it goes orange at half and pink when low; low ones blink.', file: ex("battery", "levels"), Component: BatteryLevels },
      { title: "Segments, sizes, and tones", file: ex("battery", "segments"), Component: BatterySegments },
      { title: "Interactive", file: ex("battery", "interactive"), Component: BatteryInteractive },
    ],
    props: [
      {
        rows: [
          { name: "value", type: "number", description: "Charge from 0 to 100. Clamped and rounded." },
          { name: "charging", type: "boolean", default: "false", description: "Shows a bolt and sweeps stripes across the fill." },
          { name: "tone", type: '"auto" | "lime" | "pink" | "blue" | "violet" | "orange"', default: '"auto"', description: "Fill color. auto is pink at or below lowAt, orange at 50 or below, and lime above." },
          { name: "lowAt", type: "number", default: "20", description: "At or below this the battery reads as low, and blinks unless charging." },
          { name: "segments", type: "number", description: "Discrete cells instead of a smooth fill, lit to the nearest cell. Any charge lights at least one." },
          { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Battery and label size." },
          { name: "showValue", type: "boolean", default: "true", description: "Show the percentage next to the battery." },
          { name: "label", type: "string", default: '"Battery"', description: "Accessible name." },
          { name: "...props", type: 'ComponentProps<"div">', description: "Native attributes." },
        ],
      },
    ],
    accessibility: [
      'Uses role="meter" with aria-valuenow, aria-valuemin, and aria-valuemax, named by label.',
      'aria-valuetext reads the state too, for example "12%, low" or "72%, charging".',
      "Charging and low are shown with a bolt and the percentage as well as color and motion.",
      "The charging stripes and the low blink stop for reduced motion.",
    ],
  },
  {
    slug: "avatar",
    name: "Avatar",
    description: "Initials in a toned circle, plus a group that overlaps them.",
    status: "beta",
    file: "packages/react/src/Avatar.tsx",
    usage: `import { Avatar, AvatarGroup } from "@streamuilib/react";

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
  {
    slug: "animated-icon",
    name: "Animated Icon",
    description:
      "Wrap any SVG icon to animate it on hover, on a loop, or once on mount. Seven presets, pure CSS, and off under reduced motion.",
    status: "beta",
    file: "packages/react/src/AnimatedIcon.tsx",
    usage: `import { Rocket } from "lucide-react";
import { AnimatedIcon } from "@streamuilib/react";

<AnimatedIcon animation="bounce" trigger="hover">
  <Rocket aria-hidden />
</AnimatedIcon>`,
    examples: [
      {
        title: "Animations",
        description: "Hover a tile. draw traces the strokes; the rest move the whole glyph.",
        file: ex("animated-icon", "animations"),
        Component: AnimatedIconAnimations,
      },
      {
        title: "Triggers",
        description: "loop for busy states, once for confirmations, hover for everything else.",
        file: ex("animated-icon", "triggers"),
        Component: AnimatedIconTriggers,
      },
      {
        title: "Inside a button",
        description: "With the hover trigger, hovering or focusing the parent button plays the animation.",
        file: ex("animated-icon", "in-button"),
        Component: AnimatedIconInButton,
      },
    ],
    props: [
      {
        rows: [
          {
            name: "animation",
            type: '"draw" | "spin" | "bounce" | "wiggle" | "pulse" | "shake" | "pop"',
            description: "Which preset to play. Required.",
          },
          {
            name: "trigger",
            type: '"hover" | "loop" | "once"',
            default: '"hover"',
            description: "hover plays while the icon or its direct parent is hovered or focused.",
          },
          { name: "duration", type: "number", default: "700", description: "Length of one cycle in milliseconds." },
          { name: "children", type: "ReactNode", description: "The SVG icon to animate (lucide-react, react-icons, or your own)." },
          { name: "...props", type: 'ComponentProps<"span">', description: "Native span attributes for the wrapper." },
        ],
      },
    ],
    accessibility: [
      "Every animation stops under prefers-reduced-motion; the icon stays fully drawn and still.",
      "Animation is decoration: keep the icon aria-hidden and put the meaning in text or an aria-label.",
      "Avoid loop for anything that isn't an active process, like loading or syncing.",
    ],
  },
  {
    slug: "card",
    name: "Card",
    description: "A bordered surface with a hard shadow, composed from header, title, description, content, and footer parts.",
    status: "stable",
    file: "packages/react/src/Card.tsx",
    usage: `import { Card, CardContent, CardHeader, CardTitle } from "@streamuilib/react";

<Card>
  <CardHeader>
    <CardTitle>Pro plan</CardTitle>
  </CardHeader>
  <CardContent>…</CardContent>
</Card>`,
    examples: [
      { title: "Composed card", file: ex("card", "basic"), Component: CardBasic },
      { title: "Tones", description: "Soft tints keep large surfaces light.", file: ex("card", "tones"), Component: CardTones },
    ],
    props: [
      {
        caption: "Card",
        rows: [
          { name: "tone", type: '"paper" | "lime" | "pink" | "blue" | "violet" | "orange"', default: '"paper"', description: "Surface tint." },
          { name: "...props", type: 'ComponentProps<"div">', description: "Native div attributes." },
        ],
      },
      {
        caption: "CardTitle",
        rows: [{ name: "as", type: '"h2" | "h3" | "h4"', default: '"h3"', description: "Heading level, to fit your page outline." }],
      },
      {
        caption: "CardHeader, CardDescription, CardContent, CardFooter",
        rows: [{ name: "...props", type: "native element props", description: "Plain layout parts; className is merged last." }],
      },
    ],
    accessibility: [
      "CardTitle is a real heading, so cards show up in a screen reader's heading list. Pick the level that fits your page.",
      "A card is a plain container. If the whole card should be clickable, put one link inside and stretch its hit area rather than wrapping everything in a link.",
    ],
  },
  {
    slug: "alert",
    name: "Alert",
    description: "A message box for info, success, warnings, and errors, with an icon, title, and optional actions.",
    status: "stable",
    file: "packages/react/src/Alert.tsx",
    usage: `import { Alert } from "@streamuilib/react";

<Alert tone="success" title="Changes saved" />`,
    examples: [
      { title: "Tones", file: ex("alert", "tones"), Component: AlertTones },
      { title: "With actions", file: ex("alert", "with-action"), Component: AlertWithAction },
    ],
    props: [
      {
        rows: [
          { name: "tone", type: '"info" | "success" | "warning" | "danger"', default: '"info"', description: "Color, icon, and default role." },
          { name: "title", type: "ReactNode", description: "Bold first line." },
          { name: "icon", type: "ReactNode | null", description: "Replaces the tone's icon; null hides it." },
          { name: "action", type: "ReactNode", description: "Buttons or links under the message." },
          { name: "role", type: "string", description: 'Overrides the default "alert" or "status".' },
          { name: "...props", type: 'ComponentProps<"div">', description: "Native div attributes." },
        ],
      },
    ],
    accessibility: [
      'Warnings and errors default to role="alert", which screen readers announce immediately; info and success use the politer role="status".',
      'Live roles announce content that appears after load. For a message that\'s on the page from the start, pass role="note" (or another role) so it isn\'t announced as new.',
      "The icon is decorative; the title and text carry the meaning, so color is never the only signal.",
    ],
  },
  {
    slug: "textarea",
    name: "Textarea",
    description: "A multi-line text field in the same frame as Input, with an invalid state and vertical resizing.",
    status: "stable",
    file: "packages/react/src/Textarea.tsx",
    usage: `import { Textarea } from "@streamuilib/react";

<label htmlFor="msg">Message</label>
<Textarea id="msg" rows={4} />`,
    examples: [
      { title: "Basic", file: ex("textarea", "basic"), Component: TextareaBasic },
      { title: "Invalid and disabled", file: ex("textarea", "states"), Component: TextareaStates },
    ],
    props: [
      {
        rows: [
          { name: "invalid", type: "boolean", default: "false", description: "Sets aria-invalid and tints the field pink." },
          { name: "rows", type: "number", default: "4", description: "Visible lines before scrolling." },
          { name: "frameClassName", type: "string", description: "Classes for the outer frame." },
          { name: "className", type: "string", description: "Classes for the <textarea> itself." },
          { name: "...props", type: 'ComponentProps<"textarea">', description: "Every native textarea attribute." },
        ],
      },
    ],
    accessibility: [
      "Pair it with a <label>, and link hints or errors with aria-describedby.",
      "Shares Input's frame, so focus, invalid, and disabled states look the same across a form.",
    ],
  },
  {
    slug: "select",
    name: "Select",
    description: "A native select in the brutal frame, so phones get their own picker and keyboards work as expected.",
    status: "stable",
    file: "packages/react/src/Select.tsx",
    usage: `import { Select } from "@streamuilib/react";

<label htmlFor="region">Region</label>
<Select id="region">
  <option value="bom">Asia (Mumbai)</option>
</Select>`,
    examples: [
      { title: "Basic", file: ex("select", "basic"), Component: SelectBasic },
      { title: "Invalid and disabled", file: ex("select", "states"), Component: SelectStates },
    ],
    props: [
      {
        rows: [
          { name: "invalid", type: "boolean", default: "false", description: "Sets aria-invalid and tints the field pink." },
          { name: "frameClassName", type: "string", description: "Classes for the outer frame." },
          { name: "className", type: "string", description: "Classes for the <select> itself." },
          { name: "children", type: "<option> elements", description: "Options and optgroups, exactly as in native HTML." },
          { name: "...props", type: 'ComponentProps<"select">', description: "Every native select attribute." },
        ],
      },
    ],
    accessibility: [
      "It's the platform's own <select>: typeahead, arrow keys, and the native picker on touch devices all work.",
      "Use a disabled empty first option as a placeholder, and mark the field invalid if the form is submitted without a choice.",
    ],
  },
  {
    slug: "radio-group",
    name: "Radio Group",
    description: "Native radio buttons with a brutal face, grouped in a fieldset whose legend names the choice.",
    status: "stable",
    file: "packages/react/src/Radio.tsx",
    usage: `import { Radio, RadioGroup } from "@streamuilib/react";

<RadioGroup legend="Billing">
  <Radio name="billing" value="monthly" label="Monthly" />
  <Radio name="billing" value="yearly" label="Yearly" />
</RadioGroup>`,
    examples: [
      { title: "With descriptions", file: ex("radio-group", "basic"), Component: RadioGroupBasic },
      { title: "Horizontal", file: ex("radio-group", "horizontal"), Component: RadioGroupHorizontal },
    ],
    props: [
      {
        caption: "RadioGroup",
        rows: [
          { name: "legend", type: "ReactNode", description: "The group's visible name. Required." },
          { name: "orientation", type: '"vertical" | "horizontal"', default: '"vertical"', description: "Layout of the options." },
          { name: "...props", type: 'ComponentProps<"fieldset">', description: "Native fieldset attributes, e.g. disabled." },
        ],
      },
      {
        caption: "Radio",
        rows: [
          { name: "name", type: "string", description: "Shared by every radio in the group." },
          { name: "value", type: "string", description: "Submitted with the form when chosen." },
          { name: "label", type: "ReactNode", description: "Visible label; the whole row is clickable." },
          { name: "description", type: "ReactNode", description: "Secondary line under the label." },
          { name: "...props", type: 'Omit<ComponentProps<"input">, "type">', description: "Native input attributes, e.g. defaultChecked." },
        ],
      },
    ],
    accessibility: [
      "Real radio inputs: arrow keys move between options and Tab moves in and out of the group, as browsers expect.",
      "The fieldset's legend is announced with each option, so users know what they're choosing.",
      "The visible circle mirrors the input's focus ring, and the dot only shows when it's checked.",
    ],
  },
  {
    slug: "accordion",
    name: "Accordion",
    description: "Expandable sections built on native details and summary, with an exclusive mode that keeps one open at a time.",
    status: "stable",
    file: "packages/react/src/Accordion.tsx",
    usage: `import { Accordion } from "@streamuilib/react";

<Accordion
  exclusive
  items={[
    { id: "install", title: "How do I install it?", content: "…" },
    { id: "license", title: "Is it free?", content: "…" },
  ]}
/>`,
    examples: [
      { title: "Basic", file: ex("accordion", "basic"), Component: AccordionBasic },
      {
        title: "One open at a time",
        description: "exclusive uses the native details name attribute, so opening one closes the others.",
        file: ex("accordion", "exclusive"),
        Component: AccordionExclusive,
      },
    ],
    props: [
      {
        rows: [
          { name: "items", type: "{ id: string; title: ReactNode; content: ReactNode }[]", description: "Sections in order. id must be unique." },
          { name: "exclusive", type: "boolean", default: "false", description: "Only one section open at a time." },
          { name: "defaultOpen", type: "string[]", default: "[]", description: "Ids open on first render." },
          { name: "className", type: "string", description: "Classes for the wrapper." },
        ],
      },
    ],
    accessibility: [
      "Native <details>/<summary>: Enter and Space toggle, and screen readers announce expanded or collapsed.",
      "Works without JavaScript, and the browser's find-in-page can open a section to show a match.",
      "Closed content stays in the page, so it isn't lost to search engines.",
    ],
  },
  {
    slug: "dialog",
    name: "Dialog",
    description: "A modal built on the native dialog element: focus is trapped, Esc closes it, and focus returns to the trigger.",
    status: "beta",
    file: "packages/react/src/Dialog.tsx",
    usage: `import { Button, Dialog } from "@streamuilib/react";

<Dialog title="Delete this project?" trigger={<Button>Delete</Button>}>
  This can't be undone.
</Dialog>`,
    examples: [
      { title: "Confirm", description: "Controlled with open and onOpenChange so the footer buttons can close it.", file: ex("dialog", "basic"), Component: DialogBasic },
      { title: "With a form", file: ex("dialog", "form"), Component: DialogForm },
    ],
    props: [
      {
        rows: [
          { name: "title", type: "ReactNode", description: "Heading; also the dialog's accessible name. Required." },
          { name: "description", type: "ReactNode", description: "Supporting line; becomes the accessible description." },
          { name: "children", type: "ReactNode", description: "Body content." },
          { name: "footer", type: "ReactNode", description: "Actions along the bottom." },
          { name: "trigger", type: "ReactElement", description: "Element that opens the dialog; gets aria-haspopup and aria-expanded." },
          { name: "open", type: "boolean", description: "Controlled open state." },
          { name: "defaultOpen", type: "boolean", default: "false", description: "Initial state when uncontrolled." },
          { name: "onOpenChange", type: "(open: boolean) => void", description: "Called on every open and close, including Esc." },
          { name: "dismissible", type: "boolean", default: "true", description: "Close when the backdrop is clicked." },
          { name: "className", type: "string", description: "Classes for the panel." },
        ],
      },
    ],
    accessibility: [
      "Uses <dialog>.showModal(): focus moves into the dialog, Tab stays inside, and the rest of the page is inert.",
      "Esc closes it and focus returns to the element that opened it.",
      "Named by its title (aria-labelledby) and described by its description (aria-describedby). The close button has a label.",
    ],
  },
  {
    slug: "tooltip",
    name: "Tooltip",
    description: "A short hint on hover and keyboard focus that Esc dismisses, linked to its trigger for screen readers.",
    status: "beta",
    file: "packages/react/src/Tooltip.tsx",
    usage: `import { Button, Tooltip } from "@streamuilib/react";

<Tooltip content="Notifications">
  <Button size="icon" aria-label="Notifications">…</Button>
</Tooltip>`,
    examples: [{ title: "On icon buttons", description: "Hover or Tab to the buttons. Esc hides the hint.", file: ex("tooltip", "basic"), Component: TooltipBasic }],
    props: [
      {
        rows: [
          { name: "content", type: "ReactNode", description: "The hint. Keep it short. Required." },
          { name: "children", type: "ReactElement", description: "One focusable trigger; it gets aria-describedby." },
          { name: "side", type: '"top" | "bottom"', default: '"top"', description: "Which side of the trigger to show on." },
          { name: "delay", type: "number", default: "150", description: "Hover delay in ms. Focus shows immediately." },
          { name: "className", type: "string", description: "Classes for the tooltip bubble." },
        ],
      },
    ],
    accessibility: [
      "Shows on keyboard focus as well as hover, and Esc dismisses it without moving focus (WCAG 1.4.13).",
      'The bubble has role="tooltip" and is linked with aria-describedby, so it\'s read after the trigger\'s name.',
      "Tooltips are hints, not labels: icon-only buttons still need their own aria-label.",
    ],
  },
  {
    slug: "skeleton",
    name: "Skeleton",
    description: "Placeholder shapes for content that's loading, sized with classes and pulsing only when motion is allowed.",
    status: "stable",
    file: "packages/react/src/Skeleton.tsx",
    usage: `import { Skeleton } from "@streamuilib/react";

<div role="status" aria-busy="true" aria-label="Loading">
  <Skeleton className="h-4 w-40" />
</div>`,
    examples: [
      { title: "Profile row", file: ex("skeleton", "basic"), Component: SkeletonBasic },
      { title: "Loading card", file: ex("skeleton", "card"), Component: SkeletonCard },
    ],
    props: [
      {
        rows: [
          { name: "className", type: "string", description: "Size and shape, e.g. h-4 w-40 or size-12 rounded-full." },
          { name: "...props", type: 'ComponentProps<"div">', description: "Native div attributes." },
        ],
      },
    ],
    accessibility: [
      "Each skeleton is aria-hidden; label the loading region instead (role=\"status\", aria-busy, aria-label) so screen readers hear one message.",
      "The pulse only runs when the user allows motion.",
    ],
  },
  {
    slug: "slider",
    name: "Slider",
    description: "A native range input with a hard-edged track and thumb, for volume, seeking, and any value on a scale.",
    status: "stable",
    file: "packages/react/src/Slider.tsx",
    usage: `import { Slider } from "@streamuilib/react";

<Slider aria-label="Volume" value={volume} onValueChange={setVolume} />`,
    examples: [
      { title: "With a label and readout", file: ex("slider", "basic"), Component: SliderBasic },
      { title: "Tones", file: ex("slider", "tones"), Component: SliderTones },
    ],
    props: [
      {
        rows: [
          { name: "value", type: "number", description: "Current value. Required; the slider is always controlled." },
          { name: "onValueChange", type: "(value: number) => void", description: "Called with the new value as a number." },
          { name: "min / max", type: "number", default: "0 / 100", description: "Range of the slider." },
          { name: "step", type: 'number | "any"', default: "1", description: "Increment; any allows continuous values." },
          { name: "tone", type: '"lime" | "pink" | "blue" | "violet" | "orange"', default: '"lime"', description: "Color of the filled part." },
          { name: "aria-valuetext", type: "string", description: 'What screen readers announce, e.g. "1:23 of 3:05".' },
          { name: "...props", type: 'ComponentProps<"input">', description: "Native input attributes, e.g. disabled or id." },
        ],
      },
    ],
    accessibility: [
      "A real <input type=\"range\">: arrow keys, Page Up/Down, Home/End, and touch all work.",
      "Give it a name with a <label> or aria-label, and use aria-valuetext when the raw number isn't meaningful.",
      "The focus ring sits around the whole track, and the thumb fills with the tone while dragging.",
    ],
  },
  {
    slug: "audio-player",
    name: "Audio Player",
    description: "Full and mini music players with seek, volume, playlists, and auto-advance, plus a hook to build your own.",
    status: "beta",
    file: "packages/react/src/AudioPlayer.tsx",
    usage: `import { AudioPlayer } from "@streamuilib/react";

<AudioPlayer
  playlist
  tracks={[
    { title: "Hard Edges", artist: "stream/ui", src: "/audio/hard-edges.mp3" },
    { title: "Ink & Paper", artist: "stream/ui", src: "/audio/ink-and-paper.mp3" },
  ]}
/>`,
    examples: [
      {
        title: "Full player with playlist",
        description: "These demo tracks are generated in your browser, so there are no audio files to download.",
        file: ex("audio-player", "full"),
        Component: AudioPlayerFull,
      },
      { title: "Mini player", file: ex("audio-player", "mini"), Component: AudioPlayerMini },
      {
        title: "Build your own with useAudioPlayer",
        description: "The hook handles playback; you choose the layout.",
        file: ex("audio-player", "headless"),
        Component: AudioPlayerHeadless,
      },
    ],
    props: [
      {
        caption: "AudioPlayer, MiniPlayer",
        rows: [
          { name: "tracks", type: "Track[]", description: "{ title, src, artist?, cover?, tone?, duration? }. Required." },
          { name: "playlist", type: "boolean", default: "false", description: "AudioPlayer only: show the track list." },
          { name: "defaultIndex", type: "number", default: "0", description: "Track selected first." },
          { name: "defaultVolume", type: "number", default: "0.8", description: "Start volume, 0 to 1." },
          { name: "loop", type: "boolean", default: "true", description: "Wrap from the last track to the first." },
          { name: "className", type: "string", description: "Classes for the player frame." },
        ],
      },
      {
        caption: "useAudioPlayer(tracks, options)",
        rows: [
          { name: "returns", type: "{ track, index, playing, time, duration, volume, muted, ready, … }", description: "Live playback state." },
          { name: "controls", type: "play, pause, toggle, seek, next, previous, select, setVolume, toggleMute", description: "Actions; previous restarts the track if you're past 3 seconds." },
          { name: "audioProps", type: "{ ref, src, preload }", description: "Spread onto your own <audio> element." },
        ],
      },
    ],
    accessibility: [
      "Each player is a labelled region; every button has a name (Play/Pause, Previous track, Next track, Mute/Unmute).",
      "The seek and volume sliders announce readable values like \"0:12 of 0:23\" and \"80%\".",
      "Mute is a toggle button with aria-pressed, and the now-playing track is announced politely.",
      "State follows the <audio> element's own events, so it stays correct when the browser or system pauses playback.",
    ],
  },
  {
    slug: "track-list",
    name: "Track List",
    description: "A playlist of tracks with numbers, artists, durations, and a live meter on the one that's playing.",
    status: "beta",
    file: "packages/react/src/TrackList.tsx",
    usage: `import { TrackList } from "@streamuilib/react";

<TrackList tracks={tracks} index={current} playing onSelect={setCurrent} />`,
    examples: [{ title: "Basic", description: "Pick a track to move the meter.", file: ex("track-list", "basic"), Component: TrackListBasic }],
    props: [
      {
        rows: [
          { name: "tracks", type: "Track[]", description: "Tracks in order. Required." },
          { name: "index", type: "number", description: "The current track." },
          { name: "playing", type: "boolean", default: "false", description: "Animates the current track's meter." },
          { name: "onSelect", type: "(index: number) => void", description: "Called when a track is chosen." },
          { name: "...props", type: 'ComponentProps<"ol">', description: "Native list attributes." },
        ],
      },
    ],
    accessibility: [
      "An ordered list of buttons, so screen readers announce the count and position.",
      "The current track has aria-current and a hidden \"Now playing\" prefix; the meter itself is decorative.",
    ],
  },
  {
    slug: "equalizer",
    name: "Equalizer",
    description: "An animated now-playing meter whose bars move independently, and stop when paused or when motion is reduced.",
    status: "stable",
    file: "packages/react/src/Equalizer.tsx",
    usage: `import { Equalizer } from "@streamuilib/react";

<Equalizer playing={isPlaying} bars={4} tone="pink" />`,
    examples: [{ title: "Sizes and tones", file: ex("equalizer", "basic"), Component: EqualizerBasic }],
    props: [
      {
        rows: [
          { name: "playing", type: "boolean", default: "true", description: "Animate the bars; when false they rest low." },
          { name: "bars", type: "number", default: "4", description: "How many bars." },
          { name: "tone", type: '"lime" | "pink" | "blue" | "violet" | "orange"', default: '"lime"', description: "Bar color." },
          { name: "className", type: "string", description: "Size it with height classes, e.g. h-8." },
        ],
      },
    ],
    accessibility: [
      "Purely decorative and aria-hidden; pair it with text that says what's playing.",
      "Under prefers-reduced-motion the bars hold still at a fixed height.",
    ],
  },
  {
    slug: "comic-input",
    name: "Comic Input",
    description: "A comic-book text field: hand-inked corners, halftone dots, and an Oops! sticker when invalid.",
    status: "beta",
    file: "packages/react/src/ComicInput.tsx",
    usage: `import { ComicInput } from "@streamuilib/react";

<label htmlFor="name">Hero name</label>
<ComicInput id="name" placeholder="Captain Brutal" />`,
    examples: [
      { title: "Basic", description: "With a label, an icon, or both. The frame lifts toward the light on focus.", file: ex("comic-input", "basic"), Component: ComicInputBasic },
      { title: "Invalid and disabled", description: "Invalid tints the frame and slams on a sticker; set your own word with sfx.", file: ex("comic-input", "states"), Component: ComicInputStates },
    ],
    props: [
      {
        rows: [
          { name: "icon", type: "ReactNode", description: "Leading icon. Rendered aria-hidden." },
          { name: "invalid", type: "boolean", default: "false", description: "Sets aria-invalid, tints the frame pink, and slaps on the sticker." },
          { name: "sfx", type: "ReactNode | false", default: '"Oops!"', description: "The sticker shown when invalid; false for none." },
          { name: "frameClassName", type: "string", description: "Classes for the outer frame (width, tilt)." },
          { name: "...props", type: 'ComponentProps<"input">', description: "Every native input attribute; className goes to the <input>." },
        ],
      },
    ],
    accessibility: [
      "A real <input>: pair it with a <label>, and link error text with aria-describedby.",
      "The sticker is decorative and hidden; aria-invalid carries the state.",
      "The frame shows the focus ring and the lift; motion stops for reduced motion.",
    ],
  },
  {
    slug: "comic-textarea",
    name: "Comic Textarea",
    description: "A comic-book textarea: a speech bubble to write in, with halftone dots and a tail.",
    status: "beta",
    file: "packages/react/src/ComicTextarea.tsx",
    usage: `import { ComicTextarea } from "@streamuilib/react";

<label htmlFor="msg">Say something!</label>
<ComicTextarea id="msg" />`,
    examples: [
      { title: "Basic", file: ex("comic-textarea", "basic"), Component: ComicTextareaBasic },
      { title: "Invalid, and without the tail", file: ex("comic-textarea", "states"), Component: ComicTextareaStates },
    ],
    props: [
      {
        rows: [
          { name: "tail", type: "boolean", default: "true", description: "The speech-bubble tail off the bottom left." },
          { name: "invalid", type: "boolean", default: "false", description: "Sets aria-invalid, tints the frame pink, and slaps on the sticker." },
          { name: "sfx", type: "ReactNode | false", default: '"Oops!"', description: "The sticker shown when invalid; false for none." },
          { name: "frameClassName", type: "string", description: "Classes for the outer frame (width, tilt)." },
          { name: "rows", type: "number", default: "4", description: "Visible lines." },
          { name: "...props", type: 'ComponentProps<"textarea">', description: "Every native textarea attribute." },
        ],
      },
    ],
    accessibility: [
      "A real <textarea>: pair it with a <label>, and link error text with aria-describedby.",
      "The tail and sticker are decorative and hidden.",
    ],
  },
  {
    slug: "comic-select",
    name: "Comic Select",
    description: "A native select in the comic frame, with the arrow on a starburst that spins on focus.",
    status: "beta",
    file: "packages/react/src/ComicSelect.tsx",
    usage: `import { ComicSelect } from "@streamuilib/react";

<ComicSelect aria-label="Power">
  <option>Flight</option>
  <option>Speed</option>
</ComicSelect>`,
    examples: [
      { title: "Basic", file: ex("comic-select", "basic"), Component: ComicSelectBasic },
      { title: "Invalid and disabled", file: ex("comic-select", "states"), Component: ComicSelectStates },
    ],
    props: [
      {
        rows: [
          { name: "invalid", type: "boolean", default: "false", description: "Sets aria-invalid and tints the frame pink." },
          { name: "frameClassName", type: "string", description: "Classes for the outer frame." },
          { name: "...props", type: 'ComponentProps<"select">', description: "Every native select attribute; pass <option>s as children." },
        ],
      },
    ],
    accessibility: [
      "A native <select>: the platform's own picker on phones, typeahead, and full keyboard and screen reader support.",
      "The starburst arrow is decorative and hidden.",
    ],
  },
  {
    slug: "comic-checkbox",
    name: "Comic Checkbox",
    description: "A hand-inked checkbox whose check mark draws itself in with a starburst flash.",
    status: "beta",
    file: "packages/react/src/ComicCheckbox.tsx",
    usage: `import { ComicCheckbox } from "@streamuilib/react";

<ComicCheckbox name="terms" label="I agree to the terms" />`,
    examples: [
      { title: "Basic", description: "Check it: the mark draws in and a burst flashes behind the box.", file: ex("comic-checkbox", "basic"), Component: ComicCheckboxBasic },
      { title: "Group", file: ex("comic-checkbox", "group"), Component: ComicCheckboxGroup },
    ],
    props: [
      {
        rows: [
          { name: "label", type: "ReactNode", description: "Text next to the box; clicking it toggles the box." },
          { name: "...props", type: 'Omit<ComponentProps<"input">, "type">', description: "Native checkbox attributes: checked, defaultChecked, name, value, disabled." },
        ],
      },
    ],
    accessibility: [
      "A real checkbox, visually hidden, so forms, Space to toggle, and screen readers work unchanged.",
      "The focus ring shows on the box when the hidden input has keyboard focus.",
      "The draw-in and flash stop when the user prefers reduced motion.",
    ],
  },
  {
    slug: "comic-radio-group",
    name: "Comic Radio Group",
    description: "Hand-inked radios that fill with a spinning star, under a comic caption legend.",
    status: "beta",
    file: "packages/react/src/ComicRadio.tsx",
    usage: `import { ComicRadio, ComicRadioGroup } from "@streamuilib/react";

<ComicRadioGroup legend="Delivery">
  <ComicRadio name="delivery" value="standard" label="Standard" defaultChecked />
  <ComicRadio name="delivery" value="jetpack" label="Jetpack" />
</ComicRadioGroup>`,
    examples: [
      { title: "Basic", file: ex("comic-radio-group", "basic"), Component: ComicRadioGroupBasic },
      { title: "Horizontal", file: ex("comic-radio-group", "horizontal"), Component: ComicRadioGroupHorizontal },
    ],
    props: [
      {
        caption: "ComicRadioGroup",
        rows: [
          { name: "legend", type: "ReactNode", description: "The group's name, on a tilted caption box." },
          { name: "orientation", type: '"vertical" | "horizontal"', default: '"vertical"', description: "Stack or wrap the radios." },
        ],
      },
      {
        caption: "ComicRadio",
        rows: [
          { name: "label", type: "ReactNode", description: "The option's text." },
          { name: "description", type: "ReactNode", description: "A secondary line under the label." },
          { name: "...props", type: 'Omit<ComponentProps<"input">, "type">', description: "Native radio attributes; give a group the same name." },
        ],
      },
    ],
    accessibility: [
      "A native fieldset and legend: screen readers announce the group name with each radio.",
      "Real radios underneath, so arrow keys move between options in a group.",
    ],
  },
  {
    slug: "comic-switch",
    name: "Comic Switch",
    description: "A halftone pill with a starburst thumb that rolls across and shouts ON!",
    status: "beta",
    file: "packages/react/src/ComicSwitch.tsx",
    usage: `import { ComicSwitch } from "@streamuilib/react";

<label>
  <ComicSwitch defaultChecked /> Sound effects
</label>`,
    examples: [
      { title: "Basic", file: ex("comic-switch", "basic"), Component: ComicSwitchBasic },
      { title: "Controlled, with your own words", file: ex("comic-switch", "controlled"), Component: ComicSwitchControlled },
    ],
    props: [
      {
        rows: [
          { name: "checked", type: "boolean", description: "Controlled state." },
          { name: "defaultChecked", type: "boolean", default: "false", description: "Initial state when uncontrolled." },
          { name: "onCheckedChange", type: "(checked: boolean) => void", description: "Called with the new state." },
          { name: "labels", type: "[ReactNode, ReactNode] | false", default: '["On!", "Off"]', description: "Words in the track, on then off; false for none." },
          { name: "...props", type: 'ComponentProps<"button">', description: "Native button attributes, like disabled and aria-label." },
        ],
      },
    ],
    accessibility: [
      'A button with role="switch" and aria-checked; Space and Enter toggle it.',
      "The words in the track are decorative; name the switch with a <label> or aria-label.",
      "The roll stops when the user prefers reduced motion.",
    ],
  },
  {
    slug: "comic-slider",
    name: "Comic Slider",
    description: "A halftone track with a starburst thumb and the value in a speech bubble.",
    status: "beta",
    file: "packages/react/src/ComicSlider.tsx",
    usage: `import { ComicSlider } from "@streamuilib/react";

<ComicSlider value={power} onValueChange={setPower} aria-label="Power" />`,
    examples: [
      { title: "Basic", description: "Drag it or use the arrow keys; the burst turns as it goes.", file: ex("comic-slider", "basic"), Component: ComicSliderBasic },
      { title: "Tones, ranges, and formats", file: ex("comic-slider", "tones"), Component: ComicSliderTones },
    ],
    props: [
      {
        rows: [
          { name: "value", type: "number", description: "Current value (controlled)." },
          { name: "onValueChange", type: "(value: number) => void", description: "Called with the new value." },
          { name: "min / max / step", type: "number", default: "0 / 100 / 1", description: "The range." },
          { name: "tone", type: '"lime" | "pink" | "blue" | "violet" | "orange"', default: '"lime"', description: "Fill color." },
          { name: "showValue", type: "boolean", default: "true", description: "The value bubble over the thumb." },
          { name: "formatValue", type: "(value: number) => ReactNode", description: "Formats the bubble's text." },
          { name: "...props", type: 'ComponentProps<"input">', description: "Native range attributes, like aria-label and aria-valuetext." },
        ],
      },
    ],
    accessibility: [
      "A native range input sits on top, invisible, so arrow keys, Page Up and Down, Home and End, touch, and screen readers all work.",
      "Pass aria-valuetext when the number alone doesn't say enough.",
      "The bubble, track, and thumb are drawn for sight only and hidden.",
    ],
  },
  {
    slug: "comic-tabs",
    name: "Comic Tabs",
    description: "Tilted caption-box tabs over a comic panel; the active tab stands up straight and its panel pops in.",
    status: "beta",
    file: "packages/react/src/ComicTabs.tsx",
    usage: `import { ComicTabs } from "@streamuilib/react";

<ComicTabs
  label="Episode"
  items={[
    { id: "origin", label: "Origin", content: <p>...</p> },
    { id: "powers", label: "Powers", content: <p>...</p> },
  ]}
/>`,
    examples: [{ title: "Basic", description: "Click a tab or use the arrow keys, Home, and End.", file: ex("comic-tabs", "basic"), Component: ComicTabsBasic }],
    props: [
      {
        rows: [
          { name: "items", type: "{ id: string; label: ReactNode; content: ReactNode }[]", description: "Tabs in order. id must be unique." },
          { name: "label", type: "string", description: "Accessible name for the tab list. Required." },
          { name: "defaultIndex", type: "number", default: "0", description: "The tab selected on first render." },
          { name: "className", type: "string", description: "Classes for the wrapper." },
        ],
      },
    ],
    accessibility: [
      "WAI-ARIA tabs, the same as Tabs: arrow keys move and select, Home and End jump to the ends.",
      "Only the active tab is in the tab order; panels are focusable.",
      "The tilt and pop-in stop when the user prefers reduced motion.",
    ],
  },
  {
    slug: "comic-accordion",
    name: "Comic Accordion",
    description: "Hand-inked panels with a starburst toggle that spins open; the answer pops in on halftone dots.",
    status: "beta",
    file: "packages/react/src/ComicAccordion.tsx",
    usage: `import { ComicAccordion } from "@streamuilib/react";

<ComicAccordion
  items={[
    { id: "free", title: "Is it free?", content: "Yes! MIT licensed." },
  ]}
/>`,
    examples: [
      { title: "Basic", file: ex("comic-accordion", "basic"), Component: ComicAccordionBasic },
      { title: "One at a time", file: ex("comic-accordion", "exclusive"), Component: ComicAccordionExclusive },
    ],
    props: [
      {
        rows: [
          { name: "items", type: "{ id: string; title: ReactNode; content: ReactNode }[]", description: "Sections in order. id must be unique." },
          { name: "exclusive", type: "boolean", default: "false", description: "Only one item open at a time." },
          { name: "defaultOpen", type: "string[]", default: "[]", description: "Ids of items open on first render." },
          { name: "className", type: "string", description: "Classes for the wrapper." },
        ],
      },
    ],
    accessibility: [
      "Native <details> and <summary>: Enter and Space toggle, screen readers hear expanded or collapsed, and find-in-page opens matches.",
      "The starburst toggle is decorative and hidden.",
      "The spin and pop-in stop when the user prefers reduced motion.",
    ],
  },
  {
    slug: "comic-dialog",
    name: "Comic Dialog",
    description: "A hand-inked modal that slams in over a halftone backdrop, with a caption-box title and a sound effect.",
    status: "beta",
    file: "packages/react/src/ComicDialog.tsx",
    usage: `import { ComicButton, ComicDialog } from "@streamuilib/react";

<ComicDialog
  title="Delete this project?"
  sfx="Gulp!"
  trigger={<ComicButton>Delete project</ComicButton>}
/>`,
    examples: [
      { title: "Confirm", description: "A sound effect on the corner, and comic buttons in the footer.", file: ex("comic-dialog", "basic"), Component: ComicDialogBasic },
      { title: "With a form", description: 'A form with method="dialog" closes it on submit.', file: ex("comic-dialog", "form"), Component: ComicDialogForm },
    ],
    props: [
      {
        rows: [
          { name: "title", type: "ReactNode", description: "Heading on the caption box; also the dialog's accessible name. Required." },
          { name: "description", type: "ReactNode", description: "Supporting text, linked with aria-describedby." },
          { name: "sfx", type: "ReactNode", description: "A starburst sound effect on the top-right corner." },
          { name: "trigger", type: "ReactElement", description: "An element that opens the dialog when clicked." },
          { name: "open / defaultOpen / onOpenChange", type: "boolean / boolean / (open) => void", description: "Controlled or uncontrolled open state." },
          { name: "footer", type: "ReactNode", description: "Buttons along the bottom." },
          { name: "dismissible", type: "boolean", default: "true", description: "Close when the backdrop is clicked." },
        ],
      },
    ],
    accessibility: [
      "Native <dialog> opened with showModal(), the same as Dialog: focus moves in and is trapped, Esc closes, and focus returns to the trigger.",
      "The rest of the page is inert while it's open.",
      "The close button is labelled; the sound effect is decorative and hidden.",
      "The slam-in stops when the user prefers reduced motion.",
    ],
  },
  {
    slug: "comic-tooltip",
    name: "Comic Tooltip",
    description: "A speech-bubble tooltip with a tail pointing at its trigger, that pops in with a bounce.",
    status: "beta",
    file: "packages/react/src/ComicTooltip.tsx",
    usage: `import { ComicTooltip } from "@streamuilib/react";

<ComicTooltip content="Share the love!">
  <button aria-label="Share">...</button>
</ComicTooltip>`,
    examples: [{ title: "Tones and sides", description: "Hover or tab to each button.", file: ex("comic-tooltip", "basic"), Component: ComicTooltipBasic }],
    props: [
      {
        rows: [
          { name: "content", type: "ReactNode", description: "The hint. Keep it short." },
          { name: "children", type: "ReactElement", description: "One focusable trigger, e.g. an icon button." },
          { name: "tone", type: '"paper" | "lime" | "pink" | "blue" | "orange"', default: '"paper"', description: "Bubble fill." },
          { name: "side", type: '"top" | "bottom"', default: '"top"', description: "Where the bubble sits." },
          { name: "delay", type: "number", default: "150", description: "Hover delay in ms. Focus shows it right away." },
        ],
      },
    ],
    accessibility: [
      "Built on Tooltip: it shows on hover and keyboard focus, and hides on Esc, blur, or pointer leave (WCAG 1.4.13).",
      "The trigger gets aria-describedby, so screen readers read the hint after its name.",
      "The pop-in stops when the user prefers reduced motion.",
    ],
  },
];

/** Sidebar and prev/next order: basics, form fields, disclosure and overlays, feedback, media. */
export const componentOrder = [
  "button",
  "comic-button",
  "badge",
  "comic-badge",
  "card",
  "comic-card",
  "alert",
  "comic-alert",
  "input",
  "comic-input",
  "textarea",
  "comic-textarea",
  "select",
  "comic-select",
  "checkbox",
  "comic-checkbox",
  "radio-group",
  "comic-radio-group",
  "switch",
  "comic-switch",
  "slider",
  "comic-slider",
  "tabs",
  "comic-tabs",
  "accordion",
  "comic-accordion",
  "dialog",
  "comic-dialog",
  "tooltip",
  "comic-tooltip",
  "progress",
  "battery",
  "skeleton",
  "avatar",
  "audio-player",
  "track-list",
  "equalizer",
  "animated-icon",
];

export const components: ComponentDoc[] = [...entries].sort(
  (a, b) => componentOrder.indexOf(a.slug) - componentOrder.indexOf(b.slug),
);

export function getComponent(slug: string) {
  return components.find((c) => c.slug === slug);
}

/**
 * A broad component category with several designs: its own page is a grid
 * of them, and each design gets a page at /components/<group>/<variant>.
 * Members keep their own slugs (for the package and the shadcn registry).
 */
export type ComponentGroup = {
  slug: string;
  name: string;
  description: string;
  variants: { id: string; name: string; description: string; doc: ComponentDoc }[];
};

const member = (slug: string) => {
  const doc = getComponent(slug);
  if (!doc) throw new Error(`component group: no component "${slug}"`);
  return doc;
};

export const componentGroups: ComponentGroup[] = [
  {
    slug: "button",
    name: "Buttons",
    description: "The primary way to trigger an action, in two designs: the classic brutal button and comic-book buttons that go POW!",
    variants: [
      { id: "classic", name: "Classic", description: "Lifts on hover and sinks into its shadow on press, in four tones and four sizes.", doc: member("button") },
      { id: "comic", name: "Comic", description: "Panels, bubbles, ribbons, and bursts with halftone dots that pop a sound effect on click.", doc: member("comic-button") },
    ],
  },
  {
    slug: "card",
    name: "Cards",
    description: "Surfaces that group related content, in two designs: the classic brutal card and comic-book panels with captions and sound effects.",
    variants: [
      { id: "classic", name: "Classic", description: "A bordered surface with a hard shadow, built from header, title, description, content, and footer parts.", doc: member("card") },
      { id: "comic", name: "Comic", description: "Skewed comic panels with halftone dots, a narration caption, and a starburst sound effect.", doc: member("comic-card") },
    ],
  },
  {
    slug: "alert",
    name: "Alerts",
    description: "Messages for info, success, warnings, and errors, in two designs: the classic brutal box and comic speech bubbles that pop in.",
    variants: [
      { id: "classic", name: "Classic", description: "A bordered message box with a toned icon tile, a title, and optional actions.", doc: member("alert") },
      { id: "comic", name: "Comic", description: "A speech bubble pointing at a starburst, with a shouty title and a stamped sound effect.", doc: member("comic-alert") },
    ],
  },
  {
    slug: "input",
    name: "Inputs",
    description: "Single-line text fields, in two designs: the classic brutal field and comic-book fields with hand-inked corners.",
    variants: [
      { id: "classic", name: "Classic", description: "A bordered field with a hard shadow, an optional icon, and an invalid state.", doc: member("input") },
      { id: "comic", name: "Comic", description: "Hand-inked corners, halftone dots, and an Oops! sticker when invalid.", doc: member("comic-input") },
    ],
  },
  {
    slug: "textarea",
    name: "Textareas",
    description: "Multi-line text fields, in two designs: the classic brutal box and a comic speech bubble to write in.",
    variants: [
      { id: "classic", name: "Classic", description: "A resizable bordered box with a hard shadow and an invalid state.", doc: member("textarea") },
      { id: "comic", name: "Comic", description: "A speech bubble with a tail, halftone dots, and an Oops! sticker.", doc: member("comic-textarea") },
    ],
  },
  {
    slug: "select",
    name: "Selects",
    description: "Native dropdowns, in two designs: the classic brutal frame and a comic frame with a spinning starburst arrow.",
    variants: [
      { id: "classic", name: "Classic", description: "A native select in the brutal frame with a chevron.", doc: member("select") },
      { id: "comic", name: "Comic", description: "The comic frame with the arrow on a starburst that spins on focus.", doc: member("comic-select") },
    ],
  },
  {
    slug: "checkbox",
    name: "Checkboxes",
    description: "Native checkboxes, in two designs: the classic hard-edged box and a hand-inked box with a starburst flash.",
    variants: [
      { id: "classic", name: "Classic", description: "A square face with a hard shadow that fills lime when checked.", doc: member("checkbox") },
      { id: "comic", name: "Comic", description: "A hand-inked box whose check mark draws in with a burst behind it.", doc: member("comic-checkbox") },
    ],
  },
  {
    slug: "radio-group",
    name: "Radio Groups",
    description: "Pick one of a few options, in two designs: classic round radios and hand-inked blobs with a spinning star.",
    variants: [
      { id: "classic", name: "Classic", description: "Round radios with a hard shadow inside a fieldset and legend.", doc: member("radio-group") },
      { id: "comic", name: "Comic", description: "Hand-inked blobs that fill with a star, under a caption-box legend.", doc: member("comic-radio-group") },
    ],
  },
  {
    slug: "switch",
    name: "Switches",
    description: "On and off toggles, in two designs: the classic square switch and a comic pill with a rolling starburst.",
    variants: [
      { id: "classic", name: "Classic", description: "A square track and thumb that slides across and turns lime.", doc: member("switch") },
      { id: "comic", name: "Comic", description: "A halftone pill with a starburst thumb that rolls over and shouts ON!", doc: member("comic-switch") },
    ],
  },
  {
    slug: "slider",
    name: "Sliders",
    description: "Range inputs, in two designs: the classic brutal track and a comic track with a starburst and a value bubble.",
    variants: [
      { id: "classic", name: "Classic", description: "A native range with a hard-edged track, thumb, and toned fill.", doc: member("slider") },
      { id: "comic", name: "Comic", description: "A starburst thumb that turns as it slides, with the value in a bubble.", doc: member("comic-slider") },
    ],
  },
  {
    slug: "tabs",
    name: "Tabs",
    description: "Switch between views in one place, in two designs: classic folder tabs and tilted comic caption tabs.",
    variants: [
      { id: "classic", name: "Classic", description: "Folder tabs joined to a bordered panel with a hard shadow.", doc: member("tabs") },
      { id: "comic", name: "Comic", description: "Tilted caption-box tabs over a comic panel that pops in.", doc: member("comic-tabs") },
    ],
  },
  {
    slug: "accordion",
    name: "Accordions",
    description: "Show and hide sections, in two designs: classic brutal rows and hand-inked comic panels with a spinning starburst.",
    variants: [
      { id: "classic", name: "Classic", description: "Bordered rows with a plus that turns into a cross.", doc: member("accordion") },
      { id: "comic", name: "Comic", description: "Hand-inked panels with a starburst toggle and halftone answers.", doc: member("comic-accordion") },
    ],
  },
  {
    slug: "dialog",
    name: "Dialogs",
    description: "Modal windows, in two designs: the classic brutal panel and a comic panel that slams in with a sound effect.",
    variants: [
      { id: "classic", name: "Classic", description: "A bordered panel with a big hard shadow over a dimmed page.", doc: member("dialog") },
      { id: "comic", name: "Comic", description: "Slams in over a halftone backdrop with a caption-box title.", doc: member("comic-dialog") },
    ],
  },
  {
    slug: "tooltip",
    name: "Tooltips",
    description: "Short hints on hover and focus, in two designs: a classic ink label and a comic speech bubble.",
    variants: [
      { id: "classic", name: "Classic", description: "A small ink label with a hard shadow.", doc: member("tooltip") },
      { id: "comic", name: "Comic", description: "A speech bubble with a tail that pops in with a bounce.", doc: member("comic-tooltip") },
    ],
  },
  {
    slug: "badge",
    name: "Badges",
    description: "Short labels for status, counts, and callouts, in two designs: a classic pill and comic-book stickers.",
    variants: [
      { id: "classic", name: "Classic", description: "A pill label in six tones for status, counts, and categories.", doc: member("badge") },
      { id: "comic", name: "Comic", description: "Starbursts, seals, splats, blobs, speech bubbles, and ribbons with hard outlines.", doc: member("comic-badge") },
    ],
  },
];

export const getComponentGroup = (slug: string) => componentGroups.find((g) => g.slug === slug);

function groupOf(doc: ComponentDoc) {
  for (const g of componentGroups) {
    const v = g.variants.find((v) => v.doc === doc);
    if (v) return { group: g, variant: v };
  }
}

/** Where a component's page lives: its own slug, or inside its group. */
export function componentHref(doc: ComponentDoc) {
  const hit = groupOf(doc);
  return hit ? `/components/${hit.group.slug}/${hit.variant.id}` : `/components/${doc.slug}`;
}

export { groupOf as componentGroupOf };

/** The top-level entries in order, for the sidebar, the index, and prev/next: each group once, where its first member sits. */
export type ComponentEntry = { slug: string; name: string; description: string } & (
  | { kind: "doc"; doc: ComponentDoc }
  | { kind: "group"; group: ComponentGroup }
);

export const componentEntries: ComponentEntry[] = components.flatMap((doc): ComponentEntry[] => {
  const hit = groupOf(doc);
  if (!hit) return [{ kind: "doc", slug: doc.slug, name: doc.name, description: doc.description, doc }];
  if (hit.group.variants[0].doc !== doc) return [];
  const g = hit.group;
  return [{ kind: "group", slug: g.slug, name: g.name, description: g.description, group: g }];
});

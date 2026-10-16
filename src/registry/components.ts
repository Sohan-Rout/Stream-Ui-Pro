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
];

/** Sidebar and prev/next order: basics, form fields, disclosure and overlays, feedback, media. */
export const componentOrder = [
  "button",
  "badge",
  "card",
  "alert",
  "input",
  "textarea",
  "select",
  "checkbox",
  "radio-group",
  "switch",
  "tabs",
  "accordion",
  "dialog",
  "tooltip",
  "progress",
  "skeleton",
  "avatar",
  "animated-icon",
];

export const components: ComponentDoc[] = [...entries].sort(
  (a, b) => componentOrder.indexOf(a.slug) - componentOrder.indexOf(b.slug),
);

export function getComponent(slug: string) {
  return components.find((c) => c.slug === slug);
}

/**
 * Compact previews for the /components index cards. Every card has the same
 * fixed-height stage, so components whose first example is taller than the
 * stage get a smaller specimen here. Everything else uses its first example.
 */
import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";
import { Bell, Heart, Rocket, Settings } from "lucide-react";
import {
  Accordion,
  Alert,
  AnimatedIcon,
  Button,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Progress,
  Textarea,
  TrackList,
  type IconAnimation,
} from "@streamuilib/react";
import RadioGroupHorizontal from "@/examples/radio-group/horizontal";
import AudioPlayerMini from "@/examples/audio-player/mini";
import { BadgesPreview } from "@/components/docs/BadgesPreview";
import { ButtonsPreview, ComicButtonPreview } from "@/components/docs/ButtonsPreview";
import { CardsPreview, ComicCardPreview } from "@/components/docs/CardsPreview";
import { AlertsPreview, ComicAlertPreview } from "@/components/docs/AlertsPreview";
import {
  InputsPreview,
  TextareasPreview,
  SelectsPreview,
  CheckboxesPreview,
  RadioGroupsPreview,
  SwitchesPreview,
  SlidersPreview,
  ComicInputPreview,
  ComicTextareaPreview,
  ComicSelectPreview,
  ComicCheckboxPreview,
  ComicRadioGroupPreview,
  ComicSwitchPreview,
} from "@/components/docs/FieldsPreview";

function CardPreview() {
  return (
    <Card className="w-60">
      <CardHeader>
        <CardTitle>Pro plan</CardTitle>
        <CardDescription>For teams shipping every day.</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button size="sm" className="w-full">
          Start trial
        </Button>
      </CardFooter>
    </Card>
  );
}

function AlertPreview() {
  return (
    <Alert tone="success" title="Changes saved" role="note" className="w-72">
      Your workspace is up to date.
    </Alert>
  );
}

function TextareaPreview() {
  return (
    <div className="w-64">
      <p className="mb-2 font-bold">Feedback</p>
      <Textarea aria-label="Feedback" rows={2} placeholder="What should we build next?" />
    </div>
  );
}

function AccordionPreview() {
  return (
    <Accordion
      className="w-72"
      defaultOpen={["license"]}
      items={[
        { id: "license", title: "Is it free?", content: "Yes, MIT licensed." },
        { id: "install", title: "How do I install it?", content: "bun add @streamuilib/react" },
      ]}
    />
  );
}

function ProgressPreview() {
  return (
    <div className="w-64">
      <div className="mb-2 flex justify-between text-sm">
        <span className="font-bold">Storage</span>
        <span className="font-mono tabular-nums">72%</span>
      </div>
      <Progress value={72} aria-label="Storage" />
    </div>
  );
}

const iconDemos: { icon: LucideIcon; animation: IconAnimation }[] = [
  { icon: Rocket, animation: "bounce" },
  { icon: Settings, animation: "spin" },
  { icon: Bell, animation: "wiggle" },
  { icon: Heart, animation: "pulse" },
];

function AnimatedIconPreview() {
  return (
    <div className="flex gap-3">
      {iconDemos.map(({ icon: Icon, animation }) => (
        <span key={animation} className="grid size-14 place-items-center border-2 border-ink bg-paper-raised shadow-brutal-sm">
          <AnimatedIcon animation={animation} trigger="loop" duration={1400}>
            <Icon aria-hidden className="size-6" strokeWidth={1.75} />
          </AnimatedIcon>
        </span>
      ))}
    </div>
  );
}

function TrackListPreview() {
  return (
    <TrackList
      className="w-72 border-2 border-ink shadow-brutal-sm"
      index={0}
      playing
      tracks={[
        { title: "Hard Edges", artist: "stream/ui demo", src: "", duration: 23, tone: "lime" },
        { title: "Offset Shadow", artist: "stream/ui demo", src: "", duration: 20, tone: "pink" },
      ]}
    />
  );
}

export const indexPreviews: Record<string, ComponentType> = {
  card: CardPreview,
  alert: AlertPreview,
  textarea: TextareaPreview,
  "radio-group": RadioGroupHorizontal,
  accordion: AccordionPreview,
  progress: ProgressPreview,
  "animated-icon": AnimatedIconPreview,
  "audio-player": AudioPlayerMini,
  "track-list": TrackListPreview,
  "comic-button": ComicButtonPreview,
  "comic-card": ComicCardPreview,
  "comic-alert": ComicAlertPreview,
  "comic-input": ComicInputPreview,
  "comic-textarea": ComicTextareaPreview,
  "comic-select": ComicSelectPreview,
  "comic-checkbox": ComicCheckboxPreview,
  "comic-radio-group": ComicRadioGroupPreview,
  "comic-switch": ComicSwitchPreview,
};

/** Previews for component groups (like Badges) on the /components index. */
export const groupPreviews: Record<string, ComponentType> = {
  button: ButtonsPreview,
  badge: BadgesPreview,
  card: CardsPreview,
  alert: AlertsPreview,
  input: InputsPreview,
  textarea: TextareasPreview,
  select: SelectsPreview,
  checkbox: CheckboxesPreview,
  "radio-group": RadioGroupsPreview,
  switch: SwitchesPreview,
  slider: SlidersPreview,
};

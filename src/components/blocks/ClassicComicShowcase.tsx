"use client";

import { useState, type ReactNode } from "react";
import { Mail, Plus, Zap } from "lucide-react";
import {
  Alert,
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  ComicAlert,
  ComicButton,
  ComicCard,
  ComicInput,
  ComicProgress,
  ComicSwitch,
  Input,
  Progress,
  Switch,
  cn,
} from "@streamuilib/react";
import { IntentLink as Link } from "@/components/ui/IntentLink";

type Design = "classic" | "comic";

/** One component, both designs. The toggle picks which one is on stage. */
const TILES: { slug: string; name: string; classic: () => ReactNode; comic: () => ReactNode }[] = [
  {
    slug: "button",
    name: "Button",
    classic: () => (
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button>
          <Plus aria-hidden /> Create
        </Button>
        <Button variant="pink">Delete</Button>
      </div>
    ),
    comic: () => (
      <div className="flex flex-wrap items-center justify-center gap-6">
        <ComicButton>Get started</ComicButton>
        <ComicButton shape="burst" tone="pink" tilt={6}>
          Buy!
        </ComicButton>
      </div>
    ),
  },
  {
    slug: "switch",
    name: "Switch",
    classic: () => (
      <div className="flex flex-col gap-4">
        <label className="flex items-center gap-3 font-bold">
          <Switch defaultChecked /> Email alerts
        </label>
        <label className="flex items-center gap-3 font-bold">
          <Switch /> SMS alerts
        </label>
      </div>
    ),
    comic: () => (
      <div className="flex flex-col gap-4">
        <label className="flex items-center gap-3 font-bold">
          <ComicSwitch defaultChecked /> Sound effects
        </label>
        <label className="flex items-center gap-3 font-bold">
          <ComicSwitch /> Dark lair mode
        </label>
      </div>
    ),
  },
  {
    slug: "progress",
    name: "Progress",
    classic: () => (
      <div className="flex w-full max-w-xs flex-col gap-5">
        <Progress value={72} tone="pink" aria-label="Storage" />
        <Progress value={38} tone="lime" aria-label="Bandwidth" />
      </div>
    ),
    comic: () => (
      <div className="flex w-full max-w-xs flex-col gap-6 pt-2">
        <ComicProgress value={64} tone="lime" aria-label="Level" />
        <ComicProgress value={85} tone="blue" aria-label="Quest" />
      </div>
    ),
  },
  {
    slug: "input",
    name: "Input",
    classic: () => (
      <div className="w-full max-w-xs">
        <Input type="email" icon={<Mail />} aria-label="Email" placeholder="name@company.com" />
      </div>
    ),
    comic: () => (
      <div className="w-full max-w-xs">
        <ComicInput type="email" icon={<Mail />} aria-label="Email" placeholder="you@example.com" />
      </div>
    ),
  },
  {
    slug: "alert",
    name: "Alert",
    classic: () => (
      <div className="w-full max-w-xs">
        <Alert tone="success" title="Changes saved">
          Your profile is up to date.
        </Alert>
      </div>
    ),
    comic: () => (
      <div className="w-full max-w-xs pt-3">
        <ComicAlert tone="success" title="Changes saved">
          Your profile is up to date.
        </ComicAlert>
      </div>
    ),
  },
  {
    slug: "card",
    name: "Card",
    classic: () => (
      <Card className="w-full max-w-xs">
        <CardHeader>
          <CardTitle>Deploys in seconds</CardTitle>
          <CardDescription>Every pull request gets a live URL.</CardDescription>
        </CardHeader>
      </Card>
    ),
    comic: () => (
      <div className="w-full max-w-[16.5rem] pt-4">
        <ComicCard caption="Meanwhile, in prod…" sfx="Kapow!">
          <CardTitle>Deploys in seconds</CardTitle>
          <CardDescription>Every pull request gets a live URL.</CardDescription>
        </ComicCard>
      </div>
    ),
  },
];

const DESIGNS: { id: Design; name: string }[] = [
  { id: "classic", name: "Classic" },
  { id: "comic", name: "Comic" },
];

/**
 * The home page's Classic or Comic board: one toggle flips six live
 * components between their two designs, so the pairing is the point.
 */
export function ClassicComicShowcase() {
  const [design, setDesign] = useState<Design>("classic");

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-ink bg-paper-raised px-5 py-4 sm:px-6">
        <div role="group" aria-label="Design" className="inline-flex border-2 border-ink shadow-brutal-sm">
          {DESIGNS.map((d, i) => (
            <button
              key={d.id}
              type="button"
              aria-pressed={design === d.id}
              onClick={() => setDesign(d.id)}
              className={cn(
                "inline-flex cursor-pointer items-center gap-2 px-4 py-2 font-mono text-sm font-bold uppercase transition-colors duration-150 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue motion-reduce:transition-none",
                i > 0 && "border-l-2 border-ink",
                design === d.id ? (d.id === "comic" ? "bg-pink text-on-bright" : "bg-lime text-on-bright") : "bg-paper text-ink hover:bg-paper-raised",
              )}
            >
              {d.id === "comic" && <Zap aria-hidden className="size-4" />}
              {d.name}
            </button>
          ))}
        </div>
        <p className="font-mono text-xs text-ink-muted" aria-live="polite">
          Showing the {design} design · same props, same keyboard support
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-0.5 bg-ink sm:grid-cols-2 lg:grid-cols-3">
        {TILES.map((t) => (
          <li key={t.slug} className={cn("flex min-h-64 flex-col", design === "comic" ? "bg-orange-soft" : "bg-paper")}>
            <div className="flex items-center justify-between gap-3 border-b-2 border-dashed border-ink-faint px-5 py-3 font-mono text-xs">
              <span className="font-semibold">{design === "comic" ? `Comic${t.name}` : t.name}</span>
              <Link href={`/components/${t.slug}/${design}`} className="font-bold underline decoration-2 underline-offset-2 hover:text-ink-muted">
                Docs →
              </Link>
            </div>
            {/* Keyed by design, so the new one mounts fresh (and plays its entrance). */}
            <div key={design} className="flex flex-1 items-center justify-center p-6 sm:p-8">
              {design === "classic" ? t.classic() : t.comic()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

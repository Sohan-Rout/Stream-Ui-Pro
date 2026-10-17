"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowUp, Paperclip, Sparkles } from "lucide-react";
import { Badge, Button } from "@streamuilib/react";

const MAX = 500;

const suggestions = [
  "A landing page for a coffee roaster",
  "A pricing table with three plans",
  "A settings screen with a dark sidebar",
];

/**
 * Prompt hero: a headline over a large prompt box, the "describe what you
 * want" pattern of AI builders. Enter sends, Shift+Enter adds a line, and
 * the suggestion chips fill the box. Point the form `action` at your app.
 */
export function PromptHeroSection({ headingAs: Heading = "h1" }: { headingAs?: "h1" | "h2" | "h3" }) {
  const [prompt, setPrompt] = useState("");
  const box = useRef<HTMLTextAreaElement>(null);
  const empty = prompt.trim() === "";

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    // Enter sends; Shift+Enter (and Enter while composing, e.g. IME input) doesn't.
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (!empty) e.currentTarget.form?.requestSubmit();
    }
  }

  function suggest(text: string) {
    setPrompt(text);
    box.current?.focus();
  }

  return (
    <section className="@container bg-pink-soft bg-dots">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-14 text-center @3xl:py-20">
        <Badge tone="paper">
          <Sparkles aria-hidden className="size-3.5" />
          Now in public beta
        </Badge>
        <Heading className="font-display text-4xl leading-none tracking-tight text-balance @3xl:text-6xl">
          Describe the page. Get the code.
        </Heading>
        <p className="max-w-xl text-lg leading-relaxed text-ink-muted">
          Tell Acme what you need and it drafts a responsive React page you can edit, export, or
          deploy.
        </p>

        <form action="/new" method="get" className="w-full text-left">
          <div className="border-2 border-ink bg-paper-raised shadow-brutal-lg focus-within:outline-3 focus-within:outline-offset-4 focus-within:outline-blue">
            <label htmlFor="hero-prompt" className="sr-only">
              Describe what you want to build
            </label>
            <textarea
              ref={box}
              id="hero-prompt"
              name="prompt"
              rows={3}
              maxLength={MAX}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="A portfolio site with a project grid and a contact form…"
              className="block w-full resize-none bg-transparent px-5 pt-4 text-lg leading-relaxed outline-none placeholder:text-ink-faint"
            />
            <div className="flex items-center justify-between gap-3 px-3 pt-2 pb-3">
              <Button type="button" variant="secondary" size="icon" aria-label="Attach a file" className="size-9 shadow-brutal-sm">
                <Paperclip aria-hidden />
              </Button>
              <div className="flex items-center gap-3">
                <span aria-hidden className="font-mono text-xs text-ink-muted">
                  {prompt.length}/{MAX}
                </span>
                <Button type="submit" size="icon" aria-label="Generate" disabled={empty} className="size-9 shadow-brutal-sm">
                  <ArrowUp aria-hidden />
                </Button>
              </div>
            </div>
          </div>
          <p className="mt-3 text-center font-mono text-xs text-ink-muted">
            Enter to send · Shift + Enter for a new line
          </p>
        </form>

        <ul aria-label="Try an example" className="flex flex-wrap justify-center gap-2">
          {suggestions.map((s) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => suggest(s)}
                className="cursor-pointer border-2 border-ink bg-paper px-3 py-1.5 text-sm font-semibold transition-colors duration-150 hover:bg-lime focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue"
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

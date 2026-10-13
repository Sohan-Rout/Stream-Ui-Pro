import { ArrowRight, Check } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { siteConfig } from "@/lib/site";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonStyles } from "@/components/ui/Button";
import { InstallCommand } from "./InstallCommand";

type Token = [text: string, kind?: "kw" | "str" | "dim"];

// Hand-tokenized so the hero needs no syntax highlighter.
const code: { tokens: Token[]; highlight?: boolean }[] = [
  { tokens: [["import", "kw"], [" { Button } "], ["from", "kw"], [' "@/components/ui/button"', "str"], [";", "dim"]] },
  { tokens: [] },
  { tokens: [["export function", "kw"], [" Actions() {"]] },
  { tokens: [["  return", "kw"], [" ("]] },
  { tokens: [['    <div className=', "dim"], ['"flex gap-3"', "str"], [">", "dim"]] },
  { tokens: [["      <Button>"], ["Deploy"], ["</Button>"]], highlight: true },
  { tokens: [["      <Button variant="], ['"secondary"', "str"], [">Cancel</Button>"]] },
  { tokens: [["    </div>", "dim"]] },
  { tokens: [["  );"]] },
  { tokens: [["}"]] },
];

const tokenClass = {
  kw: "font-bold",
  str: "text-ink-muted",
  dim: "text-ink-muted",
} as const;

export function Hero() {
  return (
    <Section id="top" railClassName="grid grid-cols-1 lg:grid-cols-2">
      {/* Pitch */}
      <div className="flex flex-col justify-center gap-8 px-5 py-14 sm:px-10 sm:py-20 lg:border-r-2 lg:border-ink">
        <Badge tone="paper" className="self-start">
          <span aria-hidden className="size-2 rounded-full bg-lime ring-2 ring-ink" />
          v0.1 · public beta
        </Badge>

        <h1 className="font-display text-4xl leading-none tracking-tight text-balance sm:text-5xl xl:text-6xl">
          React components with{" "}
          <span className="box-decoration-clone bg-lime px-2 text-on-bright">
            hard edges.
          </span>
        </h1>

        <p className="max-w-lg text-lg leading-relaxed text-pretty text-ink-muted">
          Components, page sections, and icons built on Tailwind v4 and
          TypeScript. Add them one at a time with the CLI. The source lands in
          your repo, ready to edit.
        </p>

        <div className="flex flex-wrap gap-4">
          <a href="#components" className={buttonStyles({ size: "lg" })}>
            Browse components <ArrowRight aria-hidden />
          </a>
          <a
            href={siteConfig.githubUrl}
            className={buttonStyles({ variant: "secondary", size: "lg" })}
          >
            <SiGithub aria-hidden /> GitHub
          </a>
        </div>

        <InstallCommand command={siteConfig.installCommand} className="self-start" />
      </div>

      {/* Source → result */}
      <div className="flex flex-col justify-center gap-5 border-t-2 border-ink bg-lime-soft bg-dots px-5 py-14 sm:px-10 lg:border-t-0">
        <figure className="border-2 border-ink bg-paper-raised shadow-brutal-lg">
          <div className="flex items-stretch border-b-2 border-ink font-mono text-xs">
            <span className="border-r-2 border-ink bg-paper-raised px-4 py-2.5 font-bold">
              actions.tsx
            </span>
            <span className="flex-1 bg-paper-sunken" />
          </div>

          <pre className="overflow-x-auto py-4 font-mono text-sm leading-6 [scrollbar-width:none]">
            <code>
              {code.map((line, i) => (
                <span
                  key={i}
                  className={`flex ${line.highlight ? "bg-lime" : ""}`}
                >
                  <span aria-hidden className="w-10 shrink-0 pr-3 text-right text-ink-muted select-none">
                    {i + 1}
                  </span>
                  <span className="pr-4 whitespace-pre">
                    {line.tokens.map(([text, kind], j) => (
                      <span key={j} className={kind ? tokenClass[kind] : undefined}>
                        {text}
                      </span>
                    ))}
                    {line.tokens.length === 0 && " "}
                  </span>
                </span>
              ))}
            </code>
          </pre>

          <figcaption className="flex flex-wrap items-center justify-between gap-4 border-t-2 border-ink bg-paper px-4 py-4">
            <span className="font-mono text-xs text-ink-muted">Rendered</span>
            <span className="flex gap-3">
              <Button size="sm">Deploy</Button>
              <Button size="sm" variant="secondary">
                Cancel
              </Button>
            </span>
          </figcaption>
        </figure>

        <p className="flex items-center gap-2 font-mono text-xs text-ink-muted">
          <Check aria-hidden className="size-4 text-ink" strokeWidth={2.5} />
          added src/components/ui/button.tsx
        </p>
      </div>
    </Section>
  );
}

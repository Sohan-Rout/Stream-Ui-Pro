import { cn } from "@/lib/cn";
import { readSource } from "@/lib/source";
import { CodeBlock } from "./CodeBlock";
import { Live } from "@/components/docs/Live";

export type ExampleProps = {
  title: string;
  description?: string;
  /** Repo-relative path of the example file; its source is shown below. */
  file: string;
  /** Background for the preview stage. */
  stageClassName?: string;
};

/** A live preview with its exact source attached underneath. */
export function Example({ title, description, file, stageClassName }: ExampleProps) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h3 className="font-display text-xl tracking-tight">{title}</h3>
        {description && <p className="mt-1 text-ink-muted">{description}</p>}
      </div>
      <div className="border-2 border-ink shadow-brutal">
        <div
          className={cn(
            "flex min-h-48 items-center justify-center overflow-x-auto border-b-2 border-ink bg-dots px-5 py-8 sm:p-10",
            stageClassName ?? "bg-paper",
          )}
        >
          <Live file={file} />
        </div>
        <CodeBlock code={readSource(file)} filename={file.split("/").slice(-2).join("/")} framed={false} collapsible />
      </div>
    </section>
  );
}

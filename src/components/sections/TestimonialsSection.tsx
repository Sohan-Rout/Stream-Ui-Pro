import { Avatar } from "@streamuilib/react";

const quotes = [
  {
    body: "We cut our incident review time in half. Everyone reads the same timeline now.",
    name: "Priya Raman",
    role: "Engineering Manager, Northwind",
    initials: "PR",
    tone: "lime",
  },
  {
    body: "Preview links on every PR changed how design reviews work here. No more screenshots in Slack.",
    name: "Marcus Lee",
    role: "Design Lead, Fabrikam",
    initials: "ML",
    tone: "pink",
  },
  {
    body: "Setup took an afternoon. The performance budgets caught a regression the next morning.",
    name: "Sofia Alvarez",
    role: "Staff Engineer, Contoso",
    initials: "SA",
    tone: "blue",
  },
] as const;

/** Three quotes in ruled columns. */
export function TestimonialsSection() {
  return (
    <section className="@container bg-paper">
      <header className="border-b-2 border-ink p-8 @3xl:p-12">
        <p className="font-mono text-xs font-bold tracking-widest text-ink-muted uppercase">Customers</p>
        <h2 className="mt-4 max-w-xl font-display text-3xl leading-tight tracking-tight text-balance @3xl:text-4xl">
          Teams that stopped asking “what changed?”
        </h2>
      </header>
      <ul className="grid grid-cols-1 gap-0.5 bg-ink @3xl:grid-cols-3">
        {quotes.map((q) => (
          <li key={q.name} className="bg-paper p-8">
            <figure className="flex h-full flex-col gap-6">
              <blockquote className="flex-1 text-lg leading-relaxed">
                <p>
                  <span aria-hidden className="font-display text-3xl leading-none">“</span>
                  {q.body}
                </p>
              </blockquote>
              <figcaption className="flex items-center gap-3 border-t-2 border-dashed border-ink-faint pt-5">
                <Avatar initials={q.initials} tone={q.tone} size="sm" />
                <span>
                  <span className="block font-bold">{q.name}</span>
                  <span className="block text-sm text-ink-muted">{q.role}</span>
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}

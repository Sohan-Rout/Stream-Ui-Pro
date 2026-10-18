import { Plus } from "lucide-react";

const faqs = [
  {
    q: "Can I try it before paying?",
    a: "Yes. Starter is free forever, and Pro has a 14-day trial with no credit card.",
  },
  {
    q: "Where is my data stored?",
    a: "In the region you choose at signup. Enterprise plans can pin data to a single country.",
  },
  {
    q: "Do you support SSO?",
    a: "SAML and SCIM are included in Enterprise. Pro supports Google and GitHub sign-in.",
  },
  {
    q: "What happens if I cancel?",
    a: "You keep access until the end of the billing period, then you can export everything.",
  },
];

/**
 * Accordion built on native <details>, so it works without JavaScript and
 * keyboard and screen reader support come from the browser.
 */
export function FaqSection() {
  return (
    <section className="@container bg-paper text-ink">
      <div className="grid grid-cols-1 @3xl:grid-cols-3">
        <header className="border-b-2 border-ink p-8 @3xl:border-r-2 @3xl:border-b-0 @3xl:p-12">
          <p className="font-mono text-xs font-bold tracking-widest text-ink-muted uppercase">FAQ</p>
          <h2 className="mt-4 font-display text-3xl leading-tight tracking-tight">Questions, answered.</h2>
          <p className="mt-4 leading-relaxed text-ink-muted">
            Something else? Email{" "}
            <a href="mailto:help@acme.dev" className="font-semibold text-ink underline decoration-2 underline-offset-4">
              help@acme.dev
            </a>
            .
          </p>
        </header>
        <div className="flex flex-col gap-4 p-8 @3xl:col-span-2 @3xl:p-12">
          {faqs.map((f, i) => (
            <details
              key={f.q}
              open={i === 0}
              className="group border-2 border-ink bg-paper-raised shadow-brutal-sm open:bg-orange open:text-on-bright"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-bold [&::-webkit-details-marker]:hidden">
                {f.q}
                <Plus
                  aria-hidden
                  className="size-5 shrink-0 transition-transform duration-150 group-open:rotate-45 motion-reduce:transition-none"
                />
              </summary>
              <p className="border-t-2 border-ink px-5 py-4 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Button, Input } from "@streamuilib/react";

const columns = [
  { title: "Product", links: ["Features", "Pricing", "Changelog", "Status"] },
  { title: "Company", links: ["About", "Careers", "Blog", "Press"] },
  { title: "Legal", links: ["Privacy", "Terms", "Security"] },
];

/** Footer with a newsletter signup and ruled link columns. */
export function FooterSection() {
  return (
    <footer className="@container bg-paper">
      <div className="grid grid-cols-1 gap-0.5 bg-ink @3xl:grid-cols-5">
        <div className="flex flex-col gap-5 bg-paper p-8 @3xl:col-span-2">
          <span className="font-display text-2xl tracking-tight">acme</span>
          <form className="flex flex-col gap-3" action="#">
            <label htmlFor="footer-email" className="font-bold">
              Product updates, once a month
            </label>
            <div className="flex flex-col gap-3 @sm:flex-row">
              <Input id="footer-email" type="email" required placeholder="you@company.com" frameClassName="flex-1" />
              <Button type="submit">Subscribe</Button>
            </div>
          </form>
        </div>
        {columns.map((c) => (
          <nav key={c.title} aria-label={c.title} className="bg-paper p-8">
            <p className="font-mono text-xs font-bold tracking-widest text-ink-muted uppercase">{c.title}</p>
            <ul className="mt-4 flex flex-col gap-2">
              {c.links.map((l) => (
                <li key={l}>
                  <a href="#" className="font-semibold underline-offset-4 hover:underline hover:decoration-2">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="flex flex-col gap-2 border-t-2 border-ink px-8 py-4 font-mono text-xs text-ink-muted @xl:flex-row @xl:justify-between">
        <span>© Acme, Inc.</span>
        <span>Made with stream/ui</span>
      </div>
    </footer>
  );
}

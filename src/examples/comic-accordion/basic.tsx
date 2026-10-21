import { ComicAccordion } from "@streamuilib/react";

export default function ComicAccordionBasic() {
  return (
    <ComicAccordion
      className="w-full max-w-lg"
      defaultOpen={["free"]}
      items={[
        { id: "free", title: "Is it really free?", content: "Yes! MIT licensed. Use it in anything, no strings attached." },
        { id: "react", title: "Does it need React 19?", content: "React 18 or 19 both work. The styles come from Tailwind CSS v4." },
        { id: "dark", title: "Is there a dark mode?", content: "Not yet. Comics are printed on paper, after all." },
      ]}
    />
  );
}

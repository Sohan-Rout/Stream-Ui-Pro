import { ComicAccordion } from "@streamuilib/react";

export default function ComicAccordionExclusive() {
  return (
    <ComicAccordion
      exclusive
      className="w-full max-w-lg"
      items={[
        { id: "1", title: "Chapter 1: The spark", content: "Opening one chapter closes the others." },
        { id: "2", title: "Chapter 2: The fall", content: "Only one is open at a time, using the native details name attribute." },
        { id: "3", title: "Chapter 3: The comeback", content: "No JavaScript needed." },
      ]}
    />
  );
}

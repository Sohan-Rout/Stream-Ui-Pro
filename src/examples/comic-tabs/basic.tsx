import { ComicTabs } from "@streamuilib/react";

export default function ComicTabsBasic() {
  return (
    <ComicTabs
      label="Episode"
      className="w-full max-w-lg"
      items={[
        {
          id: "origin",
          label: "Origin",
          content: <p>A mild-mannered stylesheet falls into a vat of hard shadows. Nothing is ever soft again.</p>,
        },
        {
          id: "powers",
          label: "Powers",
          content: <p>Thick ink borders, halftone dots, and the ability to shout POW! on click.</p>,
        },
        {
          id: "nemesis",
          label: "Nemesis",
          content: <p>Gradient Man, who blurs every edge he touches. Stay sharp.</p>,
        },
      ]}
    />
  );
}

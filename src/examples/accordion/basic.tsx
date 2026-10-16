import { Accordion } from "@streamuilib/react";

const items = [
  { id: "install", title: "How do I install it?", content: "Run bun add @streamuilib/react, then import the theme in your CSS." },
  { id: "tailwind", title: "Do I need Tailwind?", content: "Yes, Tailwind CSS v4. The components are styled with its classes." },
  { id: "license", title: "Can I use it commercially?", content: "Yes. stream/ui is MIT licensed." },
];

export default function AccordionBasic() {
  return <Accordion items={items} defaultOpen={["install"]} className="w-full max-w-md" />;
}

import { Accordion } from "@streamuilib/react";

const steps = [
  { id: "account", title: "1. Create an account", content: "Sign up with GitHub or email." },
  { id: "project", title: "2. Create a project", content: "Name it and pick a region close to your users." },
  { id: "deploy", title: "3. Deploy", content: "Push to main and your preview URL is ready in a minute." },
];

export default function AccordionExclusive() {
  return <Accordion items={steps} exclusive defaultOpen={["account"]} className="w-full max-w-md" />;
}

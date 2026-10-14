import { Tabs } from "@/components/ui/Tabs";

const items = [
  { id: "preview", label: "Preview", content: "The rendered component, styled with your theme tokens." },
  { id: "code", label: "Code", content: "The source file the CLI copies into your repo." },
  { id: "props", label: "Props", content: "variant, size, className, and every native button prop." },
].map((t) => ({ ...t, content: <p className="leading-relaxed">{t.content}</p> }));

export function TabsDemo() {
  return <Tabs items={items} label="Component view" className="w-full max-w-sm" />;
}

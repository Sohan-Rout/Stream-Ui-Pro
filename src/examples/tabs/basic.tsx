import { Tabs } from "@/components/ui/Tabs";

const items = [
  {
    id: "overview",
    label: "Overview",
    content: <p className="leading-relaxed">Traffic is up 12% week over week, led by organic search.</p>,
  },
  {
    id: "activity",
    label: "Activity",
    content: <p className="leading-relaxed">3 deploys today. The last one finished 4 minutes ago.</p>,
  },
  {
    id: "settings",
    label: "Settings",
    content: <p className="leading-relaxed">Project settings are managed by your workspace admin.</p>,
  },
];

export default function TabsBasic() {
  return <Tabs items={items} label="Project" className="w-full max-w-md" />;
}

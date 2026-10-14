import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";

export default function InputWithIcon() {
  return (
    <div className="w-full max-w-xs">
      <label htmlFor="input-search" className="sr-only">
        Search projects
      </label>
      <Input id="input-search" type="search" icon={<Search />} placeholder="Search projects…" />
    </div>
  );
}

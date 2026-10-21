import { Mail, Search } from "lucide-react";
import { ComicInput } from "@streamuilib/react";

export default function ComicInputBasic() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      <label className="flex flex-col gap-2">
        <span className="font-bold">Your hero name</span>
        <ComicInput placeholder="Captain Brutal" />
      </label>
      <label className="flex flex-col gap-2">
        <span className="font-bold">Email</span>
        <ComicInput type="email" icon={<Mail />} placeholder="you@example.com" />
      </label>
      <ComicInput type="search" icon={<Search />} aria-label="Search issues" placeholder="Search issues…" />
    </div>
  );
}

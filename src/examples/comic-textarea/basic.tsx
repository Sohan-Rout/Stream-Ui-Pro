import { ComicTextarea } from "@streamuilib/react";

export default function ComicTextareaBasic() {
  return (
    <label className="flex w-full max-w-md flex-col gap-2">
      <span className="font-bold">Say something!</span>
      <ComicTextarea placeholder="What should we build next?" />
    </label>
  );
}

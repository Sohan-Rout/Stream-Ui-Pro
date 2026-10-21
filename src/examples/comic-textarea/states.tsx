import { ComicTextarea } from "@streamuilib/react";

export default function ComicTextareaStates() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <label className="flex flex-col gap-2">
        <span className="font-bold">Bio</span>
        <ComicTextarea rows={2} invalid defaultValue="hi" aria-describedby="comic-bio-error" />
        <span id="comic-bio-error" className="text-sm font-semibold">
          Tell us a little more: at least 20 characters.
        </span>
      </label>
      <label className="flex flex-col gap-2">
        <span className="font-bold">Notes, no tail</span>
        <ComicTextarea rows={2} tail={false} placeholder="A plain comic box" />
      </label>
    </div>
  );
}

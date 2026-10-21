import { ComicInput } from "@streamuilib/react";

export default function ComicInputStates() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <label className="flex flex-col gap-2">
        <span className="font-bold">Username</span>
        <ComicInput defaultValue="no spaces allowed" invalid aria-describedby="comic-user-error" />
        <span id="comic-user-error" className="text-sm font-semibold text-ink">
          Use letters, numbers, and dashes only.
        </span>
      </label>
      <label className="flex flex-col gap-2">
        <span className="font-bold">Coupon</span>
        <ComicInput defaultValue="NOPE" invalid sfx="Nope!" />
      </label>
      <label className="flex flex-col gap-2">
        <span className="font-bold">Workspace</span>
        <ComicInput defaultValue="stream-ui" disabled />
      </label>
    </div>
  );
}

import { Textarea } from "@streamui/react";

export default function TextareaStates() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <div>
        <label htmlFor="textarea-bio" className="mb-2 block font-bold">
          Bio
        </label>
        <Textarea id="textarea-bio" rows={3} defaultValue="Hi" invalid aria-describedby="textarea-bio-error" />
        <p id="textarea-bio-error" className="mt-2 text-sm font-semibold">
          Write at least 20 characters.
        </p>
      </div>
      <div>
        <label htmlFor="textarea-locked" className="mb-2 block font-bold">
          Admin notes
        </label>
        <Textarea id="textarea-locked" rows={2} defaultValue="Only admins can edit this." disabled />
      </div>
    </div>
  );
}

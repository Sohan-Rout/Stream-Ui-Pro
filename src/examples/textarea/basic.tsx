import { Textarea } from "@streamuilib/react";

export default function TextareaBasic() {
  return (
    <div className="w-full max-w-sm">
      <label htmlFor="textarea-feedback" className="mb-2 block font-bold">
        Feedback
      </label>
      <Textarea
        id="textarea-feedback"
        placeholder="What should we build next?"
        aria-describedby="textarea-feedback-hint"
      />
      <p id="textarea-feedback-hint" className="mt-2 text-sm text-ink-muted">
        Markdown is supported.
      </p>
    </div>
  );
}

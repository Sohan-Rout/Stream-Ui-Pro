import { Input } from "@streamuilib/react";

export default function InputBasic() {
  return (
    <div className="w-full max-w-xs">
      <label htmlFor="input-name" className="mb-2 block font-bold">
        Full name
      </label>
      <Input id="input-name" autoComplete="name" placeholder="Ada Lovelace" aria-describedby="input-name-hint" />
      <p id="input-name-hint" className="mt-2 text-sm text-ink-muted">
        As it appears on your invoices.
      </p>
    </div>
  );
}

import { Mail } from "lucide-react";
import { Input } from "@streamui/react";

export default function InputStates() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-6">
      <div>
        <label htmlFor="input-invalid" className="mb-2 block font-bold">
          Work email
        </label>
        <Input
          id="input-invalid"
          type="email"
          icon={<Mail />}
          defaultValue="ada@"
          invalid
          aria-describedby="input-invalid-error"
        />
        <p id="input-invalid-error" className="mt-2 text-sm font-semibold">
          Enter a complete email address.
        </p>
      </div>
      <div>
        <label htmlFor="input-disabled" className="mb-2 block font-bold">
          Workspace ID
        </label>
        <Input id="input-disabled" defaultValue="ws_8f2k1" disabled />
      </div>
    </div>
  );
}

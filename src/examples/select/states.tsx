import { Select } from "@streamuilib/react";

export default function SelectStates() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-6">
      <div>
        <label htmlFor="select-role" className="mb-2 block font-bold">
          Role
        </label>
        <Select id="select-role" defaultValue="" invalid aria-describedby="select-role-error">
          <option value="" disabled>
            Choose a role…
          </option>
          <option value="admin">Admin</option>
          <option value="member">Member</option>
        </Select>
        <p id="select-role-error" className="mt-2 text-sm font-semibold">
          Pick a role to send the invite.
        </p>
      </div>
      <div>
        <label htmlFor="select-plan" className="mb-2 block font-bold">
          Plan
        </label>
        <Select id="select-plan" disabled>
          <option>Enterprise (managed)</option>
        </Select>
      </div>
    </div>
  );
}

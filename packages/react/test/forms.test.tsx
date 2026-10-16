import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Radio, RadioGroup, Select, Textarea } from "../src";

describe("Textarea", () => {
  test("is labelled, typeable, and defaults to 4 rows", async () => {
    render(
      <>
        <label htmlFor="msg">Message</label>
        <Textarea id="msg" />
      </>,
    );
    const box = screen.getByRole("textbox", { name: "Message" }) as HTMLTextAreaElement;
    expect(box.getAttribute("rows")).toBe("4");
    await userEvent.type(box, "Hello");
    expect(box.value).toBe("Hello");
  });

  test("sets aria-invalid only when invalid", () => {
    const { rerender } = render(<Textarea aria-label="x" />);
    expect(screen.getByRole("textbox").hasAttribute("aria-invalid")).toBe(false);
    rerender(<Textarea aria-label="x" invalid />);
    expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBe("true");
  });
});

describe("Select", () => {
  const options = (
    <>
      <option value="">Choose…</option>
      <option value="react">React</option>
      <option value="vue">Vue</option>
    </>
  );

  test("is a native, labelled combobox", () => {
    render(
      <>
        <label htmlFor="fw">Framework</label>
        <Select id="fw">{options}</Select>
      </>,
    );
    const select = screen.getByRole("combobox", { name: "Framework" });
    expect(select.tagName).toBe("SELECT");
  });

  test("changes value like a native select", async () => {
    render(<Select aria-label="Framework">{options}</Select>);
    await userEvent.selectOptions(screen.getByRole("combobox"), "vue");
    expect((screen.getByRole("combobox") as HTMLSelectElement).value).toBe("vue");
  });

  test("the chevron is decorative", () => {
    render(<Select aria-label="x">{options}</Select>);
    expect(screen.getByRole("combobox").parentElement?.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });

  test("sets aria-invalid only when invalid", () => {
    render(<Select aria-label="x" invalid>{options}</Select>);
    expect(screen.getByRole("combobox").getAttribute("aria-invalid")).toBe("true");
  });
});

describe("Radio and RadioGroup", () => {
  function Plans() {
    return (
      <RadioGroup legend="Plan">
        <Radio name="plan" value="free" label="Free" defaultChecked />
        <Radio name="plan" value="pro" label="Pro" description="For teams" />
        <Radio name="plan" value="ent" label="Enterprise" disabled />
      </RadioGroup>
    );
  }

  test("the group is named by its legend", () => {
    render(<Plans />);
    expect(screen.getByRole("group", { name: "Plan" })).toBeDefined();
  });

  test("radios are real inputs named by their labels", () => {
    render(<Plans />);
    expect(screen.getAllByRole("radio")).toHaveLength(3);
    expect(screen.getByRole("radio", { name: /Pro/ })).toBeDefined();
  });

  test("choosing one unchecks the others", async () => {
    render(<Plans />);
    await userEvent.click(screen.getByText("Pro"));
    expect((screen.getByRole("radio", { name: /Pro/ }) as HTMLInputElement).checked).toBe(true);
    expect((screen.getByRole("radio", { name: "Free" }) as HTMLInputElement).checked).toBe(false);
  });

  test("disabled radios can't be chosen", async () => {
    render(<Plans />);
    await userEvent.click(screen.getByText("Enterprise"));
    expect((screen.getByRole("radio", { name: "Enterprise" }) as HTMLInputElement).checked).toBe(false);
  });

  test("submits the chosen value with a form", async () => {
    render(
      <form data-testid="form">
        <Plans />
      </form>,
    );
    await userEvent.click(screen.getByText("Pro"));
    expect(new FormData(screen.getByTestId("form") as HTMLFormElement).get("plan")).toBe("pro");
  });
});

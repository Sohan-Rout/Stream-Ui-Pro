/** The comic form fields keep their native elements: labels, values, states, and keyboard. */
import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  ComicCheckbox,
  ComicInput,
  ComicRadio,
  ComicRadioGroup,
  ComicSelect,
  ComicSlider,
  ComicSwitch,
  ComicTextarea,
} from "@streamuilib/react";

afterEach(cleanup);

describe("ComicInput", () => {
  test("is a typeable, labelled textbox", async () => {
    render(<ComicInput aria-label="Hero name" />);
    const box = screen.getByRole("textbox", { name: "Hero name" }) as HTMLInputElement;
    await userEvent.type(box, "Brutal");
    expect(box.value).toBe("Brutal");
    expect(box.hasAttribute("aria-invalid")).toBe(false);
  });

  test("invalid sets aria-invalid and a hidden sticker; sfx sets or drops it", () => {
    const { rerender } = render(<ComicInput aria-label="x" invalid />);
    expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByText("Oops!").getAttribute("aria-hidden")).toBe("true");
    rerender(<ComicInput aria-label="x" invalid sfx="Nope!" />);
    expect(screen.getByText("Nope!")).toBeTruthy();
    rerender(<ComicInput aria-label="x" invalid sfx={false} />);
    expect(screen.queryByText("Oops!")).toBeNull();
  });
});

describe("ComicTextarea", () => {
  test("defaults to 4 rows and has a tail unless turned off", () => {
    const { container, rerender } = render(<ComicTextarea aria-label="Message" />);
    expect(screen.getByRole("textbox", { name: "Message" }).getAttribute("rows")).toBe("4");
    expect(container.querySelectorAll("span[aria-hidden]").length).toBe(2);
    rerender(<ComicTextarea aria-label="Message" tail={false} />);
    expect(container.querySelectorAll("span[aria-hidden]").length).toBe(0);
  });
});

describe("ComicSelect", () => {
  test("is a native combobox that changes value", async () => {
    render(
      <ComicSelect aria-label="Power" defaultValue="flight">
        <option value="flight">Flight</option>
        <option value="speed">Speed</option>
      </ComicSelect>,
    );
    const select = screen.getByRole("combobox", { name: "Power" }) as HTMLSelectElement;
    await userEvent.selectOptions(select, "speed");
    expect(select.value).toBe("speed");
  });
});

describe("ComicCheckbox", () => {
  test("toggles a real checkbox through its label", async () => {
    render(<ComicCheckbox label="Iron the cape" />);
    const box = screen.getByRole("checkbox", { name: "Iron the cape" }) as HTMLInputElement;
    expect(box.checked).toBe(false);
    await userEvent.click(screen.getByText("Iron the cape"));
    expect(box.checked).toBe(true);
  });
});

describe("ComicRadioGroup", () => {
  test("is a named group of exclusive radios", async () => {
    render(
      <ComicRadioGroup legend="Size">
        <ComicRadio name="size" value="s" label="Small" defaultChecked />
        <ComicRadio name="size" value="l" label="Large" />
      </ComicRadioGroup>,
    );
    expect(screen.getByRole("group", { name: "Size" })).toBeTruthy();
    await userEvent.click(screen.getByRole("radio", { name: "Large" }));
    expect((screen.getByRole("radio", { name: "Large" }) as HTMLInputElement).checked).toBe(true);
    expect((screen.getByRole("radio", { name: "Small" }) as HTMLInputElement).checked).toBe(false);
  });
});

describe("ComicSwitch", () => {
  test("is a switch that toggles and reports its state", async () => {
    const seen: boolean[] = [];
    render(<ComicSwitch aria-label="Sound" onCheckedChange={(v) => seen.push(v)} />);
    const sw = screen.getByRole("switch", { name: "Sound" });
    expect(sw.getAttribute("aria-checked")).toBe("false");
    expect(screen.getByText("Off")).toBeTruthy();
    await userEvent.click(sw);
    expect(sw.getAttribute("aria-checked")).toBe("true");
    expect(screen.getByText("On!")).toBeTruthy();
    expect(seen).toEqual([true]);
  });

  test("custom labels, or none", () => {
    const { rerender } = render(<ComicSwitch aria-label="x" defaultChecked labels={["Yes!", "Nah"]} />);
    expect(screen.getByText("Yes!")).toBeTruthy();
    rerender(<ComicSwitch aria-label="x" defaultChecked labels={false} />);
    expect(screen.queryByText("On!")).toBeNull();
  });
});

describe("ComicSlider", () => {
  test("is a native slider; the bubble shows the formatted value", () => {
    const seen: number[] = [];
    render(<ComicSlider aria-label="Power" value={60} onValueChange={(v) => seen.push(v)} formatValue={(v) => `${v}%`} />);
    const slider = screen.getByRole("slider", { name: "Power" });
    expect(screen.getByText("60%").getAttribute("aria-hidden")).toBe("true");
    fireEvent.change(slider, { target: { value: "75" } });
    expect(seen).toEqual([75]);
  });

  test("showValue={false} hides the bubble", () => {
    render(<ComicSlider aria-label="x" value={30} showValue={false} />);
    expect(screen.queryByText("30")).toBeNull();
  });
});

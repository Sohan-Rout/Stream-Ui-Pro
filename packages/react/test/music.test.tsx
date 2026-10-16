import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AudioPlayer, Equalizer, MiniPlayer, Slider, TrackList, formatTime, type Track } from "../src";

const tracks: Track[] = [
  { id: "a", title: "First", artist: "Band", src: "a.wav", duration: 30 },
  { id: "b", title: "Second", artist: "Band", src: "b.wav", duration: 45 },
  { id: "c", title: "Third", src: "c.wav", duration: 60 },
];

/* The test DOM can't decode audio: make play/pause fire the events a browser would. */
const proto = HTMLMediaElement.prototype;
const original = { play: proto.play, pause: proto.pause };
beforeEach(() => {
  proto.play = function (this: HTMLMediaElement) {
    this.dispatchEvent(new Event("play"));
    return Promise.resolve();
  };
  proto.pause = function (this: HTMLMediaElement) {
    this.dispatchEvent(new Event("pause"));
  };
});
afterEach(() => {
  proto.play = original.play;
  proto.pause = original.pause;
});

describe("formatTime", () => {
  test("formats minutes and seconds, and hours when needed", () => {
    expect(formatTime(0)).toBe("0:00");
    expect(formatTime(83)).toBe("1:23");
    expect(formatTime(3725)).toBe("1:02:05");
  });

  test("unknown durations read 0:00", () => {
    expect(formatTime(Number.NaN)).toBe("0:00");
    expect(formatTime(Infinity)).toBe("0:00");
    expect(formatTime(-5)).toBe("0:00");
  });
});

describe("Slider", () => {
  test("is a native, labelled range", () => {
    render(<Slider aria-label="Volume" value={40} />);
    const s = screen.getByRole("slider", { name: "Volume" }) as HTMLInputElement;
    expect(s.type).toBe("range");
    expect(s.value).toBe("40");
  });

  test("exposes the filled share of the track as a CSS variable", () => {
    render(<Slider aria-label="x" value={25} min={0} max={50} />);
    expect(screen.getByRole("slider").style.getPropertyValue("--sui-fill")).toBe("50%");
  });

  test("reports numbers through onValueChange", () => {
    const onValueChange = mock();
    render(<Slider aria-label="x" value={10} onValueChange={onValueChange} />);
    fireEvent.change(screen.getByRole("slider"), { target: { value: "70" } });
    expect(onValueChange).toHaveBeenCalledWith(70);
  });

  test("passes human-readable values to screen readers", () => {
    render(<Slider aria-label="Seek" value={83} max={185} aria-valuetext="1:23 of 3:05" />);
    expect(screen.getByRole("slider").getAttribute("aria-valuetext")).toBe("1:23 of 3:05");
  });
});

describe("Equalizer", () => {
  test("is decorative and draws the requested bars", () => {
    const { container } = render(<Equalizer bars={5} />);
    const eq = container.firstElementChild as HTMLElement;
    expect(eq.getAttribute("aria-hidden")).toBe("true");
    expect(eq.children).toHaveLength(5);
  });

  test("only animates while playing", () => {
    const { container, rerender } = render(<Equalizer playing />);
    expect((container.firstElementChild as HTMLElement).dataset.playing).toBe("true");
    rerender(<Equalizer playing={false} />);
    expect((container.firstElementChild as HTMLElement).hasAttribute("data-playing")).toBe(false);
  });
});

describe("TrackList", () => {
  test("lists every track and marks the current one", () => {
    render(<TrackList tracks={tracks} index={1} playing />);
    const items = screen.getAllByRole("button");
    expect(items).toHaveLength(3);
    expect(items[1].getAttribute("aria-current")).toBe("true");
    expect(items[1].textContent).toContain("Now playing:");
    expect(items[0].hasAttribute("aria-current")).toBe(false);
  });

  test("shows durations and reports the chosen track", async () => {
    const onSelect = mock();
    render(<TrackList tracks={tracks} onSelect={onSelect} />);
    expect(screen.getByText("0:45")).toBeDefined();
    await userEvent.click(screen.getByText("Third"));
    expect(onSelect).toHaveBeenCalledWith(2);
  });
});

describe("AudioPlayer", () => {
  const audio = () => document.querySelector("audio") as HTMLAudioElement;

  test("shows the first track and its position in the playlist", () => {
    render(<AudioPlayer tracks={tracks} />);
    expect(screen.getByText("First")).toBeDefined();
    expect(screen.getByText("Track 1 of 3")).toBeDefined();
    expect(audio().getAttribute("src")).toBe("a.wav");
  });

  test("play and pause follow the element's events", async () => {
    render(<AudioPlayer tracks={tracks} />);
    await userEvent.click(screen.getByRole("button", { name: "Play" }));
    expect(screen.getByRole("button", { name: "Pause" })).toBeDefined();
    await userEvent.click(screen.getByRole("button", { name: "Pause" }));
    expect(screen.getByRole("button", { name: "Play" })).toBeDefined();
  });

  test("a pause from the browser itself (e.g. headphones unplugged) is reflected", async () => {
    render(<AudioPlayer tracks={tracks} />);
    await userEvent.click(screen.getByRole("button", { name: "Play" }));
    act(() => {
      audio().dispatchEvent(new Event("pause"));
    });
    expect(screen.getByRole("button", { name: "Play" })).toBeDefined();
  });

  test("next and previous move through the playlist, wrapping around", async () => {
    render(<AudioPlayer tracks={tracks} />);
    await userEvent.click(screen.getByRole("button", { name: "Next track" }));
    expect(screen.getByText("Second")).toBeDefined();
    await userEvent.click(screen.getByRole("button", { name: "Previous track" }));
    await userEvent.click(screen.getByRole("button", { name: "Previous track" }));
    expect(screen.getByText("Track 3 of 3")).toBeDefined();
  });

  test("previous restarts the track when you're more than 3 seconds in", async () => {
    render(<AudioPlayer tracks={tracks} defaultIndex={1} />);
    act(() => {
      Object.defineProperty(audio(), "currentTime", { value: 10, writable: true, configurable: true });
      audio().dispatchEvent(new Event("timeupdate"));
    });
    await userEvent.click(screen.getByRole("button", { name: "Previous track" }));
    expect(screen.getByText("Track 2 of 3")).toBeDefined();
    expect(audio().currentTime).toBe(0);
  });

  test("when a track ends, the next one plays", async () => {
    render(<AudioPlayer tracks={tracks} />);
    await userEvent.click(screen.getByRole("button", { name: "Play" }));
    act(() => {
      audio().dispatchEvent(new Event("ended"));
    });
    expect(screen.getByText("Second")).toBeDefined();
    expect(audio().getAttribute("src")).toBe("b.wav");
  });

  test("without loop, the last track ending stops at the end", () => {
    render(<AudioPlayer tracks={tracks} defaultIndex={2} loop={false} />);
    act(() => {
      audio().dispatchEvent(new Event("ended"));
    });
    expect(screen.getByText("Track 3 of 3")).toBeDefined();
  });

  test("seek and volume sliders are labelled with readable values", () => {
    render(<AudioPlayer tracks={tracks} />);
    expect(screen.getByRole("slider", { name: "Seek" }).getAttribute("aria-valuetext")).toBe("0:00 of 0:30");
    expect(screen.getByRole("slider", { name: "Volume" }).getAttribute("aria-valuetext")).toBe("80%");
  });

  test("mute is a toggle button", async () => {
    render(<AudioPlayer tracks={tracks} />);
    const mute = screen.getByRole("button", { name: "Mute" });
    expect(mute.getAttribute("aria-pressed")).toBe("false");
    await userEvent.click(mute);
    expect(screen.getByRole("button", { name: "Unmute" }).getAttribute("aria-pressed")).toBe("true");
  });

  test("the playlist starts the track you pick", async () => {
    render(<AudioPlayer tracks={tracks} playlist />);
    await userEvent.click(screen.getByRole("button", { name: /Third/ }));
    expect(screen.getByText("Track 3 of 3")).toBeDefined();
    expect(audio().getAttribute("src")).toBe("c.wav");
  });

  test("play is disabled until a track has a source", () => {
    render(<AudioPlayer tracks={[{ title: "Loading", src: "" }]} />);
    expect((screen.getByRole("button", { name: "Play" }) as HTMLButtonElement).disabled).toBe(true);
    expect(audio().hasAttribute("src")).toBe(false);
  });
});

describe("MiniPlayer", () => {
  test("has play, next, and a seek line", async () => {
    render(<MiniPlayer tracks={tracks} />);
    expect(screen.getByRole("region", { name: "Mini player: First" })).toBeDefined();
    await userEvent.click(screen.getByRole("button", { name: "Next track" }));
    expect(screen.getByRole("region", { name: "Mini player: Second" })).toBeDefined();
    expect(screen.getByRole("slider", { name: "Seek" })).toBeDefined();
  });
});

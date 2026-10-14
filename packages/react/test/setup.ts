import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { afterEach } from "bun:test";

// A browser-like DOM for component tests. Registered before Testing Library
// loads so it binds to these globals.
GlobalRegistrator.register();

const { cleanup } = await import("@testing-library/react");
afterEach(() => cleanup());

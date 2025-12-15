import { describe, it, expect, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Geist: () => ({ className: "geist" }),
  Geist_Mono: () => ({ className: "geist-mono" }),
}));

import { geistMonoConfig, geistSansConfig } from "./fonts";

describe("font configuration", () => {
  it("keeps primary sans font ready for first paint", () => {
    expect(geistSansConfig.display).toBe("swap");
    expect(geistSansConfig.preload ?? true).toBe(true);
  });

  it("disables preload for rarely used mono font", () => {
    expect(geistMonoConfig.preload).toBe(false);
    expect(geistMonoConfig.display).toBe("swap");
  });
});

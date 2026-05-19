import { describe, expect, it } from "vitest";
import { translations } from "./translations";

describe("translations", () => {
  it("every single key entry has both 'en' and 'bn' definitions", () => {
    const missing: string[] = [];

    for (const [key, value] of Object.entries(translations)) {
      if (typeof value !== "object" || value === null) {
        missing.push(`${key} (not an object)`);
        continue;
      }
      
      const entry = value as Record<string, string>;
      if (!("en" in entry) || !entry.en) {
        missing.push(`${key}.en`);
      }
      if (!("bn" in entry) || !entry.bn) {
        missing.push(`${key}.bn`);
      }
    }

    expect(missing).toEqual([]);
  });

  it("contains core critical sections", () => {
    // Assert presence of important translation keys
    expect(translations).toHaveProperty("appointment.step0");
    expect(translations).toHaveProperty("appointment.step1");
    expect(translations).toHaveProperty("appointment.step2");
    expect(translations).toHaveProperty("appointment.step3");
    expect(translations).toHaveProperty("chambers.badge");
    expect(translations).toHaveProperty("chambers.title");
    expect(translations).toHaveProperty("breadcrumbs.chambers");
  });
});

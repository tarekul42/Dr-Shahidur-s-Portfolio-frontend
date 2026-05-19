import { beforeEach, describe, expect, it, vi } from "vitest";
import { useLanguageStore } from "./use-language-store";

describe("useLanguageStore", () => {
  beforeEach(() => {
    // Reset Zustand store state before each test
    useLanguageStore.setState({ language: "en" });
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  });

  it("defaults to English", () => {
    expect(useLanguageStore.getState().language).toBe("en");
  });

  it("sets language to Bengali", () => {
    useLanguageStore.getState().setLanguage("bn");
    expect(useLanguageStore.getState().language).toBe("bn");
  });

  it("toggles language between en and bn", () => {
    useLanguageStore.getState().toggleLanguage();
    expect(useLanguageStore.getState().language).toBe("bn");

    useLanguageStore.getState().toggleLanguage();
    expect(useLanguageStore.getState().language).toBe("en");
  });

  it("persists language selection to localStorage when browser environment is present", () => {
    // Mock localStorage
    const spy = vi.spyOn(Storage.prototype, "setItem");

    useLanguageStore.getState().setLanguage("bn");
    expect(spy).toHaveBeenCalledWith("language", "bn");

    useLanguageStore.getState().toggleLanguage();
    expect(spy).toHaveBeenCalledWith("language", "en");

    spy.mockRestore();
  });
});

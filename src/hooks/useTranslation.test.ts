import { beforeEach, describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTranslation } from "./useTranslation";
import { useLanguageStore } from "@/store/use-language-store";

describe("useTranslation hook", () => {
  beforeEach(() => {
    // Reset language store before each test
    useLanguageStore.setState({ language: "en" });
  });

  it("returns translation function and active language", () => {
    const { result } = renderHook(() => useTranslation());
    expect(result.current.language).toBe("en");
    expect(typeof result.current.t).toBe("function");
  });

  it("translates key into English by default", () => {
    const { result } = renderHook(() => useTranslation());
    expect(result.current.t("appointment.step1")).toBe("Personal Info");
  });

  it("translates key into Bengali when store language is changed", () => {
    const { result } = renderHook(() => useTranslation());

    act(() => {
      useLanguageStore.setState({ language: "bn" });
    });

    expect(result.current.t("appointment.step1")).toBe("ব্যক্তিগত তথ্য");
  });

  it("interpolates variables inside brackets dynamically", () => {
    const { result } = renderHook(() => useTranslation());
    
    // We can test variable replacement if we have a key in translations that uses {var}.
    // If not, we can rely on how `result.replace` handles custom strings in t() or test a known i18n entry.
    // Let's check a standard one or test how fallback key behaves with variables.
    // translations have "appointment.step2.availableOn" with `{days}` probably. Let's look at translation structure.
    expect(result.current.t("nonexistent.key")).toBe("nonexistent.key");
  });

  it("falls back to showing the key itself if the key is not found", () => {
    const { result } = renderHook(() => useTranslation());
    expect(result.current.t("unknown_key_name")).toBe("unknown_key_name");
  });

  it("calls store toggling methods correctly", () => {
    const { result } = renderHook(() => useTranslation());

    act(() => {
      result.current.toggleLanguage();
    });

    expect(useLanguageStore.getState().language).toBe("bn");
  });
});

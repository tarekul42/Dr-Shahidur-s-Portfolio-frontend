import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { LanguageToggle } from "./LanguageToggle";
import { useLanguageStore } from "@/store/use-language-store";

describe("LanguageToggle component", () => {
  beforeEach(() => {
    useLanguageStore.setState({ language: "en" });
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  });

  it("renders loader space before mounting on client", () => {
    const spy = vi.spyOn(React, "useState");
    spy.mockReturnValueOnce([false, vi.fn()]);

    const { container } = render(<LanguageToggle />);
    expect(container.querySelector(".opacity-0")).toBeInTheDocument();

    spy.mockRestore();
  });

  it("renders both language labels EN and বা after mount", async () => {
    render(<LanguageToggle />);
    // Wait for the mounted state (which changes inside an useEffect)
    const button = await screen.findByRole("button", { name: /switch to/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByText("EN")).toBeInTheDocument();
    expect(screen.getByText("বা")).toBeInTheDocument();
  });

  it("indicates the current active language with appropriate highlight state", async () => {
    render(<LanguageToggle />);
    const button = await screen.findByRole("button", { name: /switch to/i });

    // Default is "en" -> ARIA label says "Switch to Bengali"
    expect(button).toHaveAttribute("aria-label", "Switch to Bengali");
  });

  it("toggles the global store language when clicked", async () => {
    render(<LanguageToggle />);
    const button = await screen.findByRole("button", { name: /switch to/i });

    fireEvent.click(button);
    expect(useLanguageStore.getState().language).toBe("bn");

    // Click again to switch back
    fireEvent.click(button);
    expect(useLanguageStore.getState().language).toBe("en");
  });

  it("pre-loads saved language selection from localStorage on load", async () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("language", "bn");
    }

    render(<LanguageToggle />);
    const button = await screen.findByRole("button");
    expect(button).toHaveAttribute("aria-label", "Switch to English");
  });
});

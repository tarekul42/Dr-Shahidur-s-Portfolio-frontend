import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CopyButton } from "./CopyButton";

describe("CopyButton", () => {
  const originalClipboard = navigator.clipboard;

  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
    vi.useFakeTimers();
  });

  afterEach(() => {
    Object.assign(navigator, {
      clipboard: originalClipboard,
    });
    vi.useRealTimers();
  });

  it("renders with default label", () => {
    render(<CopyButton value="test-val" />);
    expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
  });

  it("renders with custom label", () => {
    render(<CopyButton value="test-val" label="Copy Text" />);
    expect(screen.getByRole("button", { name: "Copy Text" })).toBeInTheDocument();
  });

  it("copies to clipboard and changes state temporarily", async () => {
    render(<CopyButton value="copy-this" />);
    const button = screen.getByRole("button", { name: "Copy" });
    
    await act(async () => {
      fireEvent.click(button);
    });
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("copy-this");
    expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(1200);
    });

    expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
  });

  it("handles clipboard write errors silently", async () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.reject(new Error("Failed"))),
      },
    });

    render(<CopyButton value="test-val" />);
    const button = screen.getByRole("button", { name: "Copy" });
    
    fireEvent.click(button);
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("test-val");
    // Should still be "Copy" since it threw an error
    expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
  });
});

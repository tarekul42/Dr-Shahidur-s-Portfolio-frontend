import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BackToTop } from "./BackToTop";
import * as useScrollPositionHook from "@/hooks/useScrollPosition";

describe("BackToTop component", () => {
  it("does not render when isVisible is false", () => {
    vi.spyOn(useScrollPositionHook, "useScrollPosition").mockReturnValue(false);
    render(<BackToTop />);
    expect(screen.queryByRole("button", { name: "Back to top" })).not.toBeInTheDocument();
  });

  it("renders when isVisible is true and scrolls to top on click", () => {
    vi.spyOn(useScrollPositionHook, "useScrollPosition").mockReturnValue(true);
    
    // Mock window.scrollTo
    const scrollToMock = vi.fn();
    window.scrollTo = scrollToMock;

    render(<BackToTop />);
    
    const button = screen.getByRole("button", { name: "Back to top" });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    
    expect(scrollToMock).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });
});

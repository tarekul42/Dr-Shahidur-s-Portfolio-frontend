import { renderHook, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useScrollPosition } from "./useScrollPosition";

describe("useScrollPosition hook", () => {
  let rafCallback: FrameRequestCallback | null = null;
  let scrollYValue = 0;

  beforeEach(() => {
    vi.useFakeTimers();
    scrollYValue = 0;
    rafCallback = null;

    // Use a getter so we can control the value across tests
    Object.defineProperty(window, "scrollY", {
      get: () => scrollYValue,
      configurable: true,
    });

    // Capture the RAF callback instead of auto-firing it
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      rafCallback = cb;
      return 1;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  const flushRaf = () => {
    if (rafCallback) {
      const cb = rafCallback;
      rafCallback = null;
      cb(0);
    }
  };

  it("returns false initially when scrollY is below threshold", () => {
    scrollYValue = 0;
    const { result } = renderHook(() => useScrollPosition(100));
    expect(result.current).toBe(false);
  });

  it("returns true initially when scrollY is above threshold", () => {
    scrollYValue = 200;
    const { result } = renderHook(() => useScrollPosition(100));
    expect(result.current).toBe(true);
  });

  it("updates when scrolling past threshold", () => {
    scrollYValue = 0;
    const { result } = renderHook(() => useScrollPosition(100));
    expect(result.current).toBe(false);

    // Scroll past threshold
    act(() => {
      scrollYValue = 150;
      window.dispatchEvent(new Event("scroll"));
      flushRaf();
    });

    expect(result.current).toBe(true);
  });

  it("returns to false when scrolling back below threshold", () => {
    scrollYValue = 150;
    const { result } = renderHook(() => useScrollPosition(100));
    expect(result.current).toBe(true);

    act(() => {
      scrollYValue = 50;
      window.dispatchEvent(new Event("scroll"));
      flushRaf();
    });

    expect(result.current).toBe(false);
  });
});

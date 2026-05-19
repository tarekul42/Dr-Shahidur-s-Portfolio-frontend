import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 500));
    expect(result.current).toBe("hello");
  });

  it("updates value after delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "hello", delay: 500 } },
    );

    rerender({ value: "world", delay: 500 });
    expect(result.current).toBe("hello"); // Not updated yet

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe("world"); // Updated after delay
  });

  it("resets timer if value changes before delay expires", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "a", delay: 500 } },
    );

    rerender({ value: "b", delay: 500 });
    act(() => {
      vi.advanceTimersByTime(300); // Not enough time
    });
    expect(result.current).toBe("a");

    rerender({ value: "c", delay: 500 });
    act(() => {
      vi.advanceTimersByTime(300); // Still not enough — timer reset
    });
    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(200); // Now 500ms since last change
    });
    expect(result.current).toBe("c");
  });
});

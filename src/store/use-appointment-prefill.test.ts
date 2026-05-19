import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useAppointmentPrefill } from "./use-appointment-prefill";

describe("useAppointmentPrefill", () => {
  it("should set and clear prefill data", () => {
    const { result } = renderHook(() => useAppointmentPrefill());

    // Initial state
    expect(result.current.message).toBeUndefined();
    expect(result.current.source).toBeUndefined();
    expect(result.current.preferredDate).toBeUndefined();

    // Set prefill
    act(() => {
      result.current.setPrefill({
        message: "Test message",
        source: "article:test",
        preferredDate: "2024-01-01",
      });
    });

    expect(result.current.message).toBe("Test message");
    expect(result.current.source).toBe("article:test");
    expect(result.current.preferredDate).toBe("2024-01-01");

    // Clear prefill
    act(() => {
      result.current.clearPrefill();
    });

    expect(result.current.message).toBeUndefined();
    expect(result.current.source).toBeUndefined();
    expect(result.current.preferredDate).toBeUndefined();
  });
});

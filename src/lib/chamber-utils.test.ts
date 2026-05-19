import { describe, expect, it } from "vitest";
import {
  getChamberById,
  getPrimaryChamber,
  formatTimeSlot,
  isDateAvailableForChamber,
  getAvailableDayNames,
} from "./chamber-utils";
import { CHAMBERS } from "@/constants/chambers";

describe("chamber-utils", () => {
  it("getChamberById returns the matching chamber or undefined", () => {
    const dhaka = getChamberById("dhaka");
    expect(dhaka).toBeDefined();
    expect(dhaka?.id).toBe("dhaka");
    expect(dhaka?.hospitalEn).toContain("Ibn Sina");

    const unknown = getChamberById("unknown");
    expect(unknown).toBeUndefined();
  });

  it("getPrimaryChamber returns the primary designated chamber", () => {
    const primary = getPrimaryChamber();
    expect(primary).toBeDefined();
    expect(primary.isPrimary).toBe(true);
    expect(primary.id).toBe("dhaka");
  });

  it("formatTimeSlot converts 24h string to 12h representation", () => {
    // AM slots
    expect(formatTimeSlot("10:00")).toBe("10:00 AM");
    expect(formatTimeSlot("11:30")).toBe("11:30 AM");
    
    // PM slots
    expect(formatTimeSlot("12:00")).toBe("12:00 PM");
    expect(formatTimeSlot("15:30")).toBe("3:30 PM");
    expect(formatTimeSlot("18:00")).toBe("6:00 PM");
    expect(formatTimeSlot("23:45")).toBe("11:45 PM");

    // Edge case midnight
    expect(formatTimeSlot("00:15")).toBe("12:15 AM");
  });

  it("isDateAvailableForChamber checks day numbers properly", () => {
    const jhitka = getChamberById("jhitka"); // Open on Thursday (4)
    expect(jhitka).toBeDefined();

    // 2026-05-21 is a Thursday (4)
    expect(isDateAvailableForChamber("2026-05-21", jhitka!)).toBe(true);

    // 2026-05-20 is a Wednesday (3)
    expect(isDateAvailableForChamber("2026-05-20", jhitka!)).toBe(false);
  });

  it("getAvailableDayNames returns correct day names array", () => {
    const singair = getChamberById("singair"); // Open on Saturday (6)
    expect(singair).toBeDefined();
    expect(getAvailableDayNames(singair!)).toEqual(["Sat"]);

    const dhaka = getChamberById("dhaka"); // Open on Mon, Wed, Fri, Sat (1, 3, 5, 6)
    expect(dhaka).toBeDefined();
    expect(getAvailableDayNames(dhaka!)).toEqual(["Mon", "Wed", "Fri", "Sat"]);
  });
});

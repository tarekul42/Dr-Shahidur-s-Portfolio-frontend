import { CHAMBERS, type Chamber } from "@/constants/chambers";

/** Get chamber by ID. Returns undefined if not found. */
export function getChamberById(id: string): Chamber | undefined {
  return CHAMBERS.find((c) => c.id === id);
}

/** Get the primary chamber (for defaults). */
export function getPrimaryChamber(): Chamber {
  return CHAMBERS.find((c) => c.isPrimary) ?? CHAMBERS[0];
}

/**
 * Convert 24h "HH:mm" time slot to 12h display format.
 * "18:00" → "6:00 PM", "10:30" → "10:30 AM"
 */
export function formatTimeSlot(slot: string): string {
  const [h, m] = slot.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
}

/**
 * Check if a date (ISO string "YYYY-MM-DD") falls on an available day for the given chamber.
 */
export function isDateAvailableForChamber(
  dateStr: string,
  chamber: Chamber,
): boolean {
  const dayOfWeek = new Date(`${dateStr}T00:00:00`).getDay();
  return chamber.availableDays.includes(dayOfWeek);
}

/**
 * Get available day names for a chamber (for display).
 * Returns abbreviated day names: ["Sat", "Mon", "Wed", "Fri"]
 */
export function getAvailableDayNames(chamber: Chamber): string[] {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return chamber.availableDays.map((d) => dayNames[d]);
}

import type { ChamberFallback } from "@/constants/chambers";
import { CHAMBERS, type Chamber } from "@/constants/chambers";
import {
  type ChamberActiveDate,
  JS_DAY_TO_APPOINTMENT_DAY,
} from "@/types/chamber";

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

/**
 * Check if a specific date is an active day for the given chamber.
 * Compares the JS day-of-week against the chamber's activeDates.
 */
export function isDateActiveForChamber(
  date: Date,
  activeDates: ChamberActiveDate[],
): boolean {
  const jsDay = date.getDay(); // 0=Sun, 6=Sat
  const appointmentDay = JS_DAY_TO_APPOINTMENT_DAY[jsDay];
  return activeDates.some((ad) => ad.activeDay === appointmentDay);
}

/**
 * Generate time slot options from a chamber's activeDates for a given date.
 * Creates 30-minute interval slots between startTime and endTime.
 */
export function generateTimeSlots(
  activeDates: ChamberActiveDate[],
  date: Date,
): Array<{ value: string; label: string; disabled: boolean }> {
  const jsDay = date.getDay();
  const appointmentDay = JS_DAY_TO_APPOINTMENT_DAY[jsDay];
  const schedule = activeDates.filter((ad) => ad.activeDay === appointmentDay);

  if (schedule.length === 0) return [];

  const slots: Array<{ value: string; label: string; disabled: boolean }> = [];

  for (const slot of schedule) {
    const [startH, startM] = slot.startTime.split(":").map(Number);
    const [endH, endM] = slot.endTime.split(":").map(Number);

    let currentMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    while (currentMinutes < endMinutes) {
      const hours = Math.floor(currentMinutes / 60);
      const minutes = currentMinutes % 60;
      const ampm = hours >= 12 ? "PM" : "AM";
      const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
      const label = `${displayHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
      const value = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

      slots.push({ value, label, disabled: false });
      currentMinutes += 30; // 30-minute intervals
    }
  }

  return slots;
}

/**
 * Format a time from "18:00" to "06:00 PM" for display.
 */
export function formatTimeDisplay(time24: string): string {
  const [h, m] = time24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const displayHours = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${displayHours}:${m.toString().padStart(2, "0")} ${ampm}`;
}

/**
 * Merge backend chamber data with frontend enrichment.
 */
export function mergeChamberData(
  backendChambers: ChamberFallback[],
  enrichment: Record<
    string,
    {
      address: string;
      addressBn: string;
      phone: string;
      assistantName?: string;
      assistantNameBn?: string;
      room?: string;
      isPrimary?: boolean;
    }
  >,
): ChamberFallback[] {
  return backendChambers.map((chamber) => {
    const extra = enrichment[chamber.id];
    if (!extra) return chamber;
    return {
      ...chamber,
      ...extra,
      isPrimary: extra.isPrimary ?? chamber.isPrimary,
    };
  });
}

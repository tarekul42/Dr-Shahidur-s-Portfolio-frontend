/** Backend chamber model (from GET /api/v1/chambers) */
export interface ChamberActiveDate {
  activeDay: string; // "SATURDAY" | "SUNDAY" | ... | "FRIDAY"
  startTime: string; // "18:00" (24h format)
  endTime: string; // "21:00" (24h format)
}

export interface Chamber {
  _id: string;
  chemberName: string;
  map: string; // Google Maps embed URL
  activeDates: ChamberActiveDate[];
  createdAt: string;
  updatedAt: string;
}

/** Frontend-enriched chamber data — supplements backend's minimal model */
export interface ChamberEnrichment {
  chamberId: string;
  address: string;
  addressBn: string;
  phone: string;
  assistantName?: string;
  assistantNameBn?: string;
  room?: string;
  roomBn?: string;
  isPrimary?: boolean;
}

/** Day enum matching backend's APPOINTMENT_DAYS */
export type AppointmentDay =
  | "SATURDAY"
  | "SUNDAY"
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY";

/** Map from JS Day number (0=Sun) to backend day string */
export const JS_DAY_TO_APPOINTMENT_DAY: Record<number, AppointmentDay> = {
  0: "SUNDAY",
  1: "MONDAY",
  2: "TUESDAY",
  3: "WEDNESDAY",
  4: "THURSDAY",
  5: "FRIDAY",
  6: "SATURDAY",
};

/** Display labels for days (English) */
export const DAY_LABELS: Record<AppointmentDay, string> = {
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
};

/** Display labels for days (Bengali) */
export const DAY_LABELS_BN: Record<AppointmentDay, string> = {
  SATURDAY: "শনিবার",
  SUNDAY: "রবিবার",
  MONDAY: "সোমবার",
  TUESDAY: "মঙ্গলবার",
  WEDNESDAY: "বুধবার",
  THURSDAY: "বৃহস্পতিবার",
  FRIDAY: "শুক্রবার",
};

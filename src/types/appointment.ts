import type { GeoLocation } from "./api";

export type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export interface Appointment {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  preferredDate: string;
  preferredTime: string;
  chamberId?: string;
  status: AppointmentStatus;
  ipAddress: string;
  location: GeoLocation;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentCreatePayload {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  preferredDate: string;
  preferredTime: string;
  chamberId?: string;
  recaptchaToken?: string;
}

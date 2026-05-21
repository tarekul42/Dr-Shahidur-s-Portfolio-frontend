import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type {
  Appointment,
  AppointmentCreatePayload,
} from "@/types/appointment";

export async function createAppointment(
  payload: AppointmentCreatePayload,
): Promise<Appointment> {
  const { chamberId, ...rest } = payload;
  
  // Only send chemberId if it is a valid 24-character hex MongoDB ObjectId to prevent backend CastError
  const isValidObjectId = !!chamberId && /^[0-9a-fA-F]{24}$/.test(chamberId);

  const backendPayload = {
    ...rest,
    ...(isValidObjectId ? { chemberId: chamberId } : {}),
  };
  const { data } = await api.post<ApiResponse<Appointment>>(
    "/appointments",
    backendPayload,
  );
  return data.data;
}

export async function getBookedSlots(date: string): Promise<string[]> {
  try {
    const { data } = await api.get<
      ApiResponse<Array<{ preferredTime: string }>>
    >("/appointments/booked-slots", { params: { date } });
    return data.data.map((slot) => slot.preferredTime);
  } catch (_error) {
    return [];
  }
}

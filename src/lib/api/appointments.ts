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
  const backendPayload = {
    ...rest,
    ...(chamberId ? { chemberId: chamberId } : {}),
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

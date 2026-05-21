import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/axios", () => ({
  api: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

import { api } from "@/lib/axios";
import { createAppointment, getBookedSlots } from "./appointments";

describe("createAppointment()", () => {
  it("sends POST with chemberId when chamberId is provided (backend typo field)", async () => {
    const mockResponse = {
      data: { data: { _id: "apt123" } },
    };
    vi.mocked(api.post).mockResolvedValueOnce(mockResponse);

    const mongoId = "507f1f77bcf86cd799439011";
    const payload = {
      name: "John Doe",
      phone: "+8801712345678",
      preferredDate: "2026-05-16",
      preferredTime: "10:00 AM",
      chamberId: mongoId,
      recaptchaToken: "token",
    };

    const result = await createAppointment(payload);

    expect(api.post).toHaveBeenCalledWith("/appointments", {
      name: "John Doe",
      phone: "+8801712345678",
      preferredDate: "2026-05-16",
      preferredTime: "10:00 AM",
      recaptchaToken: "token",
      chemberId: mongoId,
    });
    expect(result._id).toBe("apt123");
  });

  it("sends chemberId for fallback slug ids when API mapping is unavailable", async () => {
    vi.mocked(api.post).mockResolvedValueOnce({
      data: { data: { _id: "apt-slug" } },
    });

    await createAppointment({
      name: "Jane",
      phone: "+8801712345678",
      preferredDate: "2026-06-01",
      preferredTime: "6:00 PM",
      chamberId: "dhaka",
    });

    expect(api.post).toHaveBeenCalledWith(
      "/appointments",
      expect.objectContaining({ chemberId: "dhaka" }),
    );
  });

  it("omits chemberId when chamberId is not provided", async () => {
    vi.mocked(api.post).mockResolvedValueOnce({
      data: { data: { _id: "apt-no-chamber" } },
    });

    await createAppointment({
      name: "Jane",
      phone: "+8801712345678",
      preferredDate: "2026-06-01",
      preferredTime: "6:00 PM",
    });

    expect(api.post).toHaveBeenCalledWith("/appointments", {
      name: "Jane",
      phone: "+8801712345678",
      preferredDate: "2026-06-01",
      preferredTime: "6:00 PM",
    });
  });
});

describe("getBookedSlots()", () => {
  it("fetches booked slots for a given date", async () => {
    const mockResponse = {
      data: {
        data: [{ preferredTime: "10:00 AM" }, { preferredTime: "11:30 AM" }],
      },
    };
    vi.mocked(api.get).mockResolvedValueOnce(mockResponse);

    const date = "2026-05-16";
    const result = await getBookedSlots(date);

    expect(api.get).toHaveBeenCalledWith("/appointments/booked-slots", {
      params: { date },
    });
    expect(result).toEqual(["10:00 AM", "11:30 AM"]);
  });

  it("returns empty array on error", async () => {
    vi.mocked(api.get).mockRejectedValueOnce(new Error("Network Error"));

    const result = await getBookedSlots("2026-05-16");
    expect(result).toEqual([]);
  });
});

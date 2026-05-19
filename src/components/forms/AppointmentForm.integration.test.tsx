import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock out the API queries and mutations
vi.mock("@/lib/api/appointments", () => ({
  createAppointment: vi.fn().mockResolvedValue({
    _id: "new-appointment-id",
    name: "John Doe",
    phone: "+8801712345678",
    preferredDate: "2026-06-06",
    preferredTime: "6:00 PM",
    chemberId: "dhaka",
  }),
}));

vi.mock("react-google-recaptcha-v3", () => ({
  useGoogleReCaptcha: () => ({ executeRecaptcha: undefined }),
}));

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/appointment",
  useRouter: () => ({ push: vi.fn() }),
}));

import { createAppointment } from "@/lib/api/appointments";
import { AppointmentForm } from "./AppointmentForm";

const mockedCreateAppointment = vi.mocked(createAppointment);

describe("AppointmentForm Integration - Full 4-Step Flow", () => {
  it("completes the full booking wizard successfully", async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <AppointmentForm />
      </QueryClientProvider>,
    );

    // Step 0: Select Chamber
    await waitFor(() => {
      expect(screen.getByText("Ibn Sina Medical College Hospital")).toBeInTheDocument();
    });
    const chamberCard = screen.getByText("Ibn Sina Medical College Hospital");
    await user.click(chamberCard);

    const continueButton = screen.getByRole("button", { name: /continue/i });
    await user.click(continueButton);

    // Step 1: Patient Info
    expect(screen.getByText("Who is the patient?")).toBeInTheDocument();
    await user.type(screen.getByLabelText(/Patient Name/i), "John Doe");
    await user.type(screen.getByLabelText(/Phone Number/i), "+8801712345678");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // Step 2: Preferred Schedule
    expect(screen.getByText("Preferred Schedule")).toBeInTheDocument();
    // In our test, let's select a valid date (Step 2 requires future date in available chamber days)
    // 2026-05-25 is a Monday (available day for Dhaka)
    const dateInput = screen.getByLabelText(/Preferred Date/i);
    await user.type(dateInput, "2026-05-25");
    
    // Select time slot
    const timeSelect = screen.getByLabelText(/Preferred Time/i);
    await user.selectOptions(timeSelect, "18:00");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // Step 3: Notes & Submit
    expect(screen.getByText("Anything else?")).toBeInTheDocument();
    const submitButton = screen.getByRole("button", { name: /submit/i });
    await user.click(submitButton);

    // Verification
    await waitFor(() => {
      expect(mockedCreateAppointment).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "John Doe",
          phone: "+8801712345678",
          preferredDate: "2026-05-25",
          preferredTime: "6:00 PM",
        }),
      );
    });
  });
});

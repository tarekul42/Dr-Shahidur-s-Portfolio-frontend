import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppointmentForm } from "./AppointmentForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppointment, getBookedSlots } from "@/lib/api/appointments";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

// Set up mock search params
let mockSearchParamVal: string | null = null;
vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (key: string) => (key === "chamber" ? mockSearchParamVal : null),
  }),
}));

// Mock the API
vi.mock("@/lib/api/appointments", () => ({
  createAppointment: vi.fn().mockResolvedValue({ _id: "123" }),
  getBookedSlots: vi.fn().mockResolvedValue([]),
}));

// Mock reCAPTCHA
vi.mock("react-google-recaptcha-v3", () => ({
  useGoogleReCaptcha: vi.fn(() => ({
    executeRecaptcha: vi.fn().mockResolvedValue("mock-token"),
  })),
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("AppointmentForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
    mockSearchParamVal = null;
  });

  it("renders step 0 (chamber selection) initially", () => {
    render(<AppointmentForm />, { wrapper });
    expect(screen.getByText("Which chamber would you like to visit?")).toBeInTheDocument();
    expect(screen.getByText("Ibn Sina Medical College Hospital")).toBeInTheDocument();
    expect(screen.getByText("Payra Hospital Limited")).toBeInTheDocument();
    expect(screen.getByText("Islami Bank Community Hospital, Manikganj")).toBeInTheDocument();
    expect(screen.getByText("Singair City Hospital & Diagnostic Center")).toBeInTheDocument();
  });

  it("shows validation error on Step 0 if no chamber selected", async () => {
    const user = userEvent.setup();
    render(<AppointmentForm />, { wrapper });

    await user.click(screen.getByRole("button", { name: /continue/i }));

    await waitFor(() => {
      expect(screen.getByText("Chamber is required")).toBeInTheDocument();
    });
  });

  it("auto-selects chamber from URL query parameter and skips Step 0 to Step 1", async () => {
    mockSearchParamVal = "dhaka";
    render(<AppointmentForm />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText("Who is the patient?")).toBeInTheDocument();
      expect(screen.getByLabelText("Patient Name")).toBeInTheDocument();
    });
  });

  it("advances to Step 1 upon selecting a chamber and clicking continue", async () => {
    const user = userEvent.setup();
    render(<AppointmentForm />, { wrapper });

    // Select the first chamber (Ibn Sina)
    await user.click(screen.getByText("Ibn Sina Medical College Hospital"));
    await user.click(screen.getByRole("button", { name: /continue/i }));

    await waitFor(() => {
      expect(screen.getByText("Who is the patient?")).toBeInTheDocument();
    });
  });

  it("validates patient name and phone format on Step 1", async () => {
    const user = userEvent.setup();
    mockSearchParamVal = "dhaka"; // skip Step 0
    render(<AppointmentForm />, { wrapper });

    await user.click(screen.getByRole("button", { name: /continue/i }));

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
      expect(screen.getByText("Invalid Bangladesh phone format")).toBeInTheDocument();
    });

    // Try incorrect phone number format
    await user.type(screen.getByLabelText("Patient Name"), "Test Patient");
    await user.type(screen.getByLabelText("Phone Number"), "017123456"); // too short, no +880
    await user.click(screen.getByRole("button", { name: /continue/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid Bangladesh phone format")).toBeInTheDocument();
    });
  });

  it("completes full flow and packs chamber name into final message", async () => {
    const user = userEvent.setup();
    mockSearchParamVal = "dhaka"; // skip Step 0
    render(<AppointmentForm />, { wrapper });

    // Step 1: Patient Info
    await user.type(screen.getByLabelText("Patient Name"), "John Doe");
    await user.type(screen.getByLabelText("Email Address"), "john@example.com");
    await user.type(screen.getByLabelText("Phone Number"), "+8801712345678");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // Step 2: Date & Time
    await waitFor(() => {
      expect(screen.getByText("Preferred Schedule")).toBeInTheDocument();
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Kalyanpur Dhaka is open on Sat, Mon, Wed, Fri (1, 3, 5, 6).
    // Ensure we select a date that matches availableDays to pass the validator
    let testDate = tomorrow;
    while (![1, 3, 5, 6].includes(testDate.getDay())) {
      testDate.setDate(testDate.getDate() + 1);
    }
    const dateStr = testDate.toISOString().slice(0, 10);

    await user.type(screen.getByLabelText("Preferred Date"), dateStr);
    
    // Select time slot
    await user.selectOptions(screen.getByLabelText("Preferred Time Slot"), "6:00 PM");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // Step 3: Concern Notes
    await waitFor(() => {
      expect(screen.getByText("Anything else?")).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText("Primary Concern"), "Severe knee pain");
    await user.click(screen.getByRole("button", { name: /submit request/i }));

    await waitFor(() => {
      expect(createAppointment).toHaveBeenCalledOnce();
      expect(screen.getByText("Request Received")).toBeInTheDocument();
    });

    const callArgs = vi.mocked(createAppointment).mock.calls[0][0];
    expect(callArgs.name).toBe("John Doe");
    expect(callArgs.phone).toBe("+8801712345678");
    expect(callArgs.preferredDate).toBe(dateStr);
    expect(callArgs.preferredTime).toBe("6:00 PM");
    // Verify it includes chamber name prefix in the message!
    expect(callArgs.message).toContain("[Chamber: Ibn Sina Medical College Hospital]");
    expect(callArgs.message).toContain("Severe knee pain");
  });

  it("can navigate back and forth between steps", async () => {
    const user = userEvent.setup();
    render(<AppointmentForm />, { wrapper });

    // Step 0 -> select chamber -> Step 1
    await user.click(screen.getByText("Ibn Sina Medical College Hospital"));
    await user.click(screen.getByRole("button", { name: /continue/i }));

    await waitFor(() => {
      expect(screen.getByText("Who is the patient?")).toBeInTheDocument();
    });

    // Step 1 -> Step 0
    await user.click(screen.getByRole("button", { name: /back/i }));

    await waitFor(() => {
      expect(screen.getByText("Which chamber would you like to visit?")).toBeInTheDocument();
    });
  });

  it("displays helper message on closed chamber days", async () => {
    const user = userEvent.setup();
    mockSearchParamVal = "jhitka"; // Jhitka is ONLY open on Thursday (4)
    render(<AppointmentForm />, { wrapper });

    // Step 1: fill info
    await user.type(screen.getByLabelText("Patient Name"), "John Doe");
    await user.type(screen.getByLabelText("Phone Number"), "+8801712345678");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // Step 2: select a closed date (e.g. Wednesday/Sunday)
    await waitFor(() => {
      expect(screen.getByText("Preferred Schedule")).toBeInTheDocument();
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Find a non-Thursday date
    let closedDate = tomorrow;
    while (closedDate.getDay() === 4) {
      closedDate.setDate(closedDate.getDate() + 1);
    }
    const closedDateStr = closedDate.toISOString().slice(0, 10);

    await user.type(screen.getByLabelText("Preferred Date"), closedDateStr);
    
    // Check validation error is displayed
    await waitFor(() => {
      expect(
        screen.getByText("The selected chamber is not open on this day of the week")
      ).toBeInTheDocument();
    });
  });

  it("displays booked slots message when bookedSlots query has data", async () => {
    vi.mocked(getBookedSlots).mockResolvedValueOnce(["6:00 PM"]);
    const user = userEvent.setup();
    mockSearchParamVal = "dhaka"; // skip step 0
    render(<AppointmentForm />, { wrapper });

    // Step 1
    await user.type(screen.getByLabelText("Patient Name"), "John Doe");
    await user.type(screen.getByLabelText("Phone Number"), "+8801712345678");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // Step 2
    await waitFor(() => {
      expect(screen.getByText("Preferred Schedule")).toBeInTheDocument();
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().slice(0, 10);
    await user.type(screen.getByLabelText("Preferred Date"), dateStr);

    await waitFor(() => {
      expect(screen.getByText(/1 slot\(s\) already booked for this date/)).toBeInTheDocument();
    });
  });
});

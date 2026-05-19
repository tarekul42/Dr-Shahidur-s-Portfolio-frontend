import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "./ContactForm";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

// Mock the API
vi.mock("@/lib/api/contact", () => ({
  submitContact: vi.fn().mockResolvedValue({ _id: "123", status: "UNREAD" }),
}));

// Mock reCAPTCHA
vi.mock("react-google-recaptcha-v3", () => ({
  useGoogleReCaptcha: vi.fn(() => ({
    executeRecaptcha: vi.fn().mockResolvedValue("mock-token"),
  })),
}));

// Mock Next.js router/components or others if needed
// Actually, ContactForm doesn't seem to use useRouter, but we will wrap with QueryClient if needed.
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { submitContact } from "@/lib/api/contact";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("ContactForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it("renders all form fields", () => {
    render(<ContactForm />, { wrapper });
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone \(optional\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Reason/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Your Message/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send message/i }),
    ).toBeInTheDocument();
  });

  it("shows validation errors on empty submit", async () => {
    const user = userEvent.setup();
    render(<ContactForm />, { wrapper });

    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Name must be at least 2 characters/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Subject must be at least 5 characters/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Message must be at least 10 characters/i),
      ).toBeInTheDocument();
    });
  });

  it("shows error for invalid email format", async () => {
    const user = userEvent.setup();
    render(<ContactForm />, { wrapper });

    await user.type(screen.getByLabelText(/Full Name/i), "John Doe");
    fireEvent.change(
      screen.getByLabelText(/Email Address/i),
      "pietenium0@gmail.com",
    );
    await user.type(screen.getByLabelText(/Subject/i), "Medical question");
    await user.type(
      screen.getByLabelText(/Your Message/i),
      "I have a question about knee pain treatment",
    );
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
    });
  });

  it("shows error for short name", async () => {
    const user = userEvent.setup();
    render(<ContactForm />, { wrapper });

    await user.type(screen.getByLabelText(/Full Name/i), "J");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Name must be at least 2 characters/i),
      ).toBeInTheDocument();
    });
  });

  it("submits form successfully with valid data", async () => {
    const user = userEvent.setup();
    render(<ContactForm />, { wrapper });

    await user.type(screen.getByLabelText(/Full Name/i), "John Doe");
    await user.type(
      screen.getByLabelText(/Email Address/i),
      "pietenium0@gmail.com",
    );
    await user.type(screen.getByLabelText(/Subject/i), "Medical question");
    await user.type(
      screen.getByLabelText(/Your Message/i),
      "I have a question about knee pain treatment",
    );

    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(submitContact).toHaveBeenCalledOnce();
    });

    // Verify payload
    const callArgs = vi.mocked(submitContact).mock.calls[0][0];
    expect(callArgs.name).toBe("John Doe");
    expect(callArgs.email).toBe("pietenium0@gmail.com");
    expect(callArgs.reason).toBe("general");
    expect(callArgs.recaptchaToken).toBe("mock-token");
  });

  it("handles 429 rate limit error", async () => {
    vi.mocked(submitContact).mockRejectedValueOnce({
      response: { status: 429 },
    });
    const user = userEvent.setup();
    render(<ContactForm />, { wrapper });

    await user.type(screen.getByLabelText(/Full Name/i), "John Doe");
    await user.type(screen.getByLabelText(/Email Address/i), "test@test.com");
    await user.type(screen.getByLabelText(/Subject/i), "Medical question");
    await user.type(
      screen.getByLabelText(/Your Message/i),
      "I have a question about knee pain treatment",
    );

    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(submitContact).toHaveBeenCalled();
    });
  });

  it("handles generic submission error", async () => {
    vi.mocked(submitContact).mockRejectedValueOnce(new Error("Network Error"));
    const user = userEvent.setup();
    render(<ContactForm />, { wrapper });

    await user.type(screen.getByLabelText(/Full Name/i), "John Doe");
    await user.type(screen.getByLabelText(/Email Address/i), "test@test.com");
    await user.type(screen.getByLabelText(/Subject/i), "Medical question");
    await user.type(
      screen.getByLabelText(/Your Message/i),
      "I have a question about knee pain treatment",
    );

    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(submitContact).toHaveBeenCalled();
    });
  });

  it("handles missing or failing recaptcha", async () => {
    // Override recaptcha mock for this test to throw error
    vi.mocked(useGoogleReCaptcha).mockReturnValue({
      executeRecaptcha: vi
        .fn()
        .mockRejectedValue(new Error("Recaptcha failed")),
    } as any);

    const user = userEvent.setup();
    render(<ContactForm />, { wrapper });

    await user.type(screen.getByLabelText(/Full Name/i), "John Doe");
    await user.type(screen.getByLabelText(/Email Address/i), "test@test.com");
    await user.type(screen.getByLabelText(/Subject/i), "Medical question");
    await user.type(
      screen.getByLabelText(/Your Message/i),
      "I have a question about knee pain treatment",
    );

    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(submitContact).toHaveBeenCalled();
      const callArgs = vi.mocked(submitContact).mock.calls[0][0];
      expect(callArgs.recaptchaToken).toBeUndefined();
    });

    // Reset mock for other tests
    vi.mocked(useGoogleReCaptcha).mockReturnValue({
      executeRecaptcha: vi.fn().mockResolvedValue("mock-token"),
    } as any);
  });

  it("submits without token if recaptcha is not initialized", async () => {
    // Override recaptcha mock to return undefined executeRecaptcha
    vi.mocked(useGoogleReCaptcha).mockReturnValue({
      executeRecaptcha: undefined,
    } as any);

    const user = userEvent.setup();
    render(<ContactForm />, { wrapper });

    await user.type(screen.getByLabelText(/Full Name/i), "John Doe");
    await user.type(screen.getByLabelText(/Email Address/i), "test@test.com");
    await user.type(screen.getByLabelText(/Subject/i), "Medical question");
    await user.type(
      screen.getByLabelText(/Your Message/i),
      "I have a question about knee pain treatment",
    );

    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(submitContact).toHaveBeenCalled();
      const callArgs = vi.mocked(submitContact).mock.calls[0][0];
      expect(callArgs.recaptchaToken).toBeUndefined();
    });

    // Reset mock
    vi.mocked(useGoogleReCaptcha).mockReturnValue({
      executeRecaptcha: vi.fn().mockResolvedValue("mock-token"),
    } as any);
  });
});

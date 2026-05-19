import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CookieConsent } from "./CookieConsent";

// Mock the API
vi.mock("@/lib/api/visitors", () => ({
  giveConsent: vi.fn().mockResolvedValue({}),
}));

beforeEach(() => {
  localStorage.clear();
});

describe("CookieConsent", () => {
  it("shows banner when consent not given", () => {
    render(<CookieConsent />);
    expect(screen.getByText(/analytics cookies/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /accept cookies/i }),
    ).toBeInTheDocument();
  });

  it("hides banner when consent already accepted in localStorage", () => {
    localStorage.setItem("cookie_consent", "true");
    render(<CookieConsent />);
    expect(screen.queryByText(/analytics cookies/i)).not.toBeInTheDocument();
  });

  it("hides banner after clicking Accept", async () => {
    const user = userEvent.setup();
    render(<CookieConsent />);

    await user.click(screen.getByRole("button", { name: /accept cookies/i }));

    await waitFor(() => {
      expect(screen.queryByText(/analytics cookies/i)).not.toBeInTheDocument();
    });
    expect(localStorage.getItem("cookie_consent")).toBe("true");
  });
});

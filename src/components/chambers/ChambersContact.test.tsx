import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChambersContact } from "./ChambersContact";

// Mock out the nested ContactForm component
vi.mock("@/components/forms/ContactForm", () => ({
  ContactForm: () => <div data-testid="mock-contact-form" />,
}));

describe("ChambersContact component", () => {
  it("renders emergency hotline contacts", () => {
    render(<ChambersContact />);
    
    // Checks that the emergency hotlines are shown
    expect(screen.getByText("+880 1777-079696")).toBeInTheDocument();
    expect(screen.getByText("+880 1711-608502")).toBeInTheDocument();
  });

  it("renders WhatsApp chat card linking to correct URL", () => {
    render(<ChambersContact />);
    
    const whatsappLink = screen.getByRole("link", { name: /whatsapp \+880 1777-079696/i });
    expect(whatsappLink).toHaveAttribute("href", "https://wa.me/8801777079696");
  });

  it("renders the mocked contact form inside the right column", () => {
    render(<ChambersContact />);
    
    expect(screen.getByTestId("mock-contact-form")).toBeInTheDocument();
  });
});

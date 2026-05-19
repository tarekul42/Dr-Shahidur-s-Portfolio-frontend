import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChambersHero } from "./ChambersHero";
import { CHAMBERS } from "@/constants/chambers";

describe("ChambersHero component", () => {
  it("renders quick cards for all provided chambers", () => {
    render(<ChambersHero chambers={CHAMBERS} />);
    
    // Dhaka
    expect(screen.getByText("Ibn Sina Medical College Hospital")).toBeInTheDocument();
    // Jhitka
    expect(screen.getByText("Payra Hospital Limited")).toBeInTheDocument();
    // Manikganj
    expect(screen.getByText("Islami Bank Community Hospital, Manikganj")).toBeInTheDocument();
    // Singair
    expect(screen.getByText("Singair City Hospital & Diagnostic Center")).toBeInTheDocument();
  });

  it("renders primary badge only on the primary chamber", () => {
    const { container } = render(<ChambersHero chambers={CHAMBERS} />);
    
    // The primary badge says "PRIMARY" (or translations fallback/mocked)
    // Check that we have a badge matching the primary chamber
    const primaryBadge = screen.getByText("PRIMARY");
    expect(primaryBadge).toBeInTheDocument();
  });

  it("renders schedule days and hours on each card", () => {
    render(<ChambersHero chambers={CHAMBERS} />);
    
    expect(screen.getByText("Sat, Mon, Wed")).toBeInTheDocument();
    expect(screen.getByText("6:00 PM – 9:00 PM")).toBeInTheDocument();
    
    expect(screen.getByText("Thursday")).toBeInTheDocument();
    expect(screen.getByText("4:00 PM – 8:00 PM")).toBeInTheDocument();
  });

  it("renders appointment and serial calling buttons on each card with correct links", () => {
    render(<ChambersHero chambers={CHAMBERS} />);
    
    // Verify booking buttons link correctly
    const bookingButtons = screen.getAllByRole("link", { name: /book/i });
    expect(bookingButtons).toHaveLength(4);
    expect(bookingButtons[0]).toHaveAttribute("href", "/appointment?chamber=dhaka");
    expect(bookingButtons[1]).toHaveAttribute("href", "/appointment?chamber=jhitka");
    
    // Verify call serial buttons link correctly
    const callButtons = screen.getAllByRole("link", { name: /call serial/i });
    expect(callButtons).toHaveLength(4);
    expect(callButtons[0]).toHaveAttribute("href", "tel:8809610009616");
    expect(callButtons[1]).toHaveAttribute("href", "tel:01778455552");
  });
});

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChamberOverview } from "./ChamberOverview";

describe("ChamberOverview component", () => {
  it("renders homepage section heading correctly", () => {
    render(<ChamberOverview />);
    
    // Renders title / badge
    expect(screen.getByText("Schedule a Visit")).toBeInTheDocument();
  });

  it("renders chamber card summaries for all 4 locations", () => {
    render(<ChamberOverview />);
    
    expect(screen.getByText("Ibn Sina Medical College Hospital")).toBeInTheDocument();
    expect(screen.getByText("Payra Hospital Limited")).toBeInTheDocument();
    expect(screen.getByText("Islami Bank Community Hospital, Manikganj")).toBeInTheDocument();
    expect(screen.getByText("Singair City Hospital & Diagnostic Center")).toBeInTheDocument();
  });

  it("renders primary badge only on the primary chamber", () => {
    render(<ChamberOverview />);
    
    // Select primary designated chamber cards
    const primaryBadge = screen.getByText("PRIMARY");
    expect(primaryBadge).toBeInTheDocument();
  });

  it("renders a link button redirecting to dedicated /chambers page", () => {
    render(<ChamberOverview />);
    
    const link = screen.getByRole("link", { name: /view all chambers & schedules/i });
    expect(link).toHaveAttribute("href", "/chambers");
  });
});

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { HomeChamberOverview } from "./HomeChamberOverview";

describe("HomeChamberOverview component", () => {
  it("renders homepage section heading correctly", () => {
    render(<HomeChamberOverview />);

    expect(screen.getByText("Chamber Schedule")).toBeInTheDocument();
  });

  it("renders chamber card summaries for all 4 locations", () => {
    render(<HomeChamberOverview />);

    expect(
      screen.getByText("Ibn Sina Medical College Hospital"),
    ).toBeInTheDocument();
    expect(screen.getByText("Payra Hospital Limited")).toBeInTheDocument();
    expect(
      screen.getByText("Islami Bank Community Hospital, Manikganj"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Singair City Hospital & Diagnostic Center"),
    ).toBeInTheDocument();
  });

  it("renders primary badge only on the primary chamber", () => {
    render(<HomeChamberOverview />);

    const primaryBadge = screen.getByText("Primary");
    expect(primaryBadge).toBeInTheDocument();
  });

  it("renders a link button redirecting to dedicated /chambers page", () => {
    render(<HomeChamberOverview />);

    const viewAll = screen.getByRole("link", {
      name: /view all chambers/i,
    });
    expect(viewAll).toHaveAttribute("href", "/chambers");
  });
});

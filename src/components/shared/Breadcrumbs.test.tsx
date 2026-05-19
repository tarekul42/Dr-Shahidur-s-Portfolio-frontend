import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Breadcrumbs } from "./Breadcrumbs";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: vi.fn().mockReturnValue("/articles/knee-replacement"),
}));

describe("Breadcrumbs", () => {
  it("renders Home link", () => {
    render(<Breadcrumbs />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Home").closest("a")).toHaveAttribute("href", "/");
  });

  it("renders intermediate links correctly", () => {
    render(<Breadcrumbs />);
    expect(screen.getByText("Articles")).toBeInTheDocument();
    expect(screen.getByText("Articles").closest("a")).toHaveAttribute(
      "href",
      "/articles",
    );
  });

  it("renders current page without link", () => {
    render(<Breadcrumbs title="Knee Replacement" />);
    // "Knee Replacement" should be rendered instead of the raw slug
    expect(screen.getByText("Knee Replacement")).toBeInTheDocument();
    // It should not be a link
    expect(screen.getByText("Knee Replacement").closest("a")).toBeNull();
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./Badge";

describe("Badge component", () => {
  it("renders with default variant", () => {
    render(<Badge>Default Badge</Badge>);
    const badge = screen.getByText("Default Badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-gray-100");
  });

  it("renders with success variant", () => {
    render(<Badge variant="success">Success Badge</Badge>);
    const badge = screen.getByText("Success Badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-green-100");
  });

  it("renders with medical variant and dot", () => {
    render(<Badge variant="medical" showDot>Medical Badge</Badge>);
    const badge = screen.getByText("Medical Badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-brand-primary/10");
    // Verify dot is rendered by checking if there's a span inside that is not the text
    // The dot has the class bg-brand-primary
    const dot = badge.querySelector("span.bg-brand-primary");
    expect(dot).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Badge className="custom-class">Custom Badge</Badge>);
    const badge = screen.getByText("Custom Badge");
    expect(badge).toHaveClass("custom-class");
  });
});

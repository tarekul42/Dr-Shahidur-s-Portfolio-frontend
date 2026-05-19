import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders as a button by default", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: "Click me" }),
    ).toBeInTheDocument();
  });

  it("renders as a link when href is provided", () => {
    render(<Button href="/about">About Us</Button>);
    const link = screen.getByRole("link", { name: "About Us" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/about");
  });
});

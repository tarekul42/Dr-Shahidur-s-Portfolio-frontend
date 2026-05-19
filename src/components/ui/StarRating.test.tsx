import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StarRating } from "./StarRating";

describe("StarRating component", () => {
  it("renders 5 stars and displays the rating text", () => {
    const { container } = render(<StarRating rating={4.5} />);
    
    // It should render 5 SVGs
    const stars = container.querySelectorAll("svg");
    expect(stars.length).toBe(5);
    
    // It should display "4.5"
    expect(screen.getByText("4.5")).toBeInTheDocument();
  });

  it("applies yellow color to rounded rating stars", () => {
    const { container } = render(<StarRating rating={3} />);
    const stars = container.querySelectorAll("svg");
    
    // The first 3 should be yellow
    expect(stars[0]).toHaveClass("text-yellow-400");
    expect(stars[1]).toHaveClass("text-yellow-400");
    expect(stars[2]).toHaveClass("text-yellow-400");
    
    // The last 2 should be gray
    expect(stars[3]).toHaveClass("text-gray-300");
    expect(stars[4]).toHaveClass("text-gray-300");
  });

  it("supports different sizes", () => {
    const { container: smContainer } = render(<StarRating rating={5} size="sm" />);
    expect(smContainer.querySelector("svg")).toHaveClass("w-3 h-3");

    const { container: lgContainer } = render(<StarRating rating={5} size="lg" />);
    expect(lgContainer.querySelector("svg")).toHaveClass("w-6 h-6");
  });

  it("applies custom className", () => {
    const { container } = render(<StarRating rating={5} className="custom-rating" />);
    expect(container.firstChild).toHaveClass("custom-rating");
  });
});

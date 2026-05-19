import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "./EmptyState";

describe("EmptyState component", () => {
  it("renders with title and description", () => {
    render(<EmptyState title="No items found" description="Try adjusting your search criteria." />);
    
    expect(screen.getByText("No items found")).toBeInTheDocument();
    expect(screen.getByText("Try adjusting your search criteria.")).toBeInTheDocument();
  });

  it("renders with an icon", () => {
    render(
      <EmptyState 
        title="No items found" 
        description="Try adjusting your search criteria." 
        icon={<svg data-testid="test-icon" />}
      />
    );
    
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });

  it("renders with an action button", () => {
    render(
      <EmptyState 
        title="No items found" 
        description="Try adjusting your search criteria." 
        action={<button>Clear Filters</button>}
      />
    );
    
    expect(screen.getByRole("button", { name: "Clear Filters" })).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <EmptyState 
        title="No items found" 
        description="Try adjusting your search criteria." 
        className="custom-empty-state"
      />
    );
    
    // The container is the parent of the title
    const titleElement = screen.getByText("No items found");
    const container = titleElement.closest("div");
    expect(container).toHaveClass("custom-empty-state");
  });
});

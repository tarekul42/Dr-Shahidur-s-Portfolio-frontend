import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Skeleton } from "./Skeleton";

describe("Skeleton component", () => {
  it("renders with default text variant", () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass("h-4 w-full rounded");
  });

  it("renders with avatar variant", () => {
    const { container } = render(<Skeleton variant="avatar" />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass("h-12 w-12 rounded-full");
  });

  it("renders with card variant", () => {
    const { container } = render(<Skeleton variant="card" />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass("h-48 w-full rounded-xl");
  });

  it("applies custom className", () => {
    const { container } = render(<Skeleton className="custom-class" />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass("custom-class");
  });
});

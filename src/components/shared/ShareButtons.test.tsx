import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ShareButtons } from "./ShareButtons";

// Mock process.env
vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://drshahid.com");

describe("ShareButtons", () => {
  const props = {
    title: "Knee Replacement Guide",
    slug: "knee-replacement",
    basePath: "articles",
  };

  it("renders all 5 share buttons", () => {
    render(<ShareButtons {...props} />);
    expect(screen.getByLabelText("Share")).toBeInTheDocument();
    expect(screen.getByLabelText("Share on Facebook")).toBeInTheDocument();
    expect(screen.getByLabelText("Share on X")).toBeInTheDocument();
    expect(screen.getByLabelText("Share on LinkedIn")).toBeInTheDocument();
    expect(screen.getByLabelText("Copy link")).toBeInTheDocument();
  });

  it("generates correct Facebook share URL", () => {
    render(<ShareButtons {...props} />);
    const link = screen.getByLabelText("Share on Facebook").closest("a");
    expect(link?.href).toContain("facebook.com/sharer/sharer.php");
    expect(link?.href).toContain(
      encodeURIComponent("https://drshahid.com/articles/knee-replacement"),
    );
  });

  it("generates correct X share URL with encoded title", () => {
    render(<ShareButtons {...props} />);
    const link = screen.getByLabelText("Share on X").closest("a");
    expect(link?.href).toContain("twitter.com/intent/tweet");
    expect(link?.href).toContain(encodeURIComponent("Knee Replacement Guide"));
  });

  it("uses basePath prop for URL generation", () => {
    render(<ShareButtons {...props} basePath="research" />);
    const link = screen.getByLabelText("Copy link").closest("a");
    expect(link?.href).toContain("/research/knee-replacement");
  });

  it("calls navigator.share if available", async () => {
    const mockShare = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { share: mockShare });

    render(<ShareButtons {...props} />);

    // The native share button has aria-label="Share" (the first one)
    const nativeShareButton = screen.getByLabelText("Share");
    nativeShareButton.click();

    expect(mockShare).toHaveBeenCalledWith({
      title: "Knee Replacement Guide",
      url: "https://drshahid.com/articles/knee-replacement",
    });

    // Clean up
    delete (navigator as any).share;
  });
});

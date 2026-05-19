import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChamberDetailList } from "./ChamberDetailList";
import { CHAMBERS } from "@/constants/chambers";

describe("ChamberDetailList component", () => {
  it("renders detailed sections for all provided chambers", () => {
    render(<ChamberDetailList chambers={CHAMBERS} />);
    
    // Check titles
    expect(screen.getByText("Ibn Sina Medical College Hospital")).toBeInTheDocument();
    expect(screen.getByText("Payra Hospital Limited")).toBeInTheDocument();
    expect(screen.getByText("Islami Bank Community Hospital, Manikganj")).toBeInTheDocument();
    expect(screen.getByText("Singair City Hospital & Diagnostic Center")).toBeInTheDocument();
    
    // Check rooms/locations
    expect(screen.getByText("Room 205 (2nd Floor, Lift 1), Hospital Building")).toBeInTheDocument();
    expect(screen.getByText("Room 103")).toBeInTheDocument();
    expect(screen.getByText("Room 107 (Ground Floor)")).toBeInTheDocument();
    expect(screen.getByText("Room 207 (2nd Floor)")).toBeInTheDocument();
  });

  it("renders primary marker correctly on the primary chamber card", () => {
    render(<ChamberDetailList chambers={CHAMBERS} />);
    
    // Primary badge text
    expect(screen.getByText("PRIMARY CHAMBER")).toBeInTheDocument();
  });

  it("renders assistant contact details", () => {
    render(<ChamberDetailList chambers={CHAMBERS} />);
    
    expect(screen.getByText("01777079696 (Farzana)")).toBeInTheDocument();
    expect(screen.getByText("01619220033 (Mishu)")).toBeInTheDocument();
  });

  it("renders app links only for chambers that support online booking apps", () => {
    render(<ChamberDetailList chambers={CHAMBERS} />);
    
    // Ibn Sina has an app name defined
    expect(screen.getByText("Ibn Sina Doctor Appointment")).toBeInTheDocument();
    
    // Check it links to the store search URL
    const appLink = screen.getByRole("link", { name: /ibn sina doctor appointment/i });
    expect(appLink).toHaveAttribute(
      "href",
      "https://play.google.com/store/search?q=Ibn+Sina+Doctor+Appointment"
    );
  });

  it("renders map direction links for all chambers", () => {
    render(<ChamberDetailList chambers={CHAMBERS} />);
    
    const directionLinks = screen.getAllByRole("link", { name: /directions/i });
    expect(directionLinks).toHaveLength(4);
    
    expect(directionLinks[0]).toHaveAttribute(
      "href",
      "https://maps.google.com/?q=Ibn+Sina+Medical+College+Hospital+Kalyanpur+Dhaka"
    );
    expect(directionLinks[1]).toHaveAttribute(
      "href",
      "https://maps.google.com/?q=Payra+Hospital+Jhitkabazar+Harirampur+Manikganj"
    );
  });
});

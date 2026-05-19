import { fireEvent, render, screen } from "@testing-library/react";
import { addMonths, format, startOfMonth, subMonths } from "date-fns";
import { describe, expect, it, vi } from "vitest";
import type { ChamberActiveDate } from "@/types/chamber";
import { Calendar } from "./Calendar";

vi.mock("@/lib/chamber-utils", () => ({
  isDateActiveForChamber: vi.fn((date: Date, activeDates: ChamberActiveDate[]) => {
    // Only the 15th of any month is "active" if activeDates is non-empty
    if (!activeDates || activeDates.length === 0) return false;
    return date.getDate() === 15;
  }),
}));

describe("Calendar component", () => {
  const mockActiveDates: ChamberActiveDate[] = [
    { activeDay: "SATURDAY", startTime: "10:00", endTime: "14:00" },
  ];

  it("renders correctly with current month and year", () => {
    render(
      <Calendar
        activeDates={mockActiveDates}
        selectedDate={null}
        onSelectDate={vi.fn()}
      />
    );
    const currentMonthLabel = format(startOfMonth(new Date()), "MMMM yyyy");
    expect(screen.getByText(currentMonthLabel)).toBeInTheDocument();
  });

  it("can navigate to next and previous months", () => {
    render(
      <Calendar
        activeDates={mockActiveDates}
        selectedDate={null}
        onSelectDate={vi.fn()}
        minDate={subMonths(new Date(), 2)}
      />
    );

    const nextButton = screen.getByLabelText("Next month");
    const prevButton = screen.getByLabelText("Previous month");

    const currentMonthLabel = format(startOfMonth(new Date()), "MMMM yyyy");
    expect(screen.getByText(currentMonthLabel)).toBeInTheDocument();

    fireEvent.click(nextButton);
    const nextMonthLabel = format(addMonths(new Date(), 1), "MMMM yyyy");
    expect(screen.getByText(nextMonthLabel)).toBeInTheDocument();

    fireEvent.click(prevButton);
    expect(screen.getByText(currentMonthLabel)).toBeInTheDocument();
  });

  it("allows selecting an active date", () => {
    const handleSelectDate = vi.fn();
    render(
      <Calendar
        activeDates={mockActiveDates}
        selectedDate={null}
        onSelectDate={handleSelectDate}
        // Use a minDate in the past so the 15th of the current month is definitely selectable
        minDate={subMonths(new Date(), 1)}
      />
    );

    // Click on the 15th
    const activeDateButton = screen.getAllByText("15").find(btn => !btn.hasAttribute('disabled'));
    expect(activeDateButton).toBeDefined();
    
    if (activeDateButton) {
      fireEvent.click(activeDateButton);
      expect(handleSelectDate).toHaveBeenCalled();
    }
  });

  it("disables inactive dates", () => {
    render(
      <Calendar
        activeDates={mockActiveDates}
        selectedDate={null}
        onSelectDate={vi.fn()}
      />
    );

    // Click on the 16th which is not active based on our mock
    const inactiveDateButton = screen.getAllByText("16").find(btn => btn.hasAttribute('disabled'));
    expect(inactiveDateButton).toBeDefined();
    expect(inactiveDateButton).toBeDisabled();
  });
});

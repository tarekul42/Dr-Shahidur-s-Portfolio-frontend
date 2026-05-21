"use client";

import { format } from "date-fns";
import dynamic from "next/dynamic";
import type { ChamberFallback } from "@/constants/chambers";
import { useTranslation } from "@/hooks/useTranslation";

const Calendar = dynamic(
  () => import("@/components/ui/Calendar").then((mod) => mod.Calendar),
  {
    loading: () => (
      <div
        className="h-72 rounded-2xl bg-border-light/30 dark:bg-border-dark/30 animate-pulse"
        aria-hidden
      />
    ),
  },
);

interface AppointmentScheduleStepProps {
  isBn: boolean;
  selectedChamber: ChamberFallback | null;
  selectedDate: Date | null;
  tomorrow: Date;
  preferredTime: string;
  availableTimeSlots: Array<{
    value: string;
    label: string;
    disabled: boolean;
  }>;
  bookedSlots: string[];
  dateError?: string;
  timeError?: string;
  onSelectDate: (date: Date) => void;
  onSelectTime: (time: string) => void;
  registerPreferredDate: () => Record<string, unknown>;
}

export function AppointmentScheduleStep({
  isBn,
  selectedChamber,
  selectedDate,
  tomorrow,
  preferredTime,
  availableTimeSlots,
  bookedSlots,
  dateError,
  timeError,
  onSelectDate,
  onSelectTime,
  registerPreferredDate,
}: AppointmentScheduleStepProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 flex-1 flex flex-col justify-center animate-fade-in">
      <div className="space-y-2">
        <h4 className="text-xl font-bold text-text-heading-light dark:text-text-heading-dark">
          {t("appointment.step2.heading")}
        </h4>
        <p className="text-sm text-text-para-light dark:text-text-para-dark opacity-60">
          {selectedChamber
            ? isBn
              ? `${selectedChamber.chemberName}-এ রোগী দেখার দিনগুলো নিচে চিহ্নিত করা রয়েছে।`
              : `Available days at ${selectedChamber.chemberName} are highlighted below.`
            : t("appointment.step2.sub")}
        </p>
      </div>

      <div className="rounded-2xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-4 shadow-sm">
        <Calendar
          activeDates={selectedChamber?.activeDates ?? []}
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
          minDate={tomorrow}
        />
      </div>

      <label htmlFor="preferredDate" className="sr-only">
        Preferred Date
      </label>
      <input
        type="text"
        id="preferredDate"
        className="sr-only"
        {...registerPreferredDate()}
      />
      {dateError && (
        <p className="text-xs text-red-500 font-semibold">{dateError}</p>
      )}

      {selectedDate && availableTimeSlots.length > 0 && (
        <div className="space-y-3 text-left animate-fade-in">
          <span className="block text-xs font-semibold uppercase tracking-wider text-text-para-light dark:text-text-para-dark">
            {isBn ? "উপলব্ধ সময়সূচী" : "Available Time Slots"} —{" "}
            {format(selectedDate, "EEEE, MMM d")}
          </span>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {availableTimeSlots.map((slot) => {
              const isSelected = preferredTime === slot.label;
              return (
                <button
                  key={slot.label}
                  type="button"
                  disabled={slot.disabled}
                  onClick={() => !slot.disabled && onSelectTime(slot.label)}
                  className={
                    "px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 border text-center " +
                    (slot.disabled
                      ? "bg-border-light/40 dark:bg-border-dark/40 text-text-para-light/30 dark:text-text-para-dark/30 border-transparent cursor-not-allowed line-through"
                      : isSelected
                        ? "bg-brand-primary text-white border-brand-primary shadow-md shadow-brand-primary/25"
                        : "bg-card-light dark:bg-card-dark text-text-heading-light dark:text-text-heading-dark border-border-light dark:border-border-dark hover:border-brand-primary hover:bg-brand-primary/5 cursor-pointer")
                  }
                >
                  {slot.label}
                </button>
              );
            })}
          </div>

          {timeError && (
            <p className="text-xs text-red-500 font-semibold">{timeError}</p>
          )}

          {bookedSlots.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-brand-primary bg-brand-primary/5 p-3.5 rounded-xl border border-brand-primary/10">
              <span>
                {isBn
                  ? `এই তারিখে ইতোমধ্যে ${bookedSlots.length} টি অ্যাপয়েন্টমেন্ট বুক করা হয়েছে।`
                  : `${bookedSlots.length} slot(s) already booked for this date. Please pick an available one.`}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

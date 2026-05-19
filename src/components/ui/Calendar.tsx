"use client";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  isToday,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import { isDateActiveForChamber } from "@/lib/chamber-utils";
import { cn } from "@/lib/utils";
import type { ChamberActiveDate } from "@/types/chamber";

interface CalendarProps {
  activeDates: ChamberActiveDate[];
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  minDate?: Date;
  className?: string;
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export const Calendar = ({
  activeDates,
  selectedDate,
  onSelectDate,
  minDate,
  className,
}: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(() =>
    startOfMonth(new Date()),
  );
  const effectiveMinDate = minDate ?? startOfDay(new Date());

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  const isActiveDay = useCallback(
    (date: Date) => isDateActiveForChamber(date, activeDates),
    [activeDates],
  );

  const isSelectable = useCallback(
    (date: Date) => {
      if (isBefore(date, effectiveMinDate)) return false;
      if (!isActiveDay(date)) return false;
      return true;
    },
    [effectiveMinDate, isActiveDay],
  );

  const handlePrevMonth = () => setCurrentMonth((m) => subMonths(m, 1));
  const handleNextMonth = () => setCurrentMonth((m) => addMonths(m, 1));

  const canGoPrev = useMemo(() => {
    const prev = subMonths(currentMonth, 1);
    return !isBefore(endOfMonth(prev), effectiveMinDate);
  }, [currentMonth, effectiveMinDate]);

  return (
    <div className={cn("select-none", className)}>
      {/* Month navigation header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={handlePrevMonth}
          disabled={!canGoPrev}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-brand-primary/10 text-text-para-light dark:text-text-para-dark disabled:opacity-20 disabled:cursor-not-allowed"
          aria-label="Previous month"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <title>Previous Month</title>
            <path
              d="M10 12L6 8L10 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <AnimatePresence mode="wait">
          <motion.span
            key={format(currentMonth, "MMM yyyy")}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
            className="text-sm font-bold text-text-heading-light dark:text-text-heading-dark min-w-28 text-center"
          >
            {format(currentMonth, "MMMM yyyy")}
          </motion.span>
        </AnimatePresence>

        <button
          type="button"
          onClick={handleNextMonth}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-brand-primary/10 text-text-para-light dark:text-text-para-dark"
          aria-label="Next month"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <title>Next Month</title>
            <path
              d="M6 4L10 8L6 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="h-9 flex items-center justify-center text-[10px] font-bold uppercase tracking-wider text-text-para-light/50 dark:text-text-para-dark/50"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Day grid with animated month transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={format(currentMonth, "yyyy-MM")}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-7 gap-1"
        >
          {calendarDays.map((date) => {
            const inCurrentMonth = isSameMonth(date, currentMonth);
            const selectable = inCurrentMonth && isSelectable(date);
            const selected = selectedDate && isSameDay(date, selectedDate);
            const today = isToday(date);

            return (
              <button
                key={date.toISOString()}
                type="button"
                disabled={!selectable}
                onClick={() => selectable && onSelectDate(date)}
                className={cn(
                  "h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all duration-200 relative",
                  !inCurrentMonth && "opacity-0 pointer-events-none",
                  inCurrentMonth &&
                    !selectable &&
                    "text-text-para-light/25 dark:text-text-para-dark/25 cursor-not-allowed",
                  selectable &&
                    !selected &&
                    !today &&
                    "text-text-heading-light dark:text-text-heading-dark hover:bg-brand-primary/10 hover:scale-105 cursor-pointer",
                  selectable &&
                    today &&
                    !selected &&
                    "text-brand-primary font-bold",
                  selected &&
                    "bg-brand-primary text-white shadow-lg shadow-brand-primary/25 scale-105",
                )}
              >
                {format(date, "d")}
                {today && !selected && inCurrentMonth && (
                  <span className="absolute inset-0 rounded-xl ring-1 ring-brand-primary/30" />
                )}
              </button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border-light/50 dark:border-border-dark/50">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-brand-primary" />
          <span className="text-[10px] text-text-para-light dark:text-text-para-dark">
            Available
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-text-para-light/25 dark:bg-text-para-dark/25" />
          <span className="text-[10px] text-text-para-light dark:text-text-para-dark">
            Unavailable
          </span>
        </div>
      </div>
    </div>
  );
};

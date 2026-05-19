"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/Calendar";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { CHAMBERS_FALLBACK, type ChamberFallback } from "@/constants/chambers";
import { useTranslation } from "@/hooks/useTranslation";
import { createAppointment, getBookedSlots } from "@/lib/api/appointments";
import {
  formatTimeDisplay,
  generateTimeSlots,
  isDateActiveForChamber,
} from "@/lib/chamber-utils";
import { extractHttpStatus } from "@/lib/utils";
import { useAppointmentPrefill } from "@/store/use-appointment-prefill";

const appointmentSchema = z.object({
  chamberId: z.string().min(1, "Chamber is required"),
  name: z.string().min(2, "Name is required").trim(),
  phone: z
    .string()
    .regex(/^\+8801[3-9]\d{8}$/, "Invalid Bangladesh phone format"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  preferredDate: z
    .string()
    .min(1, "Preferred date is required")
    .refine((val) => {
      const d = new Date(val);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      return d >= now;
    }, "Date must be today or in the future"),
  preferredTime: z.string().min(1, "Please select a time"),
  message: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

const springTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
};

const slideVariants = {
  enter: { x: 24, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -24, opacity: 0 },
};

const expandVariants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: {
      duration: 0.25,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
  },
  expanded: {
    height: "auto",
    opacity: 1,
    transition: {
      duration: 0.35,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
  },
};

function AppointmentFormContent() {
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(0);
  const [selectedChamber, setSelectedChamber] =
    useState<ChamberFallback | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { executeRecaptcha } = useGoogleReCaptcha();
  const {
    message: prefillMessage,
    chamberId: prefillChamberId,
    clearPrefill,
  } = useAppointmentPrefill();
  const { t, language } = useTranslation();
  const isBn = language === "bn";
  const searchParams = useSearchParams();
  const chamberParam = searchParams.get("chamber");

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    trigger,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      chamberId: "",
      preferredTime: "",
      message: prefillMessage ?? "",
    },
  });

  const chamberId = watch("chamberId");
  const preferredDate = watch("preferredDate");
  const preferredTime = watch("preferredTime");

  // Scan URL query parameter or store prefill for chamber selection
  useEffect(() => {
    const targetChamberId = chamberParam || prefillChamberId;
    if (targetChamberId) {
      const found = CHAMBERS_FALLBACK.find((c) => c.id === targetChamberId);
      if (found) {
        setValue("chamberId", targetChamberId, { shouldValidate: true });
        setSelectedChamber(found);
        setStep(1); // Auto-skip Step 0
      }
    }
  }, [chamberParam, prefillChamberId, setValue]);

  // Clear prefills on unmount
  useEffect(() => {
    return () => clearPrefill();
  }, [clearPrefill]);

  // Dynamic day-of-week validation
  useEffect(() => {
    if (preferredDate && selectedChamber) {
      const parsedDate = new Date(`${preferredDate}T00:00:00`);
      if (Number.isNaN(parsedDate.getTime())) return;

      if (!isDateActiveForChamber(parsedDate, selectedChamber.activeDates)) {
        setError("preferredDate", {
          type: "custom",
          message: isBn
            ? "নির্বাচিত চেম্বারটি এই বারে খোলা নেই"
            : "The selected chamber is not open on this day of the week",
        });
      } else {
        clearErrors("preferredDate");
      }
    }
  }, [preferredDate, selectedChamber, setError, clearErrors, isBn]);

  // Synchronize selectedDate state with form value (e.g. when set programmatically or via tests)
  useEffect(() => {
    if (preferredDate) {
      const parsedDate = new Date(`${preferredDate}T00:00:00`);
      if (!Number.isNaN(parsedDate.getTime())) {
        setSelectedDate((prev) => {
          if (prev && format(prev, "yyyy-MM-dd") === preferredDate) {
            return prev;
          }
          return parsedDate;
        });
      }
    } else {
      setSelectedDate(null);
    }
  }, [preferredDate]);

  const handleChamberChange = useCallback(
    (id: string) => {
      const chamber = CHAMBERS_FALLBACK.find((c) => c.id === id) ?? null;
      setSelectedChamber(chamber);
      setSelectedDate(null); // Clear selected date
      setValue("chamberId", id, { shouldValidate: true }); // Set form value
      setValue("preferredDate", "", { shouldValidate: false }); // Clear date
      setValue("preferredTime", "", { shouldValidate: false }); // Clear time
      clearErrors("chamberId");
    },
    [setValue, clearErrors],
  );

  const handleDateSelect = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      const dateStr = format(date, "yyyy-MM-dd");
      setValue("preferredDate", dateStr, { shouldValidate: true });
      setValue("preferredTime", "", { shouldValidate: false }); // Reset time when date changes
      clearErrors("preferredDate");
    },
    [setValue, clearErrors],
  );

  const handleNext = async () => {
    const fieldsByStep: Record<number, Array<keyof AppointmentFormData>> = {
      0: ["chamberId"],
      1: ["name", "email", "phone"],
      2: ["preferredDate", "preferredTime"],
    };

    const fields = fieldsByStep[step];
    if (!fields) return;

    const isValid = await trigger(fields);
    if (isValid) {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    setStep((s) => s - 1);
  };

  const { data: bookedSlots = [] } = useQuery({
    queryKey: ["booked-slots", preferredDate],
    enabled: !!preferredDate && preferredDate.length === 10,
    queryFn: async () => getBookedSlots(preferredDate),
    retry: false,
    staleTime: 1000 * 60,
  });

  const timeSlotOptions = useMemo(() => {
    if (!selectedChamber || !selectedDate) return [];
    return generateTimeSlots(selectedChamber.activeDates, selectedDate);
  }, [selectedChamber, selectedDate]);

  const availableTimeSlots = useMemo(() => {
    return timeSlotOptions.map((slot) => {
      const isBooked = bookedSlots.includes(slot.label);
      return {
        ...slot,
        disabled: slot.disabled || isBooked,
        label: isBooked
          ? `${slot.label} (${isBn ? "বুকড" : "Booked"})`
          : slot.label,
      };
    });
  }, [timeSlotOptions, bookedSlots, isBn]);

  const appointmentMutation = useMutation({
    mutationFn: createAppointment,
    retry: false,
    onSuccess: () => {
      toast.success(
        isBn
          ? "অ্যাপয়েন্টমেন্টের আবেদন জমা হয়েছে! নিশ্চিতকরণের জন্য আমরা শীঘ্রই যোগাযোগ করব।"
          : "Appointment request submitted! We will contact you soon to confirm.",
      );
      reset({ chamberId: "", preferredTime: "", message: "" });
      setStep(0);
      setSelectedChamber(null);
      setSelectedDate(null);
      setSubmitted(true);
    },
    onError: (error) => {
      const status = extractHttpStatus(error);
      if (status === 429) {
        toast.error(
          isBn
            ? "আপনি খুব বেশি আবেদন জমা দিয়েছেন। অনুগ্রহ করে কিছুক্ষণ অপেক্ষা করে আবার চেষ্টা করুন।"
            : "You've submitted too many requests. Please wait and try again.",
        );
      } else {
        toast.error(
          isBn
            ? "আবেদন জমা দিতে ব্যর্থ হয়েছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন।"
            : "Failed to submit request. Please try again later.",
        );
      }
    },
  });

  const onSubmit = async (data: AppointmentFormData) => {
    if (step < 3) {
      handleNext();
      return;
    }

    let token: string | undefined;

    if (executeRecaptcha) {
      try {
        token = await executeRecaptcha("appointment_request");
      } catch (_error) {
        console.warn(
          "ReCAPTCHA execution failed — attempting submission without token.",
        );
      }
    } else {
      console.warn(
        "ReCAPTCHA not initialized — attempting submission without token.",
      );
    }

    // Append selected chamber details to outgoing message
    const chamberName = selectedChamber ? selectedChamber.chemberName : "";
    const chamberText = chamberName ? `[Chamber: ${chamberName}]` : "";
    const finalMessage = data.message
      ? `${chamberText}\n\n${data.message}`
      : chamberText;

    appointmentMutation.mutate({
      name: data.name,
      phone: data.phone,
      email: data.email || undefined,
      message: finalMessage,
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime,
      chamberId: data.chamberId,
      recaptchaToken: token,
    });
  };

  if (submitted) {
    return (
      <div className="min-h-100 flex flex-col items-center justify-center space-y-8 text-center p-8">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-24 h-24 rounded-full bg-brand-primary/10 flex items-center justify-center"
        >
          <svg
            width="44"
            height="44"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-brand-primary"
          >
            <title>Success</title>
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </motion.div>

        <div className="space-y-3">
          <h3 className="text-3xl font-bold text-text-heading-light dark:text-text-heading-dark">
            {t("appointment.received")}
          </h3>
          <p className="text-text-para-light dark:text-text-para-dark max-w-sm mx-auto leading-relaxed">
            {t("appointment.receivedDesc")}
          </p>
        </div>

        <Button
          type="button"
          onClick={() => setSubmitted(false)}
          variant="outline"
          className="px-8 h-12"
        >
          {t("appointment.bookAnother")}
        </Button>
      </div>
    );
  }

  const stepsLabels = [
    t("appointment.step0"),
    t("appointment.step1"),
    t("appointment.step2"),
    t("appointment.step3"),
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      {/* Wizard Steps Header */}
      <div className="flex flex-col gap-4 mb-2">
        <div className="flex items-center justify-between gap-4">
          {stepsLabels.map((label, index) => {
            const isActive = index <= step;
            const isCurrent = index === step;
            return (
              <div key={label} className="flex-1 group">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 text-xs font-bold transition-all duration-500 " +
                        (isActive
                          ? "border-brand-primary bg-brand-primary text-white shadow-xl shadow-brand-primary/20"
                          : "border-border-light dark:border-border-dark bg-transparent text-text-para-light dark:text-text-para-dark") +
                        (isCurrent
                          ? " scale-110 ring-8 ring-brand-primary/10"
                          : "")
                      }
                    >
                      {index < step ? (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <title>Checked</title>
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className="flex-1 hidden md:block">
                      <div
                        className={
                          "h-0.5 w-full rounded-full transition-all duration-700 " +
                          (isActive && index < step
                            ? "bg-brand-primary"
                            : "bg-border-light dark:bg-border-dark")
                        }
                      />
                    </div>
                  </div>
                  <span
                    className={
                      "text-[10px] font-bold uppercase tracking-[0.15em] transition-colors duration-500 " +
                      (isActive
                        ? "text-brand-primary"
                        : "text-text-para-light dark:text-text-para-dark opacity-40")
                    }
                  >
                    {label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="min-h-100 flex flex-col">
        <AnimatePresence mode="wait">
          {/* Step 0: Location (New Dropdown & Animated details) */}
          {step === 0 && (
            <motion.div
              key="step0"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={springTransition}
              className="space-y-6 flex-1 flex flex-col justify-center"
            >
              <div className="space-y-2">
                <h4 className="text-xl font-bold text-text-heading-light dark:text-text-heading-dark">
                  {t("appointment.step0.heading")}
                </h4>
                <p className="text-sm text-text-para-light dark:text-text-para-dark opacity-60">
                  {t("appointment.step0.sub")}
                </p>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="chamber-select"
                  className="text-xs font-semibold uppercase tracking-wider text-text-para-light dark:text-text-para-dark"
                >
                  {isBn ? "চেম্বার / হাসপাতাল" : "Chamber / Hospital"}
                </label>
                <div className="relative group focus-within:-translate-y-px transition-transform duration-200">
                  <select
                    id="chamber-select"
                    value={chamberId}
                    onChange={(e) => handleChamberChange(e.target.value)}
                    className={
                      "w-full rounded-xl border bg-card-light dark:bg-card-dark px-4 py-3 text-sm transition-all outline-none appearance-none cursor-pointer " +
                      "border-border-light dark:border-border-dark text-text-heading-light dark:text-text-heading-dark " +
                      "focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none " +
                      (errors.chamberId
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                        : "")
                    }
                  >
                    <option value="" disabled>
                      {isBn
                        ? "একটি চেম্বার নির্বাচন করুন..."
                        : "Choose a chamber..."}
                    </option>
                    {CHAMBERS_FALLBACK.map((chamber) => (
                      <option key={chamber.id} value={chamber.id}>
                        {chamber.chemberName}
                        {chamber.isPrimary
                          ? ` (${isBn ? "প্রধান" : "Primary"})`
                          : ""}
                      </option>
                    ))}
                  </select>
                  {/* Custom chevron icon */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-para-light dark:text-text-para-dark">
                    <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                      <title>Chevron</title>
                      <path
                        d="M3 4.5L6 7.5L9 4.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                {errors.chamberId && (
                  <p className="text-xs text-red-500 font-semibold mt-1">
                    {errors.chamberId.message}
                  </p>
                )}
              </div>

              {/* Animated Chamber Details Card */}
              <AnimatePresence>
                {selectedChamber && (
                  <motion.div
                    key={`chamber-detail-${selectedChamber.id}`}
                    variants={expandVariants}
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    className="overflow-hidden"
                  >
                    <motion.div
                      initial={{ y: -8 }}
                      animate={{ y: 0 }}
                      transition={{
                        delay: 0.1,
                        duration: 0.3,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                      className="rounded-2xl border border-brand-primary/20 bg-brand-primary/[0.03] dark:bg-brand-primary/[0.06] p-5 space-y-4 text-left"
                    >
                      {/* Chamber Name + Primary Badge */}
                      <div>
                        <h5 className="font-bold text-base text-text-heading-light dark:text-text-heading-dark">
                          {selectedChamber.chemberName}
                        </h5>
                        {selectedChamber.isPrimary && (
                          <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-primary bg-brand-primary/10 px-2.5 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                            {isBn ? "প্রধান চেম্বার" : "Primary Chamber"}
                          </span>
                        )}
                      </div>

                      {/* Details Grid: Address, Phone, Room, Assistant */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Address */}
                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5 w-4 h-4 shrink-0 text-brand-primary">
                            <svg
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <title>Address Icon</title>
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-text-para-light/60 dark:text-text-para-dark/60">
                              {isBn ? "ঠিকানা" : "Address"}
                            </p>
                            <p className="text-sm font-medium text-text-heading-light dark:text-text-heading-dark leading-relaxed">
                              {isBn
                                ? selectedChamber.addressBn
                                : selectedChamber.address}
                            </p>
                          </div>
                        </div>

                        {/* Phone */}
                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5 w-4 h-4 shrink-0 text-brand-primary">
                            <svg
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <title>Phone Icon</title>
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-text-para-light/60 dark:text-text-para-dark/60">
                              {isBn ? "সিরিয়াল ফোন" : "Serial Phone"}
                            </p>
                            <p className="text-sm font-medium text-text-heading-light dark:text-text-heading-dark">
                              {selectedChamber.phone}
                            </p>
                          </div>
                        </div>

                        {/* Room */}
                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5 w-4 h-4 shrink-0 text-brand-primary">
                            <svg
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <title>Room Icon</title>
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-text-para-light/60 dark:text-text-para-dark/60">
                              {isBn ? "কক্ষ নং" : "Room"}
                            </p>
                            <p className="text-sm font-medium text-text-heading-light dark:text-text-heading-dark">
                              {isBn && selectedChamber.roomBn
                                ? selectedChamber.roomBn
                                : selectedChamber.room}
                            </p>
                          </div>
                        </div>

                        {/* Assistant */}
                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5 w-4 h-4 shrink-0 text-brand-primary">
                            <svg
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <title>Assistant Icon</title>
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-text-para-light/60 dark:text-text-para-dark/60">
                              {isBn ? "সহকারী" : "Assistant"}
                            </p>
                            <p className="text-sm font-medium text-text-heading-light dark:text-text-heading-dark">
                              {isBn && selectedChamber.assistantNameBn
                                ? selectedChamber.assistantNameBn
                                : selectedChamber.assistantName}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Schedule Badges */}
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-text-para-light/60 dark:text-text-para-dark/60 mb-2.5">
                          {isBn ? "সাপ্তাহিক সূচী" : "Weekly Schedule"}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {selectedChamber.activeDates.map((ad) => {
                            // Find display day name
                            const dayMap: Record<
                              string,
                              { en: string; bn: string }
                            > = {
                              SATURDAY: { en: "Saturday", bn: "শনিবার" },
                              SUNDAY: { en: "Sunday", bn: "রবিবার" },
                              MONDAY: { en: "Monday", bn: "সোমবার" },
                              TUESDAY: { en: "Tuesday", bn: "মঙ্গলবার" },
                              WEDNESDAY: { en: "Wednesday", bn: "বুধবার" },
                              THURSDAY: { en: "Thursday", bn: "বৃহস্পতিবার" },
                              FRIDAY: { en: "Friday", bn: "শুক্রবার" },
                            };
                            const info = dayMap[ad.activeDay] ?? {
                              en: ad.activeDay,
                              bn: ad.activeDay,
                            };
                            const dayName = isBn ? info.bn : info.en;

                            return (
                              <div
                                key={`${ad.activeDay}-${ad.startTime}`}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-primary/10 border border-brand-primary/15 text-xs text-text-heading-light dark:text-text-heading-dark font-medium"
                              >
                                <span className="font-bold text-brand-primary">
                                  {dayName}
                                </span>
                                <span className="opacity-75">
                                  {formatTimeDisplay(ad.startTime)} –{" "}
                                  {formatTimeDisplay(ad.endTime)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Google Maps Link */}
                      {selectedChamber.map && (
                        <div className="pt-2">
                          <a
                            href={selectedChamber.map}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary hover:text-brand-hover transition-colors group"
                          >
                            <svg
                              className="w-4 h-4 group-hover:scale-110 transition-transform"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <title>Map Icon</title>
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                              />
                            </svg>
                            {isBn ? "গুগল ম্যাপে দেখুন" : "View on Google Maps"}
                          </a>
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Step 1: Patient Info */}
          {step === 1 && (
            <motion.div
              key="step1"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={springTransition}
              className="space-y-8 flex-1 flex flex-col justify-center"
            >
              <div className="space-y-2">
                <h4 className="text-xl font-bold text-text-heading-light dark:text-text-heading-dark">
                  {t("appointment.step1.heading")}
                </h4>
                <p className="text-sm text-text-para-light dark:text-text-para-dark opacity-60">
                  {t("appointment.step1.sub")}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Input
                  label={t("appointment.name")}
                  placeholder={t("appointment.namePlaceholder")}
                  error={errors.name?.message}
                  {...register("name")}
                />
                <Input
                  label={t("appointment.email")}
                  type="email"
                  placeholder={t("appointment.emailPlaceholder")}
                  error={errors.email?.message}
                  {...register("email")}
                />
              </div>
              <Input
                label={t("appointment.phone")}
                type="tel"
                placeholder={t("appointment.phonePlaceholder")}
                helperText="Format: +8801XXXXXXXXX"
                error={errors.phone?.message}
                {...register("phone")}
              />
            </motion.div>
          )}

          {/* Step 2: Date & Time Selection (Redesigned with custom calendar & time slot buttons) */}
          {step === 2 && (
            <motion.div
              key="step2"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={springTransition}
              className="space-y-6 flex-1 flex flex-col justify-center"
            >
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

              {/* Calendar card wrapper */}
              <div className="rounded-2xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-4 shadow-sm">
                <Calendar
                  activeDates={selectedChamber?.activeDates ?? []}
                  selectedDate={selectedDate}
                  onSelectDate={handleDateSelect}
                  minDate={tomorrow}
                />
              </div>

              {/* Hidden input to hold state validation */}
              <label htmlFor="preferredDate" className="sr-only">
                Preferred Date
              </label>
              <input
                type="text"
                id="preferredDate"
                className="sr-only"
                {...register("preferredDate")}
              />
              {errors.preferredDate && (
                <p className="text-xs text-red-500 font-semibold">
                  {errors.preferredDate.message}
                </p>
              )}

              {/* Time slots button grid */}
              <AnimatePresence>
                {selectedDate && availableTimeSlots.length > 0 && (
                  <motion.div
                    key={`timeslots-${preferredDate}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="space-y-3 text-left"
                  >
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
                            onClick={() =>
                              !slot.disabled &&
                              setValue("preferredTime", slot.label, {
                                shouldValidate: true,
                              })
                            }
                            className={
                              "px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 border text-center " +
                              (slot.disabled
                                ? "bg-border-light/40 dark:bg-border-dark/40 text-text-para-light/30 dark:text-text-para-dark/30 border-transparent cursor-not-allowed line-through"
                                : isSelected
                                  ? "bg-brand-primary text-white border-brand-primary shadow-md shadow-brand-primary/25 scale-[1.02]"
                                  : "bg-card-light dark:bg-card-dark text-text-heading-light dark:text-text-heading-dark border-border-light dark:border-border-dark hover:border-brand-primary hover:bg-brand-primary/5 cursor-pointer hover:scale-[1.02]")
                            }
                          >
                            {slot.label}
                          </button>
                        );
                      })}
                    </div>

                    {errors.preferredTime && (
                      <p className="text-xs text-red-500 font-semibold">
                        {errors.preferredTime.message}
                      </p>
                    )}

                    {bookedSlots.length > 0 && (
                      <div className="flex items-center gap-2 text-xs text-brand-primary bg-brand-primary/5 p-3.5 rounded-xl border border-brand-primary/10">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <title>Info</title>
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="16" x2="12" y2="12" />
                          <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                        <span>
                          {isBn
                            ? `এই তারিখে ইতোমধ্যে ${bookedSlots.length} টি অ্যাপয়েন্টমেন্ট বুক করা হয়েছে।`
                            : `${bookedSlots.length} slot(s) already booked for this date. Please pick an available one.`}
                        </span>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Step 3: Concern Notes */}
          {step === 3 && (
            <motion.div
              key="step3"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={springTransition}
              className="space-y-8 flex-1 flex flex-col justify-center"
            >
              <div className="space-y-2">
                <h4 className="text-xl font-bold text-text-heading-light dark:text-text-heading-dark">
                  {t("appointment.step3.heading")}
                </h4>
                <p className="text-sm text-text-para-light dark:text-text-para-dark opacity-60">
                  {t("appointment.step3.sub")}
                </p>
              </div>

              {/* Selection Summary Badges */}
              {selectedChamber && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-wrap gap-2 text-xs text-left"
                >
                  <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-primary/10 text-brand-primary font-bold">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <title>Location</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                    </svg>
                    {selectedChamber.chemberName}
                  </span>

                  {selectedDate && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-secondary/10 text-brand-secondary font-bold">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <title>Date</title>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {format(selectedDate, "MMM d, yyyy")}
                    </span>
                  )}

                  {preferredTime && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-accent/10 text-brand-accent font-bold">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <title>Clock</title>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {preferredTime}
                    </span>
                  )}
                </motion.div>
              )}

              <Textarea
                label={t("appointment.concern")}
                placeholder={t("appointment.concernPlaceholder")}
                error={errors.message?.message}
                maxLength={500}
                className="min-h-40"
                {...register("message")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-border-light dark:border-border-dark">
        <p className="text-[10px] text-center sm:text-left text-text-para-light dark:text-text-para-dark opacity-50 leading-relaxed max-w-xs">
          <span>
            {isBn
              ? "নিশ্চিতকরণের জন্য একজন প্রতিনিধি আপনার সাথে যোগাযোগ করবেন।"
              : "A representative will contact you for final confirmation."}
          </span>
          <br />
          <span>
            Protected by reCAPTCHA. Google{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-brand-primary"
            >
              Privacy
            </a>{" "}
            &{" "}
            <a
              href="https://policies.google.com/terms"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-brand-primary"
            >
              Terms
            </a>{" "}
            apply.
          </span>
        </p>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          {step > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="flex-1 sm:flex-none h-12 px-8 text-base font-bold"
            >
              {t("appointment.back")}
            </Button>
          )}
          {step < 3 ? (
            <Button
              type="button"
              onClick={handleNext}
              className="flex-2 sm:flex-none h-12 px-10 text-base font-bold shadow-lg shadow-brand-primary/20"
            >
              {t("appointment.continue")}
            </Button>
          ) : (
            <Button
              type="submit"
              loading={appointmentMutation.isPending}
              className="flex-2 sm:flex-none h-12 px-10 text-base font-bold shadow-lg shadow-brand-primary/20"
            >
              {t("appointment.submit")}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}

export const AppointmentForm = () => {
  return (
    <Suspense
      fallback={
        <div className="h-96 flex items-center justify-center text-sm opacity-60">
          Loading appointment form...
        </div>
      }
    >
      <AppointmentFormContent />
    </Suspense>
  );
};

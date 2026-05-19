"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { CHAMBERS } from "@/constants/chambers";
import { useTranslation } from "@/hooks/useTranslation";
import { createAppointment, getBookedSlots } from "@/lib/api/appointments";
import { formatTimeSlot, isDateAvailableForChamber } from "@/lib/chamber-utils";
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
      return d > now;
    }, "Date must be in the future"),
  preferredTime: z.string().min(1, "Please select a time"),
  message: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

function AppointmentFormContent() {
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(0);
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
  const minDate = tomorrow.toISOString().slice(0, 10);

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

  const selectedChamberId = watch("chamberId");
  const preferredDate = watch("preferredDate");
  const activeChamber = CHAMBERS.find((c) => c.id === selectedChamberId);

  // Scan URL query parameter or store prefill for chamber selection
  useEffect(() => {
    const targetChamberId = chamberParam || prefillChamberId;
    if (targetChamberId && CHAMBERS.some((c) => c.id === targetChamberId)) {
      setValue("chamberId", targetChamberId);
      setStep(1); // Auto-skip Step 0
    }
  }, [chamberParam, prefillChamberId, setValue]);

  // Clear prefills on unmount
  useEffect(() => {
    return () => clearPrefill();
  }, [clearPrefill]);

  // Dynamic day-of-week validation
  useEffect(() => {
    if (preferredDate && activeChamber) {
      if (!isDateAvailableForChamber(preferredDate, activeChamber)) {
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
  }, [preferredDate, activeChamber, setError, clearErrors, isBn]);

  const handleNext = async () => {
    let fields: Array<keyof AppointmentFormData> = [];
    if (step === 0) {
      fields = ["chamberId"];
    } else if (step === 1) {
      fields = ["name", "email", "phone"];
    } else if (step === 2) {
      fields = ["preferredDate", "preferredTime"];
    }

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
    enabled: !!preferredDate,
    queryFn: async () => getBookedSlots(preferredDate),
    retry: false,
    staleTime: 1000 * 60,
  });

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

    // Double-check date constraint on submit
    if (
      activeChamber &&
      !isDateAvailableForChamber(data.preferredDate, activeChamber)
    ) {
      setError("preferredDate", {
        type: "custom",
        message: isBn
          ? "নির্বাচিত চেম্বারটি এই বারে খোলা নেই"
          : "The selected chamber is not open on this day of the week",
      });
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
    const chamberName = activeChamber
      ? isBn
        ? activeChamber.hospitalBn
        : activeChamber.hospitalEn
      : "";
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

  // Map 24h active slots dynamically
  const timeOptions = activeChamber
    ? activeChamber.timeSlots.map((slot24) => {
        const slot12 = formatTimeSlot(slot24);
        const isBooked = bookedSlots.includes(slot12);
        return {
          value: slot12,
          label: isBooked ? `${slot12} (${isBn ? "বুকড" : "Booked"})` : slot12,
          disabled: isBooked,
        };
      })
    : [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      {/* Wizard Steps Header */}
      <div className="flex flex-col gap-4 mb-2">
        <div className="flex items-center justify-between gap-4">
          {[
            t("appointment.step0"),
            t("appointment.step1"),
            t("appointment.step2"),
            t("appointment.step3"),
          ].map((label, index) => {
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
                      {index}
                    </div>
                    <div className="flex-1 hidden md:block">
                      <div
                        className={
                          "h-0.5 w-full rounded-full transition-all duration-700 " +
                          (isActive
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
          {/* Step 0: Chamber Selection */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 25,
              }}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CHAMBERS.map((chamber) => {
                  const hospital = isBn
                    ? chamber.hospitalBn
                    : chamber.hospitalEn;
                  const address = isBn ? chamber.addressBn : chamber.addressEn;
                  const isSelected = selectedChamberId === chamber.id;

                  return (
                    <button
                      key={chamber.id}
                      type="button"
                      onClick={() => {
                        setValue("chamberId", chamber.id);
                        clearErrors("chamberId");
                      }}
                      className={`p-5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between group relative h-full
                        ${
                          isSelected
                            ? "border-brand-primary bg-brand-softbg dark:bg-brand-primary/10 shadow-md shadow-brand-primary/5 ring-2 ring-brand-primary/20"
                            : "border-border-light dark:border-border-dark bg-transparent hover:border-brand-primary/50 hover:bg-bg-light-soft dark:hover:bg-bg-dark-soft"
                        }`}
                    >
                      {/* Selection Checkmark Dot */}
                      <div
                        className={`absolute top-4 right-4 w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300
                        ${
                          isSelected
                            ? "border-brand-primary bg-brand-primary text-white"
                            : "border-border-light dark:border-border-dark"
                        }`}
                      >
                        {isSelected && (
                          <svg
                            aria-hidden="true"
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>

                      <div className="pr-6">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded
                            ${
                              chamber.isPrimary
                                ? "bg-brand-primary text-white"
                                : "bg-border-light dark:bg-border-dark text-text-para-light dark:text-text-para-dark"
                            }`}
                          >
                            {chamber.isPrimary
                              ? t("chambers.primary")
                              : isBn
                                ? "সহযোগী চেম্বার"
                                : "Affiliated"}
                          </span>
                        </div>
                        <h5 className="font-bold text-sm text-text-heading-light dark:text-text-heading-dark group-hover:text-brand-primary transition-colors line-clamp-1 mb-1">
                          {hospital}
                        </h5>
                        <p className="text-xs text-text-para-light dark:text-text-para-dark opacity-70 line-clamp-1">
                          {address}
                        </p>
                      </div>

                      <div className="border-t border-border-light/60 dark:border-border-dark/60 pt-3 mt-4 w-full">
                        <div className="flex items-center gap-1.5 text-xs text-text-para-light dark:text-text-para-dark opacity-80">
                          <svg
                            aria-hidden="true"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-brand-primary shrink-0"
                          >
                            <rect
                              x="3"
                              y="4"
                              width="18"
                              height="18"
                              rx="2"
                              ry="2"
                            />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                          </svg>
                          <span className="font-semibold text-text-heading-light dark:text-text-heading-dark">
                            {isBn ? "দিনসমূহ:" : "Days:"}
                          </span>
                          <span className="truncate">
                            {chamber.schedule
                              .map((s) => (isBn ? s.daysBn : s.daysEn))
                              .join(" | ")}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              {errors.chamberId && (
                <p className="text-xs text-red-500 font-semibold mt-1">
                  {errors.chamberId.message}
                </p>
              )}
            </motion.div>
          )}

          {/* Step 1: Patient Info */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 25,
              }}
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

          {/* Step 2: Date & Time Selection */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 25,
              }}
              className="space-y-8 flex-1 flex flex-col justify-center"
            >
              <div className="space-y-2">
                <h4 className="text-xl font-bold text-text-heading-light dark:text-text-heading-dark">
                  {t("appointment.step2.heading")}
                </h4>
                <p className="text-sm text-text-para-light dark:text-text-para-dark opacity-60">
                  {t("appointment.step2.sub")}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Input
                    label={t("appointment.date")}
                    type="date"
                    min={minDate}
                    error={errors.preferredDate?.message}
                    {...register("preferredDate")}
                  />
                  {activeChamber && (
                    <p className="mt-2 text-xs text-brand-primary font-semibold">
                      {isBn
                        ? `চেম্বার শুধুমাত্র ${activeChamber.schedule.map((s) => s.daysBn).join(" ও ")} বারে খোলা থাকে`
                        : `Chamber is open on ${activeChamber.schedule.map((s) => s.daysEn).join(" & ")} only`}
                    </p>
                  )}
                </div>
                <Select
                  label={t("appointment.time")}
                  options={timeOptions}
                  placeholder={isBn ? "সময় নির্বাচন করুন" : "Select a time"}
                  error={errors.preferredTime?.message}
                  {...register("preferredTime")}
                  disabled={!preferredDate || timeOptions.length === 0}
                />
              </div>
              {bookedSlots.length > 0 ? (
                <div className="flex items-center gap-2 text-xs text-brand-primary bg-brand-primary/5 p-4 rounded-xl border border-brand-primary/10">
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
                    <title>Info Icon</title>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  <span>
                    {isBn
                      ? `এই তারিখে ইতোমধ্যে ${bookedSlots.length} টি অ্যাপয়েন্টমেন্ট বুক করা হয়েছে। অনুগ্রহ করে একটি ফাকা সময় বেছে নিন।`
                      : `${bookedSlots.length} slot(s) already booked for this date. Please pick an available one.`}
                  </span>
                </div>
              ) : null}
            </motion.div>
          )}

          {/* Step 3: Concern Notes */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 25,
              }}
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

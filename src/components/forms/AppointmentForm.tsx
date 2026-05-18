"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { useTranslation } from "@/hooks/useTranslation";
import { createAppointment, getBookedSlots } from "@/lib/api/appointments";
import { extractHttpStatus } from "@/lib/utils";
import { useAppointmentPrefill } from "@/store/use-appointment-prefill";

const appointmentSchema = z.object({
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

export const AppointmentForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(0);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { message: prefillMessage, clearPrefill } = useAppointmentPrefill();
  const { t } = useTranslation();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().slice(0, 10);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    trigger,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      preferredTime: "",
      message: prefillMessage ?? "",
    },
  });

  useEffect(() => {
    return () => clearPrefill();
  }, [clearPrefill]);

  const preferredDate = watch("preferredDate");

  const handleNext = async () => {
    const fields =
      step === 0
        ? (["name", "email", "phone"] as const)
        : (["preferredDate", "preferredTime"] as const);

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
        "Appointment request submitted! We will contact you soon to confirm.",
      );
      reset({ preferredTime: "", message: "" });
      setStep(0);
      setSubmitted(true);
    },
    onError: (error) => {
      const status = extractHttpStatus(error);
      if (status === 429) {
        toast.error(
          "You've submitted too many requests. Please wait and try again.",
        );
      } else {
        toast.error("Failed to submit request. Please try again later.");
      }
    },
  });

  const onSubmit = async (data: AppointmentFormData) => {
    // Submission Guard: If not on the last step, just move to next step
    if (step < 2) {
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

    appointmentMutation.mutate({
      name: data.name,
      phone: data.phone,
      email: data.email || undefined,
      message: data.message,
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      <div className="flex flex-col gap-4 mb-2">
        <div className="flex items-center justify-between gap-4">
          {[
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
                      {index + 1}
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
                  {t("appointment.step2.heading")}
                </h4>
                <p className="text-sm text-text-para-light dark:text-text-para-dark opacity-60">
                  {t("appointment.step2.sub")}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Input
                  label={t("appointment.date")}
                  type="date"
                  min={minDate}
                  error={errors.preferredDate?.message}
                  {...register("preferredDate")}
                />
                <Select
                  label={t("appointment.time")}
                  options={[
                    {
                      value: "10:00 AM",
                      label: `10:00 AM${bookedSlots.includes("10:00 AM") ? " (Booked)" : ""}`,
                      disabled: bookedSlots.includes("10:00 AM"),
                    },
                    {
                      value: "10:30 AM",
                      label: `10:30 AM${bookedSlots.includes("10:30 AM") ? " (Booked)" : ""}`,
                      disabled: bookedSlots.includes("10:30 AM"),
                    },
                    {
                      value: "11:00 AM",
                      label: `11:00 AM${bookedSlots.includes("11:00 AM") ? " (Booked)" : ""}`,
                      disabled: bookedSlots.includes("11:00 AM"),
                    },
                    {
                      value: "11:30 AM",
                      label: `11:30 AM${bookedSlots.includes("11:30 AM") ? " (Booked)" : ""}`,
                      disabled: bookedSlots.includes("11:30 AM"),
                    },
                    {
                      value: "12:00 PM",
                      label: `12:00 PM${bookedSlots.includes("12:00 PM") ? " (Booked)" : ""}`,
                      disabled: bookedSlots.includes("12:00 PM"),
                    },
                    {
                      value: "04:00 PM",
                      label: `04:00 PM${bookedSlots.includes("04:00 PM") ? " (Booked)" : ""}`,
                      disabled: bookedSlots.includes("04:00 PM"),
                    },
                    {
                      value: "04:30 PM",
                      label: `04:30 PM${bookedSlots.includes("04:30 PM") ? " (Booked)" : ""}`,
                      disabled: bookedSlots.includes("04:30 PM"),
                    },
                    {
                      value: "05:00 PM",
                      label: `05:00 PM${bookedSlots.includes("05:00 PM") ? " (Booked)" : ""}`,
                      disabled: bookedSlots.includes("05:00 PM"),
                    },
                    {
                      value: "05:30 PM",
                      label: `05:30 PM${bookedSlots.includes("05:30 PM") ? " (Booked)" : ""}`,
                      disabled: bookedSlots.includes("05:30 PM"),
                    },
                    {
                      value: "06:00 PM",
                      label: `06:00 PM${bookedSlots.includes("06:00 PM") ? " (Booked)" : ""}`,
                      disabled: bookedSlots.includes("06:00 PM"),
                    },
                    {
                      value: "06:30 PM",
                      label: `06:30 PM${bookedSlots.includes("06:30 PM") ? " (Booked)" : ""}`,
                      disabled: bookedSlots.includes("06:30 PM"),
                    },
                    {
                      value: "07:00 PM",
                      label: `07:00 PM${bookedSlots.includes("07:00 PM") ? " (Booked)" : ""}`,
                      disabled: bookedSlots.includes("07:00 PM"),
                    },
                    {
                      value: "07:30 PM",
                      label: `07:30 PM${bookedSlots.includes("07:30 PM") ? " (Booked)" : ""}`,
                      disabled: bookedSlots.includes("07:30 PM"),
                    },
                    {
                      value: "08:00 PM",
                      label: `08:00 PM${bookedSlots.includes("08:00 PM") ? " (Booked)" : ""}`,
                      disabled: bookedSlots.includes("08:00 PM"),
                    },
                  ]}
                  error={errors.preferredTime?.message}
                  {...register("preferredTime")}
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
                    {bookedSlots.length} slot(s) already booked for this date.
                    Please pick an available one.
                  </span>
                </div>
              ) : null}
            </motion.div>
          )}

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

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-border-light dark:border-border-dark">
        <p className="text-[10px] text-center sm:text-left text-text-para-light dark:text-text-para-dark opacity-50 leading-relaxed max-w-xs">
          <span>A representative will contact you for final confirmation.</span>
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
          {step < 2 ? (
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
};

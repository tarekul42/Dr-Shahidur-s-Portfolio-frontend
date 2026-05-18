"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { useTranslation } from "@/hooks/useTranslation";
import { submitContact } from "@/lib/api/contact";
import { extractHttpStatus } from "@/lib/utils";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").trim(),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters").trim(),
  message: z.string().min(10, "Message must be at least 10 characters").trim(),
  reason: z.enum(["medical-inquiry", "general", "media", "other"]),
});

type ContactFormData = z.infer<typeof contactSchema>;

export const ContactForm = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { reason: "general" },
  });

  const contactMutation = useMutation({
    mutationFn: submitContact,
    retry: false,
    onSuccess: () => {
      toast.success("Message sent successfully! I'll get back to you soon.");
      reset();
    },
    onError: (error) => {
      const status = extractHttpStatus(error);
      if (status === 429) {
        toast.error("Too many messages. Please wait and try again.");
      } else {
        toast.error("Failed to send message. Please try again later.");
      }
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    let token: string | undefined;

    if (executeRecaptcha) {
      try {
        token = await executeRecaptcha("contact_form");
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

    contactMutation.mutate({ ...data, recaptchaToken: token });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label={t("contact.name")}
          placeholder={t("contact.namePlaceholder")}
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label={t("contact.email")}
          type="email"
          placeholder={t("contact.emailPlaceholder")}
          error={errors.email?.message}
          {...register("email")}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label={t("contact.phoneOptional")}
          type="tel"
          placeholder={t("contact.phonePlaceholder")}
          error={errors.phone?.message}
          {...register("phone")}
        />
        <Select
          label={t("contact.reason")}
          options={[
            { value: "medical-inquiry", label: t("contact.reason.medical") },
            { value: "general", label: t("contact.reason.general") },
            { value: "media", label: t("contact.reason.media") },
            { value: "other", label: t("contact.reason.other") },
          ]}
          error={errors.reason?.message}
          {...register("reason")}
        />
      </div>
      <Input
        label={t("contact.subject")}
        placeholder={t("contact.subjectPlaceholder")}
        error={errors.subject?.message}
        {...register("subject")}
      />
      <Textarea
        label={t("contact.yourMessage")}
        placeholder={t("contact.messagePlaceholder")}
        error={errors.message?.message}
        maxLength={1000}
        {...register("message")}
      />
      <Button
        type="submit"
        loading={contactMutation.isPending}
        className="w-full h-14 text-lg"
      >
        {t("contact.send")}
      </Button>
      <p className="text-[10px] text-center text-text-para-light dark:text-text-para-dark opacity-50 leading-relaxed">
        {t("contact.recaptcha")}{" "}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-brand-primary transition-colors"
        >
          {t("contact.privacyPolicy")}
        </a>{" "}
        and{" "}
        <a
          href="https://policies.google.com/terms"
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-brand-primary transition-colors"
        >
          {t("contact.termsOfService")}
        </a>{" "}
        {t("contact.apply")}
      </p>
    </form>
  );
};

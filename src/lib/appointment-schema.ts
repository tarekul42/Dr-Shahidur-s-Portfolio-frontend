import * as z from "zod";

export const appointmentSchema = z.object({
  chamberId: z.string().min(1, "Chamber is required"),
  name: z.string().min(2, "Name is required").trim(),
  phone: z
    .string()
    .regex(/^(?:\+?88)?01[3-9]\d{8}$/, "Invalid Bangladesh phone format"),
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

export type AppointmentFormData = z.infer<typeof appointmentSchema>;

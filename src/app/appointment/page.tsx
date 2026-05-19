import type { Metadata } from "next";
import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { FALLBACKS } from "@/constants/fallbacks";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description: `Schedule a consultation with ${FALLBACKS.doctorName} for specialized orthopedic surgery and care.`,
};

export default function AppointmentPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs title="Book Appointment" />
        <SectionHeading
          badge="Priority Care"
          title="Schedule Your Consultation"
          subtitle="Take the first step towards pain-free movement. Please fill out the form below, and my team will contact you shortly to confirm your time slot."
          centered
        />

        <div className="bg-white dark:bg-card-dark rounded-3xl shadow-2xl overflow-hidden border border-border-light dark:border-border-dark">
          <div className="grid grid-cols-1 lg:grid-cols-5">
            <div className="lg:col-span-2 bg-brand-primary h-full p-8 md:p-12 text-white flex flex-col justify-between">
              <div className="space-y-8">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <title>Calendar Icon</title>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">Appointment Info</h3>
                  <p className="text-white/80 leading-relaxed text-sm">
                    Our medical team reviews every request within 2 hours during
                    working periods. We prioritize urgent trauma cases.
                  </p>
                </div>
                <ul className="space-y-4 text-sm font-semibold">
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    Video Consultations Available
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    Direct WhatsApp Support
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    Medical History Review
                  </li>
                </ul>
              </div>

              <div className="pt-8 border-t border-white/20">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                  Emergency Line
                </p>
                <a
                  href={`tel:${FALLBACKS.phone.replace(/\D/g, "")}`}
                  className="text-xl font-bold hover:text-white/80 transition-colors"
                >
                  {FALLBACKS.phone}
                </a>
              </div>
            </div>

            <div className="lg:col-span-3 p-8 md:p-12">
              <AppointmentForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

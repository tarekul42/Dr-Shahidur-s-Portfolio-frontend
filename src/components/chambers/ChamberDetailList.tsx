"use client";

import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import type { Chamber } from "@/constants/chambers";
import { useTranslation } from "@/hooks/useTranslation";

interface ChamberDetailListProps {
  chambers: Chamber[];
}

export function ChamberDetailList({ chambers }: ChamberDetailListProps) {
  return (
    <section className="w-full">
      <div className="space-y-8">
        {chambers.map((chamber, idx) => (
          <ChamberDetailCard key={chamber.id} chamber={chamber} index={idx} />
        ))}
      </div>
    </section>
  );
}

function ChamberDetailCard({
  chamber,
  index,
}: {
  chamber: Chamber;
  index: number;
}) {
  const { t, language } = useTranslation();
  const isBn = language === "bn";

  const hospital = isBn ? chamber.hospitalBn : chamber.hospitalEn;
  const address = isBn ? chamber.addressBn : chamber.addressEn;
  const room = isBn ? chamber.roomBn : chamber.roomEn;
  const assistant = isBn ? chamber.assistantBn : chamber.assistantEn;

  return (
    <AnimatedSection>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05 }}
        className={`relative p-8 md:p-10 rounded-2xl border bg-card-light dark:bg-card-dark transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-brand-primary/5 hover:border-brand-primary group
          ${
            chamber.isPrimary
              ? "border-brand-primary/40 ring-1 ring-brand-primary/5"
              : "border-border-light dark:border-border-dark"
          }`}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {/* Location pin icon */}
              <div className="w-12 h-12 bg-brand-softbg dark:bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <title>Location Pin Icon</title>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-heading-light dark:text-text-heading-dark">
                {hospital}
              </h3>
            </div>
            <p className="text-sm text-text-para-light dark:text-text-para-dark opacity-80 ml-[60px]">
              {address}
            </p>
            <p className="text-sm text-text-para-light dark:text-text-para-dark opacity-60 ml-[60px] mt-1">
              {room}
            </p>
          </div>

          {chamber.isPrimary && (
            <span className="shrink-0 px-3 py-1 bg-brand-primary/10 text-brand-primary text-[9px] font-bold uppercase tracking-widest rounded-full self-start">
              {t("chambers.primaryChamber")}
            </span>
          )}
        </div>

        {/* Details Grid: Schedule + Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Schedule Column */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-para-light dark:text-text-para-dark opacity-50">
              {t("chambers.schedule")}
            </h4>
            {chamber.schedule.map((s) => {
              const days = isBn ? s.daysBn : s.daysEn;
              const time = isBn ? s.timeBn : s.timeEn;
              return (
                <div
                  key={`${s.daysEn}-${s.timeEn}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-brand-primary/5 border border-brand-primary/10"
                >
                  {/* Calendar icon */}
                  <div className="w-8 h-8 bg-brand-primary/10 rounded-lg flex items-center justify-center text-brand-primary shrink-0">
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
                      <title>Calendar Icon</title>
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-heading-light dark:text-text-heading-dark leading-tight">
                      {days}
                    </p>
                    <p className="text-xs text-text-para-light dark:text-text-para-dark mt-0.5">
                      {time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contact Column */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-para-light dark:text-text-para-dark opacity-50">
              {t("chambers.contact")}
            </h4>

            {/* Serial Phone Numbers */}
            <div className="p-4 rounded-xl bg-white dark:bg-white/5 border border-border-light dark:border-border-dark space-y-3 shadow-sm">
              <div className="flex items-center gap-2">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-brand-primary shrink-0"
                >
                  <title>Phone Icon</title>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary">
                  {t("chambers.serialBooking")}
                </span>
              </div>
              {chamber.serialPhone.map((phone) => (
                <div key={phone} className="flex items-center gap-2">
                  <a
                    href={`tel:${phone.replace(/\D/g, "")}`}
                    className="text-sm font-bold text-text-heading-light dark:text-text-heading-dark hover:text-brand-primary transition-colors"
                  >
                    {phone}
                  </a>
                  <CopyButton
                    value={phone}
                    label="copy"
                    className="px-1.5 py-0.5 text-[8px] rounded-md font-semibold h-fit border border-border-light dark:border-border-dark"
                  />
                </div>
              ))}
            </div>

            {/* Assistant */}
            <div className="p-4 rounded-xl bg-white dark:bg-white/5 border border-border-light dark:border-border-dark shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-brand-primary shrink-0"
                >
                  <title>User Icon</title>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary">
                  {t("chambers.assistant")}
                </span>
              </div>
              <p className="text-sm font-semibold text-text-heading-light dark:text-text-heading-dark">
                {assistant}
              </p>
            </div>

            {/* App Link (if available) */}
            {chamber.appName && chamber.appUrl && (
              <a
                href={chamber.appUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl bg-brand-primary/5 border border-brand-primary/10 hover:bg-brand-primary/10 transition-colors shadow-sm"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-brand-primary shrink-0"
                >
                  <title>Mobile Icon</title>
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
                <div>
                  <p className="text-xs font-bold text-brand-primary">
                    {chamber.appName}
                  </p>
                  <p className="text-[10px] text-text-para-light dark:text-text-para-dark opacity-60">
                    {isBn ? "গুগল প্লে স্টোরে উপলব্ধ" : "Available on Google Play"}
                  </p>
                </div>
              </a>
            )}
          </div>
        </div>

        {/* Bottom CTAs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-6 border-t border-border-light dark:border-border-dark">
          <Button
            href={`/appointment?chamber=${chamber.id}`}
            className="shadow-lg shadow-brand-primary/20 text-center"
          >
            {t("nav.bookAppointment")}
          </Button>
          <Button
            href={`tel:${chamber.serialPhone[0].replace(/\D/g, "")}`}
            variant="outline"
            className="text-center"
          >
            {t("chambers.callForSerial")}
          </Button>
          <a
            href={chamber.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 h-11 text-sm font-bold rounded-xl border border-border-light dark:border-border-dark text-text-para-light dark:text-text-para-dark hover:text-brand-primary hover:border-brand-primary transition-colors text-center"
          >
            {t("chambers.getDirections")}
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
              <title>Arrow Right</title>
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>
      </motion.div>
    </AnimatedSection>
  );
}

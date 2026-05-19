"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CHAMBERS } from "@/constants/chambers";
import { useTranslation } from "@/hooks/useTranslation";

export function ChamberOverview() {
  const { t, language } = useTranslation();
  const isBn = language === "bn";

  return (
    <section id="chambers">
      <AnimatedSection className="py-20 bg-bg-light-soft dark:bg-bg-dark-soft border-y border-border-light/40 dark:border-border-dark/40">
        <div className="container mx-auto px-6">
          <SectionHeading
            badge={t("chambers.badge")}
            title={t("chambers.title")}
            subtitle={t("chambers.subtitle")}
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
            {CHAMBERS.map((chamber, index) => {
              const hospital = isBn ? chamber.hospitalBn : chamber.hospitalEn;
              const address = isBn ? chamber.addressBn : chamber.addressEn;

              return (
                <motion.div
                  key={chamber.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-6 rounded-2xl border bg-card-light dark:bg-card-dark flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group
                  ${
                    chamber.isPrimary
                      ? "border-brand-primary/30 shadow-md shadow-brand-primary/5"
                      : "border-border-light dark:border-border-dark"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="w-8 h-8 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <title>Pin Icon</title>
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        </svg>
                      </span>
                      {chamber.isPrimary && (
                        <span className="px-2 py-0.5 bg-brand-primary text-white text-[8px] font-bold uppercase tracking-wider rounded-md">
                          {t("chambers.primary")}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-text-heading-light dark:text-text-heading-dark group-hover:text-brand-primary transition-colors line-clamp-2 min-h-[3rem] mb-1">
                      {hospital}
                    </h3>
                    <p className="text-xs text-text-para-light dark:text-text-para-dark opacity-60 mb-4 truncate">
                      {address}
                    </p>
                  </div>

                  <div className="border-t border-border-light/60 dark:border-border-dark/60 pt-4 mt-auto">
                    <div className="flex flex-col gap-1.5">
                      {chamber.schedule.slice(0, 1).map((s) => {
                        const days = isBn ? s.daysBn : s.daysEn;
                        const time = isBn ? s.timeBn : s.timeEn;
                        return (
                          <div
                            key={`${s.daysEn}-${s.timeEn}`}
                            className="flex items-center gap-1.5 text-xs"
                          >
                            {/* Mini Calendar Icon */}
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="text-brand-primary shrink-0"
                            >
                              <title>Calendar Icon</title>
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
                            <span className="font-bold text-text-heading-light dark:text-text-heading-dark">
                              {days}:
                            </span>
                            <span className="text-text-para-light dark:text-text-para-dark opacity-80">
                              {time}
                            </span>
                          </div>
                        );
                      })}
                      {chamber.schedule.length > 1 && (
                        <span className="text-[10px] text-brand-primary font-bold self-start mt-0.5">
                          {isBn
                            ? `+${chamber.schedule.length - 1} টি অন্য সময়সূচী`
                            : `+${chamber.schedule.length - 1} more schedule`}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* View All CTA */}
          <div className="flex justify-center">
            <Link
              href="/chambers"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-brand-primary text-white text-sm font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-primary-hover hover:-translate-y-0.5 transition-all duration-300"
            >
              {isBn
                ? "সকল চেম্বার ও সময়সূচী দেখুন"
                : "View All Chambers & Schedules"}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:translate-x-1 transition-transform"
              >
                <title>Arrow Right</title>
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}
export default ChamberOverview;

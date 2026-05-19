"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import type { Chamber } from "@/constants/chambers";
import { useTranslation } from "@/hooks/useTranslation";

interface ChambersHeroProps {
  chambers: Chamber[];
}

export function ChambersHero({ chambers }: ChambersHeroProps) {
  return (
    <section className="max-w-6xl mx-auto w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {chambers.map((chamber, idx) => (
          <ChamberQuickCard key={chamber.id} chamber={chamber} index={idx} />
        ))}
      </div>
    </section>
  );
}

function ChamberQuickCard({
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className={`relative p-6 rounded-2xl border bg-card-light dark:bg-card-dark
        hover:border-brand-primary hover:-translate-y-1 hover:shadow-xl
        hover:shadow-brand-primary/5 transition-all duration-300 group flex flex-col justify-between
        ${chamber.isPrimary ? "border-brand-primary/40 ring-1 ring-brand-primary/5" : "border-border-light dark:border-border-dark"}`}
    >
      <div>
        {/* Primary Badge */}
        {chamber.isPrimary && (
          <span className="absolute -top-3 left-4 px-3 py-1 bg-brand-primary text-white text-[9px] font-bold uppercase tracking-widest rounded-full shadow-lg">
            {t("chambers.primary")}
          </span>
        )}

        {/* Hospital Name */}
        <h3 className="text-lg font-bold text-text-heading-light dark:text-text-heading-dark mb-1 group-hover:text-brand-primary transition-colors line-clamp-2 min-h-14">
          {hospital}
        </h3>

        {/* Location */}
        <p className="text-xs text-text-para-light dark:text-text-para-dark opacity-60 mb-4 truncate">
          {address}
        </p>

        {/* Schedule Lines */}
        <div className="space-y-2 mb-6 min-h-16">
          {chamber.schedule.map((s) => {
            const days = isBn ? s.daysBn : s.daysEn;
            const time = isBn ? s.timeBn : s.timeEn;
            return (
              <div
                key={`${s.daysEn}-${s.timeEn}`}
                className="flex items-start gap-2"
              >
                {/* Calendar icon */}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-brand-primary shrink-0 mt-0.5"
                >
                  <title>Calendar Icon</title>
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-text-heading-light dark:text-text-heading-dark leading-tight">
                    {days}
                  </span>
                  <span className="text-xs text-text-para-light dark:text-text-para-dark opacity-80 mt-0.5">
                    {time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTAs */}
      <div className="flex gap-3 mt-auto">
        <Button
          href={`/appointment?chamber=${chamber.id}`}
          size="sm"
          className="flex-1 text-xs"
        >
          {t("chambers.book")}
        </Button>
        <Button
          href={`tel:${chamber.serialPhone[0].replace(/\D/g, "")}`}
          variant="outline"
          size="sm"
          className="flex-1 text-xs px-1"
        >
          {t("chambers.callSerial")}
        </Button>
      </div>
    </motion.div>
  );
}

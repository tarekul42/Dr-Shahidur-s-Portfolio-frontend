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
    <section className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
      className={`relative p-8 rounded-2xl border bg-card-light dark:bg-card-dark flex flex-col justify-between min-h-[340px] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-brand-primary/5 hover:border-brand-primary group
        ${chamber.isPrimary ? "border-brand-primary/40 ring-1 ring-brand-primary/5" : "border-border-light dark:border-border-dark"}`}
    >
      <div>
        {/* Primary Badge */}
        {chamber.isPrimary && (
          <span className="absolute -top-3 left-6 px-3 py-1 bg-brand-primary text-white text-[9px] font-bold uppercase tracking-widest rounded-full shadow-lg shadow-brand-primary/20">
            {t("chambers.primary")}
          </span>
        )}

        <div className="flex items-start justify-between gap-2 mb-5">
          <span className="w-12 h-12 rounded-xl bg-brand-softbg dark:bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
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
              <title>Pin Icon</title>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            </svg>
          </span>
        </div>

        {/* Hospital Name */}
        <h3 className="text-xl font-bold text-text-heading-light dark:text-text-heading-dark group-hover:text-brand-primary transition-colors line-clamp-2 min-h-[3.5rem] mb-2 leading-snug">
          {hospital}
        </h3>

        {/* Location */}
        <p className="text-sm text-text-para-light dark:text-text-para-dark opacity-60 mb-6 line-clamp-2 min-h-[2.5rem]">
          {address}
        </p>

        {/* Schedule Lines */}
        <div className="space-y-2.5 mb-6 min-h-[5.5rem]">
          {chamber.schedule.map((s) => {
            const days = isBn ? s.daysBn : s.daysEn;
            const time = isBn ? s.timeBn : s.timeEn;
            return (
              <div
                key={`${s.daysEn}-${s.timeEn}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-brand-primary/5 border border-brand-primary/10 text-xs"
              >
                {/* Mini Calendar Icon Box */}
                <div className="w-6 h-6 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="shrink-0"
                  >
                    <title>Calendar Icon</title>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-text-heading-light dark:text-text-heading-dark leading-tight">
                    {days}
                  </span>
                  <span className="text-[10px] text-text-para-light dark:text-text-para-dark opacity-80 mt-0.5">
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
          className="flex-1 text-xs shadow-md shadow-brand-primary/10"
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

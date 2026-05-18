"use client";

import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { useTranslation } from "@/hooks/useTranslation";

const SPECIALTY_KEYS = [
  {
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <title>Ilizarov Icon</title>
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    titleKey: "specialties.ilizarov.title",
    descKey: "specialties.ilizarov.desc",
  },
  {
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <title>Spine Icon</title>
        <path d="M12 2v20M8 6h8M8 12h8M8 18h8" />
      </svg>
    ),
    titleKey: "specialties.spine.title",
    descKey: "specialties.spine.desc",
  },
  {
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <title>Joint Replacement Icon</title>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
    titleKey: "specialties.arthroplasty.title",
    descKey: "specialties.arthroplasty.desc",
  },
  {
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <title>Sports Medicine Icon</title>
        <path d="M10 21v-8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8" />
        <path d="M17 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" />
        <path d="M2 14h20" />
      </svg>
    ),
    titleKey: "specialties.arthroscopy.title",
    descKey: "specialties.arthroscopy.desc",
  },
  {
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <title>Reconstructive Icon</title>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
    ),
    titleKey: "specialties.reconstructive.title",
    descKey: "specialties.reconstructive.desc",
  },
  {
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <title>Trauma Icon</title>
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    ),
    titleKey: "specialties.trauma.title",
    descKey: "specialties.trauma.desc",
  },
];

export const Specialties = () => {
  const { t } = useTranslation();

  return (
    <AnimatedSection className="py-24 bg-white dark:bg-bg-dark">
      <div className="container mx-auto px-6">
        <SectionHeading
          badge={t("specialties.badge")}
          title={t("specialties.title")}
          subtitle={t("specialties.subtitle")}
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SPECIALTY_KEYS.map((item, idx) => (
            <motion.div
              key={item.titleKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group p-8 rounded-2xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark hover:border-brand-primary transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-primary/5"
            >
              <div className="w-14 h-14 bg-brand-softbg dark:bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary mb-6 group-hover:scale-110 transition-transform duration-500">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-text-heading-light dark:text-text-heading-dark mb-4">
                {t(item.titleKey)}
              </h3>
              <p className="text-sm text-text-para-light dark:text-text-para-dark leading-relaxed">
                {t(item.descKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

"use client";

import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { useTranslation } from "@/hooks/useTranslation";

interface AboutBioProps {
  doctorBio?: string;
}

const BIO_PARAGRAPHS = [
  "Dr. Sahidur Rahman Khan is a distinguished Orthopedic Surgeon whose career has been defined by an unwavering commitment to surgical precision and patient-centered care. With over 15 years of experience across tertiary medical centers in Bangladesh, he has become a trusted name in restoring mobility and transforming lives through advanced orthopedic interventions.",
  "His journey in medicine began with a Gold Medal in MBBS, followed by a Master of Surgery in Orthopedics — achievements that laid the foundation for a career built on academic rigor and clinical excellence. A subsequent Fellowship in Joint Replacement further sharpened his expertise in one of the most demanding subspecialties in orthopedic surgery.",
  "Dr. Sahidur believes that every patient deserves not just treatment, but understanding. His approach combines thorough diagnostic evaluation with personalized treatment plans, ensuring that each individual receives care tailored to their unique condition, lifestyle, and recovery goals. He takes the time to explain procedures, set realistic expectations, and walk alongside his patients through every stage of recovery.",
  "Beyond the operating room, Dr. Sahidur is a passionate researcher and educator. He has contributed to the development of orthopedic protocols, published clinical research, and actively mentors the next generation of surgeons. His commitment to evidence-based practice ensures that his patients benefit from the latest advancements in orthopedic science.",
  "Whether performing a complex joint replacement, managing a challenging trauma case, or guiding a patient through rehabilitation, Dr. Sahidur's philosophy remains the same: treat every patient as you would want your own family to be treated — with skill, empathy, and respect.",
];

const _VALUES = [
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
        <title>Value Icon</title>
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
      </svg>
    ),
    title: "Patient First",
    description:
      "Every decision is guided by what is best for the patient — from diagnosis to recovery.",
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
        <title>Value Icon</title>
        <path d="M9 2H15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z" />
        <path d="M4 5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        <path d="M9 14l2 2 4-4" />
      </svg>
    ),
    title: "Evidence Based",
    description:
      "Treatment plans are rooted in the latest clinical research and proven surgical techniques.",
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
        <title>Value Icon</title>
        <path d="M22 10c0-5.52-4.48-10-10-10S2 4.48 2 10c0 4.13 2.5 7.65 6 9.2V22h8v-2.8c3.5-1.55 6-5.07 6-9.2Z" />
        <path d="M9 22h6" />
        <path d="M12 14v4" />
      </svg>
    ),
    title: "Innovate & Teach",
    description:
      "Advancing orthopedic care through research while mentoring the next generation of surgeons.",
  },
];

export function AboutBio({ doctorBio }: AboutBioProps) {
  const { t } = useTranslation();

  const VALUES = [
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
          <title>Value Icon</title>
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
        </svg>
      ),
      titleKey: "aboutBio.val1.title",
      descKey: "aboutBio.val1.desc",
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
          <title>Value Icon</title>
          <path d="M9 2H15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z" />
          <path d="M4 5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
          <path d="M9 14l2 2 4-4" />
        </svg>
      ),
      titleKey: "aboutBio.val2.title",
      descKey: "aboutBio.val2.desc",
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
          <title>Value Icon</title>
          <path d="M22 10c0-5.52-4.48-10-10-10S2 4.48 2 10c0 4.13 2.5 7.65 6 9.2V22h8v-2.8c3.5-1.55 6-5.07 6-9.2Z" />
          <path d="M9 22h6" />
          <path d="M12 14v4" />
        </svg>
      ),
      titleKey: "aboutBio.val3.title",
      descKey: "aboutBio.val3.desc",
    },
  ];
  return (
    <AnimatedSection className="py-24 bg-white dark:bg-bg-dark">
      <div className="container mx-auto px-6">
        <SectionHeading
          badge={t("aboutBio.badge")}
          title={t("aboutBio.title")}
          centered
          className="mb-12"
        />

        <div className="max-w-3xl mx-auto space-y-6">
          {doctorBio ? (
            <div
              className="prose prose-lg dark:prose-invert max-w-none text-text-para-light dark:text-text-para-dark leading-relaxed"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: Trusted CMS content
              dangerouslySetInnerHTML={{ __html: doctorBio }}
            />
          ) : (
            BIO_PARAGRAPHS.map((paragraph) => (
              <p
                key={paragraph.substring(0, 20)}
                className="text-lg text-text-para-light dark:text-text-para-dark leading-relaxed"
              >
                {paragraph}
              </p>
            ))
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {VALUES.map((item, idx) => (
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
}

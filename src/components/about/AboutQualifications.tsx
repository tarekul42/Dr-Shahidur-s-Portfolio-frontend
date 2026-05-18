"use client";

import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { SectionHeading } from "@/components/shared/SectionHeading";

const QUALIFICATIONS = [
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
        <title>Qualification Icon</title>
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
    degree: "MBBS",
    detail:
      "Gold Medalist — Graduated with the highest academic distinction in the batch.",
    tag: "Gold Medal",
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
        <title>Qualification Icon</title>
        <path d="M12 2a4 4 0 0 0-4 4 4 4 0 0 0 1 2.65V15a3 3 0 0 0 6 0V8.65A4 4 0 0 0 16 6a4 4 0 0 0-4-4Z" />
        <path d="M12 15v7" />
        <path d="M9 22h6" />
      </svg>
    ),
    degree: "MS (Orthopedics)",
    detail:
      "Master of Surgery specializing in orthopedic pathology, trauma management, and reconstructive procedures.",
    tag: "Postgraduate",
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
        <title>Qualification Icon</title>
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    ),
    degree: "Fellowship in Joint Replacement",
    detail:
      "Advanced training in total knee and hip arthroplasty, including minimally invasive and computer-assisted techniques.",
    tag: "Fellowship",
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
        <title>Qualification Icon</title>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    degree: "Expert Trauma Consultant",
    detail:
      "Specialized certification in managing complex musculoskeletal injuries and polytrauma cases.",
    tag: "Certified",
  },
];

const STATS = [
  { value: "15+", label: "Years of Experience" },
  { value: "5000+", label: "Successful Surgeries" },
  { value: "10+", label: "Research Publications" },
  { value: "20+", label: "Conferences Attended" },
];

export function AboutQualifications() {
  return (
    <AnimatedSection className="py-24 bg-brand-softbg dark:bg-brand-primary/5">
      <div className="container mx-auto px-6">
        <SectionHeading
          badge="Credentials"
          title="Education & Specializations"
          centered
          className="mb-12"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {QUALIFICATIONS.map((item, idx) => (
            <motion.div
              key={item.degree}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group p-8 rounded-2xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark hover:border-brand-primary transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-primary/5"
            >
              <div className="w-14 h-14 bg-brand-softbg dark:bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary mb-6 group-hover:scale-110 transition-transform duration-500">
                {item.icon}
              </div>
              <span className="inline-block px-2 py-0.5 bg-brand-primary/10 text-brand-primary rounded text-[9px] font-bold tracking-widest uppercase mb-3">
                {item.tag}
              </span>
              <h3 className="text-xl font-bold text-text-heading-light dark:text-text-heading-dark mb-3">
                {item.degree}
              </h3>
              <p className="text-sm text-text-para-light dark:text-text-para-dark leading-relaxed">
                {item.detail}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              className="text-center p-6 rounded-2xl bg-white dark:bg-card-dark border border-border-light dark:border-border-dark"
            >
              <span className="block text-4xl font-bold text-brand-primary">
                {stat.value}
              </span>
              <span className="text-xs uppercase tracking-wider font-semibold opacity-50 mt-1 block text-text-heading-light dark:text-text-heading-dark">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

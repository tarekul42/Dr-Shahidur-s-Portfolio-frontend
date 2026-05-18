"use client";

import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/Button";

export const About = () => {
  return (
    <AnimatedSection className="py-24 bg-brand-softbg dark:bg-brand-primary/5">
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Visual Column */}
        <div className="relative group">
          <div className="absolute inset-0 bg-brand-primary rounded-2xl rotate-3 group-hover:rotate-6 transition-transform duration-500 -z-10 opacity-10" />
          <div className="relative aspect-4/5 bg-gray-200 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 flex items-center justify-center text-text-para-light dark:text-text-para-dark font-bold text-xl opacity-30">
              DR. SAHIDUR RAHMAN KHAN
            </div>
          </div>

          {/* Experience Floating Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="absolute -bottom-8 -right-8 p-6 bg-white dark:bg-card-dark rounded-2xl shadow-xl border border-border-light dark:border-border-dark hidden md:block"
          >
            <span className="block text-4xl font-bold text-brand-primary leading-none">
              15+
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-text-para-light dark:text-text-para-dark opacity-60">
              Years of Surgery
            </span>
          </motion.div>
        </div>

        {/* Content Column */}
        <div className="space-y-8">
          <SectionHeading
            badge="About the Doctor"
            title="Leading the Way in Advanced Orthopedics"
            className="mb-8"
          />

          <div className="space-y-4 text-lg text-text-para-light dark:text-text-para-dark leading-relaxed">
            <p>
              Dr. Sahidur Rahman Khan is a distinguished Orthopedic Surgeon
              known for his surgical precision and commitment to
              patient-centered care. With over 15 years of experience in
              tertiary medical centers, he has specialized in restoring mobility
              through innovative techniques.
            </p>
            <p>
              Beyond the operating room, Dr. Sahidur is a passionate researcher
              and educator, consistently contributing to the development of
              orthopedic protocols and mentoring the next generation of
              surgeons.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            {[
              "MBBS (Gold Medalist)",
              "MS (Orthopedics)",
              "Fellowship in Joint Replacement",
              "Expert Trauma Consultant",
            ].map((qual) => (
              <div key={qual} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-brand-primary" />
                <span className="font-semibold text-text-heading-light dark:text-text-heading-dark">
                  {qual}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center gap-6">
            <Button size="lg" href="/about">
              Learn More About My Journey
            </Button>
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-bg-dark bg-gray-300 dark:bg-gray-700"
                />
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-white dark:border-bg-dark bg-brand-primary flex items-center justify-center text-white text-[10px] font-bold">
                5k+
              </div>
              <div className="ml-6 flex flex-col">
                <span className="text-sm font-bold text-text-heading-light dark:text-text-heading-dark">
                  Happy Patients
                </span>
                <span className="text-[10px] font-bold uppercase text-brand-primary">
                  Trusted Care
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

"use client";

import Image from "next/image";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/hooks/useTranslation";

const QUAL_KEYS = [
  "about.qual.mbbs",
  "about.qual.ms",
  "about.qual.dortho",
  "about.qual.bcs",
  "about.qual.fellowship",
];

interface AboutProps {
  doctorImageUrl?: string;
}

export const About = ({ doctorImageUrl }: AboutProps) => {
  const { t } = useTranslation();
  const imageUrl = doctorImageUrl ?? "/HELLO_DR_Sahid2.webp";

  return (
    <AnimatedSection className="py-24 bg-brand-softbg dark:bg-brand-primary/5">
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Visual Column */}
        <div className="relative group">
          <div className="absolute inset-0 bg-brand-primary rounded-2xl rotate-3 group-hover:rotate-6 transition-transform duration-500 -z-10 opacity-10" />
          <div className="relative aspect-4/5 bg-gray-200 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={imageUrl}
              alt="Dr. Sahidur Rahman Khan"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Content Column */}
        <div className="space-y-8">
          <SectionHeading
            badge={t("about.badge")}
            title={t("about.title")}
            className="mb-8"
          />

          <div className="space-y-4 text-lg text-text-para-light dark:text-text-para-dark leading-relaxed">
            <p>{t("about.para1")}</p>
            <p>{t("about.para2")}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            {QUAL_KEYS.map((key) => (
              <div key={key} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-brand-primary" />
                <span className="font-semibold text-text-heading-light dark:text-text-heading-dark">
                  {t(key)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center gap-6">
            <Button size="lg" href="/about">
              {t("about.cta")}
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
                  {t("about.patients")}
                </span>
                <span className="text-[10px] font-bold uppercase text-brand-primary">
                  {t("about.trustedCare")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

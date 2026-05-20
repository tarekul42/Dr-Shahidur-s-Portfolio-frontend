"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/hooks/useTranslation";

interface AboutHeroProps {
  doctorName: string;
  doctorTitle: string;
  doctorSpecialty: string;
  doctorImageUrl?: string;
}
export function AboutHero({
  doctorName,
  doctorTitle,
  doctorSpecialty,
  doctorImageUrl,
}: AboutHeroProps) {
  const { t } = useTranslation();
  const imageUrl = doctorImageUrl ?? "/HELLO_DR_Sahid2.webp";

  return (
    <section className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pt-32 pb-20">
      {/* Photo column */}
      <div className="relative group">
        <div className="absolute inset-0 bg-brand-primary rounded-2xl rotate-3 group-hover:rotate-6 transition-transform duration-500 -z-10 opacity-10" />

        <div className="relative aspect-4/5 bg-gray-200 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src={imageUrl}
            alt={doctorName}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>

        {/* Experience badge */}
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
            {t("hero.stat1")}
          </span>
        </motion.div>
      </div>

      {/* Text column */}
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block px-4 py-1.5 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-bold tracking-widest uppercase mb-4">
            {t("about.badge")}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-heading-light dark:text-text-heading-dark leading-tight">
            {doctorName}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-lg text-brand-primary font-semibold">
            {doctorTitle} — {doctorSpecialty}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-lg text-text-para-light dark:text-text-para-dark max-w-lg leading-relaxed">
            {t("aboutHero.tagline")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Button size="lg" href="/appointment">
            {t("hero.cta.primary")}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

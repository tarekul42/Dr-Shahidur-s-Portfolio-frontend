"use client";

import { motion } from "framer-motion";
import { ContactForm } from "@/components/forms/ContactForm";
import { useTranslation } from "@/hooks/useTranslation";

export function ChambersContact() {
  const { t } = useTranslation();

  return (
    <section className="max-w-6xl mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Heading and Info */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-primary px-3 py-1 bg-brand-primary/10 rounded-full w-fit block">
              {t("chambers.stillQuestions")}
            </span>
            <h2 className="text-3xl font-extrabold text-text-heading-light dark:text-text-heading-dark tracking-tight">
              {t("chambers.sendMessage")}
            </h2>
            <p className="text-sm text-text-para-light dark:text-text-para-dark opacity-80 leading-relaxed">
              {t("chambers.messageDesc")}
            </p>
          </div>

          <div className="space-y-4">
            {/* Emergency Contacts */}
            <motion.div
              whileHover={{ y: -3 }}
              className="p-6 rounded-2xl border border-red-500/20 bg-red-500/5 flex items-center gap-4 transition-all duration-300"
            >
              <div className="w-10 h-10 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center shrink-0">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <title>Alert Triangle</title>
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-red-500 mb-1">
                  {t("chambers.emergencyContact")}
                </p>
                <div className="flex flex-col gap-0.5">
                  <a
                    href="tel:+8801777079696"
                    className="text-base font-bold text-text-heading-light dark:text-text-heading-dark hover:text-red-500 transition-colors"
                  >
                    +880 1777-079696
                  </a>
                  <a
                    href="tel:+8801711608502"
                    className="text-base font-bold text-text-heading-light dark:text-text-heading-dark hover:text-red-500 transition-colors"
                  >
                    +880 1711-608502
                  </a>
                </div>
              </div>
            </motion.div>

            {/* WhatsApp Link */}
            <motion.a
              href="https://wa.me/8801777079696"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -3 }}
              className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-4 transition-all duration-300 group block"
            >
              <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <title>WhatsApp</title>
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-500 mb-1">
                  {t("chambers.whatsapp")}
                </p>
                <p className="text-base font-bold text-text-heading-light dark:text-text-heading-dark group-hover:text-emerald-600 dark:group-hover:text-emerald-500 transition-colors">
                  +880 1777-079696
                </p>
              </div>
            </motion.a>
          </div>
        </div>

        {/* Right Column: Inquiry Form */}
        <div className="lg:col-span-7 bg-card-light dark:bg-card-dark p-8 rounded-3xl border border-border-light dark:border-border-dark shadow-sm">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

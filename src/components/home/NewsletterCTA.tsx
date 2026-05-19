"use client";

import { useState } from "react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { useTranslation } from "@/hooks/useTranslation";

export function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setStatus("success");
    setEmail("");
  };

  return (
    <AnimatedSection className="py-24 bg-brand-softbg dark:bg-brand-primary/5">
      <div className="container mx-auto px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark shadow-xl px-8 py-16 md:px-16 text-center">
          {/* Decorative blobs — theme-aware */}
          <div className="pointer-events-none absolute -top-20 -left-20 w-72 h-72 rounded-full bg-brand-primary/10 dark:bg-brand-primary/15 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-brand-secondary/10 dark:bg-brand-secondary/15 blur-[100px]" />

          <div className="relative max-w-2xl mx-auto">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 dark:bg-brand-primary/15 border border-brand-primary/25 text-brand-primary text-xs font-bold uppercase tracking-widest mb-6">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z" />
              </svg>
              {t("newsletter.badge")}
            </span>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl font-bold text-text-heading-light dark:text-text-heading-dark leading-tight mb-4">
              {t("newsletter.title")}
            </h2>
            <p className="text-text-para-light dark:text-text-para-dark text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              {t("newsletter.subtitle")}
            </p>

            {/* Form / Success */}
            {status === "success" ? (
              <div className="flex flex-col items-center gap-3 py-6">
                <div className="w-14 h-14 rounded-full bg-brand-primary/15 dark:bg-brand-primary/20 flex items-center justify-center">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-brand-primary"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p className="text-text-heading-light dark:text-text-heading-dark font-semibold text-lg">
                  {t("newsletter.subscribed")}
                </p>
                <p className="text-text-para-light dark:text-text-para-dark text-sm">
                  {t("newsletter.subscribedDesc")}
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
              >
                <div className="relative flex-1">
                  <svg
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-text-para-light dark:text-text-para-dark pointer-events-none opacity-50"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z" />
                  </svg>
                  <input
                    type="email"
                    required
                    placeholder={t("newsletter.placeholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-14 pl-11 pr-4 rounded-2xl bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark text-text-heading-light dark:text-text-heading-dark placeholder:text-text-para-light dark:placeholder:text-text-para-dark text-sm focus:outline-none focus:border-brand-primary transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="h-14 px-7 rounded-2xl bg-brand-primary text-white font-semibold text-sm hover:bg-brand-hover transition-all hover:scale-[1.03] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap flex items-center gap-2 justify-center"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        aria-hidden="true"
                      >
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      {t("newsletter.subscribing")}
                    </>
                  ) : (
                    <>
                      {t("newsletter.subscribe")}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Trust badges */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-text-para-light dark:text-text-para-dark text-xs font-medium opacity-70">
              <span className="flex items-center gap-1.5">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                </svg>
                {t("newsletter.private")}
              </span>
              <span className="w-px h-4 bg-border-light dark:bg-border-dark" />
              <span className="flex items-center gap-1.5">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {t("newsletter.weekly")}
              </span>
              <span className="w-px h-4 bg-border-light dark:bg-border-dark" />
              <span className="flex items-center gap-1.5">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="9 11 12 14 22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
                {t("newsletter.unsubscribe")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

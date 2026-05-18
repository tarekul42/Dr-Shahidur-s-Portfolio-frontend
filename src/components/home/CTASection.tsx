"use client";

import Link from "next/link";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/hooks/useTranslation";

export function CTASection() {
  const { t, language } = useTranslation();
  const isBn = language === "bn";

  return (
    <AnimatedSection className="py-24">
      <div className="container mx-auto px-6">
        <div className="rounded-3xl overflow-hidden border border-border-light dark:border-border-dark bg-linear-to-r from-brand-primary to-brand-hover p-10 md:p-14 text-white relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.25),transparent_50%)]" />
          <div className="relative max-w-4xl space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              {t("cta.title")}
            </h2>
            <p className="text-white/85 leading-relaxed max-w-2xl">
              {t("cta.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Button
                href="/appointment"
                variant="ghost"
                className="bg-white text-brand-primary hover:bg-white/90 justify-center"
              >
                {t("cta.book")}
              </Button>
              <Button
                href="/chambers"
                variant="outline"
                className="border-white text-white hover:bg-white/10 justify-center"
              >
                {t("cta.ask")}
              </Button>
            </div>

            <div className="pt-6 border-t border-white/20">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
                {t("chambers.schedule")}
              </div>
              <div className="mt-2 text-xs md:text-sm font-semibold text-white/95 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>
                  {isBn
                    ? "ইবনে সিনা মেডিকেল কলেজ হাসপাতাল (শনি, সোম, বুধ, শুক্র)"
                    : "Ibn Sina Medical College Hospital (Sat, Mon, Wed, Fri)"}
                </span>
                <span className="text-white/40 hidden sm:inline">|</span>
                <Link
                  href="/chambers"
                  className="underline text-white hover:text-white/80 transition-colors"
                >
                  {isBn ? "অন্যান্য চেম্বার দেখুন" : "View other chambers"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
export default CTASection;

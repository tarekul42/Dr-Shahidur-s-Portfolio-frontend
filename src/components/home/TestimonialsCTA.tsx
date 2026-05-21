"use client";

import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/hooks/useTranslation";

export const TestimonialsCTA = () => {
  const { t } = useTranslation();

  return (
    <AnimatedSection className="py-24 relative overflow-hidden">
      {/* Visual Background */}
      <div className="absolute inset-0 bg-brand-primary -z-10" />
      <div className="absolute top-0 right-0 w-1/3 h-full bg-black/10 -skew-x-12 translate-x-1/2 -z-10" />

      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div
            className="inline-block px-4 py-1 border border-white/30 text-white rounded-full text-[10px] font-bold tracking-[0.2em] uppercase animate-fade-in"
            style={{ animationFillMode: "both" }}
          >
            {t("testimonialsCta.badge")}
          </div>

          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight animate-slide-up"
            style={{ animationDelay: "0.1s", animationFillMode: "both" }}
          >
            {t("testimonialsCta.title")}
          </h2>

          <p
            className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed animate-slide-up"
            style={{ animationDelay: "0.2s", animationFillMode: "both" }}
          >
            {t("testimonialsCta.subtitle")}
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-slide-up"
            style={{ animationDelay: "0.3s", animationFillMode: "both" }}
          >
            <Button
              variant="white"
              size="lg"
              className="h-16 px-10 text-lg shadow-2xl"
              href="/testimonials"
            >
              {t("testimonialsCta.read")}
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white/10 h-16 px-10 text-lg"
              href="/appointment"
            >
              {t("testimonialsCta.start")}
            </Button>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

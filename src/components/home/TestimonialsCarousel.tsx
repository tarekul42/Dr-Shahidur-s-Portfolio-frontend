"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/types/testimonial";

export function TestimonialsCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const { t } = useTranslation();

  const visible = useMemo(
    () => testimonials.filter((t) => t.isVisible !== false),
    [testimonials],
  );

  const scrollToIndex = (idx: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(idx, visible.length - 1));
    const child = el.children.item(clamped) as HTMLElement | null;
    if (!child) return;

    el.scrollTo({
      left: child.offsetLeft - (el.clientWidth - child.clientWidth) / 2,
      behavior: "smooth",
    });
    setActive(clamped);
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const children = Array.from(el.children) as HTMLElement[];
      const center = el.scrollLeft + el.clientWidth / 2;
      let closest = 0;
      let best = Number.POSITIVE_INFINITY;
      for (let i = 0; i < children.length; i++) {
        const c = children[i];
        const cCenter = c.offsetLeft + c.clientWidth / 2;
        const d = Math.abs(cCenter - center);
        if (d < best) {
          best = d;
          closest = i;
        }
      }
      setActive(closest);
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible.length) return null;

  return (
    <section className="py-32 bg-[#F8FAFC] dark:bg-bg-dark relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-linear-to-b from-brand-primary/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12 mb-16">
          <SectionHeading
            badge={t("testimonials.badge")}
            title={t("testimonials.title")}
            className="mb-0"
          />
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => scrollToIndex(active - 1)}
              className="w-14 h-14 rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-card-dark flex items-center justify-center text-text-para-light dark:text-text-para-dark hover:border-brand-primary/50 hover:text-brand-primary transition-all shadow-lg shadow-black/5"
              disabled={active === 0}
              aria-label="Previous testimonial"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-label="Previous arrow"
              >
                <title>Previous</title>
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scrollToIndex(active + 1)}
              className="w-14 h-14 rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-card-dark flex items-center justify-center text-text-para-light dark:text-text-para-dark hover:border-brand-primary/50 hover:text-brand-primary transition-all shadow-lg shadow-black/5"
              disabled={active === visible.length - 1}
              aria-label="Next testimonial"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-label="Next arrow"
              >
                <title>Next</title>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="relative -mx-6 px-6">
          <div
            ref={scrollerRef}
            className="flex gap-10 overflow-x-auto snap-x snap-mandatory pb-12 scroll-smooth no-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {visible.map((t, idx) => (
              <div
                key={t._id}
                className="snap-center shrink-0 w-[85vw] md:w-112.5 lg:w-120"
              >
                <TestimonialCard testimonial={t} idx={idx} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-8 pt-8 border-t border-border-light dark:border-border-dark">
          <div className="flex items-center gap-3">
            {visible.map((_t, idx) => (
              <button
                key={`indicator-${_t._id}`}
                type="button"
                aria-label={`Go to testimonial ${idx + 1}`}
                onClick={() => scrollToIndex(idx)}
                className={cn(
                  "h-2.5 rounded-full transition-all duration-500",
                  idx === active
                    ? "bg-brand-primary w-12"
                    : "bg-border-light dark:bg-border-dark w-2.5 hover:bg-brand-primary/40",
                )}
              />
            ))}
          </div>

          <Button
            href="/testimonials"
            variant="outline"
            className="w-full sm:w-auto h-14 px-10 rounded-2xl font-bold uppercase tracking-widest text-sm"
          >
            {t("testimonialsCta.read")}
          </Button>
        </div>
      </div>
    </section>
  );
}

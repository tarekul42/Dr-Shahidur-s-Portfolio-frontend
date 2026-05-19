"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useMemo, useState } from "react";
import { VideoTestimonial } from "@/components/testimonials/VideoTestimonial";
import { StarRating } from "@/components/ui/StarRating";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/types/testimonial";

interface TestimonialCardProps {
  testimonial: Testimonial;
  idx?: number;
}

export const TestimonialCard = ({
  testimonial,
  idx = 0,
}: TestimonialCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const canExpand = testimonial.content.length > 250;

  const displayText = useMemo(() => {
    if (expanded || !canExpand) return testimonial.content;
    return `${testimonial.content.slice(0, 250).trim()}…`;
  }, [expanded, canExpand, testimonial.content]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1 }}
      className="group bg-white dark:bg-card-dark rounded-4xl border border-border-light/50 dark:border-border-dark p-10 shadow-2xl shadow-brand-primary/5 relative flex flex-col h-full hover:border-brand-primary/30 transition-all duration-500"
    >
      {/* Refined Quote Icon */}
      <div className="absolute top-10 right-10 text-brand-primary/10 group-hover:text-brand-primary/20 transition-colors duration-500">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
          <title>Quote Icon</title>
          <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C15.4647 8 15.017 8.44772 15.017 9V12C15.017 12.5523 14.5693 13 14.017 13H12.017V21H14.017ZM6.017 21L6.017 18C6.017 16.8954 6.91243 16 8.017 16H11.017C11.5693 16 12.017 15.5523 12.017 15V9C12.017 8.44772 11.5693 8 11.017 8H8.017C7.46472 8 7.017 8.44772 7.017 9V12C7.017 12.5523 6.56929 13 6.017 13H4.017V21H6.017Z" />
        </svg>
      </div>

      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <StarRating rating={testimonial.rating} size="sm" />
        </div>

        <div className="relative">
          <p className="text-lg md:text-xl text-text-para-light dark:text-text-para-dark leading-[1.8] font-medium italic">
            "{displayText}"
          </p>
          {canExpand && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-4 text-sm font-bold text-brand-primary hover:text-brand-hover transition-colors flex items-center gap-1"
              aria-expanded={expanded}
            >
              {expanded ? "Show less" : "Read full story"}
              <span
                className={cn(
                  "transition-transform",
                  expanded ? "rotate-180" : "",
                )}
              >
                ↓
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="mt-10 flex items-center gap-4 pt-8 border-t border-border-light/50 dark:border-border-dark">
        <div className="relative group/avatar">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-brand-softbg dark:bg-brand-primary/10 flex items-center justify-center text-brand-primary text-xl font-black shadow-inner">
            {testimonial.image?.url ? (
              <Image
                src={testimonial.image.url}
                alt={testimonial.name}
                fill
                sizes="64px"
                loading="lazy"
                className="object-cover transition-transform duration-500 group-hover/avatar:scale-110"
              />
            ) : (
              testimonial.name.charAt(0)
            )}
          </div>

          {testimonial.video?.url && (
            <button
              type="button"
              onClick={() => setVideoOpen(true)}
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-lg hover:bg-brand-hover transition-all scale-90 hover:scale-100"
              aria-label="Play video testimonial"
            >
              <span className="text-[10px]">▶</span>
            </button>
          )}
        </div>

        <div className="flex flex-col">
          <span className="text-lg font-bold text-text-heading-light dark:text-text-heading-dark">
            {testimonial.name}
          </span>
          <span className="text-xs uppercase tracking-[0.15em] text-brand-primary font-bold">
            {testimonial.designation || "Verified Patient"}
          </span>
        </div>
      </div>

      {testimonial.video?.url && (
        <VideoTestimonial
          isOpen={videoOpen}
          onClose={() => setVideoOpen(false)}
          videoUrl={testimonial.video.url}
          posterUrl={testimonial.image?.url}
          title={testimonial.name}
        />
      )}
    </motion.div>
  );
};

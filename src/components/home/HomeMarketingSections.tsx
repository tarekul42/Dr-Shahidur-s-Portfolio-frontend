"use client";

import { CTASection } from "@/components/home/CTASection";
import { NewsletterCTA } from "@/components/home/NewsletterCTA";
import { TestimonialsCTA } from "@/components/home/TestimonialsCTA";

/** Client-only marketing blocks — loaded after idle to reduce main-thread work on mobile. */
export function HomeMarketingSections() {
  return (
    <>
      <CTASection />
      <TestimonialsCTA />
      <NewsletterCTA />
    </>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { TestimonialsList } from "@/components/testimonials/TestimonialsList";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = {
  title: "Patient Stories",
  description:
    "Read what patients have to say about their recovery journey and orthopedic care with Dr. Sahidur Rahman Khan.",
};

function TestimonialsListFallback() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton grid
        <Skeleton key={i} variant="card" className="h-80" />
      ))}
    </div>
  );
}

export default function TestimonialsPage() {
  return (
    <div className="container mx-auto px-6 py-20">
      <Breadcrumbs title="Patient Stories" />
      <SectionHeading
        badge="Wall of Gratitude"
        title="Patient Success Stories"
        subtitle="The greatest reward in medicine is seeing my patients return to their active lives. Here are some of their stories."
        centered
      />

      <Suspense fallback={<TestimonialsListFallback />}>
        <TestimonialsList />
      </Suspense>

      <div className="mt-32 max-w-3xl mx-auto text-center p-16 rounded-[2.5rem] bg-brand-softbg dark:bg-brand-primary/10 border border-dashed border-brand-primary/30">
        <h3 className="text-3xl font-bold text-text-heading-light dark:text-text-heading-dark mb-6">
          Share Your Journey
        </h3>
        <p className="text-lg text-text-para-light dark:text-text-para-dark mb-10 max-w-xl mx-auto leading-relaxed">
          Your recovery story can inspire others facing similar orthopedic
          challenges. We would love to hear about your experience.
        </p>
        <a
          href="mailto:testimonials@drshahidur.com"
          className="inline-flex items-center gap-3 px-10 py-5 bg-brand-primary text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-brand-hover transition-all shadow-xl shadow-brand-primary/20"
        >
          <span>Email Your Feedback</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-label="Send email icon"
          >
            <title>Send Email</title>
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
        </a>
      </div>
    </div>
  );
}

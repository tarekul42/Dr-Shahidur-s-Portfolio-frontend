import type { Metadata } from "next";
import { Suspense } from "react";
import { ArticlesClient } from "@/components/articles/ArticlesClient";
import { SectionHeading } from "@/components/shared/SectionHeading";

export const metadata: Metadata = {
  title: "Articles & Insights",
  description:
    "Explore the latest orthopedic insights, surgical techniques, and patient care tips by Dr. Sahidur Rahman Khan.",
};

function ArticlesListFallback() {
  return (
    <div
      className="min-h-[12rem] animate-pulse rounded-2xl bg-border-light/20 dark:bg-border-dark/20"
      aria-hidden
    />
  );
}

export default function ArticlesPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <SectionHeading
        badge="Knowledge Center"
        title="Articles & Medical Insights"
        subtitle="Staying informed is the first step towards recovery. Browse my latest publications on orthopedic health."
        priority
      />
      <div className="mt-12">
        <Suspense fallback={<ArticlesListFallback />}>
          <ArticlesClient />
        </Suspense>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { SectionHeading } from "@/components/shared/SectionHeading";

const ResearchClient = dynamic(
  () =>
    import("@/components/research/ResearchClient").then(
      (mod) => mod.ResearchClient,
    ),
  {
    loading: () => (
      <div className="min-h-[12rem] animate-pulse rounded-2xl bg-border-light/20 dark:bg-border-dark/20" />
    ),
  },
);

export const metadata: Metadata = {
  title: "Research & Publications",
  description:
    "Browse the clinical research, medical papers, and innovations in orthopedic surgery by Dr. Sahidur Rahman Khan.",
};

export default function ResearchPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <SectionHeading
        badge="Academic Excellence"
        title="Research & Publications"
        subtitle="Contributing to the advancement of orthopedic science through evidence-based research and clinical studies."
        priority
      />

      <div className="mt-12">
        <Suspense
          fallback={
            <div className="min-h-[12rem] animate-pulse rounded-2xl bg-border-light/20 dark:bg-border-dark/20" />
          }
        >
          <ResearchClient />
        </Suspense>
      </div>
    </div>
  );
}

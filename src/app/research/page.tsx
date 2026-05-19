import type { Metadata } from "next";
import { Suspense } from "react";
import { ResearchClient } from "@/components/research/ResearchClient";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Skeleton } from "@/components/ui/Skeleton";
import { getResearchList } from "@/lib/api/research";
import type { PaginatedData } from "@/types/api";
import type { Research, UploadType } from "@/types/research";

export const metadata: Metadata = {
  title: "Research & Publications",
  description:
    "Browse the clinical research, medical papers, and innovations in orthopedic surgery by Dr. Sahidur Rahman Khan.",
};

export default async function ResearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    uploadType?: string;
    search?: string;
  }>;
}) {
  const { page: pageParam, uploadType, search } = await searchParams;
  const page = Number(pageParam) || 1;

  let data: PaginatedData<Research> | undefined;
  try {
    data = await getResearchList({
      page,
      limit: 12,
      uploadType: uploadType as UploadType | undefined,
      search,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Failed to fetch research", error);
    }
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <SectionHeading
        badge="Academic Excellence"
        title="Research & Publications"
        subtitle="Contributing to the advancement of orthopedic science through evidence-based research and clinical studies."
      />

      <div className="mt-12">
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton grid
                <Skeleton key={i} variant="card" className="h-72" />
              ))}
            </div>
          }
        >
          <ResearchClient initialResearch={data} />
        </Suspense>
      </div>
    </div>
  );
}

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Hero } from "@/components/home/Hero";
import {
  AboutSection,
  FeaturedArticlesSection,
  TestimonialsSection,
} from "@/components/home/HomeAsyncSections";
import { HomeBelowFoldSkeleton } from "@/components/home/HomeBelowFoldSkeleton";
import { HomeChamberOverview } from "@/components/home/HomeChamberOverview";
import { HomeSectionSkeleton } from "@/components/home/HomeSectionSkeleton";
import { SpecialtiesSection } from "@/components/home/SpecialtiesSection";
import { DeferredBelowFold } from "@/components/shared/DeferredBelowFold";

const HomeMarketingLazy = dynamic(
  () =>
    import("@/components/home/HomeMarketingSections").then(
      (mod) => mod.HomeMarketingSections,
    ),
);

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Hero />

      <DeferredBelowFold fallback={<HomeBelowFoldSkeleton />}>
        <SpecialtiesSection />

        <Suspense
          fallback={
            <HomeSectionSkeleton className="bg-brand-softbg dark:bg-brand-primary/5" />
          }
        >
          <AboutSection />
        </Suspense>

        <HomeChamberOverview />

        <Suspense fallback={<HomeSectionSkeleton />}>
          <FeaturedArticlesSection />
        </Suspense>

        <Suspense fallback={null}>
          <TestimonialsSection />
        </Suspense>

        <HomeMarketingLazy />
      </DeferredBelowFold>
    </div>
  );
}

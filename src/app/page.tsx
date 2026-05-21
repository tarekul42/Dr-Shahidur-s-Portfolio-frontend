import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Hero } from "@/components/home/Hero";
import {
  AboutSection,
  FeaturedArticlesSection,
} from "@/components/home/HomeAsyncSections";
import { HomeChamberOverview } from "@/components/home/HomeChamberOverview";
import { HomeSectionSkeleton } from "@/components/home/HomeSectionSkeleton";
import { SpecialtiesSection } from "@/components/home/SpecialtiesSection";

const HomeMarketingLazy = dynamic(() =>
  import("@/components/home/HomeMarketingSections").then(
    (mod) => mod.HomeMarketingSections,
  ),
);

import { TestimonialsCarouselLazy } from "@/components/home/TestimonialsCarouselLazy";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Hero />

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
        <TestimonialsCarouselLazy />
      </Suspense>

      <HomeMarketingLazy />
    </div>
  );
}

import { About } from "@/components/home/About";
import { ChamberOverview } from "@/components/home/ChamberOverview";
import { CTASection } from "@/components/home/CTASection";
import { FeaturedArticles } from "@/components/home/FeaturedArticles";
import { Hero } from "@/components/home/Hero";
import { NewsletterCTA } from "@/components/home/NewsletterCTA";
import { Specialties } from "@/components/home/Specialties";
import { TestimonialsCarousel } from "@/components/home/TestimonialsCarousel";
import { TestimonialsCTA } from "@/components/home/TestimonialsCTA";
import { getAppInfo } from "@/lib/api/app-info";
import { getArticles } from "@/lib/api/articles";
import { getTestimonials } from "@/lib/api/testimonials";

export default async function Home() {
  const [_appInfo, articles, testimonials] = await Promise.all([
    getAppInfo().catch(() => undefined),
    getArticles({ limit: 6, articleType: "MEDICAL" }).catch(() => undefined),
    getTestimonials().catch(() => undefined),
  ]);

  return (
    <div className="flex flex-col w-full">
      <Hero />
      <Specialties />
      <About />
      <ChamberOverview />

      {articles?.docs?.length ? (
        <FeaturedArticles articles={articles.docs} />
      ) : null}

      {testimonials?.docs?.length ? (
        <TestimonialsCarousel testimonials={testimonials.docs.slice(0, 5)} />
      ) : null}

      <CTASection />
      <TestimonialsCTA />
      <NewsletterCTA />
    </div>
  );
}

import { getTestimonials } from "@/lib/api/testimonials";
import { TestimonialsCarousel } from "./TestimonialsCarousel";

/** Server wrapper so carousel data loads in Suspense, not on the critical path. */
export async function TestimonialsCarouselLazy() {
  const testimonials = await getTestimonials().catch(() => undefined);

  if (!testimonials?.docs?.length) return null;

  return <TestimonialsCarousel testimonials={testimonials.docs.slice(0, 5)} />;
}

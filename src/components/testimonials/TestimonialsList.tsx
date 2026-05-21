"use client";

import { useQuery } from "@tanstack/react-query";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { fetchTestimonialsClient } from "@/lib/api/testimonials";

function TestimonialsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton grid
        <Skeleton key={i} variant="card" className="h-80" />
      ))}
    </div>
  );
}

export function TestimonialsList() {
  const { data, isPending, isFetching, isError } = useQuery({
    queryKey: ["testimonials"],
    queryFn: fetchTestimonialsClient,
    staleTime: 10 * 60 * 1000,
  });

  const loading = isPending || (isFetching && !data);

  if (loading) {
    return <TestimonialsGridSkeleton />;
  }

  if (isError || !data?.docs?.length) {
    return (
      <EmptyState
        title="No Testimonials Yet"
        description="We haven't added any patient stories yet. If you've been a patient of Dr. Sahidur, we'd love to hear from you!"
      />
    );
  }

  return (
    <div className="flex flex-col gap-10 md:block md:columns-2 lg:columns-3 md:gap-10 md:[column-fill:balance] md:space-y-10">
      {data.docs.map((testimonial, idx) => (
        <div key={testimonial._id} className="md:break-inside-avoid md:mb-10">
          <TestimonialCard testimonial={testimonial} idx={idx} />
        </div>
      ))}
    </div>
  );
}

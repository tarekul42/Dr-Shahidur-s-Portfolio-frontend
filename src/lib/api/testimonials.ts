import { cache } from "react";
import { api } from "@/lib/axios";
import { serverFetch } from "@/lib/fetcher";
import type { ApiResponse, PaginatedData } from "@/types/api";
import type { Testimonial } from "@/types/testimonial";

function visibleTestimonials(items: Testimonial[]): Testimonial[] {
  return items.filter((t) => t.isVisible !== false);
}

function normalizeTestimonials(
  data: Testimonial[] | PaginatedData<Testimonial>,
): PaginatedData<Testimonial> {
  if (Array.isArray(data)) {
    const docs = visibleTestimonials(data);
    return {
      docs,
      totalDocs: docs.length,
      limit: docs.length,
      totalPages: 1,
      page: 1,
    };
  }

  const docs = visibleTestimonials(data.docs ?? []);
  return { ...data, docs, totalDocs: docs.length };
}

export const getTestimonials = cache(
  async (): Promise<PaginatedData<Testimonial>> => {
    try {
      const data = await serverFetch<
        Testimonial[] | PaginatedData<Testimonial>
      >("/testimonials", {
        revalidate: 600,
        tags: ["testimonials"],
      });
      return normalizeTestimonials(data);
    } catch {
      return {
        docs: [],
        totalDocs: 0,
        limit: 0,
        totalPages: 0,
        page: 1,
      };
    }
  },
);

export async function fetchTestimonialsClient(): Promise<
  PaginatedData<Testimonial>
> {
  const { data: response } =
    await api.get<ApiResponse<Testimonial[] | PaginatedData<Testimonial>>>(
      "/testimonials",
    );

  if (!response.data) {
    return {
      docs: [],
      totalDocs: 0,
      limit: 0,
      totalPages: 0,
      page: 1,
    };
  }

  return normalizeTestimonials(response.data);
}

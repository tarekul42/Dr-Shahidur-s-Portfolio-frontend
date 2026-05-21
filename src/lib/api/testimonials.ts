import { cache } from "react";
import { serverFetch } from "@/lib/fetcher";
import type { PaginatedData } from "@/types/api";
import type { Testimonial } from "@/types/testimonial";

export const getTestimonials = cache(
  async (): Promise<PaginatedData<Testimonial>> => {
    try {
      const data = await serverFetch<
        Testimonial[] | PaginatedData<Testimonial>
      >("/testimonials", {
        revalidate: 600,
        tags: ["testimonials"],
      });

      if (Array.isArray(data)) {
        return {
          docs: data,
          totalDocs: data.length,
          limit: data.length,
          totalPages: 1,
          page: 1,
        };
      }

      return data;
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

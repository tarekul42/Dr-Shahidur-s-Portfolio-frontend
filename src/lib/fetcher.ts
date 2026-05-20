import type { ApiResponse } from "@/types/api";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1";

// Default local fallback data to serve when the API is down or slow
function getFallbackData<T>(endpoint: string): T {
  if (endpoint === "/app-info") {
    return {
      doctorName: "Dr. Md. Sahidur Rahman Khan",
      doctorSpecialty:
        "Ilizarov, Spine, Arthroplasty, Arthroscopy, Plastic Reconstructive & Orthopedic Trauma Surgeon",
      siteName: "Dr. Md. Sahidur Rahman Khan",
      siteDescription:
        "Dedicated Orthopedic Surgeon providing world-class orthopedic care and specialized surgical treatments.",
      phone: "+880 1799-002233",
      email: "info@drshahidur.com",
      socialLinks: {},
    } as unknown as T;
  }
  if (endpoint.startsWith("/articles/categories")) {
    return [] as unknown as T;
  }
  if (
    endpoint === "/articles" ||
    endpoint.startsWith("/articles?") ||
    endpoint === "/research" ||
    endpoint.startsWith("/research?") ||
    endpoint === "/testimonials" ||
    endpoint.startsWith("/testimonials?")
  ) {
    return {
      docs: [],
      totalDocs: 0,
      limit: 10,
      totalPages: 0,
      page: 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    } as unknown as T;
  }
  throw new Error(`No fallback data configured for endpoint: ${endpoint}`);
}

export async function serverFetch<T>(
  endpoint: string,
  options?: { revalidate?: number; tags?: string[] },
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 1500); // 1.5 seconds hard timeout

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      next: {
        revalidate: options?.revalidate,
        tags: options?.tags,
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const json = (await res.json()) as ApiResponse<unknown>;

    if (json.meta && Array.isArray(json.data)) {
      return {
        docs: json.data,
        totalDocs: json.meta.total,
        limit: Number(json.meta.limit),
        totalPages: json.meta.totalPage,
        page: Number(json.meta.page),
        pagingCounter: 1,
        hasPrevPage: Number(json.meta.page) > 1,
        hasNextPage: Number(json.meta.page) < json.meta.totalPage,
        prevPage: Number(json.meta.page) > 1 ? Number(json.meta.page) - 1 : null,
        nextPage:
          Number(json.meta.page) < json.meta.totalPage
            ? Number(json.meta.page) + 1
            : null,
      } as unknown as T;
    }

    return json.data as T;
  } catch (error) {
    clearTimeout(timeoutId);
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[serverFetch] Failed to fetch ${endpoint}, using fallback.`, error);
    }
    try {
      return getFallbackData<T>(endpoint);
    } catch (fallbackError) {
      // Re-throw if no fallback is defined (e.g. detail pages)
      throw error;
    }
  }
}


import type { ApiResponse } from "@/types/api";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1";

export async function serverFetch<T>(
  endpoint: string,
  options?: { revalidate?: number; tags?: string[] },
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    next: {
      revalidate: options?.revalidate,
      tags: options?.tags,
    },
    signal: AbortSignal.timeout(5000),
  });
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

  // Backend wraps all responses in { success, statusCode, message, data }
  return json.data as T;
}

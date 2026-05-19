import { api } from "@/lib/axios";
import { serverFetch } from "@/lib/fetcher";
import type { ApiResponse, PaginatedData } from "@/types/api";
import type {
  Article,
  ArticleCategory,
  ArticleFilterParams,
} from "@/types/article";

export async function getArticles(
  params?: ArticleFilterParams,
): Promise<PaginatedData<Article>> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.category) query.set("category", String(params.category));
  if (params?.articleType) query.set("articleType", params.articleType);
  if (params?.search) query.set("search", params.search);
  if (params?.tag) query.set("tag", params.tag);
  const qs = query.toString();
  return serverFetch<PaginatedData<Article>>(`/articles${qs ? `?${qs}` : ""}`, {
    revalidate: 300,
    tags: ["articles"],
  });
}

export async function getArticleBySlug(slug: string): Promise<Article> {
  return serverFetch<Article>(`/articles/${slug}`, {
    revalidate: 600,
    tags: ["article", slug],
  });
}

export async function getCategories(): Promise<ArticleCategory[]> {
  return serverFetch<ArticleCategory[]>("/articles/categories", {
    revalidate: 300,
    tags: ["categories"],
  });
}

export async function fetchArticlesClient(
  params: ArticleFilterParams,
): Promise<PaginatedData<Article>> {
  const { data: response } = await api.get<ApiResponse<PaginatedData<Article>>>(
    "/articles",
    { params },
  );

  // Backend returns PaginatedData directly in data field
  if (
    response.data &&
    "docs" in response.data &&
    Array.isArray(response.data.docs)
  ) {
    return response.data;
  }

  // Fallback: if data is an array (shouldn't happen with current backend)
  const plainData = response.data as unknown as Article[];
  return {
    docs: Array.isArray(plainData) ? plainData : [],
    totalDocs: Array.isArray(plainData) ? plainData.length : 0,
    limit: 10,
    totalPages: 0,
    page: 1,
  };
}

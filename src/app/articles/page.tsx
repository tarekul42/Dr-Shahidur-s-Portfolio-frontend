import type { Metadata } from "next";
import { Suspense } from "react";
import { ArticlesClient } from "@/components/articles/ArticlesClient";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Skeleton } from "@/components/ui/Skeleton";
import { getArticles, getCategories } from "@/lib/api/articles";
import type { PaginatedData } from "@/types/api";
import type { Article, ArticleCategory, ArticleType } from "@/types/article";

export const metadata: Metadata = {
  title: "Articles & Insights",
  description:
    "Explore the latest orthopedic insights, surgical techniques, and patient care tips by Dr. Sahidur Rahman Khan.",
};

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    category?: string;
    articleType?: string;
    search?: string;
  }>;
}) {
  const { page: pageParam, category, articleType, search } = await searchParams;
  const page = Number(pageParam) || 1;

  let data: PaginatedData<Article> | undefined;
  try {
    data = await getArticles({
      page,
      category,
      limit: 12,
      // type cast to keep strict typing in page
      articleType: articleType as ArticleType | undefined,
      search,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Failed to fetch articles", error);
    }
  }

  let categories: ArticleCategory[] = [];
  try {
    categories = await getCategories();
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Failed to fetch categories", error);
    }
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <SectionHeading
        badge="Knowledge Center"
        title="Articles & Medical Insights"
        subtitle="Staying informed is the first step towards recovery. Browse my latest publications on orthopedic health."
      />
      <div className="mt-12">
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 12 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton grid
                <Skeleton key={i} variant="card" className="h-80" />
              ))}
            </div>
          }
        >
          <ArticlesClient initialArticles={data} categories={categories} />
        </Suspense>
      </div>
    </div>
  );
}

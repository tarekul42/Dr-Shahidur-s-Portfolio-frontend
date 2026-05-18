import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/api/articles";
import { getResearchList } from "@/lib/api/research";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000";
  const [articles, research] = await Promise.all([
    getArticles({ limit: 100 }).catch(() => ({ docs: [] })),
    getResearchList({ limit: 100 }).catch(() => ({ docs: [] })),
  ]);

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/research`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/appointment`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/testimonials`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...articles.docs.map((article) => ({
      url: `${baseUrl}/articles/${article.slug}`,
      lastModified: new Date(article.updatedAt || article.createdAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...research.docs.map((item) => ({
      url: `${baseUrl}/research/${item.slug}`,
      lastModified: new Date(item.updatedAt || item.createdAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}

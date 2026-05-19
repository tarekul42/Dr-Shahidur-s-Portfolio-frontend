"use client";

import Link from "next/link";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/hooks/useTranslation";
import type { Article } from "@/types/article";

export function FeaturedArticles({ articles }: { articles: Article[] }) {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-bg-light dark:bg-bg-dark">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
          <SectionHeading
            badge={t("articles.badge")}
            title={t("articles.title")}
            className="mb-0"
          />
          <Button
            href="/articles"
            variant="outline"
            className="w-full lg:w-auto justify-center"
          >
            {t("hero.cta.secondary")}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, idx) => (
            <ArticleCard key={article._id} article={article} idx={idx} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/articles"
            className="text-xs font-bold uppercase tracking-widest text-brand-primary hover:text-brand-hover transition-colors"
          >
            Browse all articles →
          </Link>
        </div>
      </div>
    </section>
  );
}

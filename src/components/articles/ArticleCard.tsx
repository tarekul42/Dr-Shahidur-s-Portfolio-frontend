"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { formatDate, readingTime } from "@/lib/utils";
import type { Article } from "@/types/article";

interface ArticleCardProps {
  article: Article;
  idx?: number;
}

export const ArticleCard = ({ article, idx = 0 }: ArticleCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1 }}
      className="group bg-card-light dark:bg-card-dark rounded-2xl border border-border-light dark:border-border-dark overflow-hidden hover:shadow-2xl transition-all duration-500"
    >
      <Link
        href={`/articles/${article.slug}`}
        className="block relative aspect-video overflow-hidden"
      >
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
        {article.featuredImage && (
          <Image
            src={article.featuredImage.url}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        )}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {article.tags?.slice(0, 2).map((tag) => (
            <Badge
              key={tag}
              variant="medical"
              className="bg-white/90 backdrop-blur-sm shadow-sm"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </Link>

      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-text-para-light dark:text-text-para-dark opacity-60">
          <span>{formatDate(article.createdAt)}</span>
          <span className="w-1 h-1 rounded-full bg-current" />
          <span>{readingTime(article.content)} min read</span>
        </div>

        <h3 className="text-xl font-bold text-text-heading-light dark:text-text-heading-dark group-hover:text-brand-primary transition-colors line-clamp-2">
          <Link href={`/articles/${article.slug}`}>{article.title}</Link>
        </h3>

        <p className="text-sm text-text-para-light dark:text-text-para-dark line-clamp-3 leading-relaxed">
          {article.excerpt}
        </p>

        <div className="pt-4 border-t border-border-light dark:border-border-dark flex items-center justify-between">
          <Link
            href={`/articles/${article.slug}`}
            className="text-xs font-bold uppercase tracking-widest text-brand-primary hover:text-brand-hover flex items-center gap-2 group/link"
          >
            Read Article
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover/link:translate-x-1 transition-transform"
            >
              <title>Arrow Icon</title>
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
          <span className="text-[10px] font-bold text-text-para-light dark:text-text-para-dark opacity-40">
            {article.impressions} Views
          </span>
        </div>
      </div>
    </motion.div>
  );
};

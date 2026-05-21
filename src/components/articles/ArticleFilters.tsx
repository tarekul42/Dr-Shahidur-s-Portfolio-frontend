"use client";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/utils";
import type { ArticleCategory, ArticleType } from "@/types/article";

const TYPE_TABS: Array<{ label: string; value: ArticleType | "" }> = [
  { label: "All", value: "" },
  { label: "Medical", value: "MEDICAL" },
  { label: "Political", value: "POLITICAL" },
];

export function ArticleFilters({
  categories,
  category,
  articleType,
  search,
  onSearchChange,
  onCategoryChange,
  onArticleTypeChange,
  onClearAll,
}: {
  categories: ArticleCategory[];
  category: string;
  articleType: ArticleType | "";
  search: string;
  onSearchChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
  onArticleTypeChange: (v: ArticleType | "") => void;
  onClearAll: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
        <Input
          label="Search"
          placeholder="Search articles…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <Select
          label="Category"
          options={[
            { value: "", label: "All categories" },
            ...categories.map((c) => ({ value: c.slug, label: c.name })),
          ]}
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
        />
        <button
          type="button"
          onClick={onClearAll}
          className="h-11 rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark text-xs font-bold uppercase tracking-widest text-text-para-light dark:text-text-para-dark hover:border-brand-primary/60 transition-colors"
          aria-label="Clear all filters"
        >
          Clear all filters
        </button>
      </div>

      <div
        role="tablist"
        aria-label="Article type"
        className="flex w-full max-w-lg rounded-full border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-1 gap-1"
      >
        {TYPE_TABS.map((t) => {
          const active = t.value === articleType;
          return (
            <button
              key={t.label}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onArticleTypeChange(t.value)}
              className={cn(
                "flex-1 min-w-0 px-3 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors text-center",
                active
                  ? "bg-brand-primary text-white shadow-sm"
                  : "text-text-heading-light dark:text-text-heading-dark hover:bg-brand-primary/10 dark:hover:bg-brand-primary/15",
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

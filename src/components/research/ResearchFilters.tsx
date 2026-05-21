"use client";

import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import type { UploadType } from "@/types/research";

const TYPE_TABS: Array<{ label: string; value: UploadType | "" }> = [
  { label: "All", value: "" },
  { label: "PDF", value: "PDF" },
  { label: "DOI", value: "DOI" },
];

export function ResearchFilters({
  uploadType,
  search,
  onSearchChange,
  onUploadTypeChange,
  onClearAll,
}: {
  uploadType: UploadType | "";
  search: string;
  onSearchChange: (v: string) => void;
  onUploadTypeChange: (v: UploadType | "") => void;
  onClearAll: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
        <Input
          label="Search"
          placeholder="Search publications…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <div className="lg:col-span-2 flex items-end gap-4 flex-wrap">
          <div
            role="tablist"
            aria-label="Publication type"
            className="flex w-full max-w-md rounded-full border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-1 gap-1"
          >
            {TYPE_TABS.map((t) => {
              const active = t.value === uploadType;
              return (
                <button
                  key={t.label}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onUploadTypeChange(t.value)}
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

          <button
            type="button"
            onClick={onClearAll}
            className="h-11 px-6 rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark text-xs font-bold uppercase tracking-widest text-text-para-light dark:text-text-para-dark hover:border-brand-primary/60 transition-colors"
            aria-label="Clear all filters"
          >
            Clear all
          </button>
        </div>
      </div>
    </div>
  );
}

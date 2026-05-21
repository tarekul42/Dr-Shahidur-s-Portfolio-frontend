import { Badge } from "@/components/ui/Badge";
import { cn, formatDate } from "@/lib/utils";
import type { Research } from "@/types/research";

interface ResearchCardProps {
  research: Research;
  idx?: number;
}

export const ResearchCard = ({ research, idx = 0 }: ResearchCardProps) => {
  const resourceUrl =
    research.uploadType === "PDF" ? research.pdfFile?.url : research.doiUrl;
  const publishedLabel = research.publishedAt ?? research.createdAt;
  const badgeLabel = research.uploadType === "PDF" ? "PDF" : "DOI";

  return (
    <div
      className={cn(
        "group bg-card-light dark:bg-card-dark rounded-2xl border border-border-light dark:border-border-dark p-8 hover:shadow-2xl hover:border-brand-primary transition-all duration-500",
        idx > 0 && "animate-fade-in",
      )}
    >
      <div className="flex flex-col h-full space-y-6">
        <div className="flex items-center justify-between">
          <Badge variant="medical">{badgeLabel}</Badge>
          <span className="text-xs font-bold text-text-para-light dark:text-text-para-dark opacity-40">
            {formatDate(publishedLabel)}
          </span>
        </div>

        <div className="space-y-3 flex-1">
          <h3 className="text-xl font-bold text-text-heading-light dark:text-text-heading-dark group-hover:text-brand-primary transition-colors leading-tight">
            {research.title}
          </h3>
          <p className="text-sm text-text-para-light dark:text-text-para-dark line-clamp-3 leading-relaxed">
            {research.description ??
              (research.doiNumber ? `DOI: ${research.doiNumber}` : "")}
          </p>
        </div>

        <div className="pt-6 border-t border-border-light dark:border-border-dark flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-brand-primary"
            >
              <title>Research Icon</title>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <span className="text-xs font-bold text-text-heading-light dark:text-text-heading-dark">
              {research.uploadType === "PDF" ? "PDF Document" : "DOI Link"}
            </span>
          </div>

          <a
            href={resourceUrl ?? "#"}
            target={resourceUrl ? "_blank" : undefined}
            rel={resourceUrl ? "noopener noreferrer" : undefined}
            aria-disabled={!resourceUrl}
            className={[
              "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all",
              resourceUrl
                ? "bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white"
                : "bg-border-light dark:bg-border-dark text-text-para-light dark:text-text-para-dark opacity-40 cursor-not-allowed pointer-events-none",
            ].join(" ")}
          >
            {research.uploadType === "PDF" ? "Download" : "Open"}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <title>Download Icon</title>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

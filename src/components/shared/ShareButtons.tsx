"use client";

import {
  FacebookIcon,
  LinkedinIcon,
  XTwitterIcon,
  LinkIcon,
  ShareNodesIcon,
} from "@/components/shared/Icons";
import { useCallback } from "react";

interface ShareButtonsProps {
  title: string;
  slug: string;
  basePath?: string;
}

export const ShareButtons = ({
  title,
  slug,
  basePath = "articles",
}: ShareButtonsProps) => {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000"}/${basePath}/${slug}`;

  const onNativeShare = useCallback(async () => {
    if (navigator.share) {
      await navigator.share({ title, url });
    }
  }, [title, url]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
        Share
      </span>
      <button
        type="button"
        onClick={onNativeShare}
        className="w-10 h-10 rounded-full border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark flex items-center justify-center transition hover:border-brand-primary hover:bg-brand-primary hover:text-white"
        aria-label="Share"
      >
        <ShareNodesIcon className="w-4 h-4" />
      </button>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-full border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark flex items-center justify-center transition hover:border-[#1877f2] hover:bg-[#1877f2] hover:text-white"
        aria-label="Share on Facebook"
      >
        <FacebookIcon className="w-3 h-3" />
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-full border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark flex items-center justify-center transition hover:border-[#1da1f2] hover:bg-[#1da1f2] hover:text-white"
        aria-label="Share on X"
      >
        <XTwitterIcon className="w-3 h-3" />
      </a>
      <a
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-full border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark flex items-center justify-center transition hover:border-[#0a66c2] hover:bg-[#0a66c2] hover:text-white"
        aria-label="Share on LinkedIn"
      >
        <LinkedinIcon className="w-3 h-3" />
      </a>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="w-10 h-10 rounded-full border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark flex items-center justify-center transition hover:border-brand-primary hover:bg-brand-primary hover:text-white"
        aria-label="Copy link"
      >
        <LinkIcon className="w-3 h-3" />
      </a>
    </div>
  );
};

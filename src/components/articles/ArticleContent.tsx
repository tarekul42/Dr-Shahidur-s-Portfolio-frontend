"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ArticleContentProps {
  html: string;
  className?: string;
}

export const ArticleContent = ({ html, className }: ArticleContentProps) => {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(
    null,
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const [cleanHtml, setCleanHtml] = useState(html);

  useEffect(() => {
    import("isomorphic-dompurify").then((module) => {
      const DOMPurify = module.default;
      setCleanHtml(
        DOMPurify.sanitize(html, {
          ALLOWED_TAGS: [
            "h1",
            "h2",
            "h3",
            "p",
            "a",
            "img",
            "blockquote",
            "pre",
            "code",
            "ul",
            "ol",
            "li",
            "strong",
            "em",
            "table",
            "thead",
            "tbody",
            "tr",
            "td",
            "th",
            "br",
            "hr",
            "iframe",
          ],
          ALLOWED_ATTR: [
            "href",
            "src",
            "alt",
            "class",
            "target",
            "rel",
            "frameborder",
            "allowfullscreen",
          ],
        }),
      );
    });
  }, [html]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Re-run when HTML prop changes
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const images = container.querySelectorAll("img");

    const handleClick = (e: Event) => {
      const target = e.target as HTMLImageElement;
      setLightbox({
        src: target.src,
        alt: target.alt || "Article illustration",
      });
    };

    images.forEach((img) => {
      img.style.cursor = "zoom-in";
      img.addEventListener("click", handleClick);
    });

    return () => {
      images.forEach((img) => {
        img.removeEventListener("click", handleClick);
      });
    };
  }, [html]); // Re-run if HTML changes

  return (
    <>
      <div
        ref={containerRef}
        className={cn(
          "article-content prose prose-lg dark:prose-invert max-w-none",
          "prose-headings:text-text-heading-light dark:prose-headings:text-text-heading-dark",
          "prose-p:text-text-para-light dark:prose-p:text-text-para-dark",
          "prose-a:text-brand-primary hover:prose-a:text-brand-hover prose-a:no-underline prose-a:font-bold",
          "prose-img:rounded-2xl prose-img:shadow-xl",
          "prose-strong:text-brand-primary dark:prose-strong:text-brand-accent",
          className,
        )}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: user-supplied article HTML is sanitized via DOMPurify
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
      />

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 p-4 cursor-zoom-out"
          >
            {/* biome-ignore lint/performance/noImgElement: Lightbox uses standard img tag */}
            <motion.img
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              src={lightbox.src}
              alt={lightbox.alt}
              className="max-w-full max-h-[90vh] rounded-lg shadow-2xl cursor-default"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute top-6 right-6 text-white bg-black/50 hover:bg-black/80 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
              onClick={() => setLightbox(null)}
              type="button"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <title>Close Lightbox</title>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

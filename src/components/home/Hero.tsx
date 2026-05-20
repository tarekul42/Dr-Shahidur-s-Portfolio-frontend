"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useTranslation } from "@/hooks/useTranslation";
import { useTheme } from "@/providers/ThemeProvider";

const SkeletonViewer = dynamic(
  () =>
    import("@/components/main/SkeletonViewer/SkeletonViewer").then(
      (mod) => mod.SkeletonViewer,
    ),
  {
    ssr: false,
    loading: () => <Skeleton variant="image" className="h-full w-full" />,
  },
);

// Defer 3D viewer loading to avoid blocking main thread during initial render
function useDeferredLoad(delayMs = 3000): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(() => setReady(true), { timeout: delayMs });
      return () => cancelIdleCallback(id);
    }
    const id = setTimeout(() => setReady(true), delayMs);
    return () => clearTimeout(id);
  }, [delayMs]);
  return ready;
}

export const Hero = () => {
  const { resolvedTheme } = useTheme();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { t } = useTranslation();
  const viewer3dReady = useDeferredLoad(3000);

  return (
    <section className="relative overflow-hidden">
      {/* Subtle left-side glow */}
      <div className="absolute top-1/3 left-0 w-72 h-72 bg-brand-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 min-h-[92vh]">
        {/* ── Left: text content ──────────────────────────────────── */}
        <div
          className="flex flex-col justify-center gap-8 py-24 lg:py-0 lg:pr-10 animate-slide-in-left"
          style={{ animationDuration: "0.8s" }}
        >
          <div className="space-y-5">
            <span
              className="inline-block px-4 py-1.5 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-bold tracking-widest uppercase animate-fade-in"
              style={{ animationDelay: "0.2s", animationFillMode: "both" }}
            >
              {t("hero.badge")}
            </span>

            <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-bold text-text-heading-light dark:text-text-heading-dark leading-[1.08]">
              {t("hero.title1")}
              <br />
              {t("hero.title2")}{" "}
              <span className="text-brand-primary">{t("hero.title3")}</span>
            </h1>

            <p className="text-lg text-text-para-light dark:text-text-para-dark max-w-lg leading-relaxed">
              {t("hero.subtitle")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="h-14 px-8 text-base"
              href="/appointment"
            >
              {t("hero.cta.primary")}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-14 px-8 text-base"
              href="/articles"
            >
              {t("hero.cta.secondary")}
            </Button>
          </div>

          <div className="flex items-center gap-8 pt-2 border-t border-border-light dark:border-border-dark w-fit">
            <div>
              <span className="block text-3xl font-bold text-brand-primary">
                11+
              </span>
              <span className="text-[11px] uppercase tracking-wider font-semibold opacity-50">
                {t("hero.stat1")}
              </span>
            </div>
            <div className="w-px h-10 bg-border-light dark:bg-border-dark" />
            <div>
              <span className="block text-3xl font-bold text-brand-primary">
                5
              </span>
              <span className="text-[11px] uppercase tracking-wider font-semibold opacity-50">
                {t("hero.stat2")}
              </span>
            </div>
          </div>
        </div>

        {/* ── Right: teal stage + dark 3D card ────────────────────── */}
        {isDesktop && (
          <div
            className="hidden lg:flex items-center justify-center bg-brand-softbg dark:bg-brand-primary/5 rounded-l-[80px] p-8 relative overflow-hidden animate-scale-in"
            style={{ animationDuration: "1s", animationDelay: "0.25s", animationFillMode: "both" }}
          >
            {/* Dark 3D medical viewer card */}
            <div className="relative w-full max-w-125 aspect-4/5 max-h-[80vh] rounded-4xl overflow-hidden bg-bg-light dark:bg-bg-dark shadow-[0_24px_80px_-12px_rgba(0,0,0,0.25),0_0_0_1px_rgba(47,160,132,0.15)] mx-auto">
              {viewer3dReady ? (
                <SkeletonViewer showDebug={false} theme={resolvedTheme} />
              ) : (
                <Skeleton variant="image" className="h-full w-full" />
              )}

              {/* Rotate & Explore pill — inside the card */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 px-5 py-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10 text-white text-[10px] uppercase tracking-[0.2em] font-bold pointer-events-none whitespace-nowrap z-20">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                Rotate &amp; Explore
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </div>
            {/* Bottom gradient fade — blends panel into the next section */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-bg-light dark:from-bg-dark to-transparent pointer-events-none rounded-bl-[80px]" />
          </div>
        )}
      </div>
    </section>
  );
};

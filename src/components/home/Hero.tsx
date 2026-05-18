"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
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

export const Hero = () => {
  const { resolvedTheme } = useTheme();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { t } = useTranslation();

  return (
    /**
     * Layout intent:
     *  Left  half  → text content, centred vertically
     *  Right half  → teal "stage" panel that is itself the grid cell.
     *                The 3D card sits inside with uniform 32px padding on
     *                every edge, so the gap is always equal.
     * The grid min-height drives the stage height, eliminating the
     * "panel taller than card → unequal top/bottom gaps" problem.
     */
    <section className="relative overflow-hidden">
      {/* Subtle left-side glow */}
      <div className="absolute top-1/3 left-0 w-72 h-72 bg-brand-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 min-h-[92vh]">
        {/* ── Left: text content ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col justify-center gap-8 py-24 lg:py-0 lg:pr-10"
        >
          <div className="space-y-5">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-1.5 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-bold tracking-widest uppercase"
            >
              {t("hero.badge")}
            </motion.span>

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
        </motion.div>

        {/* ── Right: teal stage + dark 3D card ────────────────────── */}
        {isDesktop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            /**
             * This column IS the teal panel.
             * rounded-l-[80px] gives the signature left-rounded shape.
             * p-8 gives equal 32px gap on every edge of the inner card.
             * -mx-6 + pr-0 lets it bleed to the right viewport edge.
             */
            className="hidden lg:flex items-center justify-center bg-brand-softbg dark:bg-brand-primary/5 rounded-l-[80px] p-8 relative overflow-hidden"
          >
            {/* Dark 3D medical viewer card */}
            <div className="relative w-full max-w-125 aspect-4/5 max-h-[80vh] rounded-4xl overflow-hidden bg-bg-light dark:bg-bg-dark shadow-[0_24px_80px_-12px_rgba(0,0,0,0.25),0_0_0_1px_rgba(47,160,132,0.15)] mx-auto">
              <SkeletonViewer showDebug={false} theme={resolvedTheme} />

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
          </motion.div>
        )}
      </div>
    </section>
  );
};

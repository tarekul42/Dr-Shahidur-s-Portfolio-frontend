"use client";

import Image from "next/image";
import { lazy, Suspense, useState } from "react";
import { useTheme } from "@/providers/ThemeProvider";

const SkeletonViewer = lazy(() =>
  import("@/components/main/SkeletonViewer/SkeletonViewer").then((mod) => ({
    default: mod.SkeletonViewer,
  })),
);

/** Desktop-only 3D viewer — loaded on demand to keep the landing bundle lean. */
export function HeroViewer() {
  const { resolvedTheme } = useTheme();
  const [isInteractive, setIsInteractive] = useState(false);

  return (
    <div className="hidden lg:flex items-center justify-center bg-brand-softbg dark:bg-brand-primary/5 rounded-l-[80px] p-8 relative overflow-hidden">
      <div className="relative w-full max-w-125 aspect-4/5 max-h-[80vh] rounded-4xl overflow-hidden bg-bg-light dark:bg-bg-dark shadow-[0_24px_80px_-12px_rgba(0,0,0,0.25),0_0_0_1px_rgba(47,160,132,0.15)] mx-auto">
        {isInteractive ? (
          <Suspense
            fallback={
              <div className="h-full w-full animate-pulse bg-gray-200 dark:bg-gray-800 rounded-4xl" />
            }
          >
            <SkeletonViewer showDebug={false} theme={resolvedTheme} />
          </Suspense>
        ) : (
          <>
            <Image
              src="/skeleton_placeholder.png"
              alt="Interactive 3D skeleton model preview"
              fill
              sizes="(max-width: 1280px) 50vw, 500px"
              className="object-cover"
              priority={false}
              loading="lazy"
              fetchPriority="low"
            />
            <button
              type="button"
              onClick={() => setIsInteractive(true)}
              className="absolute inset-0 w-full h-full flex flex-col items-center justify-end pb-20 bg-gradient-to-t from-black/40 via-transparent to-transparent hover:from-black/50 transition-all duration-500 group z-10 cursor-pointer"
              aria-label="Activate interactive 3D skeleton viewer"
            >
              <div className="px-6 py-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 text-white font-bold text-sm tracking-wide shadow-2xl group-hover:scale-105 group-hover:bg-white/20 transition-all duration-300 flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-primary" />
                </span>
                Explore Interactive 3D
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:translate-x-0.5 transition-transform"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </>
        )}

        {isInteractive && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 px-5 py-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10 text-white text-[10px] uppercase tracking-[0.2em] font-bold pointer-events-none whitespace-nowrap z-20">
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
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
              aria-hidden="true"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-bg-light dark:from-bg-dark to-transparent pointer-events-none rounded-bl-[80px]" />
    </div>
  );
}

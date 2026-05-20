"use client";

import { useScrollPosition } from "@/hooks/useScrollPosition";

export const BackToTop = () => {
  const isVisible = useScrollPosition(400);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-24 right-6 z-90 p-3 rounded-full bg-brand-primary text-white shadow-lg hover:bg-brand-hover hover:scale-110 active:scale-95 transition-all duration-300 ${
        isVisible
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 scale-50 translate-y-5 pointer-events-none"
      }`}
      aria-label="Back to top"
      type="button"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <title>Arrow Up</title>
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  );
};

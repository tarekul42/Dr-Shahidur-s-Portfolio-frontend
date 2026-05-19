"use client";

import { useEffect, useState } from "react";

export const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const scrollTop =
        window.scrollY || document.body.scrollTop || el.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    };

    window.addEventListener("scroll", update, { passive: true });
    update();

    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      data-testid="reading-progress"
      className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-transparent"
    >
      <div
        className="h-full bg-brand-primary transition-[width] duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

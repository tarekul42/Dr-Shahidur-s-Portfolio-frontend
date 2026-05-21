"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const AnimatedSection = ({
  children,
  className,
  delay = 0,
}: AnimatedSectionProps) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Apply delay then trigger animation
          if (delay > 0) {
            setTimeout(() => el.classList.add("in-view"), delay * 1000);
          } else {
            el.classList.add("in-view");
          }
          observer.unobserve(el);
        }
      },
      { rootMargin: "0px", threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <section ref={ref} className={`animated-section ${className ?? ""}`}>
      {children}
    </section>
  );
};

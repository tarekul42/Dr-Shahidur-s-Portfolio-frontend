"use client";

import { useEffect, useState, type ReactNode } from "react";

interface DeferredBelowFoldProps {
  children: ReactNode;
  fallback: ReactNode;
}

/**
 * Keeps below-the-fold sections out of the initial HTML/hydration path so mobile
 * LCP (hero headline) can paint before heavy sections and client bundles load.
 */
export function DeferredBelowFold({
  children,
  fallback,
}: DeferredBelowFoldProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const reveal = () => setShow(true);

    if (typeof requestIdleCallback === "function") {
      const id = requestIdleCallback(reveal, { timeout: 2000 });
      return () => cancelIdleCallback(id);
    }

    const timer = setTimeout(reveal, 150);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return fallback;
  return children;
}

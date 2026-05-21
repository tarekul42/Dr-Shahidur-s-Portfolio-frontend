"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { isAnalyticsEnabled, trackPageView } from "@/lib/api/analytics";

export const AnalyticsTracker = () => {
  const pathname = usePathname();
  const visitorIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isAnalyticsEnabled()) return;
    // Basic persistent visitor ID (simulated)
    if (!visitorIdRef.current) {
      let vid = localStorage.getItem("v_id");
      if (!vid) {
        vid = `v_${Math.random().toString(36).substring(2, 11)}`;
        localStorage.setItem("v_id", vid);
      }
      visitorIdRef.current = vid;
    }

    let sessionId = sessionStorage.getItem("s_id");
    if (!sessionId) {
      sessionId = `sess_${Date.now()}`;
      sessionStorage.setItem("s_id", sessionId);
    }

    void trackPageView({
      page: pathname,
      sessionId,
      visitorId: visitorIdRef.current || undefined,
      referrer: document.referrer || undefined,
    });
  }, [pathname]);

  return null;
};

"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const HeroViewer = dynamic(
  () => import("./HeroViewer").then((mod) => mod.HeroViewer),
  { ssr: false },
);

/** Desktop-only 3D panel — never downloads Three.js or skeleton image on mobile. */
export function HeroViewerIsland() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (!isDesktop) return null;
  return <HeroViewer />;
}

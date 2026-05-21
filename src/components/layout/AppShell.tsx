"use client";

import dynamic from "next/dynamic";
import type React from "react";
import type { AppInfo } from "@/types/app-info";
import { Footer } from "./Footer";
import { Header } from "./Header";

const AnalyticsTracker = dynamic(
  () =>
    import("@/components/shared/AnalyticsTracker").then(
      (mod) => mod.AnalyticsTracker,
    ),
  { ssr: false },
);

const CookieConsent = dynamic(
  () =>
    import("@/components/shared/CookieConsent").then((mod) => mod.CookieConsent),
  { ssr: false },
);

const BackToTop = dynamic(
  () => import("@/components/ui/BackToTop").then((mod) => mod.BackToTop),
  { ssr: false },
);

const WhatsAppButton = dynamic(
  () =>
    import("@/components/shared/WhatsAppButton").then(
      (mod) => mod.WhatsAppButton,
    ),
  { ssr: false },
);

interface AppShellProps {
  children: React.ReactNode;
  appInfo?: AppInfo;
}

export const AppShell = ({ children, appInfo }: AppShellProps) => {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-100 focus:p-4 focus:bg-brand-primary focus:text-white"
      >
        Skip to main content
      </a>
      <Header appInfo={appInfo} />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 pt-24 focus:outline-none"
      >
        {children}
      </main>
      <Footer appInfo={appInfo} />
      <AnalyticsTracker />
      <BackToTop />
      <CookieConsent />
      <WhatsAppButton phone={appInfo?.phone} />
    </>
  );
};

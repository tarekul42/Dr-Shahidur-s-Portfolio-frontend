import type { Metadata } from "next";
import "./globals.css";

import { Toaster } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { getAppInfo } from "@/lib/api/app-info";
import { QueryProvider } from "@/providers/QueryProvider";
import { RecaptchaProvider } from "@/providers/RecaptchaProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import type { AppInfo } from "@/types/app-info";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const appInfo = await getAppInfo();
    return {
      title: {
        default: appInfo.siteName,
        template: `%s | ${appInfo.siteName}`,
      },
      description:
        appInfo.siteDescription ??
        `${appInfo.doctorName} — ${appInfo.doctorSpecialty}`,
      openGraph: {
        siteName: appInfo.siteName,
        images: appInfo.ogImage ? [{ url: appInfo.ogImage.url }] : [],
      },
      metadataBase: new URL(
        process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
      ),
    };
  } catch (_error) {
    return {
      title: "Dr. Sahidur Rahman Khan",
      description: "Orthopedic Surgeon Portfolio",
    };
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let appInfo: AppInfo | undefined;
  try {
    appInfo = await getAppInfo();
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Failed to fetch app info in RootLayout", error);
    }
  }

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        <link
          rel="preconnect"
          href={process.env.NEXT_PUBLIC_PAYLOAD_URL || "http://127.0.0.1:5000"}
        />
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: inline theme bootstrapping script is safe and required for FOUC prevention
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var theme = localStorage.getItem('theme');
                  if (
                    theme === 'dark' ||
                    (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)
                  ) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {
                  // Ignore localStorage failures.
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg-light dark:bg-bg-dark text-text-heading-light dark:text-text-heading-dark">
        <ThemeProvider>
          <QueryProvider>
            <RecaptchaProvider>
              <AppShell appInfo={appInfo}>{children}</AppShell>
              <Toaster
                position="top-right"
                richColors
                toastOptions={{
                  style: { fontFamily: "var(--font-inter)" },
                }}
              />
            </RecaptchaProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

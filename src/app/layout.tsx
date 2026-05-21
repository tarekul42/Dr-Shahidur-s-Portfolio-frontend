import type { Metadata } from "next";
import { Hind_Siliguri, Inter } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { DeferredToaster } from "@/components/shared/DeferredToaster";
import { getAppInfo } from "@/lib/api/app-info";
import { QueryProvider } from "@/providers/QueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "700"],
  preload: true,
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali"],
  variable: "--font-bengali",
  display: "swap",
  weight: ["400", "700"],
  preload: false,
});

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
  const appInfo = await getAppInfo().catch(() => undefined);

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
        <link rel="preconnect" href="https://ik.imagekit.io" />
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
                  var lang = localStorage.getItem('language');
                  if (lang === 'bn' || lang === 'en') {
                    document.documentElement.dataset.lang = lang;
                  }
                } catch (e) {
                  // Ignore localStorage failures.
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${hindSiliguri.variable} min-h-full flex flex-col bg-bg-light dark:bg-bg-dark text-text-heading-light dark:text-text-heading-dark`}
      >
        <ThemeProvider>
          <QueryProvider>
            <AppShell appInfo={appInfo}>{children}</AppShell>
            <DeferredToaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

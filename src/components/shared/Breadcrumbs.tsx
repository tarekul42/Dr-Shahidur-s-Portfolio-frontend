"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";

export const Breadcrumbs = ({ title }: { title?: string }) => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const { t } = useTranslation();

  const LABELS: Record<string, string> = {
    articles: t("nav.articles"),
    research: t("nav.articles"),
    appointment: t("nav.appointment"),
    contact: t("nav.contact"),
    testimonials: t("nav.testimonials"),
    about: t("nav.about"),
    chambers: t("nav.chambers"),
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-2 text-sm text-text-para-light dark:text-text-para-dark mb-8"
    >
      <Link href="/" className="hover:text-brand-primary transition-colors">
        {t("breadcrumb.home")}
      </Link>

      {segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join("/")}`;
        const isLast = index === segments.length - 1;
        const label = isLast && title ? title : LABELS[segment] || segment;

        return (
          <span key={href} className="flex items-center gap-2">
            <svg
              width="14"
              height="14"
              viewBox="0 0 20 20"
              fill="none"
              className="opacity-40"
              aria-hidden="true"
            >
              <path
                d="M7 5l5 5-5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {isLast ? (
              <span className="font-semibold text-text-heading-light dark:text-text-heading-dark">
                {label}
              </span>
            ) : (
              <Link
                href={href}
                className="hover:text-brand-primary transition-colors"
              >
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};

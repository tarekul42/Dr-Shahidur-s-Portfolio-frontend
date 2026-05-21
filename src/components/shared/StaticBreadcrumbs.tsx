import Link from "next/link";
import { BilingualText } from "@/components/shared/BilingualText";
import { translate } from "@/lib/translations";

interface StaticBreadcrumbsProps {
  titleEn: string;
  titleBn: string;
}

/** Server breadcrumbs for static pages (no client hydration required). */
export function StaticBreadcrumbs({
  titleEn,
  titleBn,
}: StaticBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-text-para-light/90 dark:text-text-para-dark/90">
        <li className="inline-flex items-center">
          <Link href="/" className="hover:text-brand-primary transition-colors">
            <BilingualText
              en={translate("breadcrumb.home")}
              bn={translate("breadcrumb.home", "bn")}
            />
          </Link>
        </li>
        <li className="inline-flex items-center gap-2">
          <svg
            width="14"
            height="14"
            viewBox="0 0 20 20"
            fill="none"
            className="opacity-60"
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
          <span
            aria-current="page"
            className="font-semibold text-text-heading-light dark:text-text-heading-dark"
          >
            <BilingualText en={titleEn} bn={titleBn} />
          </span>
        </li>
      </ol>
    </nav>
  );
}

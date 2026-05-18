"use client";

import {
  faFacebookF,
  faInstagram,
  faLinkedinIn,
  faXTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { FALLBACKS } from "@/constants/fallbacks";
import { FOOTER_LINKS } from "@/constants/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import type { AppInfo } from "@/types/app-info";

export const Footer = ({ appInfo }: { appInfo?: AppInfo }) => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <footer className="bg-bg-light dark:bg-footer-bg text-text-para-light dark:text-footer-text pt-20 pb-10 border-t border-border-light dark:border-transparent">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">
                {(appInfo?.doctorName?.trim()?.[0] ?? "D").toUpperCase()}
              </div>
              <span className="font-bold text-xl text-text-heading-light dark:text-white">
                {appInfo?.doctorName ?? FALLBACKS.doctorName}
              </span>
            </Link>
            <p className="text-sm leading-relaxed opacity-80">
              {appInfo?.siteDescription ??
                "Dedicated Orthopedic Surgeon providing world-class orthopedic care and specialized surgical treatments."}
            </p>
            <div className="flex items-center gap-4">
              {(
                [
                  ["facebook", appInfo?.socialLinks?.facebook],
                  ["twitter", appInfo?.socialLinks?.twitter],
                  ["linkedin", appInfo?.socialLinks?.linkedin],
                  ["youtube", appInfo?.socialLinks?.youtube],
                  ["instagram", appInfo?.socialLinks?.instagram],
                ] as const
              )
                .filter(([, url]) => Boolean(url))
                .map(([key, url]) => {
                  const icons: Record<
                    string,
                    import("@fortawesome/fontawesome-svg-core").IconDefinition
                  > = {
                    facebook: faFacebookF,
                    twitter: faXTwitter,
                    linkedin: faLinkedinIn,
                    youtube: faYoutube,
                    instagram: faInstagram,
                  };
                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full border border-border-dark/20 dark:border-white/10 flex items-center justify-center hover:bg-brand-primary hover:border-brand-primary transition-all duration-300 group"
                      aria-label={key}
                    >
                      <FontAwesomeIcon
                        icon={icons[key]}
                        className="w-3 h-3 text-text-para-light group-hover:text-white"
                      />
                    </a>
                  );
                })}
            </div>
          </div>

          {/* Quick Links */}
          {FOOTER_LINKS.map((group) => (
            <div key={group.title} className="space-y-6">
              <h4 className="text-text-heading-light dark:text-white font-bold uppercase tracking-widest text-xs">
                {group.title}
              </h4>
              <ul className="space-y-4">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-footer-hover transition-colors flex items-center group"
                    >
                      <span className="w-0 group-hover:w-2 h-px bg-brand-primary transition-all mr-0 group-hover:mr-2" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter / Contact Hint */}
          <div className="space-y-6">
            <h4 className="text-text-heading-light dark:text-white font-bold uppercase tracking-widest text-xs">
              {t("footer.contact")}
            </h4>
            <p className="text-sm opacity-80">
              {appInfo?.address
                ? appInfo.address
                : "For urgent orthopedic inquiries or emergency appointments, please contact the clinic directly."}
            </p>
            <div className="p-4 rounded-xl bg-gray-100 dark:bg-white/5 border border-border-light dark:border-white/10 space-y-2">
              <span className="block text-[10px] text-brand-primary font-bold uppercase tracking-wider">
                {t("footer.phone")}
              </span>
              <a
                href={`tel:${(appInfo?.phone ?? FALLBACKS.phone).replace(/\D/g, "")}`}
                className="text-lg font-bold text-text-heading-light dark:text-white hover:text-brand-primary dark:hover:text-brand-primary transition-colors"
              >
                {appInfo?.phone ?? FALLBACKS.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border-light dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-medium uppercase tracking-[0.2em]">
          <p>
            © {currentYear} {t("footer.rights")}
          </p>
          <div className="flex items-center gap-8">
            <Link
              href="/terms"
              className="hover:text-brand-primary dark:hover:text-white transition-colors"
            >
              {t("footer.terms")}
            </Link>
            <Link
              href="/privacy"
              className="hover:text-brand-primary dark:hover:text-white transition-colors"
            >
              {t("footer.privacy")}
            </Link>
            <span className="text-border-dark dark:text-white/20 hidden md:block">
              |
            </span>
            <span className="flex items-center gap-1">
              DESIGNED BY
              <Link href="https://pietenium.vercel.app" target="_blank">
                <span className="text-brand-primary">PIETENIUM</span>
              </Link>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

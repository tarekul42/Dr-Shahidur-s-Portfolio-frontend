"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { Button } from "@/components/ui/Button";
import { FALLBACKS } from "@/constants/fallbacks";
import { NAV_LINKS } from "@/constants/navigation";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/ThemeProvider";
import { useUIStore } from "@/store/use-ui-store";
import type { AppInfo } from "@/types/app-info";

export const Header = ({ appInfo }: { appInfo?: AppInfo }) => {
  const isScrolled = useScrollPosition(20);
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore();
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (pathname) closeMobileMenu();
  }, [pathname, closeMobileMenu]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      const firstLink = menuRef.current?.querySelector("a");
      firstLink?.focus();
    } else {
      menuToggleRef.current?.focus();
    }
  }, [isMobileMenuOpen]);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const navLabelKeys: Record<string, string> = {
    "/": "nav.home",
    "/articles": "nav.articles",
    "/research": "nav.research",
    "/testimonials": "nav.testimonials",
    "/contact": "nav.contact",
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/80 dark:bg-bg-dark/80 backdrop-blur-lg shadow-sm py-3"
          : "bg-transparent py-5",
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white font-bold text-xl group-hover:rotate-12 transition-transform">
            {(appInfo?.doctorName?.trim()?.[0] ?? "D").toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-none text-text-heading-light dark:text-text-heading-dark">
              {appInfo?.doctorName ?? FALLBACKS.doctorName}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-brand-primary font-bold">
              {appInfo?.doctorSpecialty ?? FALLBACKS.specialty}
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative text-sm font-semibold transition-colors hover:text-brand-primary group",
                pathname === link.href
                  ? "text-brand-primary"
                  : "text-text-para-light dark:text-text-para-dark",
              )}
            >
              {t(navLabelKeys[link.href] ?? link.label)}
              <span
                className={cn(
                  "absolute -bottom-1 left-0 h-0.5 bg-brand-primary transition-all duration-300",
                  pathname === link.href ? "w-full" : "w-0 group-hover:w-full",
                )}
              />
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <LanguageToggle />
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-text-para-light dark:text-text-para-dark min-w-9 min-h-9 flex items-center justify-center"
            aria-label="Toggle theme"
            type="button"
          >
            {!mounted ? (
              <div className="w-5 h-5 opacity-0" />
            ) : resolvedTheme === "dark" ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <title>Sun Icon</title>
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <title>Moon Icon</title>
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          <Button
            href="/appointment"
            size="sm"
            className="hidden md:flex shadow-lg shadow-brand-primary/20"
          >
            {t("nav.bookAppointment")}
          </Button>

          {/* Mobile Menu Toggle */}
          <button
            ref={menuToggleRef}
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-text-para-light dark:text-text-para-dark"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            type="button"
          >
            {isMobileMenuOpen ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <title>Close Menu</title>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <title>Open Menu</title>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-bg-dark border-t border-border-light dark:border-border-dark overflow-hidden"
          >
            <div
              ref={menuRef}
              className="container mx-auto px-6 py-8 flex flex-col gap-6"
            >
              <div className="flex items-center justify-between py-2 mb-4 border-b border-border-light dark:border-border-dark">
                <span className="text-sm font-semibold text-text-para-light dark:text-text-para-dark">
                  Language / ভাষা
                </span>
                <LanguageToggle />
              </div>
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "text-lg font-bold transition-colors block w-full",
                      pathname === link.href
                        ? "text-brand-primary"
                        : "text-text-para-light dark:text-text-para-dark",
                    )}
                  >
                    {t(navLabelKeys[link.href] ?? link.label)}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.05 }}
              >
                <Button href="/appointment" className="w-full mt-4">
                  {t("nav.bookAppointment")}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

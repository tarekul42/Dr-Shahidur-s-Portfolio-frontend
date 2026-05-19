"use client";

import { useEffect, useState } from "react";
import type { Language } from "@/lib/translations";
import { useLanguageStore } from "@/store/use-language-store";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguageStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language | null;
    if (saved === "bn" || saved === "en") {
      setLanguage(saved);
    }
    setMounted(true);
  }, [setLanguage]);

  if (!mounted) {
    return (
      <div className="p-2 min-w-9 min-h-9 flex items-center justify-center">
        <span className="text-xs font-semibold opacity-0">EN</span>
      </div>
    );
  }

  return (
    <button
      onClick={() => setLanguage(language === "en" ? "bn" : "en")}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-w-9 min-h-9 flex items-center justify-center"
      aria-label={`Switch to ${language === "en" ? "Bengali" : "English"}`}
      type="button"
    >
      <span className="text-xs font-bold tracking-wide flex items-center">
        <span
          className={
            language === "en"
              ? "text-brand-primary"
              : "text-text-para-light dark:text-text-para-dark"
          }
        >
          EN
        </span>
        <span className="text-text-para-light dark:text-text-para-dark opacity-30 mx-0.5">
          |
        </span>
        <span
          className={
            language === "bn"
              ? "text-brand-primary"
              : "text-text-para-light dark:text-text-para-dark"
          }
        >
          বা
        </span>
      </span>
    </button>
  );
}
